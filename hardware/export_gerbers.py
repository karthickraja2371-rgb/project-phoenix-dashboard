import os
import zipfile

def generate_gerber_package(pcb_path, output_dir):
    board_name = os.path.basename(pcb_path).replace('.kicad_pcb', '')
    target_dir = os.path.join(output_dir, board_name + "_Gerbers")
    
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    print(f"✅ Successfully prepared Gerber export directory: {target_dir}")

if __name__ == "__main__":
    generate_gerber_package("PCB-PHX-PALM-001.kicad_pcb", "./production_release")
    generate_gerber_package("PCB-PHX-ELBOW-002.kicad_pcb", "./production_release")
