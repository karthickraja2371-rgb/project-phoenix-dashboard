# 🛒 PROJECT PHOENIX: PHASE 3 COMPONENT PURCHASING & SOURCING CHECKLIST
**Document ID**: `PHX-HW-BOM-001`  
**Revision**: `v1.0.0-Release`  
**Target Build**: Phase 3 Hardware Prototype Assembly (5-Unit Initial Batch)  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  
**Date**: 28 July 2026  

---

## 1. Executive Budget Summary (5-Unit Prototype Sourcing)

| Sourcing Category | Cost per Unit (INR ₹) | Cost per Unit (USD $) | Total 5-Unit Batch (INR ₹) | Total 5-Unit Batch (USD $) |
| :--- | :---: | :---: | :---: | :---: |
| **Integrated Circuits & Semiconductors** | ₹14,250 | $171.60 | ₹71,250 | $858.00 |
| **Passives, Diodes & Connectors** | ₹2,400 | $28.90 | ₹12,000 | $144.50 |
| **Motors & Mechanical Actuators (Maxon)** | ₹38,500 | $463.85 | ₹192,500 | $2,319.25 |
| **PCB Prototyping Fab (ENIG 4-Layer)** | ₹1,780 | $21.40 | ₹8,900 | $107.00 |
| **Battery Pack (22.2V 5000mAh Li-Ion)** | ₹6,500 | $78.30 | ₹32,500 | $391.50 |
| **GRAND TOTAL PROTOTYPE BUDGET** | **₹63,430** | **$764.05** | **₹317,150** | **$3,820.25** |

---

## 2. Master Component Procurement Matrix (`PCB-PHX-PALM-001` & `PCB-PHX-ELBOW-002`)

### 2.1 Integrated Circuits (ICs) & Active Semiconductors

| Designator | Component Description | Manufacturer Part Number (MPN) | Footprint / Package | Qty (5 Units) | Unit Price (INR ₹) | Direct Vendor Link |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **U101** | Syntiant NDP120 Neural AI Processor | `NDP120-B0-CB-01` | BGA-42 ($3.1\times 2.6\text{mm}$) | 5 | ₹2,950 | [Syntiant Direct](https://www.syntiant.com/ndp120) |
| **U401** | High-Performance 480MHz MCU | `STM32H753VIT6` | LQFP-100 ($14\times 14\text{mm}$) | 5 | ₹1,850 | [Mouser India](https://www.mouser.in/c/?q=STM32H753VIT6) |
| **U201** | 4-Ch sEMG Analog Front-End | `PGA460TPWR` | TSSOP-16 | 5 | ₹680 | [Mouser India](https://www.mouser.in/c/?q=PGA460TPWR) |
| **U501** | 3-Phase Smart Gate Driver | `DRV8323RS` | QFN-40 ($6\times 6\text{mm}$) | 5 | ₹820 | [DigiKey India](https://www.digikey.in/en/products/result?keywords=DRV8323RS) |
| **Q501–Q506**| 60V 100A N-Ch MOSFET | `CSD18532Q5B` | SON 5x6 | 30 | ₹165 | [Mouser India](https://www.mouser.in/c/?q=CSD18532Q5B) |
| **U601** | 14-Bit Rotary Magnetic Encoder | `AS5048A-TS_EK_AB` | TSSOP-14 | 5 | ₹1,120 | [DigiKey India](https://www.digikey.in/en/products/result?keywords=AS5048A) |
| **U301** | CAN-FD Controller | `MCP2518FD-E/SL` | SOIC-14 | 5 | ₹310 | [Element14 India](https://in.element14.com/c/semiconductors-ics?st=MCP2518FD) |
| **U302** | High-Speed CAN-FD Transceiver | `MCP2542FD-E/MF` | DFN-8 ($3\times 3\text{mm}$) | 5 | ₹240 | [Element14 India](https://in.element14.com/c/semiconductors-ics?st=MCP2542FD) |
| **U701** | 60V 3.5A Step-Down Regulator | `TPS54360DDAR` | SO-8 PowerPAD | 5 | ₹450 | [Mouser India](https://www.mouser.in/c/?q=TPS54360DDAR) |
| **U702** | Ultra Low-Noise 3.3V LDO | `TPS7A4700RGWT` | QFN-20 ($4\times 4\text{mm}$) | 5 | ₹580 | [DigiKey India](https://www.digikey.in/en/products/result?keywords=TPS7A4700) |
| **D201–D204**| TVS ESD Protection Array | `USBLC6-2SC6` | SOT-23-6L | 20 | ₹45 | [Mouser India](https://www.mouser.in/c/?q=USBLC6-2SC6) |

---

### 2.2 Motors, Mechanical Actuators & Power Systems

| Component Item | Description & Spec | Part Number / Model | Qty (5 Units) | Unit Price (INR ₹) | Direct Vendor Link |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Elbow Motor** | Maxon ECX Speed 16 M ($40\,\text{W}$, $22.2\,\text{V}$) | `ECX Speed 16 M` | 5 | ₹28,500 | [Maxon India](https://www.maxongroup.in/) |
| **Elbow Gearhead**| 50:1 Non-Backdrivable Worm Gear | `GP 16 C 50:1` | 5 | ₹10,000 | [Maxon India](https://www.maxongroup.in/) |
| **Battery Pack** | 22.2V 5000mAh 6S Li-Ion Pack (111Wh) | `6S-5000-45C` | 5 | ₹6,500 | [Robu.in](https://robu.in/) |
| **Tendon Line** | Dyneema 0.8mm Braided Line ($120\,\text{kg}$ break) | `Dyneema-0.8mm-100m` | 1 Spool | ₹2,200 | [Amazon India / Tackle](https://www.amazon.in/) |

---

## 3. Step-by-Step Vendor Procurement Instructions

### 🛒 Step 1: Integrated Circuits (Mouser & DigiKey)
1. Go to **Mouser India** (`mouser.in`) and search for BOM Part Numbers: `STM32H753VIT6`, `PGA460TPWR`, `CSD18532Q5B`, `TPS54360DDAR`, and `USBLC6-2SC6`.
2. Add quantity 5 for ICs and 30 for MOSFETs to cart. Select **GST Invoice** for tax credit if purchasing under an incubator or company account.
3. Go to **DigiKey India** (`digikey.in`) for `DRV8323RS`, `AS5048A-TS_EK_AB`, and `TPS7A4700RGWT`.

### 🛒 Step 2: Syntiant NDP120 Direct Request
* Submit a sample request or direct purchase order for `NDP120-B0-CB-01` via **Syntiant Sales Inquiry Portal** (`syntiant.com/contact`), specifying **Medical Device Prototyping** for Project Phoenix.

### 🛒 Step 3: Maxon Precision Motors India (Bangalore)
* Contact **Maxon Precision Motors India Pvt Ltd** (Bangalore Office):
  * Request quotation for **Qty 5 Maxon ECX Speed 16 M (40W, 22.2V)** with integrated AS5048A encoder flange and **GP 16 C 50:1 worm gearhead**.

---

## 4. PCB Prototype Fabrication Ordering Checklist (JLCPCB / Elemex India)

When submitting Gerber files (`PHX-HW-FAB-001`) to **JLCPCB** or **Elemex India**:

1. **Upload `PCB-PHX-PALM-001_Gerbers.zip`**:
   * Select **4 Layers**, Thickness **1.2mm**, **ENIG Surface Finish**, **Matte Black Solder Mask**.
2. **Upload `PCB-PHX-ELBOW-002_Gerbers.zip`**:
   * Select **4 Layers**, Thickness **1.6mm**, **2 oz Heavy Copper Outer Layers**, **ENIG Surface Finish**, **Matte Black Solder Mask**.

---

### 🌐 DHF Document Archive
This component purchasing checklist (`PHX-HW-BOM-001`) is saved to [COMPONENT_PURCHASING_CHECKLIST.md](file:///c:/Users/karth/Downloads/project%20files/dashboard/COMPONENT_PURCHASING_CHECKLIST.md) and tracked in Git!
