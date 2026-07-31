# 🛡️ PROJECT PHOENIX: HAZARD ANALYSIS & RISK MANAGEMENT

**Document ID**: `PHX-ENG-SAFE-001`  
**Standard Compliance Baseline**: ISO 14971:2019 & IEC 60601-1:2020  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja  
**Date**: 31 July 2026  

---

## 1. Executive Safety Summary

Amputees with **skin-grafted residual limbs** present unique physiological vulnerabilities including reduced skin thickness, absent subcutaneous fat cushioning, altered sensory innervation, and increased risk of friction-induced skin breakdown.

Project Phoenix addresses these risks through an **integrated triple-barrier safety architecture**:

1. **Hardware Comparator Cutoff (Claim 8)**: Hardware interrupt cutting motor PWM within $<5\,\text{ms}$ if socket skin pressure exceeds **$20.0\,\text{kPa}$**.
2. **Sweat Cortisol Torque Capping (Claim 3)**: Automatic $80\%$ grip torque cap when microfluidic biosensors detect sweat cortisol $>0.60\,\mu\text{g/dL}$.
3. **Mandatory Rest Lock (Claim 11)**: Enforced $15\text{-minute}$ passive lock after $3\text{ hours}$ of continuous operation to prevent muscle bed fatigue.

---

## 2. ISO 14971 Risk Assessment Matrix

| Hazard ID | Failure Mode / Hazard | Severity | Probability | Risk Mitigation Strategy | Residual Risk |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **HAZ-001** | Socket skin graft pressure necrosis | **High** | Medium | 8-point FSR array with automatic **20.0 kPa passive lock interrupt** ($<5\text{ms}$ response). | **Low** |
| **HAZ-002** | User anxiety causing unintended crush force | **Medium**| Medium | Graphene sweat cortisol biosensor capping grip torque to $80\%$ when cortisol $>0.60\,\mu\text{g/dL}$. | **Low** |
| **HAZ-003** | Muscle bed overheating / inflammation | **Medium**| Low | Dual SHT31 microclimate sensors triggering alerts if socket temp $>38.0^\circ\text{C}$. | **Low** |
| **HAZ-004** | Contact dermatitis from TENS electrodes | **Low** | High | Analog multiplexer rotating TENS stimulation across 3 pad sites every 8 hours. | **Low** |
| **HAZ-005** | sEMG channel disconnection / noise spike | **Medium**| Medium | TI ADS1299 AFE auto-recalibrating to 3-channel degraded fallback mode upon channel drop. | **Low** |
| **HAZ-006** | Battery thermal runaway | **Critical**| Low | BMS dual NTC thermistors cutting pack power if battery temperature exceeds $60^\circ\text{C}$. | **Low** |

---

## 3. Electrical Isolation & IEC 60601-1 Baseline

* **Isolation Means**: $2\times\text{MOPP}$ (Means of Patient Protection) rated at $1500\,\text{V}_{\text{RMS}}$ dielectric isolation between motor drive power rails and sEMG skin-contact electrodes.
* **Leakage Current Ceiling**: Auxiliary patient leakage current $<14.5\,\mu\text{A}$ under normal operating conditions.
* **Ingress Protection**: IP54-rated sealed monocoque chassis preventing sweat and particulate ingress.

---

© 2026 R. Karthick Raja. All Rights Reserved except where licensed under the software MIT License.
