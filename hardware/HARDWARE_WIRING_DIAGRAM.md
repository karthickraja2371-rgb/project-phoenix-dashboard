# 🔌 PROJECT PHOENIX: SYSTEM HARDWARE WIRING DIAGRAM & SCHEMATIC GUIDE
**Document ID**: `PHX-HW-WIRE-001`  
**Revision**: `v1.0.0-Release`  
**Blueprint.io Reference Link**: [https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE](https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE)  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  
**Date**: 30 July 2026  

---

## 1. Subsystem Interconnect Topology

Project Phoenix utilizes a **Dual-Node CAN-FD Distributed Architecture** to minimize wiring harness bulk across the transhumeral socket:
* **Palm Master AI Board (`PCB-PHX-PALM-001`)**: Contains Syntiant NDP120 Neural Processor, PGA460 4-ch sEMG AFE, OV2640 Camera, and Knowles MEMS Mic.
* **Elbow Motor Satellite Board (`PCB-PHX-ELBOW-002`)**: Contains STM32H753 MCU (480MHz), DRV8323RS Smart Gate Driver, AS5048A 14-bit Magnetic Encoder, and Power Management Regulators.

```mermaid
graph TD
    subgraph Power Systems
        BAT[22.2V 5000mAh 6S Li-Ion] --> BUCK[TPS54360 5V/3.5A Buck]
        BUCK --> LDO[TPS7A4700 3.3V Low-Noise LDO]
        LDO --> NDP_REG[1.8V / 0.9V NDP Regulators]
    end

    subgraph Palm Master PCB (PCB-PHX-PALM-001)
        NDP[Syntiant NDP120 AI] --- SPI1[SPI Bus 1]
        PGA[TI PGA460 sEMG AFE] --- ADC[4-Ch sEMG Electrodes]
        CAM[OV2640 Vision Camera] --- DVP[Parallel DVP Bus]
        MIC[Knowles MEMS Mic] --- PDM[PDM Audio Line]
        CAN1[MCP2518FD CAN Controller] --- CAN_TX[MCP2542FD Transceiver]
    end

    subgraph Elbow Satellite PCB (PCB-PHX-ELBOW-002)
        MCU[STM32H753 480MHz MCU]
        DRV[TI DRV8323RS Gate Driver] --- FET[6x CSD18532 N-MOSFETs]
        ENC[AS5048A 14-Bit Encoder] --- SPI2[SPI Bus 2]
        CAN2[MCP2542FD CAN Transceiver]
    end

    subgraph Socket Safety & Microclimate Harness
        FSR[8-Point FSR Sensor Grid] --- COMP[20.0 kPa Hardware Comparator]
        COMP -->|IRQ_HIGH| MCU
        SHT[Sensirion SHT31 Temp/RH] --- I2C[I2C Bus]
        TENS[Dragon Skin 20 TENS Pads] --- MUX[3-Position Analog MUX]
    end

    CAN_TX <== 2-Wire Shielded CAN-FD Differential Bus (5Mbps) ==> CAN2
    MCU --- DRV
    FET --- MOTOR[Maxon ECX Speed 16 M Motor]
```

---

## 2. Complete Interconnect Pinout & Harness Matrix

### 2.1 Palm Master Board (`PCB-PHX-PALM-001`) Pinout

| Pin # | Wire Color | Signal Name | Description / Protocol | Connected Destination |
| :--- | :--- | :--- | :--- | :--- |
| **P1.1** | Red | `+22V2_VBAT` | 22.2V Main Battery Input | Main Power Harness |
| **P1.2** | Black | `GND` | Common Ground Return | System Ground Plane |
| **P1.3** | White | `CAN_H` | CAN-FD High Differential Line (5Mbps) | Elbow Satellite `P2.3` |
| **P1.4** | Blue | `CAN_L` | CAN-FD Low Differential Line (5Mbps) | Elbow Satellite `P2.4` |
| **P2.1** | Yellow | `EMG_CH1_P` | Biceps sEMG Differential Positive | Electrode Pad #1 |
| **P2.2** | Green | `EMG_CH1_N` | Biceps sEMG Differential Negative | Electrode Pad #2 |
| **P2.3** | Yellow | `EMG_CH2_P` | Triceps sEMG Differential Positive | Electrode Pad #3 |
| **P2.4** | Green | `EMG_CH2_N` | Triceps sEMG Differential Negative | Electrode Pad #4 |
| **P3.1** | Orange | `CAM_DVP_VSYNC`| OV2640 Frame Sync Signal | NDP120 Camera Host |
| **P3.2** | Purple | `MIC_PDM_CLK` | Knowles MEMS Audio Clock | NDP120 Audio Host |

---

### 2.2 Elbow Satellite Board (`PCB-PHX-ELBOW-002`) Pinout

| Pin # | Wire Color | Signal Name | Description / Protocol | Connected Destination |
| :--- | :--- | :--- | :--- | :--- |
| **E1.1** | Red (Heavy) | `MOTOR_PHASE_A`| 22.2V 10.3A High-Current Phase A | Maxon ECX Motor Phase A |
| **E1.2** | Yellow (Heavy)| `MOTOR_PHASE_B`| 22.2V 10.3A High-Current Phase B | Maxon ECX Motor Phase B |
| **E1.3** | Blue (Heavy) | `MOTOR_PHASE_C`| 22.2V 10.3A High-Current Phase C | Maxon ECX Motor Phase C |
| **E2.1** | Brown | `ENC_SPI_MOSI` | AS5048A 14-Bit Encoder Data Out | STM32H753 SPI2 |
| **E2.2** | Grey | `FSR_IRQ_LOCK` | **20.0 kPa Hardware Safety Lock** | STM32H753 EXTI Pin 5 |
| **E3.1** | Pink | `SHT31_SCL` | Socket Temperature/Humidity Clock | Sensirion SHT31 Sensor |
| **E3.2** | Cyan | `SHT31_SDA` | Socket Temperature/Humidity Data | Sensirion SHT31 Sensor |

---

## 3. Step-by-Step Prototype Wiring Procedure

1. **Step 1: Power Rail Distribution**:
   * Connect the 22.2V 5000mAh Li-Ion battery output via XT60 connector to the `TPS54360` buck regulator on `PCB-PHX-ELBOW-002`. Verify $5.0\,\text{V} \pm 0.05\,\text{V}$ and $3.3\,\text{V} \pm 0.02\,\text{V}$ outputs before plugging in ICs.
2. **Step 2: CAN-FD Differential Bus Harness**:
   * Twist white (`CAN_H`) and blue (`CAN_L`) wires together with a 120-ohm termination resistor at each end (`PCB-PHX-PALM-001` and `PCB-PHX-ELBOW-002`).
3. **Step 3: FSR Safety Lock Interlock Integration**:
   * Wire the 8 FSR pressure sensor pads in parallel into the analog comparator network. Verify that applying $>20.0\,\text{kPa}$ pressure triggers `FSR_IRQ_LOCK` line to $3.3\,\text{V}$ HIGH instantly.
4. **Step 4: sEMG Signal Calibration**:
   * Connect 4-channel sEMG shielded differential cables to the PGA460 AFE inputs. Verify zero-load noise is $<5.2\,\mu\text{V RMS}$.

---

### 🌐 Documentation & Interactive Links
* 🔗 **Blueprint.io Interactive AI Schematic Link**: [https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE](https://blueprint.io/s/L-wGw87W7LTB88vf0W0YKDq-H_zBQepHv38oIBfQYnE)
* 📄 KiCAD Schematic Files: `hardware/PCB-PHX-PALM-001.kicad_sch` & `hardware/PCB-PHX-ELBOW-002.kicad_sch`
