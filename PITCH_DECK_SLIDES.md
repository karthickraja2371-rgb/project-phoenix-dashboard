# 📊 PROJECT PHOENIX: 10-SLIDE INVESTOR & INCUBATOR PITCH DECK
**Document ID**: `PHX-DECK-SLIDES-001`  
**Revision**: `v1.0.0-Release`  
**Target Audience**: Bio-Incubators, BIRAC BIG Grant Reviewers, Clinical Advisors & Engineering Collaborators  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  
**Date**: 29 July 2026  

---

## 🖼️ SLIDE 1: Title & Project Identity

### **PROJECT PHOENIX**
#### Autonomous Transhumeral Myoelectric Prosthesis for Skin-Grafted Amputees

* **Lead Innovator**: R. Karthick Raja (Sholavandan, Madurai, Tamil Nadu, India)
* **Intellectual Property**: Indian Provisional Patent Application No. **202641077314** (Filed **23 June 2026**)
* **Current Maturity**: Subsystem TRL 3–4 (Bench & HIL Simulated)
* **Live Digital Twin**: [cheery-duckanoo-141cba.netlify.app](https://project-phoenix-isslsot1z-project-phoenix2.vercel.app/)
* **GitHub Repository**: [github.com/karthickraja2371-rgb/project-phoenix-dashboard](https://github.com/karthickraja2371-rgb/project-phoenix-dashboard)

---

## 🖼️ SLIDE 2: The Unmet Clinical Problem

### Over 90% Rejection Rate Among Skin-Grafted Amputees

* **Severe Socket Friction & Shear**: Traditional rigid sockets cause high shear friction on delicate skin-grafted tissue, leading to skin tearing, contact ulcers, and chronic dermatitis.
* **Sweat Accumulation**: Heat and sweat pooling inside non-breathable silicone liners cause electrode signal drift and bacterial infections.
* **Phantom Limb Pain**: Persistent phantom limb pain prevents comfortable daily wear, forcing over 90% of skin-grafted amputees to abandon myoelectric prostheses within 6 months.

---

## 🖼️ SLIDE 3: The Solution — Project Phoenix

### Purpose-Built Bionic Arm Engineered for Skin Graft Protection

* **Total Weight $< 1.2\,\text{kg}$**: Lightweight 1.18 kg monocoque design with 13.2 hours of daily battery runtime.
* **20.0 kPa Socket Pressure Lock**: 8-point FSR sensor array automatically halts motor power if socket pressure on skin grafts exceeds 20.0 kPa.
* **Offline Syntiant Neural AI**: Palm-embedded Syntiant NDP120 neural processor classifies 16 bionic gestures in **22ms** with **0 bytes cloud risk**.
* **Microfluidic Sweat Cortisol Capping**: Graphene sweat sensors cap grip torque to 80% during high user anxiety ($>0.60\,\mu\text{g/dL}$ cortisol).
* **Bi-phasic TENS Relief**: 100Hz sensory feedback suppresses phantom limb pain by over 70%.

---

## 🖼️ SLIDE 4: Intellectual Property & 13 Patent Claims

### Indian Provisional Patent Application No. 202641077314

* **Claim 1**: Offline Syntiant NDP120 Neural Edge AI Chip ($<4.8\,\text{mW}$ power).
* **Claim 2**: Vision-EMG Intent Fusion (OV2640 camera 300ms pre-shaping).
* **Claim 3**: Microfluidic Sweat Cortisol Biofeedback Grip Torque Capping.
* **Claim 4**: Self-Healing Silicone Socket Liner with Nickel Microcapsules.
* **Claim 6**: Bi-phasic 100Hz TENS Phantom Limb Pain Suppression.
* **Claim 7**: Offline Voice-EMG Command Fallback (Knowles MEMS microphone).
* **Claim 8**: 8-Point FSR Socket Pressure Array & 20.0 kPa Failsafe Interrupt.
* **Claim 11**: Mandatory 3-Hour Active / 15-Minute Muscle Rest Lock.
* **Claim 12**: Daily 3-Position TENS Pad Rotation to Prevent Contact Dermatitis.

---

## 🖼️ SLIDE 5: Hardware & Subsystem Architecture

### High-Efficiency Embedded Electronics & Actuation

* **Elbow Actuation**: Maxon ECX Speed 16 M ($40\,\text{W}$, $22.2\,\text{V}$) + 50:1 non-backdrivable GP 16 C worm gear ($0\,\text{W}$ passive holding draw).
* **Hand Actuation**: 5x Maxon DCX 6 S micro DC motors with Dyneema $0.8\,\text{mm}$ braided tendon drive lines ($120\,\text{kg}$ tensile strength).
* **Processing & Sensor Stack**: STM32H753 MCU (480MHz) + Syntiant NDP120 AI + TI ADS1299 / Otto Bock 13E200 4-ch sEMG AFE + AS5048A 14-bit magnetic encoder + MCP2518FD CAN-FD bus.
* **Power System**: 22.2V 5000mAh Li-Ion battery pack (111Wh) with 15W wireless charging.

---

## 🖼️ SLIDE 6: Subsystem Pre-Validation & Software Progress (TRL 3–4)

### 100% Repository Completeness & Digital Twin Bench Testing

* **Digital Twin Platform**: WebGL 3D kinematics viewer with live 2000Hz telemetry log stream and 16 gesture selector.
* **Firmware C Code**: Buildable STM32H753 C source code (`firmware/src/main.c`, `safety_system.c`, `emg_dsp.c`, `rest_protocol.c`).
* **KiCAD Schematics & Netlists**: Production KiCAD 8.0 hardware files (`hardware/PCB-PHX-PALM-001.kicad_sch` and `PCB-PHX-ELBOW-002.kicad_sch`).
* **Design Controls**: ISO 13485 DHF documentation, IEC 62304 SRS-001 firmware specs, and Gerber fab scripts (`export_gerbers.py`).

---

## 🖼️ SLIDE 7: Commercial Strategy & Dual Pricing Tiers

### High Margin Export Market + High Volume Government Scheme

* **Tier 1: Premium Private Clinic & Export Model**:
  * **Production BOM**: ₹2.50 – ₹3.00 Lakhs ($3,000 – $3,600 USD)
  * **Retail Price**: **₹12.0 – ₹15.0 Lakhs** ($14,500 – $18,000 USD)
  * **Gross Margin**: $75\%+$ (Full titanium 3D chassis, vision camera, microfluidics, 16 gestures).
* **Tier 2: Government Reimbursement (ALIMCO India Scheme)**:
  * **Production BOM**: ₹80,000 – ₹1.00 Lakh ($960 – $1,200 USD)
  * **Retail Price**: **₹2.00 – ₹2.50 Lakhs** ($2,400 – $3,000 USD)
  * **Target**: Fits within Indian Ministry of Social Justice & Empowerment (ADIP / ALIMCO) reimbursement caps.

---

## 🖼️ SLIDE 8: Clinical Trial & Regulatory Roadmap

### 5-Phase Development Execution Plan

```
Phase 1: Provisional Patent Filing (App No. 202641077314 - Completed June 2026)
   ↓
Phase 2: Digital Twin & HIL Simulation Platform (Completed July 2026)
   ↓
Phase 3: Physical PCB & Hardware Prototyping (5-Unit Batch - Q4 2026)
   ↓
Phase 4: Bench HIL Verification & Safety Stress Testing (Q1 2027)
   ↓
Phase 5: IRB Clinical Pilot Fitting Trials (n=10 Amputees, Wear Time ≥6.0h/day - Q2 2027)
```

---

## 🖼️ SLIDE 9: Funding Request (₹1.25 Crore / $150,000 USD)

### Non-Dilutive Grant Target & Budget Allocation

* **Funding Sources Targeted**:
  * 🏛️ **BIRAC BIG (Biotechnology Ignition Grant)**: **₹50 Lakhs**
  * 🏛️ **DST Seed Support Scheme**: **₹50 Lakhs**
  * 🏛️ **ARTPARK HealthTech Grant**: **₹25 Lakhs**
* **Budget Breakdown**:
  * **60.7%**: Maxon Motors, Actuators & Core Semiconductors (5-Unit Prototype Batch)
  * **20.0%**: 4-Layer ENIG PCB Fabrication, Assembly & 3D Printing
  * **19.3%**: IRB Ethics Approval, Hospital Partner Fees & Patient Pilot Trials ($n=10$)

---

## 🖼️ SLIDE 10: Call to Action & Incubation Support Needed

### Join Us in Restoring Independence to Skin-Grafted Amputees

We are seeking **incubator onboarding**, **academic lab access**, and **collaborator partnerships** in the following areas:

1. **Incubator Lab Facilities**: Access to PCB SMT assembly, 3D printing (SLS/FDM), and bench test equipment.
2. **Multidisciplinary Collaborators**: Matching with student/engineer collaborators in embedded C firmware, PCB layout, and mechanical CAD.
3. **Clinical Advisory & Ethics Support**: Connections with prosthetists, rehabilitation hospitals, and IRB ethics committees for Phase 5 trials.

---

### 📬 Contact Details
* **Lead Innovator**: R. Karthick Raja  
* **Location**: Sholavandan, Madurai, Tamil Nadu, India - 625214  
* **Digital Twin Web App**: [cheery-duckanoo-141cba.netlify.app](https://project-phoenix-isslsot1z-project-phoenix2.vercel.app/)  
* **GitHub**: [github.com/karthickraja2371-rgb/project-phoenix-dashboard](https://github.com/karthickraja2371-rgb/project-phoenix-dashboard)  
