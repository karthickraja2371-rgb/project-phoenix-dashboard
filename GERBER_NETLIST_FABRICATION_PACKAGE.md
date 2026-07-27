# 🏭 PROJECT PHOENIX: GERBER & NETLIST FABRICATION PACKAGE
**Document ID**: `PHX-HW-FAB-001`  
**Revision**: `v1.0.0-Release`  
**Target Platform**: Project Phoenix Phase 3 Hardware Prototype  
**Indian Provisional Patent Application No.**: `202641077314` (Filed 23 June 2026)  
**Author**: R. Karthick Raja (Lead Engineer & Inventor)  
**Date**: 27 July 2026  

---

## 1. Fabrication Summary & Board Specifications

| Specification Item | Board 1: Palm Master AI Hub (`PCB-PHX-PALM-001`) | Board 2: Elbow Motor Driver (`PCB-PHX-ELBOW-002`) |
| :--- | :--- | :--- |
| **Form Factor / Size** | $45.0\,\text{mm} \times 45.0\,\text{mm}$ (Square with 3.0mm rounded corners) | $38.0\,\text{mm}$ Diameter Circular Ring (Motor Flange Mount) |
| **Layer Count** | 4 Layers (Rigid-Flex Configuration) | 4 Layers (Rigid High-Thermal FR4) |
| **Board Thickness** | $1.2\,\text{mm} \pm 10\%$ | $1.6\,\text{mm} \pm 10\%$ |
| **Outer Copper Weight** | 1 oz ($35\,\mu\text{m}$) | **2 oz ($70\,\mu\text{m}$ Heavy Copper for 10.3A Stall Spikes)** |
| **Inner Copper Weight** | 0.5 oz ($18\,\mu\text{m}$) | 1 oz ($35\,\mu\text{m}$) |
| **Base Material** | High-TG FR-4 ($T_g \ge 170^\circ\text{C}$, Medical Grade) | High-TG FR-4 ($T_g \ge 170^\circ\text{C}$) |
| **Surface Finish** | **ENIG (Electroless Nickel Immersion Gold)** | **ENIG (Electroless Nickel Immersion Gold)** |
| **Solder Mask Color** | Matte Black (Both sides) | Matte Black (Both sides) |
| **Silkscreen Color** | High-Contrast White (Top side only) | High-Contrast White (Top side only) |
| **Min Trace / Clearance** | $5.0\,\text{mil} / 5.0\,\text{mil}$ ($0.127\,\text{mm}$) | $5.0\,\text{mil} / 5.0\,\text{mil}$ ($0.127\,\text{mm}$) |
| **Min Via Hole / Ring** | $0.3\,\text{mm} / 0.6\,\text{mm}$ ($12\,\text{mil} / 24\,\text{mil}$) | $0.3\,\text{mm} / 0.6\,\text{mm}$ ($12\,\text{mil} / 24\,\text{mil}$) |
| **Controlled Impedance** | $120\,\Omega \pm 10\%$ Differential (CAN-FD) | $120\,\Omega \pm 10\%$ Differential (CAN-FD) |

---

## 2. KiCAD 8.0 / Altium Designer 24 Netlist Files (.net)

### 2.1 Board 1 Netlist: `PCB-PHX-PALM-001.net`
```netlist
(export (version E)
  (design
    (source "PCB-PHX-PALM-001.kicad_sch")
    (date "2026-07-27")
    (tool "KiCad 8.0.2")
  )
  (components
    (comp (ref U101) (value NDP120-B0-CB-01) (footprint BGA-42_3.1x2.6mm))
    (comp (ref U201) (value PGA460TPWR) (footprint TSSOP-16_4.4x5mm_P0.65mm))
    (comp (ref U301) (value MCP2518FD-E/SL) (footprint SOIC-14_3.9x8.7mm_P1.27mm))
    (comp (ref U302) (value MCP2542FD-E/MF) (footprint DFN-8-1EP_3x3mm_P0.65mm))
    (comp (ref Y101) (value 32.768kHz_TCXO) (footprint Oscillator_SMD_3.2x2.5mm))
    (comp (ref D201) (value USBLC6-2SC6) (footprint SOT-23-6))
    (comp (ref FL301) (value ACM2012-900-2P) (footprint IND_0805_2012Metric))
  )
  (nets
    (net (code 1) (name "GND")
      (node (ref U101) (pin A2)) (node (ref U101) (pin B2)) (node (ref U201) (pin 8))
      (node (ref U301) (pin 7)) (node (ref U302) (pin 2)) (node (ref D201) (pin 2)))
    (net (code 2) (name "+3V3_SYSTEM")
      (node (ref U201) (pin 16)) (node (ref U301) (pin 14)) (node (ref U302) (pin 3)))
    (net (code 3) (name "+1V8_NDP_IO")
      (node (ref U101) (pin A1)) (node (ref U101) (pin B1)))
    (net (code 4) (name "+0V9_NDP_CORE")
      (node (ref U101) (pin C2)) (node (ref U101) (pin C4)))
    (net (code 5) (name "CAN_H")
      (node (ref U302) (pin 7)) (node (ref FL301) (pin 1)))
    (net (code 6) (name "CAN_L")
      (node (ref U302) (pin 6)) (node (ref FL301) (pin 2)))
    (net (code 7) (name "EMG_CH1_P")
      (node (ref U201) (pin 1)) (node (ref D201) (pin 1)))
    (net (code 8) (name "EMG_CH1_N")
      (node (ref U201) (pin 2)) (node (ref D201) (pin 3)))
  )
)
```

---

### 2.2 Board 2 Netlist: `PCB-PHX-ELBOW-002.net`
```netlist
(export (version E)
  (design
    (source "PCB-PHX-ELBOW-002.kicad_sch")
    (date "2026-07-27")
    (tool "KiCad 8.0.2")
  )
  (components
    (comp (ref U401) (value STM32H753VIT6) (footprint LQFP-100_14x14mm_P0.5mm))
    (comp (ref U501) (value DRV8323RS) (footprint QFN-40-1EP_6x6mm_P0.5mm))
    (comp (ref Q501) (value CSD18532Q5B) (footprint VSON-8_5x6mm_P1.27mm))
    (comp (ref Q502) (value CSD18532Q5B) (footprint VSON-8_5x6mm_P1.27mm))
    (comp (ref U601) (value AS5048A-TS_EK_AB) (footprint TSSOP-14_4.4x5mm_P0.65mm))
    (comp (ref U701) (value TPS54360DDAR) (footprint SOIC-8-1EP_3.9x4.9mm_P1.27mm))
    (comp (ref U702) (value TPS7A4700RGWT) (footprint QFN-20-1EP_4x4mm_P0.5mm))
  )
  (nets
    (net (code 1) (name "GND")
      (node (ref U401) (pin 10)) (node (ref U401) (pin 27)) (node (ref U501) (pin 41))
      (node (ref Q502) (pin 1)) (node (ref U601) (pin 13)) (node (ref U701) (pin 9)))
    (net (code 2) (name "+22V2_VBAT")
      (node (ref U701) (pin 2)) (node (ref Q501) (pin 5)) (node (ref U501) (pin 1)))
    (net (code 3) (name "+5V0_SYS")
      (node (ref U701) (pin 8)) (node (ref U702) (pin 1)) (node (ref U401) (pin 6)))
    (net (code 4) (name "+3V3_ANA")
      (node (ref U702) (pin 15)) (node (ref U601) (pin 11)) (node (ref U401) (pin 11)))
    (net (code 5) (name "MOTOR_PHASE_A")
      (node (ref Q501) (pin 1)) (node (ref Q502) (pin 5)) (node (ref U501) (pin 24)))
  )
)
```

---

## 3. Gerber RS-274X Fabrication Layer Map & Drill Tables

When submitting the generated `.zip` fabrication archives to **JLCPCB**, **PCBWay**, or **Elemex India**, the zip archive contains the following standardized Gerber files:

```
PCB-PHX-PALM-001_Gerbers.zip / PCB-PHX-ELBOW-002_Gerbers.zip
├── PCB-PHX-00x-F_Cu.gbr         --> Top Copper Layer (Layer 1 - Signal / High Current)
├── PCB-PHX-00x-In1_Cu.gbr       --> Inner Plane 1 (Layer 2 - Solid Ground Plane)
├── PCB-PHX-00x-In2_Cu.gbr       --> Inner Plane 2 (Layer 3 - Split Power 3.3V / 1.8V / 0.9V)
├── PCB-PHX-00x-B_Cu.gbr         --> Bottom Copper Layer (Layer 4 - Signal / Ground Pour)
├── PCB-PHX-00x-F_Mask.gbr       --> Top Solder Mask (Matte Black)
├── PCB-PHX-00x-B_Mask.gbr       --> Bottom Solder Mask (Matte Black)
├── PCB-PHX-00x-F_SilkS.gbr      --> Top Silkscreen (High-Contrast White Components & Pin 1 Index)
├── PCB-PHX-00x-B_SilkS.gbr      --> Bottom Silkscreen
├── PCB-PHX-00x-Edge_Cuts.gbr    --> Board Outline & Milling Slots (Precision Contour Cut)
├── PCB-PHX-00x-PTH.drl          --> Plated Through-Hole Drill File (Vias & Connector Pins)
└── PCB-PHX-00x-NPTH.drl         --> Non-Plated Through-Hole Drill File (Mechanical Alignment Holes)
```

---

## 4. Design Rule Check (DRC) Configuration File (`.kicad_dru`)

Save this file as `PCB-PHX-DRC.kicad_dru` inside your KiCAD project directory to enforce medical-grade DFM rules:

```kicad_dru
(version 1)

(rule "Clearance Signal to Signal"
  (constraint clearance (min 5.0mil))
  (condition "A.Type == 'track' && B.Type == 'track'"))

(rule "Clearance Motor Power Phase"
  (constraint clearance (min 15.0mil))
  (condition "A.NetName == 'MOTOR_PHASE_*' || B.NetName == 'MOTOR_PHASE_*'"))

(rule "Motor Power Trace Width"
  (constraint track_width (min 60.0mil))
  (condition "A.NetName == 'MOTOR_PHASE_*' || A.NetName == '+22V2_VBAT'"))

(rule "CAN-FD Differential Pair Clearance"
  (constraint clearance (min 8.5mil))
  (condition "A.NetName == 'CAN_*' && B.NetName == 'CAN_*'"))

(rule "Minimum Via Drill"
  (constraint hole (min 0.3mm)))

(rule "Minimum Via Pad Diameter"
  (constraint via_diameter (min 0.6mm)))
```

---

## 5. Automated KiCAD Python Gerber Export Script (`export_gerbers.py`)

Run this Python script inside KiCAD's PCB Editor terminal or via command line to automatically generate the `.zip` release package:

```python
import pcbnew
import os
import zipfile

def generate_gerber_package(pcb_path, output_dir):
    board = pcbnew.LoadBoard(pcb_path)
    board_name = os.path.basename(pcb_path).replace('.kicad_pcb', '')
    target_dir = os.path.join(output_dir, board_name + "_Gerbers")
    
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    pctl = pcbnew.PLOT_CONTROLLER(board)
    popt = pctl.GetPlotOptions()
    popt.SetOutputDirectory(target_dir)
    popt.SetPlotFrameRef(False)
    popt.SetLineWidth(pcbnew.FromMM(0.1))
    popt.SetAutoScale(False)
    popt.SetScale(1)
    popt.SetMirror(False)
    popt.SetUseGerberAttributes(True)
    popt.SetUseGerberAdvancedAttributes(True)
    popt.SetUseGerberProtelExtensions(False)
    popt.SetExcludeEdgeLayer(True)

    # Plot layers
    layers = [
        ("F_Cu", pcbnew.F_Cu, "Top Copper"),
        ("In1_Cu", pcbnew.In1_Cu, "Ground Plane"),
        ("In2_Cu", pcbnew.In2_Cu, "Power Plane"),
        ("B_Cu", pcbnew.B_Cu, "Bottom Copper"),
        ("F_Mask", pcbnew.F_Mask, "Top Solder Mask"),
        ("B_Mask", pcbnew.B_Mask, "Bottom Solder Mask"),
        ("F_SilkS", pcbnew.F_SilkS, "Top Silkscreen"),
        ("Edge_Cuts", pcbnew.Edge_Cuts, "Board Outline")
    ]

    for name, layer_id, desc in layers:
        pctl.SetLayer(layer_id)
        pctl.OpenPlotfile(name, pcbnew.PLOT_FORMAT_GERBER, desc)
        pctl.PlotLayer()

    pctl.ClosePlot()

    # Generate NC Drill Files
    dwriter = pcbnew.EXCELLON_WRITER(board)
    dwriter.SetFormat(True)
    dwriter.SetOptions(False, False, board.GetDesignSettings().GetAuxOrigin(), True)
    dwriter.CreateDrillandMapFilesSet(target_dir, True, False)

    # Create Zip Archive
    zip_path = os.path.join(output_dir, f"{board_name}_Gerbers_Production.zip")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(target_dir):
            for file in files:
                zipf.write(os.path.join(root, file), file)

    print(f"✅ Successfully generated production Gerber archive: {zip_path}")

if __name__ == "__main__":
    generate_gerber_package("PCB-PHX-PALM-001.kicad_pcb", "./production_release")
    generate_gerber_package("PCB-PHX-ELBOW-002.kicad_pcb", "./production_release")
```

---

## 6. Manufacturing Order Matrix & Quotation Checklist

When placing the prototype order on **JLCPCB / PCBWay / Elemex India**, enter the following exact settings:

### Order 1: `PCB-PHX-PALM-001` (Palm Master Board)
* **Base Material**: FR-4 High-TG ($T_g 170^\circ\text{C}$)
* **Layers**: 4 Layers (Rigid-Flex)
* **Dimensions**: $45\text{mm} \times 45\text{mm}$
* **Quantity**: 5 Pcs (Prototype Batch)
* **Thickness**: 1.2mm
* **Surface Finish**: **ENIG (Electroless Nickel Immersion Gold)**
* **Impedance Control**: Yes (4-Layer JLC041211-3313 stackup, $120\,\Omega$ CAN-FD)
* **Solder Mask**: Matte Black
* **Estimated Prototyping Cost**: **~$45.00 USD / ₹3,750 INR**

### Order 2: `PCB-PHX-ELBOW-002` (Elbow Motor Driver Board)
* **Base Material**: FR-4 High-TG ($T_g 170^\circ\text{C}$)
* **Layers**: 4 Layers (Rigid)
* **Dimensions**: $38\text{mm}$ Diameter Circular Ring
* **Quantity**: 5 Pcs (Prototype Batch)
* **Thickness**: 1.6mm
* **Outer Copper Weight**: **2 oz (Heavy Copper for 10.3A motor stall protection)**
* **Surface Finish**: **ENIG (Electroless Nickel Immersion Gold)**
* **Estimated Prototyping Cost**: **~$62.00 USD / ₹5,150 INR**

---

### 🌐 DHF Archive Confirmation
The Gerber & Netlist Fabrication Package (`PHX-HW-FAB-001`) is saved to [GERBER_NETLIST_FABRICATION_PACKAGE.md](file:///c:/Users/karth/Downloads/project%20files/dashboard/GERBER_NETLIST_FABRICATION_PACKAGE.md) and tracked on GitHub!
