"""
ranking.py

Engineering Ranking Engine for CircuitMind's Component Agent.

Responsibilities:
------------------
Takes the Top-K semantically retrieved candidates for a subsystem
request (from retrieval.py) and scores them using deterministic
engineering criteria -- NOT another semantic/LLM pass.

Scored dimensions (weights sum to 100):

    semantic_similarity     25   -- FAISS similarity_score from retrieval
    interface_match         25   -- request["interfaces"] + power_interfaces
                                    found in the candidate's own text
    stock_availability       15   -- log-scaled against a reference stock level
    price_competitiveness    15   -- relative to the other candidates for
                                    *this* request, at the requested build qty
    category_precision        5   -- subsystem keyword found in subcategory/desc
    manufacturer_preference    5   -- optional config.PREFERRED_MANUFACTURERS
    package_preference          5   -- optional config.PREFERRED_PACKAGES
    lifecycle_health             5   -- RoHS + no obsolete/EOL/NRND flags

This module does NOT talk to FAISS, the LLM, or the dataset directly --
it only operates on the dicts retrieval.py already produced.
"""

from __future__ import annotations

import logging
import math
from typing import Any, Dict, List, Optional

import config
import utils

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------
# Weights (overridable via config.RANKING_WEIGHTS without editing this file)
# ---------------------------------------------------------------------

DEFAULT_WEIGHTS = {
    "semantic_similarity": 25.0,
    "interface_match": 25.0,
    "stock_availability": 15.0,
    "price_competitiveness": 15.0,
    "category_precision": 5.0,
    "manufacturer_preference": 5.0,
    "package_preference": 5.0,
    "lifecycle_health": 5.0,
}

# Stock level (units) that earns a full stock_availability score.
# Override with config.STOCK_REFERENCE if you want it tighter/looser.
DEFAULT_STOCK_REFERENCE = 5000


def _get_weights() -> Dict[str, float]:
    configured = getattr(config, "RANKING_WEIGHTS", None)
    if isinstance(configured, dict) and configured:
        weights = dict(DEFAULT_WEIGHTS)
        weights.update(configured)
        return weights
    return dict(DEFAULT_WEIGHTS)


def _get_stock_reference() -> int:
    return int(getattr(config, "STOCK_REFERENCE", DEFAULT_STOCK_REFERENCE))


def _get_preferred_manufacturers() -> List[str]:
    values = getattr(config, "PREFERRED_MANUFACTURERS", None)
    if isinstance(values, (list, tuple)):
        return [str(v).lower() for v in values]
    return []


def _get_preferred_packages() -> List[str]:
    values = getattr(config, "PREFERRED_PACKAGES", None)
    if isinstance(values, (list, tuple)):
        return [str(v).lower() for v in values]
    return []


def _get_build_quantity(request: Dict[str, Any]) -> int:
    qty = request.get("build_quantity") or getattr(config, "DEFAULT_QTY", 1)
    try:
        return max(1, int(qty))
    except (TypeError, ValueError):
        return 1


# ---------------------------------------------------------------------
# Individual scoring dimensions -- each returns a fraction in [0, 1]
# ---------------------------------------------------------------------

def _score_semantic_similarity(candidate: Dict[str, Any]) -> float:
    similarity = candidate.get("similarity_score", 0.0)
    try:
        similarity = float(similarity)
    except (TypeError, ValueError):
        similarity = 0.0
    # Normalized BGE embeddings -> inner product is cosine similarity,
    # typically in [0, 1] for related text but can dip slightly negative.
    return max(0.0, min(1.0, similarity))


def _score_interface_match(candidate: Dict[str, Any], request: Dict[str, Any]) -> float:
    required = set(
        i.strip().lower()
        for i in (request.get("interfaces") or []) + (request.get("power_interfaces") or [])
        if i and str(i).strip()
    )
    if not required:
        # Nothing specific was required, so nothing to fail on.
        return 1.0

    text = utils.get_searchable_text(candidate)
    matched = sum(1 for interface in required if interface in text)
    return matched / len(required)


def _score_stock_availability(candidate: Dict[str, Any]) -> float:
    stock = utils.get_stock(candidate)
    if stock <= 0:
        return 0.0
    reference = _get_stock_reference()
    score = math.log10(stock + 1) / math.log10(reference + 1)
    return max(0.0, min(1.0, score))


def _score_category_precision(candidate: Dict[str, Any], request: Dict[str, Any]) -> float:
    subsystem = str(request.get("subsystem", "")).lower()
    if not subsystem:
        return 0.5

    keywords = [w for w in subsystem.replace("-", " ").split() if len(w) > 2]
    if not keywords:
        return 0.5

    haystack = " ".join([
        str(candidate.get("subcategory", "")),
        str(candidate.get("description", "")),
    ]).lower()

    matched = sum(1 for kw in keywords if kw in haystack)
    return matched / len(keywords)


def _score_manufacturer_preference(candidate: Dict[str, Any]) -> float:
    preferred = _get_preferred_manufacturers()
    if not preferred:
        return 0.7  # neutral baseline -- no configured preference

    manufacturer = str(candidate.get("manufacturer", "")).lower()
    return 1.0 if any(p in manufacturer for p in preferred) else 0.3


def _score_package_preference(candidate: Dict[str, Any]) -> float:
    preferred = _get_preferred_packages()
    if not preferred:
        return 0.5  # neutral baseline -- no configured preference

    package = str(candidate.get("package", "")).lower()
    return 1.0 if any(p in package for p in preferred) else 0.4


def _score_lifecycle_health(candidate: Dict[str, Any]) -> float:
    if utils.has_lifecycle_risk(candidate):
        return 0.0
    rohs = utils.is_rohs_compliant(candidate)
    if rohs is True:
        return 1.0
    if rohs is False:
        return 0.4
    return 0.7  # unknown RoHS status, no lifecycle red flags


def _score_price_competitiveness(
    candidate: Dict[str, Any],
    all_unit_prices: List[float],
) -> float:
    price = utils.get_unit_price(candidate, 1)
    known_prices = [p for p in all_unit_prices if p is not None]

    if price is None:
        return 0.3  # unknown price -- mild penalty, not disqualifying
    if not known_prices or max(known_prices) == min(known_prices):
        return 1.0  # only one price point in this candidate set -- no basis to penalize

    lo, hi = min(known_prices), max(known_prices)
    # Cheaper -> closer to 1.0
    return 1.0 - ((price - lo) / (hi - lo))


# ---------------------------------------------------------------------
# Public ranking API
# ---------------------------------------------------------------------

class ComponentRanker:
    """Deterministic engineering ranker for semantically retrieved candidates."""

    def __init__(self, weights: Optional[Dict[str, float]] = None):
        self.weights = weights or _get_weights()
        total = sum(self.weights.values())
        if not math.isclose(total, 100.0, abs_tol=0.01):
            logger.warning(
                "Ranking weights sum to %.2f, not 100 -- scores will still be "
                "comparable to each other but won't read as a clean 0-100 scale.",
                total,
            )

    # ------------------------------------------------------------------
    def score_candidate(
        self,
        candidate: Dict[str, Any],
        request: Dict[str, Any],
        unit_price: float,
        all_unit_prices: List[float],
    ) -> Dict[str, Any]:
        """Score one candidate and attach a breakdown + total score."""

        breakdown = {
            "semantic_similarity": _score_semantic_similarity(candidate),
            "interface_match": _score_interface_match(candidate, request),
            "stock_availability": _score_stock_availability(candidate),
            "price_competitiveness": _score_price_competitiveness(candidate, all_unit_prices),
            "category_precision": _score_category_precision(candidate, request),
            "manufacturer_preference": _score_manufacturer_preference(candidate),
            "package_preference": _score_package_preference(candidate),
            "lifecycle_health": _score_lifecycle_health(candidate),
        }

        weighted = {
            dimension: round(fraction * self.weights.get(dimension, 0.0), 2)
            for dimension, fraction in breakdown.items()
        }
        total_score = round(sum(weighted.values()), 2)

        return {
            **candidate,
            "unit_price": unit_price,
            "score": total_score,
            "score_breakdown": weighted,
        }

    # ------------------------------------------------------------------
    def rank(self, retrieval_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Rank the candidates inside one retrieval result (the dict shape
        returned by ComponentRetriever.retrieve()).
        """
        request = retrieval_result.get("request", {})
        candidates = retrieval_result.get("candidates", [])
        build_qty = _get_build_quantity(request)

        unit_prices = [utils.get_unit_price(c, build_qty) for c in candidates]

        scored = [
            self.score_candidate(candidate, request, price, unit_prices)
            for candidate, price in zip(candidates, unit_prices)
        ]

        scored.sort(key=lambda c: c["score"], reverse=True)

        logger.info(
            "Ranked %d candidates for %s (%s)",
            len(scored),
            request.get("reference", "?"),
            request.get("subsystem", "?"),
        )

        return {
            **retrieval_result,
            "ranked_candidates": scored,
            "best_candidate": scored[0] if scored else None,
        }

    # ------------------------------------------------------------------
    def rank_all(self, retrieval_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        ranked_results = []
        selected_parts: set[str] = set()

        for result in retrieval_results:
            ranked = self.rank(result)

            # Walk down ranked_candidates to find the best part not already used elsewhere in this BOM
            for candidate in ranked["ranked_candidates"]:
                part = utils.get_mfr_part(candidate)
                if part not in selected_parts:
                    ranked["best_candidate"] = candidate
                    break
            else:
                # every candidate is already used elsewhere -- keep top pick, flag it
                ranked["best_candidate"]["duplicate_warning"] = True

            selected_parts.add(utils.get_mfr_part(ranked["best_candidate"]))
            ranked_results.append(ranked)

        return ranked_results


if __name__ == "__main__":
    from retrieval import ComponentRetriever

    retriever = ComponentRetriever()
    ranker = ComponentRanker()

    request = {
        "reference": "U1",
        "type": "sensor",
        "subsystem": "Temperature Sensor",
        "category": "Sensor",
        "interfaces": ["I2C"],
        "power_interfaces": [],
    }

    retrieval_result = retriever.retrieve(request)
    ranked_result = ranker.rank(retrieval_result)

    print("\nRanked candidates:\n")
    for i, candidate in enumerate(ranked_result["ranked_candidates"][:5], start=1):
        print(f"{i}. {candidate['manufacturer']} - {utils.get_mfr_part(candidate)}")
        print(f"   Score: {candidate['score']}  Breakdown: {candidate['score_breakdown']}")
        print(f"   {candidate['description']}\n")