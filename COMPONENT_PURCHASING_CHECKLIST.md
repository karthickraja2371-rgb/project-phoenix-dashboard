# 🛒 PROJECT PHOENIX: MASTER COMPONENT PURCHASING & BOM MATRIX
**Document ID**: `PHX-HW-BOM-001`  
**Revision**: `v1.2.0-Blueprint.am-Synchronized`  
**Blueprint.am Reference Link**: [https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE](https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE)  
**Blueprint Category Count**: `92 Total Parts`  
**Total Estimated Assembly BOM**: **~$6,468.60 USD** (~**₹5,36,890 INR**)  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  
**Date**: 30 July 2026  

---

## 1. Executive Budget Breakdown (Blueprint.am Synchronized)

| Subsystem Category (92 Total Parts) | Qty / Scope | Cost per Unit (USD $) | Cost per Unit (INR ₹) | Blueprint.am Sourcing Channels |
| :--- | :---: | :---: | :---: | :--- |
| **1. Main Prosthetic MCU (STM32H753)** | 1 Unit | $25.00 | ₹2,075 | AliExpress, Amazon, eBay, Mouser |
| **2. AI Inference Chip (Syntiant NDP120)** | 1 Unit | $40.00 | ₹3,320 | Syntiant Direct, AliExpress, eBay |
| **3. Clinical sEMG Electrodes (Otto Bock MyoBock 13E200)** | 4 Units | $1,000.00 | ₹83,000 | Otto Bock Healthcare, Amazon, eBay |
| **4. Palm Object Camera (OmniVision OV2640)** | 1 Unit | $8.00 | ₹664 | AliExpress, Amazon, eBay |
| **5. Socket MEMS Microphone (Custom Knowles MEMS)** | 1 Unit | $3.00 | ₹249 | AliExpress, Amazon |
| **6. Maxon Actuators & 50:1 Worm Gear Transmission** | 2 Units | $1,850.00 | ₹1,53,550 | Maxon Motor India, Maxon Direct |
| **7. Titanium SLS 3D Printed Chassis & Monocoque Shell** | 1 Set | $1,500.00 | ₹1,24,500 | Formlabs, Materialise |
| **8. Dragon Skin 20 Silicone Socket & TENS Electrodes** | 1 Set | $650.00 | ₹53,950 | Smooth-On, Otto Bock |
| **9. 6S Li-Ion Power Management & Active BMS** | 1 Unit | $392.60 | ₹32,586 | TI, Robu.in, DigiKey |
| **10. Dyneema Tendons, FSR Sensor Array & Hardware Fasteners** | 80 Parts | $1,000.00 | ₹83,000 | McMaster-Carr, Syntiant |
| **TOTAL BLUEPRINT.AM ESTIMATED BOM** | **92 Parts** | **~$6,468.60** | **~₹5,36,890** | **Blueprint.am Verified Assembly** |

---

## 2. Blueprint.am Core Component Specification Matrix

### 2.1 Microcontrollers, AI Inference & Clinical Sensors

| Part Item | Blueprint Description | Category | Qty | Unit Price (USD) | Subtotal (USD) | Vendor Sources |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **STM32H753** | Main Prosthetic MCU (480MHz ARM Cortex-M7) | `MCU` | 1 | ~$25.00 | ~$25.00 | AliExpress, Amazon, eBay |
| **Syntiant NDP120** | AI Inference Chip (Palm) — Ultra-low power neural decision processor | `MCU` | 1 | ~$40.00 | ~$40.00 | Syntiant Direct, AliExpress, eBay |
| **Otto Bock MyoBock 13E200** | EMG Electrode (Biceps), EMG Electrode (Triceps) + 2 more | `SENSOR` | 4 | ~$250.00 | ~$1,000.00 | Otto Bock, Amazon, eBay |
| **OmniVision OV2640** | Palm Object Camera — Compact 2MP camera module with DVP interface | `SENSOR` | 1 | ~$8.00 | ~$8.00 | AliExpress, Amazon, eBay |
| **Custom MEMS Microphone** | Socket MEMS Microphone — Primary microphone for voice input (Claim 7) | `SENSOR` | 1 | ~$3.00 | ~$3.00 | AliExpress, Amazon |

---

### 2.2 Actuators, Mechanical Chassis & Power Subsystems (Complete 92-Part Assembly)

| Subsystem Component | Blueprint.am Specification | Qty | Total Price (USD) | Sourcing & Vendor |
| :--- | :--- | :---: | :---: | :--- |
| **Maxon ECX Speed 16 M** | 40W High-Speed Brushless Motor (Elbow Actuation) | 1 | $1,250.00 | Maxon Motor India |
| **Maxon DCX 6 S Array** | Micro Finger Motors (Tendon Flexion Drives) | 5 | $600.00 | Maxon Direct |
| **Ti-6Al-4V Monocoque** | Titanium SLS 3D Printed Structural Framework | 1 Set | $1,500.00 | Industrial SLS Service |
| **Dragon Skin 20 Liner** | Platinum-cured Silicone Socket Liner with Nickel Microcapsules | 1 Set | $650.00 | Smooth-On / Medical |
| **FSR 8-Point Sensor Array**| Socket Pressure Sensors (20.0 kPa Hardware Lock Interrupt) | 8 | $350.00 | Interlink Electronics |
| **6S 22.2V Li-Ion Battery** | 5000mAh Active BMS High-Discharge Power Pack | 1 Pack | $392.60 | Custom Cell Pack |
| **Dyneema Tendons & Hardware**| 0.8mm Braided Tendon Lines, Fasteners, Bearings (80 Parts) | 80 | $650.00 | McMaster-Carr |

---

## 3. Commercial Economics & Reimbursement Strategy

* **Turn-Key Assembly BOM Cost (Blueprint.am)**: **~$6,468.60 USD** (~**₹5,36,890 INR**)
* **Commercial Retail Target (India / ALIMCO Reimbursement)**: **₹2,00,000 – ₹2,50,000 INR** (Subsidized via BIRAC / ADIP Scheme).
* **Tier 1 Export Retail Price (USA / EU MDR)**: **$15,000 – $18,000 USD** (Replacing $50k–$80k commercial prostheses like Bebionic / Michelangelo).

---

### 🌐 Blueprint.am Project Link
Interactive design, wiring diagrams, and parts list:  
🔗 **[https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE](https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE)**
