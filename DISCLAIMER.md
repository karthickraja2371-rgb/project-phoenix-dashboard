# ⚠️ MEDICAL DEVICE RESEARCH & REGULATORY DISCLAIMER

**Document ID**: `PHX-REG-DISC-001`  
**Revision**: `v1.1.0-R&D-Refined`  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja  
**Date**: 30 July 2026  

---

> [!CAUTION]
> **RESEARCH & DEVELOPMENT DISCLAIMER — NOT A CERTIFIED MEDICAL DEVICE**  
> **PROJECT PHOENIX** is currently an **engineering research and development project** operating at Technology Readiness Level 3–4 (TRL 3-4). The software, WebGL 3D Digital Twin, embedded firmware C code, and KiCAD PCB schematics in this repository are provided for **research, educational, and simulation evaluation purposes only**.  
>  
> **Project Phoenix has NOT yet undergone regulatory approval** (e.g. CDSCO India, US FDA 510(k)/PMA, or EU MDR 2017/745), accredited laboratory safety testing (IEC 60601-1), or IRB-approved human clinical trial validation ($n=10$ amputee fitting trials).  
>  
> **DO NOT USE THIS SYSTEM, FIRMWARE, OR HARDWARE DESIGNS AS A CLINICAL MEDICAL DEVICE ON HUMAN PATIENTS** until all physical prototyping, accredited laboratory testing, and regulatory approvals are fully completed.

---

## 1. Scope of Current Validation

### 1.1 WebGL & HIL Digital Twin Simulation Baseline (Active Status)
All safety interlock thresholds (e.g. $20.0\,\text{kPa}$ socket pressure lock, $<5\,\text{ms}$ motor PWM cut-off, $40^\circ\text{C}$ thermal throttling, and sweat cortisol biofeedback torque capping) have been **demonstrated and evaluated in simulation** exclusively within the **HIL WebGL Digital Twin Simulation Environment** (`src/App.jsx`).

### 1.2 Physical Hardware & Clinical Fitting Trials (Planned Status)
Physical PCB fabrication (5-unit batch), bench electrical isolation testing (IEC 60601-1 2x MOPP), and IRB human clinical fitting trials represent **Planned Phase 3–5 Prototyping Tasks**.

---

## 2. Intellectual Property & Licensing Scope

The **MIT License** provided in `LICENSE` applies **strictly to the software source code** (React/Vite dashboard, WebGL scripts, and firmware C code files). 

The **Indian Provisional Patent Application No. 202641077314**, patent claims 1 to 13, 3D CAD models (STEP, STL, GLB), KiCAD 8.0 PCB schematics/netlists, and medical whitepapers **remain fully protected and are NOT covered by the MIT License**. They remain the exclusive intellectual property of **R. Karthick Raja** unless separately licensed. See **[PATENT_NOTICE.md](PATENT_NOTICE.md)** for details.

---

## 3. Limitation of Liability

Under no circumstances shall the inventor (**R. Karthick Raja**), contributors, or associated research partners be liable for any direct, indirect, incidental, special, exemplary, or consequential damages arising in any way out of the use, modification, testing, or application of the software, firmware, CAD models, or hardware schematics contained in this repository.

---

## 4. Regulatory Path Forward

Project Phoenix adheres to a strict regulatory roadmap prior to commercial or clinical deployment:

```
Phase 1: Provisional Patent Filing (App No. 202641077314 - June 2026) ✅
   ↓
Phase 2: Digital Twin HIL Simulation Baseline (July 2026) ✅
   ↓
Phase 3: Physical 5-Unit Hardware PCB Fabrication & Bench Assembly (Q4 2026) 🟡
   ↓
Phase 4: Accredited Lab Testing (IEC 60601-1 laboratory testing and ISO 14971 risk management activities) 🟡
   ↓
Phase 5: CDSCO / IRB Approved Human Clinical Fitting Pilot Trials (n=10 Amputees) 🔵
```

---

© 2026 R. Karthick Raja. All Rights Reserved except where explicitly licensed under the software MIT License.
