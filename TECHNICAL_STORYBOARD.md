# 🎬 PROJECT PHOENIX: TECHNICAL PRODUCTION STORYBOARD
**Document ID**: `PHX-STORYBOARD-001`  
**Revision**: `v1.0.0-Release`  
**Target Output**: Neural-Integrated Offline AI Prosthetic GIF Series (Digital Twin 3D Animation Asset Suite)  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  
**Date**: 28 July 2026  

---

## 1. Animation Global Benchmarks & Stylistic Standards

All production assets must adhere to these clinical and mechanical specifications to ensure the "Digital Twin" matches the physical prototype's performance and material science.

* **Base 3D Model**: Utilize the 326-solid Digital Twin assembly. The animator must verify the presence of all 81 matched parts in the rig, including internal mounting for the Maxon EC 16 (elbow), EC 13 (wrist), and the Maxon DCX 6 S finger motor array.
* **Total System Mass**: Visual inertia must reflect a Total Weight $< 1.2\,\text{kg}$.
* **Texturing & Shader Requirements**:
  * **Structural Monocoque**: Matte-finish Twill Weave Carbon Fibre.
  * **Socket/Interface**: Platinum-cured Medical-grade Silicone. Shaders must utilize Subsurface Scattering (SSS) to simulate translucent skin-like properties.
  * **Mechanical Load-Bearing**: CNC Machined Aluminum (6061-T6) and 316 Stainless Steel.
* **SimDashboard Telemetry Overlay**: A transparent data HUD in the lower third of each frame. Telemetry must be reactive to the visual action, displaying real-time kPa, latency (ms), and motor RPM.
* **Visual Tone**: High-contrast, industrial-clinical. Background: Neutral Dark Grey (`#1A1A1A`).

---

## 2. Loop 1: The Triple Barrier Safety Protocol (Passive Lock)

**Scene Objective**: Demonstrate the mechanical and sensory failsafe when socket pressure on the skin-grafted residual limb exceeds the safety threshold.

| Frame Segment | Visual Action (Mechanical / Structural) | SimDashboard Telemetry (Overlay) |
| :--- | :--- | :--- |
| **0.0s – 1.0s** | Cutaway of the SSS Silicone Shoulder Socket. The 8-12 FSR sensor grid is visible, pulsing a steady green glow. | `Pressure: 12.4 kPa (NOMINAL)`<br>`Temp: 34.2°C (SHT31 Source)`<br>`Status: ACTIVE` |
| **1.0s – 2.0s** | Lateral load applied to the arm. Sensor grid clusters turn deep crimson as pressure hits 21.8 kPa. | `Pressure: 21.8 kPa (ALARM)`<br>`Threshold: 20.0 kPa`<br>`Humidity: 42% (SHT31)` |
| **2.0s – 3.0s** | Amber Wireframe Overlay highlights Structural Bridge Nodes 32, 34-38. Visualise the STM32H753 safety interrupt signal as a red lightning pulse. | `Signal: IRQ_HIGH`<br>`MCU: STM32H753`<br>`Logic: PASSIVE_LOCK` |
| **3.0s – 4.0s** | Internal Maxon EC 16/13 motors power down (LEDs out). Fingers freeze instantly via the Passive Tendon Lock mechanism. | `Mode: PASSIVE LOCK ACTIVE`<br>`Motor Power: 0.0mW`<br>`Hold: MECHANICAL` |

---

## 3. Loop 2: Neural-Integrated Actuation (High-Speed Precision)

**Scene Objective**: Illustrate the sub-80ms transition speed from open-hand to precision pinch using the Dyneema tendon drive.

1. **Frame 0–15 (0.0s – 0.5s)**: Tight orbital pan around the Forearm Module and Hand Assembly. Carbon shell becomes 60% transparent to reveal the internal drive system.
2. **Frame 16–30 (0.5s – 1.0s)**: Five Maxon DCX 6 S motors spin up to 12,000 RPM. Telemetry displays the RPM surge.
3. **Frame 31–33 (1.03s – 1.1s)**: **HIGH-SPEED TRIGGER**: Fingers snap into a precision pinch. *Note to Animator*: This move is sub-80ms. Use high-speed keyframing with significant motion blur on the fingers to ensure the speed is perceptible but not "teleporting."
4. **Frame 34–90 (1.1s – 3.0s)**: Visualise the Dyneema tendon drive lines tensioning through the forearm routing channels.
5. **Frame 91–120 (3.0s – 4.0s)**: Hold on the pinch. SimDashboard displays a millisecond counter stopping at 78ms.

### Technical Data Points:
* **Motor Model**: 5x Maxon DCX 6 S
* **Transmission**: Dyneema Tendon Drive
* **SimDashboard**: `Actuation Latency: 78ms` | `RPM: 12,200`

---

## 4. Loop 3: The ‘Palm-Brain’ Logic Fusion (Latency Reduction)

**Scene Objective**: Visualise the offline fusion of Vision and EMG data within the NDP120 chip to reduce grip latency.

| Frame Segment | Input Signals (Left Side) | On-Chip Fusion (Right Side / Palm Subsystem 8) |
| :--- | :--- | :--- |
| **0.0s – 1.5s** | **Vision**: OV2640 micro-camera identifies a cup. Display a MobileNetV3 Bounding Box at 10fps. | **NDP120 Processing**: Signals stream into the Palm Electronics Housing (Subsystem 8). |
| **1.5s – 2.5s** | **EMG**: Four channels (Biceps, Triceps, Pectoralis Minor, Deltoid) display high-frequency Oscilloscope Wave Ripples. | **Logic Fusion**: Vision and EMG signals overlap. A "Match Confirmed" icon flashes at 82% confidence threshold. |
| **2.5s – 4.0s** | **Feedback**: PGA460 gain calibration pulses to adjust for skin-graft signal drift. | **Performance Graphic**: A "73% Latency Reduction" banner appears (300ms baseline $\rightarrow$ 80ms actual). |

### Technical Data Points:
* **AI Chip**: Syntiant NDP120 (Offline Edge)
* **Power Comparison**: 5mW (NDP120) vs. 500mW (Std. GPU Inference)
* **Nomenclature**: PGA460 (Gain), OV2640 (Vision)

---

## 5. Technical Metadata & Formatting Requirements

* **Loop Specs**: 1:1 Aspect Ratio, 30fps, exactly 4.0 seconds per loop. Loops must be perfectly seamless.
* **Rigging Accuracy**: Ensure the elbow joint reflects the Maxon EC 16 high-torque gearbox (64:1) and the wrist uses the Maxon EC 13.
* **Sensor Callout Accuracy**:
  * `MAX14521E`: Display this ID when visualising the TENS neural feedback loops.
  * `SHT31`: Display when showing socket internal thermal/humidity data.
  * `STM32H753`: Main MCU ID for all safety-interrupt logic frames.
* **Output Format**: High-bitrate GIF or 10-bit H.264 (MP4) for technical documentation embedding.
