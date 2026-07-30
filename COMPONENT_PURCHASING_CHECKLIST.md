# 🛒 PROJECT PHOENIX: PHASE 3 COMPONENT PURCHASING & SOURCING CHECKLIST
**Document ID**: `PHX-HW-BOM-001`  
**Revision**: `v1.1.0-BlueprintSynchronized`  
**Blueprint.io Reference Link**: [https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE](https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE)  
**Target Build**: Phase 3 Hardware Prototype Assembly (5-Unit Initial Batch)  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  
**Date**: 30 July 2026  

---

## 1. Executive Budget Summary (Blueprint.io Synchronized)

| Sourcing Category | Cost per Unit (INR ₹) | Cost per Unit (USD $) | Total 5-Unit Batch (INR ₹) | Total 5-Unit Batch (USD $) |
| :--- | :---: | :---: | :---: | :---: |
| **Microcontrollers & AI Chips (STM32H753 + NDP120)** | ₹5,395 | $65.00 | ₹26,975 | $325.00 |
| **Clinical sEMG Electrodes (Otto Bock MyoBock 13E200 x4)** | ₹83,000 | $1,000.00 | ₹415,000 | $5,000.00 |
| **Vision & Voice Sensors (OmniVision OV2640 + MEMS Mic)** | ₹913 | $11.00 | ₹4,565 | $55.00 |
| **Gate Drivers, Encoders & Power Management** | ₹7,940 | $95.60 | ₹39,700 | $478.00 |
| **Motors & Mechanical Actuators (Maxon ECX + Worm Gear)** | ₹38,500 | $463.85 | ₹192,500 | $2,319.25 |
| **PCB Prototyping Fab (ENIG 4-Layer)** | ₹1,780 | $21.40 | ₹8,900 | $107.00 |
| **GRAND TOTAL PROTOTYPE BUDGET** | **₹137,528** | **$1,656.85** | **₹687,640** | **$8,284.25** |

---

## 2. Blueprint.io Master Component Procurement Matrix

### 2.1 Core Microcontrollers, AI Inference & Clinical Sensors (Blueprint.io Verified)

| Part Item | Component Description | Category | Qty (per unit) | Unit Price (USD $) | Unit Price (INR ₹) | Vendor Sources |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **STM32H753** | Main Prosthetic High-Performance 480MHz MCU | `MCU` | 1 | ~$25.00 | ₹2,075 | Amazon, AliExpress, eBay, Mouser |
| **Syntiant NDP120** | AI Inference Chip (Palm) — Ultra-low power neural decision processor | `MCU` | 1 | ~$40.00 | ₹3,320 | Syntiant Direct, AliExpress, eBay |
| **Otto Bock MyoBock 13E200** | Clinical sEMG Sensor Array (Biceps, Triceps, Deltoid, Brachioradialis) | `SENSOR` | 4 | ~$250.00 ($1000 total) | ₹83,000 | Otto Bock, Amazon, AliExpress, eBay |
| **OmniVision OV2640** | Palm Object Camera — Compact 2MP camera module with DVP interface | `SENSOR` | 1 | ~$8.00 | ₹664 | Amazon, AliExpress, eBay |
| **Custom MEMS Microphone** | Socket Knowles MEMS Microphone — Primary voice input (Claim 7) | `SENSOR` | 1 | ~$3.00 | ₹249 | Amazon, AliExpress |

---

### 2.2 Gate Drivers, Encoders & Power Electronics

| Designator | Component Description | Manufacturer Part Number (MPN) | Footprint / Package | Qty (5 Units) | Unit Price (INR ₹) | Direct Vendor Link |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **U501** | 3-Phase Smart Gate Driver | `DRV8323RS` | QFN-40 ($6\times 6\text{mm}$) | 5 | ₹820 | [DigiKey India](https://www.digikey.in/en/products/result?keywords=DRV8323RS) |
| **Q501–Q506**| 60V 100A N-Ch MOSFET | `CSD18532Q5B` | SON 5x6 | 30 | ₹165 | [Mouser India](https://www.mouser.in/c/?q=CSD18532Q5B) |
| **U601** | 14-Bit Rotary Magnetic Encoder | `AS5048A-TS_EK_AB` | TSSOP-14 | 5 | ₹1,120 | [DigiKey India](https://www.digikey.in/en/products/result?keywords=AS5048A) |
| **U301** | CAN-FD Controller | `MCP2518FD-E/SL` | SOIC-14 | 5 | ₹310 | [Element14 India](https://in.element14.com/c/semiconductors-ics?st=MCP2518FD) |
| **U302** | High-Speed CAN-FD Transceiver | `MCP2542FD-E/MF` | DFN-8 ($3\times 3\text{mm}$) | 5 | ₹240 | [Element14 India](https://in.element14.com/c/semiconductors-ics?st=MCP2542FD) |
| **U701** | 60V 3.5A Step-Down Regulator | `TPS54360DDAR` | SO-8 PowerPAD | 5 | ₹450 | [Mouser India](https://www.mouser.in/c/?q=TPS54360DDAR) |

---

### 2.3 Motors, Mechanical Actuators & Power Systems

| Component Item | Description & Spec | Part Number / Model | Qty (5 Units) | Unit Price (INR ₹) | Direct Vendor Link |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Elbow Motor** | Maxon ECX Speed 16 M ($40\,\text{W}$, $22.2\,\text{V}$) | `ECX Speed 16 M` | 5 | ₹28,500 | [Maxon India](https://www.maxongroup.in/) |
| **Elbow Gearhead**| 50:1 Non-Backdrivable Worm Gear | `GP 16 C 50:1` | 5 | ₹10,000 | [Maxon India](https://www.maxongroup.in/) |
| **Battery Pack** | 22.2V 5000mAh 6S Li-Ion Pack (111Wh) | `6S-5000-45C` | 5 | ₹6,500 | [Robu.in](https://robu.in/) |

---

## 3. Step-by-Step Vendor Procurement Instructions

### 🛒 Step 1: Microcontrollers & Sensors (Amazon / AliExpress / eBay)
1. Source **STM32H753 Main MCU** (~$25.00) and **OmniVision OV2640 Camera** (~$8.00) via Amazon or AliExpress.
2. Source **Otto Bock MyoBock 13E200 Clinical sEMG Electrodes** (Qty 4, ~$250 each / ~$1000 total) through Otto Bock Healthcare or verified medical supply vendors on eBay/Amazon.
3. Source **Syntiant NDP120 AI Inference Chip** (~$40.00) directly from Syntiant sales portal or verified distributor listings.

### 🛒 Step 2: PCB Assembly (JLCPCB / Elemex India)
* Upload Gerber files (`PCB-PHX-PALM-001_Gerbers.zip` and `PCB-PHX-ELBOW-002_Gerbers.zip`) for 4-layer ENIG PCB fabrication.

---

### 🌐 Blueprint.io Project Link
This component list is synchronized with your interactive project on Blueprint.io:  
🔗 **[https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE](https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE)**
