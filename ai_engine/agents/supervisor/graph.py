"""LangGraph workflow builder for the dunkai hardware design pipeline."""

from __future__ import annotations

from typing import Literal

from langgraph.graph import END, START, StateGraph

from .nodes import (
    architecture_node,
    component_node,
    documentation_node,
    eda_enrichment_node,
    pcb_node,
    requirements_node,
    supervisor_node,
    validation_node,
)
from .state import CircuitState


def _route_after_requirements(state: CircuitState) -> Literal["architecture", "__end__"]:
    if state.get("errors"):
        return END
    if state.get("interview_status") == "question":
        return END
    if not state.get("requirements"):
        return END
    return "architecture"


def build_graph() -> StateGraph:
    """Construct the linear supervisor pipeline with a requirements gate."""
    graph = StateGraph(CircuitState)

    graph.add_node("supervisor", supervisor_node)
    graph.add_node("requirements", requirements_node)
    graph.add_node("architecture", architecture_node)
    graph.add_node("component", component_node)
    graph.add_node("eda_enrichment", eda_enrichment_node)
    graph.add_node("pcb", pcb_node)
    graph.add_node("validation", validation_node)
    graph.add_node("documentation", documentation_node)

    graph.add_edge(START, "supervisor")
    graph.add_edge("supervisor", "requirements")
    graph.add_conditional_edges("requirements", _route_after_requirements)
    graph.add_edge("architecture", "component")
    graph.add_edge("component", "eda_enrichment")
    graph.add_edge("eda_enrichment", "pcb")
    graph.add_edge("pcb", "validation")
    graph.add_edge("validation", "documentation")
    graph.add_edge("documentation", END)

    return graph


def compile_graph():
    """Return a compiled LangGraph runnable."""
    return build_graph().compile()


def run_workflow(initial_state: CircuitState | None = None) -> CircuitState:
    """Execute the full pipeline and return the final state."""
    app = compile_graph()
    return app.invoke(initial_state or {})
