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
|  • sEMG AFE: TI TI ADS1299 / Otto Bock 13E200 4-Channel Differential sEMG Front-End (2000Hz, Bandpass 10-500Hz)        |
|  • Vision Sensor: OV2640 2MP Camera Subsystem (DVP 8-bit Parallel Bus)                          |
|  • Audio Sensor: Knowles SPH0645LM4H MEMS PDM Microphone                                        |
|  • Sweat BioAFE: TI LMP91000 Graphene Microfluidic Potentiostat (Cortisol <0.60 ug/dL Cap)     |
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

### 2.2 Schematic Circuit Blocks (`PCB-PHX-PALM-001`)

#### Block A: Syntiant NDP120 Neural Processor Subsystem
* **IC Designation**: `U101` (`NDP120-B0-CB-01` BGA-42)
* **Power Supply Decoupling**:
  * `VDD_CORE` ($0.9\,\text{V}$): $4.7\,\mu\text{F}$ X7R + $0.1\,\mu\text{F}$ 0402 ceramic caps on Pins C2, C4.
  * `VDD_IO` ($1.8\,\text{V}$): $2.2\,\mu\text{F}$ X7R + $0.1\,\mu\text{F}$ 0402 ceramic caps on Pins A1, B1.
* **Clock Source**: `Y101` $32.768\,\text{kHz}$ TCXO Crystal connected to `XTAL_IN` (Pin D1) and `XTAL_OUT` (Pin D2) with $12\,\text{pF}$ load capacitors.
* **Host Interface (SPI Slave to STM32)**:
  * `NDP_SPI_CLK` $\rightarrow$ `SPI2_SCK`
  * `NDP_SPI_MISO` $\rightarrow$ `SPI2_MISO`
  * `NDP_SPI_MOSI` $\rightarrow$ `SPI2_MOSI`
  * `NDP_SPI_CS_N` $\rightarrow$ `GPIO_PB12`
  * `NDP_INT_N` $\rightarrow$ `EXTI_PB11` (Active Low Interrupt on Gesture Classification).

#### Block B: TI TI ADS1299 / Otto Bock 13E200 4-Channel sEMG Analog Front-End (2000Hz)
* **IC Designation**: `U201` (`TI ADS1299 / Otto Bock 13E200TPWR` TSSOP-16)
* **Analog Inputs**:
  * `CH1_IN+` / `CH1_IN-`: Biceps Brachii sEMG differential pair via $0.1\,\mu\text{F}$ DC-blocking caps.
  * `CH2_IN+` / `CH2_IN-`: Triceps Brachii sEMG differential pair.
  * `CH3_IN+` / `CH3_IN-`: Anterior Deltoid sEMG differential pair.
  * `CH4_IN+` / `CH4_IN-`: Brachioradialis sEMG differential pair.
* **Analog Bandpass Filter**: Passive 4th-order Sallen-Key Butterworth bandpass filter ($10\,\text{Hz} \text{ to } 500\,\text{Hz}$) with $45\,\text{dB}$ PGA gain stage and $50\,\text{Hz} / 60\,\text{Hz}$ notch rejection.
* **ESD Protection**: `D201–D204` (`USBLC6-2SC6`) TVS diode arrays on all skin-contacting sEMG electrode lines ($15\,\text{kV}$ Air / $8\,\text{kV}$ Contact ESD protection).

#### Block C: Microchip MCP2518FD CAN-FD Controller Subsystem
* **IC Designation**: `U301` (`MCP2518FD-E/SL` SOIC-14) + `U302` (`MCP2542FD-E/MF` DFN-8 Transceiver)
* **Differential Line Termination**:
  * $120\,\Omega$ split termination resistors ($R301 = 60.4\,\Omega$, $R302 = 60.4\,\Omega$) with $4.7\,\text{nF}$ filtering capacitor to GND.
* **ESD & Choke Protection**: `FL301` Common Mode Choke (`ACM2012-900-2P`) + `D301` (`PESD2CAN`) TVS diode array on `CAN_H` / `CAN_L` lines.

---

## 3. Board 2: Elbow Motor Driver & Power MCU (`PCB-PHX-ELBOW-002`)

### 3.1 Mechanical & Layer Stackup Specifications
* **Form Factor**: $38.0\,\text{mm}$ Circular Ring PCB designed to mount directly to the rear flange of the **Maxon ECX Speed 16 M** motor.
* **PCB Thickness**: $1.6\,\text{mm}$ (2 oz Heavy Copper Outer Layers to handle 10.3A motor stall spikes without overheating).
* **Layer Stackup**:
  1. **L1 (Top Power / Gate Drive)**: Heavy copper $22.2\,\text{V}$ power bus, MOSFET H-bridge traces, Phase A/B/C motor outputs.
  2. **L2 (Ground Plane)**: Continuous $0\,\text{V}$ Power Ground Plane.
  3. **L3 (Signal / Analog)**: AS5048A SPI lines, FSR comparator traces, low-noise $3.3\,\text{V}$ LDO rail.
  4. **L4 (Bottom Signal / Thermal Pad)**: Ground copper pour with exposed thermal vias connected to motor heatsink housing.

---

### 3.2 Schematic Circuit Blocks (`PCB-PHX-ELBOW-002`)

#### Block A: STM32H753VI High-Performance Main Microcontroller
* **IC Designation**: `U401` (`STM32H753VIT6` LQFP-100)
* **Core Frequency**: $480\,\text{MHz}$ ARM Cortex-M7 with Hardware Floating Point Unit (FPU).
* **Power Decoupling**: $100\,\text{nF}$ ceramic cap per $V_{DD}$ pin ($12\times$) + $4.7\,\mu\text{F}$ tantalum bulk caps on $V_{CAP1}$ and $V_{CAP2}$.
* **System Clock**: $25.000\,\text{MHz}$ HSE Crystal (`Y401`) with $18\,\text{pF}$ load caps.

#### Block B: TI DRV8323 3-Phase Gate Driver & Maxon ECX Motor H-Bridge
* **IC Designation**: `U501` (`DRV8323RS` QFN-40)
* **MOSFET H-Bridge Array**: 6x `Q501–Q506` (`CSD18532Q5B` 60V, $1.4\,\text{m}\Omega$ $R_{DS(on)}$ N-Channel MOSFETs).
* **Current Sensing**: Dual low-side current shunt resistors ($R_{shunt1,2} = 5\,\text{m}\Omega$, 3W, 1% tolerance) connected to DRV8323 internal programmable current sense amplifiers (CSA).
* **Stall Current Arbitration**: Hardware over-current trip set to $10.3\,\text{A}$ ($V_{trip} = 1.65\,\text{V}$), shutting down gate drivers within $<1.5\,\mu\text{s}$ upon mechanical stall.

#### Block C: AMS AS5048A 14-Bit Magnetic Encoder
* **IC Designation**: `U601` (`AS5048A-TS_EK_AB` TSSOP-14)
* **Alignment**: Positioned precisely on the rear axis of the Maxon motor shaft over a diametrically magnetized neodymium magnet.
* **Resolution**: 14-bit (16,384 positions per revolution = $0.022^\circ$ angular accuracy).

#### Block D: Power Converter & Battery Management System (22.2V Pack)
* **Step-Down Buck Converter**: `U701` (`TPS54360DDAR` SOIC-8)
  * Input: $18.0\,\text{V} \text{ to } 25.2\,\text{V}$ ($22.2\,\text{V}$ nominal Li-Ion pack).
  * Output: $5.0\,\text{V} \pm 1.5\%$ @ $3.5\,\text{A}$ ($89\%$ efficiency @ 2A load).
  * Inductor: `L701` $15\,\mu\text{H}$ ($I_{sat} = 5.2\,\text{A}$, $DCR = 22\,\text{m}\Omega$).
* **Low-Noise Linear Regulator**: `U702` (`TPS7A4700RGWT` QFN-20)
  * Output: $3.30\,\text{V}$ low-noise rail ($4.2\,\mu\text{V}_{RMS}$ noise floor) powering sEMG AFE, AS5048A encoder, and STM32 ADC references.

---

## 4. Complete Bill of Materials (BOM) & Netlist Summary

| Designator | Component Description | Manufacturer Part Number (MPN) | Package / Footprint | Qty | Target Vendor |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **U101** | Syntiant NDP120 Neural AI Processor | `NDP120-B0-CB-01` | BGA-42 ($3.1\times 2.6\,\text{mm}$) | 1 | Syntiant Direct |
| **U201** | 4-Ch sEMG Analog Front-End | `TI ADS1299 / Otto Bock 13E200TPWR` | TSSOP-16 | 1 | Texas Instruments |
| **U301** | CAN-FD Controller | `MCP2518FD-E/SL` | SOIC-14 | 1 | Microchip |
| **U302** | High-Speed CAN-FD Transceiver | `MCP2542FD-E/MF` | DFN-8 ($3\times 3\,\text{mm}$) | 1 | Microchip |
| **U401** | High-Perf 480MHz MCU | `STM32H753VIT6` | LQFP-100 | 1 | STMicroelectronics |
| **U501** | 3-Phase Smart Gate Driver | `DRV8323RS` | QFN-40 ($6\times 6\,\text{mm}$) | 1 | Texas Instruments |
| **Q501–Q506** | 60V 100A N-Ch MOSFET | `CSD18532Q5B` | SON 5x6 | 6 | Texas Instruments |
| **U601** | 14-Bit Rotary Magnetic Encoder | `AS5048A-TS_EK_AB` | TSSOP-14 | 1 | ams-OSRAM |
| **U701** | 60V 3.5A Buck Regulator | `TPS54360DDAR` | SO-8 PowerPAD | 1 | Texas Instruments |
| **U702** | Ultra Low-Noise LDO 3.3V | `TPS7A4700RGWT` | QFN-20 ($4\times 4\,\text{mm}$) | 1 | Texas Instruments |
| **D201–D204** | ESD Protection Diode Array | `USBLC6-2SC6` | SOT-23-6L | 4 | STMicroelectronics |
| **FL301** | CAN Common Mode Choke | `ACM2012-900-2P` | 0805 SMD | 1 | TDK Corporation |

---

## 5. PCB Fabrication & Design Rules (DFM / DFA Checklist)

1. **Trace Width / Spacing Rules**:
   * Signal Traces: Minimum $5.0\,\text{mil}$ width / $5.0\,\text{mil}$ clearance ($0.127\,\text{mm}$).
   * Motor Power Traces (Phase A/B/C): Minimum $60.0\,\text{mil}$ width ($1.524\,\text{mm}$) on 2 oz outer copper.
2. **Impedance Control**:
   * `CAN_H` / `CAN_L` Differential Pair: $120\,\Omega \pm 10\%$ differential impedance ($7.0\,\text{mil}$ trace width, $8.5\,\text{mil}$ gap on L1 over L2 GND).
3. **Thermal Management**:
   * 16x $12\,\text{mil}$ thermal via array under DRV8323 and MOSFET H-bridge pads connected to inner GND planes and bottom copper pour.
4. **IPC Standards Compliance**:
   * Designed according to **IPC-2221A** (Generic Standard on Printed Board Design) and **IPC-6012 Class 3** (High Reliability Medical Devices).

---

### 🌐 GitHub & Netlify Integration
This PCB Schematic Specification (`PHX-HW-SCH-001`) has been committed to the repository and documented in your QMS Design History File (DHF)!
