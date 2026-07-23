"""Deterministic Architecture Agent output for dunkai.

The LLM-facing requirement agent stops at ``HardwareRequirements``.  This
module converts that JSON into a vendor-neutral architecture model and a
React Flow-compatible graph.  It intentionally does not choose ICs, vendors,
passives, PCB details, or firmware.
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass, field
from typing import Any


ALLOWED_CATEGORIES = {
    "Processing", "Power", "Communication", "Input", "Output", "Sensor",
    "Storage", "Security", "Memory", "Clock", "Expansion", "Network",
}
ALLOWED_INTERFACES = {
    "GPIO", "UART", "SPI", "I2C", "USB", "CAN", "Ethernet", "PCIe",
    "SDIO", "Power", "BLE", "WiFi", "RF", "Audio",
}


def _items(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, dict):
        return [f"{key}: {item}" for key, item in value.items() if item is not None]
    if isinstance(value, (list, tuple, set)):
        return [str(item).strip() for item in value if str(item).strip()]
    return [str(value).strip()] if str(value).strip() else []


def _text(requirements: dict[str, Any]) -> str:
    values: list[str] = []
    for value in requirements.values():
        values.extend(_items(value))
    return " ".join(values).lower()


def _slug(label: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")


@dataclass
class _Graph:
    nodes: list[dict[str, Any]] = field(default_factory=list)
    edges: list[dict[str, Any]] = field(default_factory=list)
    assumptions: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    def add_node(self, label: str, category: str, *, inferred: bool = False,
                 source_requirements: list[str] | None = None) -> str:
        node_id = _slug(label)
        if any(node["id"] == node_id for node in self.nodes):
            return node_id
        if category not in ALLOWED_CATEGORIES:
            raise ValueError(f"Unsupported node category: {category}")
        self.nodes.append({
            "id": node_id,
            "type": "architecture",
            "data": {
                "label": label,
                "category": category,
                "inferred": inferred,
                "sourceRequirements": source_requirements or [],
            },
        })
        if inferred:
            requirement_text = ", ".join(source_requirements or [])
            detail = f" from: {requirement_text}" if requirement_text else ""
            self.assumptions.append(
                f"{label} is an inferred, technology-level subsystem{detail}; exact components remain unspecified."
            )
        return node_id

    def connect(self, source: str, target: str, interface: str, *, inferred: bool = True) -> None:
        if interface not in ALLOWED_INTERFACES:
            raise ValueError(f"Unsupported edge interface: {interface}")
        edge_id = f"{source}-{interface.lower()}-{target}"
        if any(edge["id"] == edge_id for edge in self.edges):
            return
        self.edges.append({
            "id": edge_id,
            "source": source,
            "target": target,
            "type": "smoothstep",
            "label": interface,
            "data": {"interface": interface, "inferred": inferred},
            "markerEnd": {"type": "arrowclosed"},
        })


def _add_matching(graph: _Graph, values: list[str], patterns: list[tuple[str, str, str]], *, category: str) -> list[str]:
    ids: list[str] = []
    for value in values:
        lower = value.lower()
        for pattern, label, interface in patterns:
            if pattern in lower:
                node_id = graph.add_node(label, category, source_requirements=[value])
                ids.append(node_id)
                break
    return list(dict.fromkeys(ids))


def _add_unmatched(graph: _Graph, values: list[str], existing_ids: list[str], *, category: str) -> list[str]:
    """Preserve requirements that do not have a specialized inference rule."""
    ids = list(existing_ids)
    matched_values = {
        value
        for node in graph.nodes
        if node["id"] in existing_ids
        for value in node["data"]["sourceRequirements"]
    }
    for value in values:
        if value not in matched_values:
            node_id = graph.add_node(value, category, source_requirements=[value])
            ids.append(node_id)
    return list(dict.fromkeys(ids))


def _interface_for_label(label: str, fallback: str) -> str:
    lower = label.lower()
    if "touch" in lower or "sensor" in lower:
        return "I2C"
    if "microphone" in lower or "audio" in lower or "speaker" in lower:
        return "Audio"
    if "display" in lower or "camera" in lower or "storage" in lower:
        return "SPI"
    return fallback


def build_architecture(requirements: dict[str, Any]) -> dict[str, Any]:
    """Return ``ArchitectureResult`` as JSON-compatible Python data."""
    if not isinstance(requirements, dict):
        raise TypeError("requirements must be a JSON object")

    graph = _Graph()
    all_text = _text(requirements)
    functional = _items(requirements.get("functional_requirements"))
    inputs = _items(requirements.get("hardware_inputs"))
    outputs = _items(requirements.get("hardware_outputs"))
    connectivity = _items(requirements.get("connectivity"))
    power = _items(requirements.get("power_requirements"))

    has_wireless = any(term in all_text for term in ("bluetooth", "ble", "wifi", "wireless"))
    processing_label = "Wireless MCU" if has_wireless else "MCU"
    processing_id = graph.add_node(processing_label, "Processing", inferred=True,
                                   source_requirements=connectivity)

    power_nodes: list[str] = []
    if power:
        battery_id = graph.add_node("Battery", "Power", inferred=True, source_requirements=power)
        pmic_id = graph.add_node("Power Management", "Power", inferred=True, source_requirements=power)
        graph.connect(battery_id, pmic_id, "Power")
        graph.connect(pmic_id, processing_id, "Power")
        power_nodes = [battery_id, pmic_id]
    else:
        graph.warnings.append("Power requirements are missing; battery, regulation, and power-budget architecture are not confirmed.")

    input_ids = _add_matching(graph, inputs, [
        ("touch", "Capacitive Touch Controller", "I2C"),
        ("button", "User Buttons", "GPIO"),
        ("microphone", "MEMS Microphone", "Audio"),
        ("mic", "MEMS Microphone", "Audio"),
        ("camera", "Camera Sensor", "SPI"),
    ], category="Input")
    input_ids = _add_unmatched(graph, inputs, input_ids, category="Input")
    sensor_ids = _add_matching(graph, functional + inputs, [
        ("navigation", "GNSS Receiver", "UART"),
        ("motion", "IMU Sensor", "I2C"),
        ("orientation", "IMU Sensor", "I2C"),
        ("temperature", "Temperature Sensor", "I2C"),
        ("pressure", "Pressure Sensor", "I2C"),
    ], category="Sensor")
    output_ids = _add_matching(graph, outputs, [
        ("display", "Display", "SPI"),
        ("oled", "Display", "SPI"),
        ("speaker", "Audio Output", "Audio"),
        ("audio", "Audio Output", "Audio"),
        ("motor", "Actuator", "GPIO"),
        ("led", "Status Indicator", "GPIO"),
    ], category="Output")
    output_ids = _add_unmatched(graph, outputs, output_ids, category="Output")

    communication_ids: list[str] = []
    for value in connectivity:
        lower = value.lower()
        if "bluetooth" in lower or "ble" in lower:
            communication_ids.append(graph.add_node("Bluetooth", "Communication", source_requirements=[value]))
            graph.connect(processing_id, "bluetooth", "BLE")
        elif "wi-fi" in lower or "wifi" in lower:
            communication_ids.append(graph.add_node("Wi-Fi", "Communication", source_requirements=[value]))
            graph.connect(processing_id, "wi-fi", "WiFi")
        elif "ethernet" in lower:
            communication_ids.append(graph.add_node("Ethernet Interface", "Network", source_requirements=[value]))
            graph.connect(processing_id, "ethernet-interface", "Ethernet")
        elif "usb" in lower:
            communication_ids.append(graph.add_node("USB Interface", "Communication", source_requirements=[value]))
            graph.connect(processing_id, "usb-interface", "USB")
        else:
            label = value.strip() or "External Interface"
            node_id = graph.add_node(label, "Communication", source_requirements=[value])
            communication_ids.append(node_id)
            graph.connect(processing_id, node_id, "RF" if "radio" in lower else "UART")

    if any(term in all_text for term in ("storage", "logging", "offline", "record")):
        storage_id = graph.add_node("Flash Storage", "Storage", inferred=True)
        graph.connect(processing_id, storage_id, "SPI")

    for node_id in input_ids:
        label = next(node["data"]["label"] for node in graph.nodes if node["id"] == node_id)
        graph.connect(node_id, processing_id, _interface_for_label(label, "GPIO"))
    for node_id in sensor_ids:
        label = next(node["data"]["label"] for node in graph.nodes if node["id"] == node_id)
        graph.connect(node_id, processing_id, _interface_for_label(label, "I2C"))
    for node_id in output_ids:
        label = next(node["data"]["label"] for node in graph.nodes if node["id"] == node_id)
        interface = _interface_for_label(label, "GPIO")
        graph.connect(processing_id, node_id, interface)
    for node_id in input_ids + sensor_ids + output_ids + communication_ids:
        if power_nodes:
            graph.connect(power_nodes[-1], node_id, "Power")

    if not inputs and not outputs and not connectivity:
        graph.warnings.append("No hardware inputs, outputs, or connectivity were provided; the architecture contains only its processing and power assumptions.")
    if "voice" in all_text and not any("microphone" in node["id"] for node in graph.nodes):
        graph.warnings.append("Voice control is mentioned without a microphone input; confirm the audio capture path.")
    if "bluetooth" in all_text and "wifi" not in all_text and "internet" in all_text:
        graph.warnings.append("Bluetooth alone does not provide direct internet connectivity.")

    return {
        "architecture_model": {
            "processing_unit": processing_label,
            "communication_modules": [node["data"]["label"] for node in graph.nodes if node["data"]["category"] in {"Communication", "Network"}],
            "sensing_modules": [node["data"]["label"] for node in graph.nodes if node["data"]["category"] in {"Input", "Sensor"}],
            "user_interface_modules": [node["data"]["label"] for node in graph.nodes if node["data"]["category"] == "Output"],
            "power_subsystem": [node["data"]["label"] for node in graph.nodes if node["data"]["category"] == "Power"],
            "storage_modules": [node["data"]["label"] for node in graph.nodes if node["data"]["category"] == "Storage"],
            "interfaces": sorted({edge["data"]["interface"] for edge in graph.edges}),
        },
        "architecture_graph": {"nodes": graph.nodes, "edges": graph.edges},
        "architecture_notes": [
            f"{processing_label} acts as the central processing unit.",
            "The graph represents logical subsystem relationships; exact components are intentionally deferred.",
        ],
        "assumptions": graph.assumptions,
        "warnings": graph.warnings,
    }


def build_architecture_json(requirements: dict[str, Any], *, indent: int = 2) -> str:
    return json.dumps(build_architecture(requirements), indent=indent)


if __name__ == "__main__":
    payload = json.load(sys.stdin)
    print(build_architecture_json(payload))
