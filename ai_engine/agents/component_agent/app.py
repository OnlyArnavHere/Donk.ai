"""
app.py

CircuitMind Component Agent -- Gradio UI.

Pipeline:

    architecture.json
          │
          ▼
    ArchitectureParser.parse()
          │
          ▼
    ComponentRetriever.retrieve_all()   (semantic search, FAISS)
          │
          ▼
    ComponentRanker.rank_all()          (deterministic engineering scoring)
          │
          ▼
    BOMGenerator.generate()
          │
          ▼
    BOM table + downloadable CSV

Heavy resources (dataset, FAISS index, embedding model) are loaded once,
lazily, on first use -- not at import time -- so `python app.py` doesn't
stall before Gradio even starts rendering the UI.
"""

from __future__ import annotations

import json
import logging
import tempfile
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Tuple

import gradio as gr
import pandas as pd

import config
from parser import ArchitectureParser
from retrieval import ComponentRetriever
from ranking import ComponentRanker
from bom import BOMGenerator, BOM_COLUMNS

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------
# Lazy singletons -- built once per process, reused on every request
# ---------------------------------------------------------------------

@lru_cache(maxsize=1)
def get_parser() -> ArchitectureParser:
    return ArchitectureParser()


@lru_cache(maxsize=1)
def get_retriever() -> ComponentRetriever:
    logger.info("Cold-starting ComponentRetriever (dataset + FAISS + embedding model)...")
    return ComponentRetriever()


@lru_cache(maxsize=1)
def get_ranker() -> ComponentRanker:
    return ComponentRanker()


@lru_cache(maxsize=1)
def get_bom_generator() -> BOMGenerator:
    return BOMGenerator()


# ---------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------

def _load_architecture(json_text: str, uploaded_file: Any) -> Dict[str, Any]:
    """Prefer an uploaded file if given, otherwise parse the pasted text box."""
    if uploaded_file is not None:
        path = uploaded_file.name if hasattr(uploaded_file, "name") else uploaded_file
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    if not json_text or not json_text.strip():
        raise ValueError(
            "Paste architecture JSON into the text box, or upload an architecture.json file."
        )
    return json.loads(json_text)


def _alternates_markdown(ranked_results: List[Dict[str, Any]], top_n: int = 3) -> str:
    """Render top-N alternates per reference for transparency/manual review."""
    sections = []
    for result in ranked_results:
        request = result.get("request", {})
        reference = request.get("reference", "?")
        subsystem = request.get("subsystem", "")
        candidates = result.get("ranked_candidates", [])[:top_n]

        if not candidates:
            sections.append(f"### {reference} -- {subsystem}\n\n_No candidates found._\n")
            continue

        lines = [f"### {reference} -- {subsystem}\n"]
        for i, c in enumerate(candidates, start=1):
            price = c.get("unit_price")
            price_str = f"${price:.4f}" if price is not None else "price unknown"
            lines.append(
                f"{i}. **{c.get('manufacturer', '?')} {c.get('mfr_part', '?')}** "
                f"-- score {c.get('score')} -- {price_str} -- stock {c.get('stock', 0)}  \n"
                f"   _{c.get('description', '')}_"
            )
        sections.append("\n".join(lines))

    return "\n\n---\n\n".join(sections) if sections else "No subsystems parsed."


def run_pipeline(
    json_text: str,
    uploaded_file: Any,
    build_quantity: int,
) -> Tuple[pd.DataFrame, str, str, str]:
    """
    Full pipeline: parse -> retrieve -> rank -> BOM.

    Returns (bom_dataframe, summary_markdown, alternates_markdown, csv_path)
    """
    architecture = _load_architecture(json_text, uploaded_file)

    requests = get_parser().parse(architecture)
    if not requests:
        raise ValueError("Parsed architecture produced no subsystem requests.")

    build_quantity = max(1, int(build_quantity or config.DEFAULT_QTY))
    for request in requests:
        request["build_quantity"] = build_quantity

    retrieval_results = get_retriever().retrieve_all(requests)
    ranked_results = get_ranker().rank_all(retrieval_results)

    bom_generator = get_bom_generator()
    rows = bom_generator.generate(ranked_results)
    df = bom_generator.to_dataframe(rows)

    summary = bom_generator.summary(rows)
    shared_groups = summary.get("shared_part_groups", [])
    flagged = summary["flagged_references"]
    unfilled = summary["unfilled_references"]

    # Lead with a warning banner whenever anything needs manual review --
    # don't bury it as just one more line among several.
    warning_banner = ""
    if flagged or unfilled:
        needs_attention = flagged + unfilled
        warning_banner = (
            f"### ⚠️ {len(needs_attention)} reference(s) need manual review "
            f"before ordering: {', '.join(needs_attention)}\n\n"
        )

    summary_md = (
        f"{warning_banner}"
        f"**Line items:** {summary['total_line_items']}  \n"
        f"**Total cost (at qty {build_quantity} each):** ${summary['total_cost_usd']:.2f}  \n"
        f"**Unfilled references:** {', '.join(unfilled) or 'none'}  \n"
        f"**Flagged references:** {', '.join(flagged) or 'none'}  \n"
        f"**Shared parts:** {'; '.join(shared_groups) or 'none'}"
    )

    alternates_md = _alternates_markdown(ranked_results)

    tmp_dir = Path(tempfile.gettempdir())
    csv_path = tmp_dir / "circuitmind_bom.csv"
    bom_generator.to_csv(rows, str(csv_path))

    return df, summary_md, alternates_md, str(csv_path)


def handle_submit(json_text: str, uploaded_file: Any, build_quantity: int):
    try:
        df, summary_md, alternates_md, csv_path = run_pipeline(
            json_text, uploaded_file, build_quantity
        )
        return df, summary_md, alternates_md, csv_path
    except Exception as exc:
        logger.exception("Pipeline failed")
        error_df = pd.DataFrame(columns=BOM_COLUMNS)
        return error_df, f"**Error:** {exc}", "", None


# ---------------------------------------------------------------------
# UI
# ---------------------------------------------------------------------

EXAMPLE_ARCHITECTURE = json.dumps(
    {
        "architecture_graph": {
            "nodes": [
                {
                    "id": "n1",
                    "data": {"label": "Temperature Sensor", "category": "Input"},
                },
                {
                    "id": "n2",
                    "data": {"label": "Main Processor", "category": "Processing"},
                },
                {
                    "id": "n3",
                    "data": {"label": "Bluetooth Module", "category": "Communication"},
                },
            ],
            "edges": [
                {"source": "n1", "target": "n2", "data": {"interface": "I2C"}},
                {"source": "n2", "target": "n3", "data": {"interface": "UART"}},
            ],
        }
    },
    indent=2,
)


def build_app() -> gr.Blocks:
    with gr.Blocks(title=config.APP_TITLE) as demo:
        gr.Markdown(f"# {config.APP_TITLE}")
        gr.Markdown(config.APP_DESCRIPTION)

        with gr.Row():
            with gr.Column(scale=1):
                json_input = gr.Textbox(
                    label="Architecture JSON (paste here)",
                    lines=16,
                    value=EXAMPLE_ARCHITECTURE,
                    placeholder="Paste architecture_graph JSON from the Architecture Agent...",
                )
                file_input = gr.File(
                    label="...or upload architecture.json",
                    file_types=[".json"],
                )
                qty_input = gr.Number(
                    label="Build quantity (per reference)",
                    value=config.DEFAULT_QTY,
                    precision=0,
                )
                submit_btn = gr.Button("Generate BOM", variant="primary")

            with gr.Column(scale=2):
                summary_output = gr.Markdown(label="Summary")
                bom_output = gr.Dataframe(
                    label="Bill of Materials",
                    headers=BOM_COLUMNS,
                    wrap=True,
                )
                csv_output = gr.File(label="Download BOM CSV")

        with gr.Accordion("Alternate candidates per reference", open=False):
            alternates_output = gr.Markdown()

        submit_btn.click(
            fn=handle_submit,
            inputs=[json_input, file_input, qty_input],
            outputs=[bom_output, summary_output, alternates_output, csv_output],
        )

    return demo


if __name__ == "__main__":
    app = build_app()
    app.launch()