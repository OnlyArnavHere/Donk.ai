import json

from sympy import false, true

from parser import ArchitectureParser

parser = ArchitectureParser()

# =====================================================
# Paste ANY Architecture JSON here
# =====================================================

architecture = {
  "architecture_model": {
    "processing_unit": "MCU",
    "communication_modules": [
      "Bluetooth Module",
      "Cloud Connectivity Module"
    ],
    "sensing_modules": [
      "Water Quality Sensor",
      "Flow Sensor",
      "Temperature Sensor",
      "User Interface"
    ],
    "user_interface_modules": [
      "UV Controller",
      "Motor Driver"
    ],
    "power_subsystem": [
      "Power Management",
      "Battery"
    ],
    "storage_modules": [],
    "interfaces": [
      "GPIO",
      "I2C",
      "Power",
      "SPI",
      "UART"
    ]
  },
  "architecture_graph": {
    "nodes": [
      {
        "id": "1",
        "type": "architecture",
        "data": {
          "label": "MCU",
          "category": "Processing"
        }
      },
      {
        "id": "2",
        "type": "architecture",
        "data": {
          "label": "Bluetooth Module",
          "category": "Communication"
        }
      },
      {
        "id": "3",
        "type": "architecture",
        "data": {
          "label": "Power Management",
          "category": "Power"
        }
      },
      {
        "id": "4",
        "type": "architecture",
        "data": {
          "label": "Battery",
          "category": "Power"
        }
      },
      {
        "id": "5",
        "type": "architecture",
        "data": {
          "label": "UV Controller",
          "category": "Output"
        }
      },
      {
        "id": "6",
        "type": "architecture",
        "data": {
          "label": "Motor Driver",
          "category": "Output"
        }
      },
      {
        "id": "7",
        "type": "architecture",
        "data": {
          "label": "Water Quality Sensor",
          "category": "Sensor"
        }
      },
      {
        "id": "8",
        "type": "architecture",
        "data": {
          "label": "Flow Sensor",
          "category": "Sensor"
        }
      },
      {
        "id": "9",
        "type": "architecture",
        "data": {
          "label": "Temperature Sensor",
          "category": "Sensor"
        }
      },
      {
        "id": "10",
        "type": "architecture",
        "data": {
          "label": "Cloud Connectivity Module",
          "category": "Communication"
        }
      },
      {
        "id": "11",
        "type": "architecture",
        "data": {
          "label": "User Interface",
          "category": "Input"
        }
      },
      {
        "id": "12",
        "type": "architecture",
        "data": {
          "label": "Memory",
          "category": "Memory"
        }
      }
    ],
    "edges": [
      {
        "id": "1-power-3",
        "source": "1",
        "target": "3",
        "type": "smoothstep",
        "label": "Power",
        "data": {
          "interface": "Power"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "4-power-3",
        "source": "4",
        "target": "3",
        "type": "smoothstep",
        "label": "Power",
        "data": {
          "interface": "Power"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "2-uart-1",
        "source": "2",
        "target": "1",
        "type": "smoothstep",
        "label": "UART",
        "data": {
          "interface": "UART"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "10-uart-1",
        "source": "10",
        "target": "1",
        "type": "smoothstep",
        "label": "UART",
        "data": {
          "interface": "UART"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "5-gpio-1",
        "source": "5",
        "target": "1",
        "type": "smoothstep",
        "label": "GPIO",
        "data": {
          "interface": "GPIO"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "6-gpio-1",
        "source": "6",
        "target": "1",
        "type": "smoothstep",
        "label": "GPIO",
        "data": {
          "interface": "GPIO"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "7-i2c-1",
        "source": "7",
        "target": "1",
        "type": "smoothstep",
        "label": "I2C",
        "data": {
          "interface": "I2C"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "8-i2c-1",
        "source": "8",
        "target": "1",
        "type": "smoothstep",
        "label": "I2C",
        "data": {
          "interface": "I2C"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "9-i2c-1",
        "source": "9",
        "target": "1",
        "type": "smoothstep",
        "label": "I2C",
        "data": {
          "interface": "I2C"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "11-gpio-1",
        "source": "11",
        "target": "1",
        "type": "smoothstep",
        "label": "GPIO",
        "data": {
          "interface": "GPIO"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "12-spi-1",
        "source": "12",
        "target": "1",
        "type": "smoothstep",
        "label": "SPI",
        "data": {
          "interface": "SPI"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      }
    ]
  },
  "subsystems": [
    {
      "label": "MCU",
      "category": "Processing",
      "reason": "Required for controlling the purification process, mobile app communication, and customizable performance settings",
      "confidence": 0.95
    },
    {
      "label": "Bluetooth Module",
      "category": "Communication",
      "reason": "Required for mobile app control and connectivity",
      "confidence": 0.95
    },
    {
      "label": "Power Management",
      "category": "Power",
      "reason": "Required for managing mains power and backup battery",
      "confidence": 0.95
    },
    {
      "label": "Battery",
      "category": "Power",
      "reason": "Required for backup power during mains power outages",
      "confidence": 0.95
    },
    {
      "label": "UV Controller",
      "category": "Output",
      "reason": "Required for controlling the UV purification process",
      "confidence": 0.95
    },
    {
      "label": "Motor Driver",
      "category": "Output",
      "reason": "Required for controlling the water pumps and valves",
      "confidence": 0.95
    },
    {
      "label": "Water Quality Sensor",
      "category": "Sensor",
      "reason": "Required for monitoring the water quality and adjusting the purification process",
      "confidence": 0.95
    },
    {
      "label": "Flow Sensor",
      "category": "Sensor",
      "reason": "Required for monitoring the water flow rate and adjusting the purification process",
      "confidence": 0.95
    },
    {
      "label": "Temperature Sensor",
      "category": "Sensor",
      "reason": "Required for monitoring the water temperature and adjusting the purification process",
      "confidence": 0.95
    },
    {
      "label": "Cloud Connectivity Module",
      "category": "Communication",
      "reason": "Required for cloud-based processing and remote monitoring",
      "confidence": 0.95
    },
    {
      "label": "User Interface",
      "category": "Input",
      "reason": "Required for user input and customizable performance settings",
      "confidence": 0.8
    },
    {
      "label": "Memory",
      "category": "Memory",
      "reason": "Required for storing the purification settings, water quality data, and software updates",
      "confidence": 0.9
    }
  ],
  "assumptions": [
    "User Interface is a model-inferred subsystem (Required for user input and customizable performance settings); confidence 0.8."
  ],
  "warnings": [],
  "react_flow": {
    "nodes": [
      {
        "id": "1",
        "type": "architecture",
        "data": {
          "label": "MCU",
          "category": "Processing"
        },
        "position": {
          "x": 640,
          "y": 0
        }
      },
      {
        "id": "2",
        "type": "architecture",
        "data": {
          "label": "Bluetooth Module",
          "category": "Communication"
        },
        "position": {
          "x": 960,
          "y": 0
        }
      },
      {
        "id": "3",
        "type": "architecture",
        "data": {
          "label": "Power Management",
          "category": "Power"
        },
        "position": {
          "x": 0,
          "y": 0
        }
      },
      {
        "id": "4",
        "type": "architecture",
        "data": {
          "label": "Battery",
          "category": "Power"
        },
        "position": {
          "x": 0,
          "y": 160
        }
      },
      {
        "id": "5",
        "type": "architecture",
        "data": {
          "label": "UV Controller",
          "category": "Output"
        },
        "position": {
          "x": 1280,
          "y": 0
        }
      },
      {
        "id": "6",
        "type": "architecture",
        "data": {
          "label": "Motor Driver",
          "category": "Output"
        },
        "position": {
          "x": 1280,
          "y": 160
        }
      },
      {
        "id": "7",
        "type": "architecture",
        "data": {
          "label": "Water Quality Sensor",
          "category": "Sensor"
        },
        "position": {
          "x": 320,
          "y": 0
        }
      },
      {
        "id": "8",
        "type": "architecture",
        "data": {
          "label": "Flow Sensor",
          "category": "Sensor"
        },
        "position": {
          "x": 320,
          "y": 160
        }
      },
      {
        "id": "9",
        "type": "architecture",
        "data": {
          "label": "Temperature Sensor",
          "category": "Sensor"
        },
        "position": {
          "x": 320,
          "y": 320
        }
      },
      {
        "id": "10",
        "type": "architecture",
        "data": {
          "label": "Cloud Connectivity Module",
          "category": "Communication"
        },
        "position": {
          "x": 960,
          "y": 160
        }
      },
      {
        "id": "11",
        "type": "architecture",
        "data": {
          "label": "User Interface",
          "category": "Input"
        },
        "position": {
          "x": 320,
          "y": 480
        }
      },
      {
        "id": "12",
        "type": "architecture",
        "data": {
          "label": "Memory",
          "category": "Memory"
        },
        "position": {
          "x": 640,
          "y": 160
        }
      }
    ],
    "edges": [
      {
        "id": "1-power-3",
        "source": "1",
        "target": "3",
        "type": "smoothstep",
        "label": "Power",
        "data": {
          "interface": "Power"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "4-power-3",
        "source": "4",
        "target": "3",
        "type": "smoothstep",
        "label": "Power",
        "data": {
          "interface": "Power"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "2-uart-1",
        "source": "2",
        "target": "1",
        "type": "smoothstep",
        "label": "UART",
        "data": {
          "interface": "UART"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "10-uart-1",
        "source": "10",
        "target": "1",
        "type": "smoothstep",
        "label": "UART",
        "data": {
          "interface": "UART"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "5-gpio-1",
        "source": "5",
        "target": "1",
        "type": "smoothstep",
        "label": "GPIO",
        "data": {
          "interface": "GPIO"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "6-gpio-1",
        "source": "6",
        "target": "1",
        "type": "smoothstep",
        "label": "GPIO",
        "data": {
          "interface": "GPIO"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "7-i2c-1",
        "source": "7",
        "target": "1",
        "type": "smoothstep",
        "label": "I2C",
        "data": {
          "interface": "I2C"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "8-i2c-1",
        "source": "8",
        "target": "1",
        "type": "smoothstep",
        "label": "I2C",
        "data": {
          "interface": "I2C"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "9-i2c-1",
        "source": "9",
        "target": "1",
        "type": "smoothstep",
        "label": "I2C",
        "data": {
          "interface": "I2C"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "11-gpio-1",
        "source": "11",
        "target": "1",
        "type": "smoothstep",
        "label": "GPIO",
        "data": {
          "interface": "GPIO"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      },
      {
        "id": "12-spi-1",
        "source": "12",
        "target": "1",
        "type": "smoothstep",
        "label": "SPI",
        "data": {
          "interface": "SPI"
        },
        "markerEnd": {
          "type": "arrowclosed"
        }
      }
    ]
  }
}

# =====================================================

requests = parser.parse(architecture)

print("="*80)

for r in requests:

    print(json.dumps(r, indent=4))

print("="*80)