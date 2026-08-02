<div align="center">

# 🚀 PROJECT PHOENIX
### Autonomous Offline AI Prosthetic System for Skin-Grafted Transhumeral Amputees

![Status](https://img.shields.io/badge/Status-Active_Development-blue)
![Build](https://github.com/karthickraja2371-rgb/project-phoenix-dashboard/actions/workflows/test.yml/badge.svg)
![Patent](https://img.shields.io/badge/Patent-Provisional_202641077314-orange)
![Platform](https://img.shields.io/badge/Digital_Twin-Live-success)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black)
![License](https://img.shields.io/badge/License-MIT-green)

**Designed and Developed by**
## R. Karthick Raja

*"Engineering independence through intelligent prosthetics."*

🌐 **Live Digital Twin:** [project-phoenix-isslsot1z-project-phoenix2.vercel.app](https://project-phoenix-isslsot1z-project-phoenix2.vercel.app/)  
🐙 **GitHub Repository:** [github.com/karthickraja2371-rgb/project-phoenix-dashboard](https://github.com/karthickraja2371-rgb/project-phoenix-dashboard)

</div>

---

# 🎬 3D DIGITAL TWIN ANIMATION SHOWCASE

```carousel
![Loop 1: Triple Barrier Safety Lock (20.0 kPa Pressure Failsafe)](/loop1_safety_lock.jpg)
<!-- slide -->
![Loop 2: Precision Tendon Actuation (Maxon DCX 6 S Motors)](/loop2_precision_actuation.jpg)
<!-- slide -->
![Loop 3: Palm-Brain Offline Logic Fusion (Syntiant NDP120 AI Edge Processor)](/loop3_logic_fusion.jpg)
```

---

# 📖 Overview

**PROJECT PHOENIX** is an assistive robotics project focused on developing an autonomous myoelectric prosthetic system specifically for **transhumeral amputees with skin-grafted residual limbs**.

The project combines embedded systems, offline neural AI, mechanical design, and digital twin simulation to explore prosthetic technologies designed for users whose skin characteristics make conventional rigid sockets difficult to use.

---

# 🎯 The Problem

Traditional myoelectric prostheses are primarily designed for intact residual limbs with thick skin coverage.

Skin-grafted amputees face critical challenges with traditional devices:
- **High Socket Shear & Friction**: Skin-grafted tissue lacks subcutaneous fat layers, leading to painful skin tearing and friction contact ulcers.
- **Sweat-Related Signal Instability**: Tropical heat and sweat pooling inside silicone liners cause sEMG electrode drift and contact dermatitis.
- **Phantom Limb Pain**: Persistent phantom pain causes discomfort and high device abandonment (>90% within 6 months).

PROJECT PHOENIX explores novel engineering approaches specifically designed to address these challenges.

---

# 💡 Proposed Solution & Key Features

PROJECT PHOENIX investigates an integrated prosthetic platform featuring:

- **Offline Edge AI (Claim 1)**: Syntiant NDP120 neural decision processor targeting on-palm gesture classification at <5mW continuous power and <30ms latency, with zero cloud biometric privacy risk.
- **Vision-EMG Intent Fusion (Claim 2)**: OV2640 palm camera pre-shapes finger postures ahead of contact — design target is reducing intent-to-grip latency from ~300ms to under 80ms.
- **Sweat Cortisol Biofeedback (Claim 3)**: Microfluidic biosensor detects sweat cortisol (>0.60 µg/dL) during anxiety, targeting an automatic 20% reduction in grip torque ceiling.
- **Socket Pressure Lock Failsafe (Claim 8)**: FSR sensor array triggers an automatic 20.0 kPa passive lock interrupt to protect skin graft tissue from shear damage.
- **Bi-Phasic TENS Pain Relief (Claim 6)**: 100Hz sensory feedback aimed at phantom limb pain suppression — efficacy is a design target, not yet a measured clinical result.
- **Offline Voice Command Fallback (Claim 7)**: MEMS microphone keyword recognition (OPEN, GRIP, LOCK, PINCH).

---

# ✨ Current Project Status

| Component | Status | Location / Artifact |
| :--- | :---: | :--- |
| **Patent Filing** | ✅ Completed | Indian Provisional Patent App No. **202641077314** (Filed 23 June 2026) |
| **Digital Twin Dashboard** | ✅ Available | [Live App](https://project-phoenix-isslsot1z-project-phoenix2.vercel.app/) |
| **3D Animation Storyboard** | ✅ Completed | `TECHNICAL_STORYBOARD.md` |
| **Firmware C Code** | ✅ Written, not hardware-tested | `firmware/src/main.c`, `safety_system.c`, `emg_dsp.c` |
| **Hardware Schematics** | ✅ Drafted, not fabricated | `hardware/PCB-PHX-PALM-001.kicad_sch` & `PCB-PHX-ELBOW-002.kicad_sch` |
| **Purchasing Checklist** | ✅ Completed | `COMPONENT_PURCHASING_CHECKLIST.md` |
| **Physical Prototype** | 🟡 Planned | Phase 3 (5-Unit Hardware Batch Build) |
| **Clinical Validation** | 🔵 Future | Phase 5 IRB Pilot Fitting Trials (n=10 amputees) |

---

# 🖥️ Live Demo & 3D Video Player

Explore the live Digital Twin and interactive 3D video player:  
🌍 **[https://project-phoenix-isslsot1z-project-phoenix2.vercel.app/](https://project-phoenix-isslsot1z-project-phoenix2.vercel.app/)**

---

# 🛠 Technology Stack

### Software & Digital Twin
- **Framework**: React 18 + Vite
- **3D Graphics Engine**: Three.js / WebGL (`Arm3DViewer.jsx`)
- **Styling**: Vanilla CSS (High-contrast Dark Mode `#030812`)
- **Speech Engine**: Web Speech API (`voiceCommandEngine.js` & `audioTelemetryEngine.js`)

### Embedded Systems & Firmware
- **Main Microcontroller**: STM32H753 (480MHz ARM Cortex-M7)
- **Neural Processor**: Syntiant NDP120 Neural Decision Processor
- **sEMG Signal Path**: Otto Bock 13E200 electrodes (onboard amplification/filtering) → STM32H753 ADC, 2000Hz active / 200Hz idle sampling. *(A dedicated external AFE chip is under consideration but not yet decided — see note in MECHANICAL_ASSEMBLY_GUIDE.md / open items.)*
- **Motor Gate Driver**: TI DRV8323RS 3-Phase Smart Driver
- **Bus Topology**: SPI / I2C (STM32H753 peripheral buses) — CAN-FD is a possible future revision, not the current verified design

### CAD & Mechanical Design
- **Structure**: Carbon fiber composite upper arm frame + forearm shell, PETG 3D-printed joint housings and hand frame (92 components, 326 solid bodies — CAD-verified)
- **Socket Liner**: Platinum-cured medical silicone with nickel-particle self-healing polymer liner
- **Transmission**: Dyneema SK78 0.8mm braided tendon lines
- **Motors**: Maxon EC 16 (elbow, 40W) + Maxon EC 13 (wrist, 10W) + Maxon DCX 6 S (fingers), AS5048A 14-bit magnetic encoder

---

# 📂 Repository Structure

```
project-phoenix-dashboard/
├── dashboard/                              # React + Three.js WebGL Digital Twin App
├── firmware/                               # STM32H753 C Firmware Source Code
│   ├── CMakeLists.txt
│   └── src/
│       ├── main.c                          # 2000Hz Task Scheduler
│       ├── safety_system.c                 # 20.0 kPa FSR Pressure Lock
│       ├── rest_protocol.c                 # 3h Active / 15m Rest Lock
│       └── emg_dsp.c                       # Otto Bock 13E200 signal conditioning + DSP filter
├── hardware/                               # KiCAD 8.0 Schematics & Netlists
│   ├── PCB-PHX-PALM-001.kicad_sch
│   ├── PCB-PHX-ELBOW-002.kicad_sch
│   ├── PCB-PHX-PALM-001.net
│   ├── PCB-PHX-ELBOW-002.net
│   └── export_gerbers.py
├── MECHANICAL_ASSEMBLY_GUIDE.md           # 3D Assembly & Material Specs
├── PROJECT_WHITEPAPER.md                   # Technical Whitepaper
├── GRANT_PITCH_DECK.md                     # BIRAC BIG Grant Pitch Outline
├── EU_AI_ACT_COMPLIANCE.md                 # EU AI Act & ISO 14971 Design-Stage Assessment
├── COMPONENT_PURCHASING_CHECKLIST.md       # BOM Sourcing Matrix & Vendor Links
├── TECHNICAL_STORYBOARD.md                 # 3D Animation GIF Specifications
├── PITCH_DECK_SLIDES.md                    # 10-Slide Investor & Incubator Presentation
├── INCUBATOR_EXECUTIVE_SUMMARY.md          # 1-Page Bioincubator Summary
├── README.md                               # Project Documentation Home
└── CONTRIBUTING.md                         # Open-Source Contribution Guide
```

---

# 🧠 System Architecture

```
┌─────────────────────────────────┐
│ Syntiant NDP120 Neural AI       │
│ (Gesture Classification)        │
└────────────────┬────────────────┘
                 │
                 ▼
┌───────────────────┐    ┌──────────────────────────────────────┐    ┌───────────────────┐
│ sEMG Sensors      ├───►│ Otto Bock 13E200 onboard filtering   ├───►│ STM32H753 Main MCU│
│ (4-Ch Skin Graft) │    │ (2000Hz active / 200Hz idle)         │    │ (480MHz Cortex-M7)│
└───────────────────┘    └──────────────────────────────────────┘    └─────────┬─────────┘
                                                                               │
┌───────────────────┐    ┌──────────────────────────────────────┐              │
│ OV2640 Palm Cam   ├───►│ Vision Bounding Box Pre-shaping      ├──────────────┤
│ (Target Optics)   │    └──────────────────────────────────────┘              │
└───────────────────┘                                                          │
                                                                               ▼
┌───────────────────┐    ┌──────────────────────────────────────┐    ┌───────────────────┐
│ FSR Sensor Array  ├───►│ 20.0 kPa Hardware Failsafe Lock       ├───►│ Maxon Motors      │
│ (Socket Skin)     │    └──────────────────────────────────────┘    │ (Elbow/Wrist/Hand)│
└───────────────────┘                                                └───────────────────┘
```

---

# 📅 Development Roadmap

```
Phase 1: Provisional Patent Filing (App No. 202641077314 - Completed June 2026) ✅
  ↓
Phase 2: Digital Twin & Computational Simulation Platform (Completed July 2026) ✅
  ↓
Phase 3: Physical PCB Fabrication & Hardware Assembly (5-Unit Batch - Q4 2026) 🟡
  ↓
Phase 4: Bench HIL Verification & Safety Stress Testing (Q1 2027) 🟡
  ↓
Phase 5: IRB Clinical Pilot Fitting Trials (n=10 Amputees - Q2 2027) 🔵
```

*Note: "HIL" (Hardware-in-the-Loop) testing correctly refers only to Phase 4 onward, once physical hardware exists. Phase 2's digital twin is software/computational simulation only.*

---

# 🤝 Contributing

We welcome contributions from engineers, researchers, and developers in:
- **Embedded C / RTOS Development** (STM32H753, Syntiant NDP120 SDK)
- **Hardware & PCB Layout** (KiCAD 8.0)
- **Mechanical CAD & FEA** (Carbon fiber + PETG structure, Dyneema tendon routing)
- **React & WebGL Simulation** (Three.js 3D shaders, custom UI components)
- **Clinical & Biomedical Research** (sEMG signal processing, skin graft biomechanics)

Please read `CONTRIBUTING.md` for setup instructions.

---

# 📜 Intellectual Property

**Indian Provisional Patent Application**
- **Application Number**: 202641077314
- **Filing Date**: 23 June 2026
- **Applicant & Inventor**: R. Karthick Raja
- **Covered Claims**: 13 novel claims spanning offline edge AI, microfluidic sweat cortisol capping, 20.0 kPa socket pressure locks, self-healing silicone liners, and TENS-based sensory feedback.

---

# ⭐ Support the Project

If you find PROJECT PHOENIX inspiring or valuable:
* ⭐ **Star this repository** on GitHub!
* 🍴 **Fork the repository** to contribute code or CAD models.
* 📢 **Share the live showcase link**: [project-phoenix-isslsot1z-project-phoenix2.vercel.app](https://project-phoenix-isslsot1z-project-phoenix2.vercel.app/)

---

# 📬 Contact

**R. Karthick Raja**  
*B.E. Electrical & Electronics Engineering*  
Sholavandan, Madurai, Tamil Nadu, India - 625214  

* 🐙 **GitHub**: [github.com/karthickraja2371-rgb/project-phoenix-dashboard](https://github.com/karthickraja2371-rgb/project-phoenix-dashboard)  
* 🌐 **Live Demo**: [project-phoenix-isslsot1z-project-phoenix2.vercel.app](https://project-phoenix-isslsot1z-project-phoenix2.vercel.app/)  

<div align="center">

### ⭐ If you support PROJECT PHOENIX, please consider giving it a Star!

*"Technology should restore independence, not create new barriers."*

</div>
