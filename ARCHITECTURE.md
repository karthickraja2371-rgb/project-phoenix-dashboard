# 🏗️ PROJECT PHOENIX: SYSTEM ARCHITECTURE & ELECTRONICS TOPOLOGY

**Document ID**: `PHX-ENG-ARCH-001`  
**Revision**: `v1.0.0-Production-Release`  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  
**Date**: 31 July 2026  

---

## 1. System Block Diagram & CAN-FD Bus Topology

Project Phoenix utilizes a decoupled dual-board architecture connected via a **1 Mbps CAN-FD differential bus** with custom 8-byte telemetry payloads:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                PALM MASTER BOARD (PCB-PHX-PALM-001)               │
│                                                                                   │
│  ┌────────────────────┐    SPI    ┌─────────────────────┐   I2C   ┌─────────────┐ │
│  │ Syntiant NDP120    ├──────────►│ TI ADS1299 sEMG AFE ├────────►│ OV2640 Cam  │ │
│  │ Neural Processor   │           │ (24-bit 2000Hz)     │         │ (Palmar)    │ │
│  └─────────┬──────────┘           └─────────────────────┘         └─────────────┘ │
│            │                                                                      │
│            │ SPI                                                                  │
│  ┌─────────▼──────────┐           ┌─────────────────────┐   CAN-H ┌─────────────┐ │
│  │ MCP2518FD CAN-FD   ├──────────►│ CAN-FD Transceiver  ├────────►│ CAN-FD Bus  │ │
│  │ Controller         │           │ (TCAN1042-Q1)       │   CAN-L │ Differential│ │
│  └────────────────────┘           └─────────────────────┘         └──────┬──────┘ │
└──────────────────────────────────────────────────────────────────────────┼────────┘
                                                                           │
                                                                           │ CAN-FD (1Mbps)
                                                                           ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                              ELBOW SATELLITE BOARD (PCB-PHX-ELBOW-002)            │
│                                                                                   │
│  ┌────────────────────┐    PWM    ┌─────────────────────┐   SPI   ┌─────────────┐ │
│  │ STM32H753 480MHz   ├──────────►│ TI DRV8323RS Gate   ├────────►│ AS5048A     │ │
│  │ ARM Cortex-M7 MCU  │           │ Driver + MOSFETs    │         │ Encoder     │ │
│  └─────────┬──────────┘           └──────────┬──────────┘         └─────────────┘ │
│            │                                 │                                    │
│            │ SPI                             ▼                                    │
│  ┌─────────▼──────────┐           ┌─────────────────────┐                         │
│  │ 8-Point FSR Array  │           │ Maxon ECX Speed 16  │                         │
│  │ (20.0 kPa Lock)    │           │ (50:1 Worm Gear)    │                         │
│  └────────────────────┘           └─────────────────────┘                         │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Hardware Subsystem Specifications

### 2.1 Palm Master Board (`PCB-PHX-PALM-001`)
* **Edge AI Inference Chip**: Syntiant NDP120 Neural Decision Processor ($<4.8\,\text{mW}$ power consumption running 4-layer CNN gesture classification).
* **Analog Front End (AFE)**: Texas Instruments **ADS1299** 24-bit 8-channel simultaneous sampling AFE ($2000\,\text{Hz}$ sample rate, $110\,\text{dB}$ CMRR).
* **Active Electrodes**: Otto Bock `13E200` Quad active differential sEMG electrode header interface.
* **Palmar Vision Camera**: OV2640 2MP image sensor ($300\,\text{ms}$ pre-contact object pre-shaping, MobileNetV3 classifier).
* **Audio MEMS Interface**: Knowles PDM MEMS microphone for Claim 7 voice command fallback (`OPEN`, `GRIP`, `LOCK`, `PINCH`).

### 2.2 Elbow Satellite Board (`PCB-PHX-ELBOW-002`)
* **Microcontroller**: STM32H753 480MHz ARM Cortex-M7 MCU (2MB Flash, 1MB RAM, double-precision FPU).
* **3-Phase Motor Driver**: TI DRV8323RS 60V 3-phase gate driver + 6x TI CSD18532 Q3A N-Channel MOSFETs.
* **Actuator Motor**: Maxon ECX Speed 16 M ($22.2\,\text{V}$, $16\,\text{mm}$ brushless DC motor).
* **Reduction Gearhead**: Maxon GP 16 C 50:1 non-backdrivable worm gear (0W passive power draw when holding heavy loads).
* **Position Feedback**: AS5048A 14-bit magnetic rotary encoder (SPI interface, $0.022^\circ$ resolution).

---

## 3. Firmware C State Machine Protocol

The firmware running on the STM32H753 follows a real-time state machine executing inside a $1\,\text{kHz}$ RTOS task loop:

```c
typedef enum {
    SYSTEM_INIT,
    SYSTEM_IDLE,
    GESTURE_ACTIVE,
    SAFETY_LOCK_ENGAGED,
    CORTISOL_TORQUE_CAP,
    MANDATORY_REST_CYCLE,
    FAULT_RECOVERY
} SystemState_t;
```

---

© 2026 R. Karthick Raja. All Rights Reserved except where licensed under the software MIT License.
