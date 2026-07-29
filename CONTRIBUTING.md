# 🤝 CONTRIBUTING TO PROJECT PHOENIX

Thank you for your interest in contributing to **Project Phoenix**! We welcome contributions from embedded systems engineers, PCB designers, mechanical engineers, WebGL developers, prosthetists, and MedTech researchers worldwide.

---

## 🌟 How You Can Contribute

### 1. Embedded Firmware C (STM32H753 / Syntiant NDP120)
* Optimize 2000Hz sEMG DSP bandpass and notch filtering algorithms in `firmware/src/emg_dsp.c`.
* Implement CAN-FD 5Mbps message arbitration between Palm Master and Elbow Slave PCBs.
* Refine Syntiant NDP120 neural network gesture weights and Golden Weights rollback logic.

### 2. Hardware & PCB Design (KiCAD 8.0)
* Review and optimize routing for `hardware/PCB-PHX-PALM-001.kicad_sch` and `PCB-PHX-ELBOW-002.kicad_sch`.
* Perform signal integrity simulations for CAN-FD differential pairs and SPI lines.

### 3. Mechanical CAD & 3D Printing (SolidWorks / Fusion 360)
* Refine Dyneema tendon routing channels to minimize internal friction coefficient below $\mu = 0.05$.
* Model custom mounting flanges for Maxon ECX Speed 16 M and DCX 6 S motor spools.

### 4. WebGL Digital Twin & React Dashboard (`dashboard/`)
* Enhance Three.js shader lighting and material textures for carbon fiber and translucent silicone.
* Add new visual telemetry graphs or gesture control interfaces.

---

## 🛠 Getting Started

1. **Fork the Repository**: Click the **Fork** button at the top right of [github.com/karthickraja2371-rgb/project-phoenix-dashboard](https://github.com/karthickraja2371-rgb/project-phoenix-dashboard).
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/project-phoenix-dashboard.git
   cd project-phoenix-dashboard/dashboard
   npm install
   npm run dev
   ```
3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Commit & Push Your Changes**:
   ```bash
   git commit -m "Add feature description"
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**: Submit a Pull Request detailing your changes and test verification results!

---

## 📜 Code of Conduct & Intellectual Property
* All contributions are licensed under the MIT License.
* Please maintain respect, constructive feedback, and scientific integrity across all discussions and pull requests.
