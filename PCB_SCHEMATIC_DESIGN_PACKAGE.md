# 📐 PROJECT PHOENIX: PHASE 3 PCB SCHEMATIC & HARDWARE DESIGN PACKAGE
**Document ID**: `PHX-HW-SCH-001`  
**Revision**: `v1.0.0-ProductionCandidate`  
**Target Platform**: Project Phoenix Autonomous Transhumeral Myoelectric Prosthesis  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  
**Date**: 27 July 2026  

---

## 1. System Architecture & Distributed Board Topology

To eliminate bulky 14-wire cable harnesses passing through the elbow joint, Project Phoenix utilizes a **Hybrid Distributed CAN-FD Bus Topology** splitting hardware into two dedicated 4-layer PCBs connected by a 2-wire shielded differential pair (`CAN_H` / `CAN_L` + 22.2V Power / GND):

```
                       +---------------------------------------------------+
                       |    22.2V 5000mAh (111Wh) Li-Ion Battery Pack      |
                       +-------------------------+-------------------------+
                                                 | (22.2V Main Bus)
                                                 v
+------------------------------------------------+------------------------------------------------+
|  ELBOW SATELLITE MOTOR DRIVER & MCU BOARD (PCB-PHX-ELBOW-002)                                   |
|  • MCU: STM32H753VI (480MHz ARM Cortex-M7, 2MB Flash)                                           |
|  • Gate Driver: TI DRV8323 3-Phase Gate Driver + 6x CSD18532Q5B MOSFETs (10.3A Stall Protection)|
|  • Encoder: AS5048A 14-bit Magnetic Encoder (0.022° resolution SPI)                             |
|  • Power System: TPS54360 60V Buck (22.2V -> 5V) + TPS7A4700 Low-Noise LDO (5V -> 3.3V)          |
|  • Safety Interlock: 8-Point FSR Analog Multiplexer + 20.0 kPa Hardware Comparator Interrupt   |
+------------------------------------------------+------------------------------------------------+
                                                 |
                                                 | 2-Wire Shielded CAN-FD Bus (5 Mbps)
                                                 | + 5.0V Auxiliary Power / GND
                                                 v
+------------------------------------------------+------------------------------------------------+
|  PALM MASTER AI & SENSOR HUB BOARD (PCB-PHX-PALM-001)                                           |
|  • AI Processor: Syntiant NDP120 Neural Decision Processor (<4.8mW, 0.9V Core)                  |
|  • sEMG AFE: TI ADS1299 24-bit sEMG Front-End + Otto Bock 13E200 Quad Header (2000Hz)         |
|  • Vision Sensor: OV2640 2MP Camera Subsystem (DVP 8-bit Parallel Bus)                          |
|  • Audio Sensor: Knowles SPH0645LM4H MEMS PDM Microphone                                        |
|  • Sweat BioAFE: TI LMP91000 Microfluidic Potentiostat (Cortisol <0.60 ug/dL Cap)               |
|  • CAN-FD Controller: Microchip MCP2518FD + MCP2542FD Transceiver (120 Ohm Split Terminated)   |
+-------------------------------------------------------------------------------------------------+
```

---

## 2. Board 1: Palm Master AI & Sensor Hub (`PCB-PHX-PALM-001`)

### 2.1 Mechanical & Layer Stackup Specifications
* **Form Factor**: $45.0\,\text{mm} \times 45.0\,\text{mm}$ 4-Layer Rigid-Flex Board with rounded $3.0\,\text{mm}$ corners to fit inside the 3D-printed titanium alloy palm chassis.
* **PCB Thickness**: $1.2\,\text{mm}$ (1 oz Copper Outer Layers, 0.5 oz Inner Layers).
* **Layer Stackup**:
  1. **L1 (Top Signal)**: High-speed differential pairs (CAN-FD, DVP Camera), sEMG analog input traces.
  2. **L2 (Ground Plane)**: Continuous Solid GND Plane ($0\,\text{V}$ reference).
  3. **L3 (Power Plane)**: Split power copper pours ($3.3\,\text{V}$ System, $1.8\,\text{V}$ IO, $0.9\,\text{V}$ NDP120 Core).
  4. **L4 (Bottom Signal)**: Passive SMT components, decoupling caps, test points.

---

## 4. Complete Bill of Materials (BOM) & Netlist Summary

| Designator | Component Description | Manufacturer Part Number (MPN) | Package / Footprint | Qty | Target Vendor |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **U101** | Syntiant NDP120 Neural AI Processor | `NDP120-B0-CB-01` | BGA-42 ($3.1\times 2.6\,\text{mm}$) | 1 | Syntiant Direct |
| **U201** | 24-Bit sEMG Analog Front-End | `ADS1299IPAG` | TQFP-64 | 1 | Texas Instruments |
| **J201** | Otto Bock Quad Electrode Header | `MyoBock_13E200_Quad` | 4-Pin 2.54mm Header | 1 | Otto Bock Direct |
| **U301** | CAN-FD Controller | `MCP2518FD-E/SL` | SOIC-14 | 1 | Microchip |
| **U302** | High-Speed CAN-FD Transceiver | `MCP2542FD-E/MF` | DFN-8 ($3\times 3\,\text{mm}$) | 1 | Microchip |
| **U401** | High-Perf 480MHz MCU | `STM32H753VIT6` | LQFP-100 | 1 | STMicroelectronics |
| **U501** | 3-Phase Smart Gate Driver | `DRV8323RS` | QFN-40 ($6\times 6\,\text{mm}$) | 1 | Texas Instruments |
| **Q501–Q506** | 60V 100A N-Ch MOSFET | `CSD18532Q5B` | SON 5x6 | 6 | Texas Instruments |
| **U601** | 14-Bit Rotary Magnetic Encoder | `AS5048A-TS_EK_AB` | TSSOP-14 | 1 | ams-OSRAM |

---

© 2026 R. Karthick Raja. All Rights Reserved except where licensed under the software MIT License.
