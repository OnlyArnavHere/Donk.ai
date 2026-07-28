"""CLI entry point for the dunkai LangGraph supervisor."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# Allow running as: python -m agents.supervisor.run
AI_ENGINE_ROOT = Path(__file__).resolve().parents[2]
if str(AI_ENGINE_ROOT) not in sys.path:
    sys.path.insert(0, str(AI_ENGINE_ROOT))

from agents.supervisor.graph import run_workflow
from agents.supervisor.server import _serialize_state


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the dunkai LangGraph hardware pipeline.")
    parser.add_argument(
        "--requirements",
        type=Path,
        help="Optional path to a requirements JSON file (skips the interview).",
    )
    parser.add_argument(
        "--user-input",
        type=str,
        help="Natural-language project idea for the Requirement Agent interview.",
    )
    parser.add_argument(
        "--build-quantity",
        type=int,
        default=1,
        help="Build quantity passed to the Component Agent.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Optional path to write the final pipeline state JSON.",
    )
    args = parser.parse_args()

    initial_state = {
        "messages": [],
        "errors": [],
        "build_quantity": max(1, args.build_quantity),
    }

    if args.requirements:
        initial_state["requirements"] = json.loads(args.requirements.read_text(encoding="utf-8"))
    elif args.user_input:
        initial_state["user_input"] = args.user_input.strip()
    else:
        parser.error("Provide --requirements or --user-input.")

    final_state = run_workflow(initial_state)
    payload = _serialize_state(final_state)

    if args.output:
        args.output.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print(f"Wrote pipeline state to {args.output}")
    else:
        print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
