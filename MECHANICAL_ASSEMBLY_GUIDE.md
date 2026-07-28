# ⚙️ PROJECT PHOENIX: MECHANICAL ASSEMBLY & 3D PRINTING GUIDE
**Document ID**: `PHX-MECH-ASM-001`  
**Revision**: `v1.0.0`  
**Target Device**: Project Phoenix Transhumeral Myoelectric Prosthesis  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  

---

## 1. Subsystem Explosions & Materials

### 1.1 Structural Chassis
* **Forearm Shell**: 3D Printed Titanium Alloy (Ti-6Al-4V) Selective Laser Sintering (SLS), $1.8\,\text{mm}$ wall thickness.
* **Palm Chassis**: SLS Titanium Alloy housing mounting the Syntiant NDP120 AI chip and OV2640 camera lens.
* **Inner Socket Liner**: Platinum-cured medical silicone (Dragon Skin 20) with embedded microfluidic sweat channels and self-healing nickel-microcapsule polymer layer (Claim 4).

### 1.2 Tendon Drive & Actuation System
* **Tendons**: $0.8\,\text{mm}$ Dyneema braided line ($120\,\text{kg}$ tensile breaking strength).
* **Elbow Motor**: Maxon ECX Speed 16 M ($40\,\text{W}$, $22.2\,\text{V}$) connected to a 50:1 non-backdrivable GP 16 C worm gear ($0\,\text{W}$ passive holding power).
* **Hand Motors**: 6x Maxon DCX 6S micro DC motors with magnetic encoders for finger flexion/extension.

---

## 2. Step-by-Step Mechanical Assembly Procedure

1. **Step 1: Socket Inner Mold Casting**:
   * Cast Dragon Skin 20 silicone into patient 3D scan mold. Embed 8x FSR pressure sensor pads and 3-position TENS pads (Claim 12).
2. **Step 2: Elbow Drive Unit Mounting**:
   * Fasten Maxon ECX Speed 16 M motor to the elbow titanium housing using M2.5 grade 12.9 hex screws. Mount `PCB-PHX-ELBOW-002` circular ring PCB to the rear flange.
3. **Step 3: Tendon Routing**:
   * Thread Dyneema $0.8\,\text{mm}$ tendons through PTFE low-friction guide sleeves from the palm spool pulley to each finger joint.
4. **Step 4: Palm Electronics Installation**:
   * Secure `PCB-PHX-PALM-001` inside the palm chassis. Align OV2640 camera lens with palm aperture.
