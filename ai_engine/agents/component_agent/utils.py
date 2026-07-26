"""
CircuitMind Component Agent
Shared Utilities

Responsibility:
- Parse engineering-notation strings from extra_params/attributes
  ("400mA", "2.7V~5.5V", "120mΩ") into real numeric values.
- Extract prices, datasheets, and stock consistently from a candidate
  row, whether the data lives in a flattened CSV column or nested
  inside extra_params.

No LLM calls, no I/O beyond what's passed in. Pure functions.
"""

from __future__ import annotations

import math
import re
from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------
# Null-like value detection
# ---------------------------------------------------------------------

_NULL_TOKENS = {"", "-", "--", "n/a", "na", "none", "null", "unknown", "?"}


def is_null_like(value: Any) -> bool:
    """True if a value is missing/placeholder ('-', '', 'N/A', None, NaN)."""
    if value is None:
        return True
    if isinstance(value, float) and math.isnan(value):
        return True
    if isinstance(value, str) and value.strip().lower() in _NULL_TOKENS:
        return True
    return False


# ---------------------------------------------------------------------
# Engineering-notation numeric parsing
# ---------------------------------------------------------------------

_SI_MULTIPLIERS = {
    "p": 1e-12,
    "n": 1e-9,
    "u": 1e-6,
    "µ": 1e-6,
    "m": 1e-3,
    "": 1.0,
    "k": 1e3,
    "K": 1e3,
    "M": 1e6,
    "G": 1e9,
}

# Matches: optional sign, number, optional SI prefix, optional unit letters.
# e.g. "400mA" -> ("400", "m", "A"); "3.3V" -> ("3.3", "", "V"); "10kOhm" -> ("10","k","Ohm")
_NUMBER_UNIT_RE = re.compile(
    r"([-+]?[0-9]*\.?[0-9]+)\s*([pnuµmkKMG]?)\s*([a-zA-ZΩ%]*)"
)


def parse_engineering_value(text: Any) -> Optional[float]:
    """
    Parse a single engineering-notation value into a float in base units.

    "400mA"  -> 0.4      (amps)
    "1.8nH"  -> 1.8e-9   (henries)
    "120mΩ"  -> 0.12     (ohms)
    "3.3V"   -> 3.3       (volts)
    "10kΩ"   -> 10000.0
    Returns None if the text can't be parsed or is null-like.
    """
    if is_null_like(text):
        return None
    if isinstance(text, (int, float)):
        return float(text)

    text = str(text).strip()
    match = _NUMBER_UNIT_RE.match(text)
    if not match:
        return None

    number_str, prefix, _unit = match.groups()
    if not number_str:
        return None

    try:
        number = float(number_str)
    except ValueError:
        return None

    multiplier = _SI_MULTIPLIERS.get(prefix, 1.0)
    return number * multiplier


def parse_range(text: Any) -> Optional[Tuple[float, float]]:
    """
    Parse a range like "2.7V~5.5V", "1.8V-3.6V", "2.7~5.5V" into (min, max)
    base-unit floats. Falls back to (v, v) for a single value. Returns None
    if nothing parseable is found.
    """
    if is_null_like(text):
        return None
    text = str(text).strip()

    # Prefer '~' as the separator (LCSC-style ranges use it and it can't be
    # confused with a leading '-' sign on the first number).
    for sep in ("~", "…", " to ", "..", "-"):
        if sep in text:
            left, _, right = text.partition(sep)
            left_val = parse_engineering_value(left)
            right_val = parse_engineering_value(right)
            if left_val is not None and right_val is not None:
                lo, hi = sorted((left_val, right_val))
                return (lo, hi)

    single = parse_engineering_value(text)
    if single is not None:
        return (single, single)
    return None


# ---------------------------------------------------------------------
# extra_params / attributes access
# ---------------------------------------------------------------------

def get_attributes(candidate: Dict[str, Any]) -> Dict[str, Any]:
    """Return candidate['extra_params']['attributes'] safely, always a dict."""
    extra = candidate.get("extra_params")
    if not isinstance(extra, dict):
        return {}
    attributes = extra.get("attributes")
    return attributes if isinstance(attributes, dict) else {}


def get_searchable_text(candidate: Dict[str, Any]) -> str:
    """
    Flatten every text-bearing field on a candidate (description, title,
    subcategory, and all attribute keys/values) into one lowercase blob
    for substring matching (interface detection, keyword scoring, etc.).
    """
    parts: List[str] = []

    for field in ("description", "title", "subcategory", "category", "mfr_part"):
        value = candidate.get(field)
        if value and not is_null_like(value):
            parts.append(str(value))

    for key, value in get_attributes(candidate).items():
        if not is_null_like(value):
            parts.append(f"{key} {value}")

    extra = candidate.get("extra_params")
    if isinstance(extra, dict):
        title = extra.get("title")
        if title and not is_null_like(title):
            parts.append(str(title))

    return " ".join(parts).lower()


# ---------------------------------------------------------------------
# Pricing
# ---------------------------------------------------------------------

def get_price_tiers(candidate: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Return the full price-break list for a candidate, preferring the
    detailed tiers nested in extra_params['prices'] (each tier has
    min_qty/max_qty/price) and falling back to the flattened
    price_qty_1 / price_qty_100 CSV columns if extra_params has none.
    """
    extra = candidate.get("extra_params")
    if isinstance(extra, dict):
        prices = extra.get("prices")
        if isinstance(prices, list) and prices:
            return prices

    tiers = []
    p1 = candidate.get("price_qty_1")
    p100 = candidate.get("price_qty_100")
    if not is_null_like(p1):
        tiers.append({"min_qty": 1, "max_qty": 99, "price": float(p1)})
    if not is_null_like(p100):
        tiers.append({"min_qty": 100, "max_qty": 10_000_000, "price": float(p100)})
    return tiers


def get_unit_price(candidate: Dict[str, Any], quantity: int = 1) -> Optional[float]:
    """
    Resolve the correct unit price for a requested build quantity by
    walking the price-break tiers. Falls back to the cheapest known
    tier if quantity exceeds all defined breaks, and to the single
    price_qty_1 column if no tiers are available at all.
    """
    tiers = get_price_tiers(candidate)
    if not tiers:
        return None

    applicable = None
    for tier in tiers:
        min_qty = tier.get("min_qty", 0)
        max_qty = tier.get("max_qty", math.inf)
        price = tier.get("price")
        if price is None:
            continue
        if min_qty <= quantity <= max_qty:
            applicable = float(price)
            break

    if applicable is not None:
        return applicable

    # Quantity fell outside every tier (e.g. above the top break) -- use
    # the tier with the highest min_qty (cheapest per-unit price).
    priced_tiers = [t for t in tiers if t.get("price") is not None]
    if not priced_tiers:
        return None
    best_tier = max(priced_tiers, key=lambda t: t.get("min_qty", 0))
    return float(best_tier["price"])


# ---------------------------------------------------------------------
# Datasheet / stock / identity
# ---------------------------------------------------------------------

def _looks_like_url(value: Any) -> bool:
    """Cheap, generic URL sanity check -- not a per-source special case."""
    return isinstance(value, str) and value.strip().lower().startswith(("http://", "https://"))


def get_datasheet_url(candidate: Dict[str, Any]) -> Optional[str]:
    """Return a datasheet URL, checking the flattened column then extra_params.

    Values that don't look like a URL (e.g. a stray "1" or other malformed
    placeholder in the source CSV) are treated as absent rather than
    trusted verbatim, and the lookup falls through to extra_params.
    """
    column_value = candidate.get("datasheet")
    if _looks_like_url(column_value):
        return column_value
    if isinstance(column_value, dict):
        pdf = column_value.get("pdf")
        if _looks_like_url(pdf):
            return pdf

    extra = candidate.get("extra_params")
    if isinstance(extra, dict):
        datasheet = extra.get("datasheet")
        if isinstance(datasheet, dict):
            pdf = datasheet.get("pdf")
            if _looks_like_url(pdf):
                return pdf
        elif _looks_like_url(datasheet):
            return datasheet
    return None


def get_stock(candidate: Dict[str, Any]) -> int:
    """Return available stock as an int, defaulting to 0 for unparsable values."""
    stock = candidate.get("stock")
    if is_null_like(stock):
        return 0
    try:
        return int(float(stock))
    except (TypeError, ValueError):
        return 0


def get_mfr_part(candidate: Dict[str, Any]) -> str:
    """Return the manufacturer part number, preferring the flattened column."""
    mfr_part = candidate.get("mfr_part")
    if mfr_part and not is_null_like(mfr_part):
        return str(mfr_part)

    extra = candidate.get("extra_params")
    if isinstance(extra, dict):
        mpn = extra.get("mpn")
        if mpn and not is_null_like(mpn):
            return str(mpn)
    return "UNKNOWN"


def get_source_url(candidate: Dict[str, Any]) -> Optional[str]:
    """Return the distributor product page URL if present in extra_params."""
    extra = candidate.get("extra_params")
    if isinstance(extra, dict):
        url = extra.get("url")
        if _looks_like_url(url):
            return url
    return None


def is_rohs_compliant(candidate: Dict[str, Any]) -> Optional[bool]:
    """Return True/False if RoHS status is known, else None."""
    extra = candidate.get("extra_params")
    if isinstance(extra, dict) and "rohs" in extra:
        return bool(extra["rohs"])
    return None


_EOL_MARKERS = ("obsolete", "eol", "end of life", "nrnd", "discontinued", "last time buy")


def has_lifecycle_risk(candidate: Dict[str, Any]) -> bool:
    """True if the description/attributes flag the part as obsolete/EOL/NRND."""
    text = get_searchable_text(candidate)
    return any(marker in text for marker in _EOL_MARKERS)