# 📜 CHANGELOG: PROJECT PHOENIX

All notable changes to **Project Phoenix** will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.2] - 2026-07-29

### Added
- **Claim 7 Offline Voice Command Engine** (`src/utils/voiceCommandEngine.js`): Recognized keywords (`OPEN`, `GRIP`, `LOCK`, `PINCH`) with confidence score logging.
- **Natural Voice Telemetry Speech Alerts** (`src/utils/audioTelemetryEngine.js`): Audio alerts for pressure alarms ($>20.0\,\text{kPa}$), sweat cortisol caps, and rest cycles.
- **Interactive 3D Video & Storyboard Player**: Full-width video view mode (`🎬 3D VIDEO ANIMATION`) with reactive SimDashboard Telemetry HUD.
- **Professional GitHub Assets**: Header banner, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE`, and GitHub Issue Templates.

---

## [v1.0.1] - 2026-07-28

### Added
- **Firmware C Source Code**: `firmware/src/main.c`, `safety_system.c`, `rest_protocol.c`, `emg_dsp.c`, `motor_control.c`, and `sensor_fusion.c`.
- **KiCAD 8.0 Hardware Schematics & Netlists**: `hardware/PCB-PHX-PALM-001.kicad_sch`, `PCB-PHX-ELBOW-002.kicad_sch`, `.net` files, and `export_gerbers.py`.
- **Master Engineering Documentation**: `MECHANICAL_ASSEMBLY_GUIDE.md`, `PROJECT_WHITEPAPER.md`, `GRANT_PITCH_DECK.md`, `EU_AI_ACT_COMPLIANCE.md`, `COMPONENT_PURCHASING_CHECKLIST.md`, and `PITCH_DECK_SLIDES.md`.

---

## [v1.0.0-TRL3.4] - 2026-07-27

### Added
- **Digital Twin Web App**: 16 Bionic Gesture selector grid, WebGL 3D arm viewer (`Arm3DViewer.jsx`), 4-channel sEMG waveform graphs, and 2000Hz live telemetry log stream.
- **Provisional Patent Filing**: Indian Provisional Patent Application No. **202641077314** (Filed **23 June 2026**).
- **ISO 13485 DHF Controls**: IEC 62304 SRS-001 Firmware Specification & Test Protocol TP-002.
