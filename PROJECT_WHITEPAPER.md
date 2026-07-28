# 📜 PROJECT PHOENIX: TECHNICAL WHITEPAPER
**Document ID**: `PHX-WP-2026-01`  
**Revision**: `v1.0.0`  
**Title**: Autonomous Transhumeral Myoelectric Prosthesis for Skin-Grafted Amputees  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  

---

## Abstract
Over 90% of upper-limb amputees with skin-grafted residual limbs abandon traditional myoelectric prosthetics within six months due to socket shear forces, friction tearing, sweat accumulation, and phantom limb pain. **Project Phoenix** presents an autonomous $1.18\,\text{kg}$ transhumeral prosthesis featuring an offline **Syntiant NDP120 neural AI processor** ($22\,\text{ms}$ latency, $<4.8\,\text{mW}$ power), microfluidic sweat cortisol biofeedback grip capping, an $8$-point FSR $20.0\,\text{kPa}$ pressure lock array, and bi-phasic TENS phantom pain suppression.

---

## 1. Subsystem Architecture
1. **Offline Edge AI (Claim 1)**: Syntiant NDP120 neural decision processor executes 4-layer CNN model directly inside the palm chassis, eliminating cloud dependency and GDPR risk.
2. **Vision-EMG Intent Fusion (Claim 2)**: OV2640 camera captures target geometries 300ms prior to contact, pre-shaping hand fingers before sEMG muscles complete contraction.
3. **Sweat Cortisol Biofeedback (Claim 3)**: Microfluidic graphene sensors detect sweat cortisol ($>0.60\,\mu\text{g/dL}$) during anxiety, capping grip torque to 80% to prevent object crushing.
4. **Self-Healing Socket Liner (Claim 4)**: Nickel-particle microcapsules autonomously repair silicone liner tears within 10 minutes at room temperature.
5. **CAN-FD Distributed Topology**: 2-wire differential bus connects Palm Master PCB and Elbow Satellite PCB, reducing wiring harness weight by $85\,\text{g}$.
