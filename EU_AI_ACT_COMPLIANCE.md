# 🇪🇺 PROJECT PHOENIX: EU AI ACT & ISO 14971 COMPLIANCE AUDIT
**Document ID**: `PHX-REG-EU-001`  
**Compliance Target**: EU Artificial Intelligence Act (Regulation 2024/1689) & Medical Device Regulation (MDR 2017/745)  
**Risk Classification**: Class B / Class C High-Risk AI Medical Device  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  

---

## 1. Zero Cloud Biometric Privacy Architecture (Article 10)
* **On-Chip Inference**: The Syntiant NDP120 neural processor performs 100% offline inference directly inside the palm chassis.
* **0 Bytes Cloud Risk**: No sEMG muscle signals, camera video feeds, or voice audio streams are stored or transmitted over the internet, fully complying with EU GDPR and AI Act privacy mandates.

## 2. Human Oversite & Safety Interlocks (Article 14)
* **20.0 kPa Hardware Lock**: If socket pressure on skin-grafted tissue exceeds 20.0 kPa, an analog hardware comparator disengages motor power immediately.
* **Manual Emergency Override**: Mechanical quick-release latch allows instantaneous un-donning of the socket by the user.

## 3. Nightly Retraining & Model Validation (Article 15)
* **Golden Weights Rollback Protocol**: During nightly wireless charging, accumulated gesture variations update local neural weights. If validation accuracy drops below 90%, the firmware automatically rolls back to factory Golden Weights.
