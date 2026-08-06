import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Arm3DViewer({ fingers = [0, 0, 0, 0, 0], elbow = 45, wrist = 12, color = "#00E5FF" }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const armGroupRef = useRef(null);
  const socketMeshRef = useRef(null);
  const forearmGroupRef = useRef(null);
  const wristGroupRef = useRef(null);
  const fingerJointsRef = useRef([]); // Stores { proxGroup, distGroup } for each of the 5 fingers
  const elbowMeshRef = useRef(null);
  const jointMatRef = useRef(null);

  // Exploded View & Component Selection State
  const [explodeRatio, setExplodeRatio] = useState(0); // 0 (assembled) to 1 (fully exploded)
  const explodeRatioRef = useRef(0);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const COMPONENT_DETAILS = {
    socket: {
      title: "Outer Platinum Silicone Socket Liner",
      badge: "Claim 4 & Claim 8",
      material: "Platinum Silicone + Self-Healing Microcapsules",
      function: "Frictionless skin graft interface & 20.0 kPa FSR pressure scanning",
      weight: "420g (MODELED)",
      ref: "PROJECT_WHITEPAPER.md (Section 3.1)"
    },
    forearm: {
      title: "Carbon Fiber Forearm Monocoque",
      badge: "Claim 13",
      material: "3K Twill Carbon Fiber Composite + PETG Joint Housings",
      function: "High strength-to-weight structural chassis housing Maxon motors",
      weight: "380g (MODELED)",
      ref: "MECHANICAL_ASSEMBLY_GUIDE.md"
    },
    palm: {
      title: "Syntiant NDP120 Palm PCB Chassis",
      badge: "Claim 1 & Claim 2",
      material: "4-Layer FR4 PCB + OV2640 Optics",
      function: "100% offline edge neural gesture classification (<5mW) & vision intent camera",
      weight: "380g (MODELED)",
      ref: "PCB-PHX-PALM-001.kicad_sch"
    },
    actuators: {
      title: "Maxon EC/DCX Motors & Encoders",
      badge: "Claim 13",
      material: "Maxon DCX 6 S + AS5048A 14-Bit Magnetic Encoder",
      function: "Precision finger tendon drive & angle feedback control",
      weight: "140g (MODELED)",
      ref: "COMPONENT_PURCHASING_CHECKLIST.md"
    },
    tendons: {
      title: "Dyneema SK78 Tendon Cable Routing",
      badge: "Claim 8",
      material: "0.8mm Braided Dyneema SK78 Ultra-High-Molecular-Weight Polyethylene",
      function: "Flexible finger articulation transmission with 20.0 kPa hardware lock",
      weight: "15g (MODELED)",
      ref: "firmware/src/safety_system.cpp"
    }
  };

  useEffect(() => {
    explodeRatioRef.current = explodeRatio;
  }, [explodeRatio]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 450;
    let height = container.clientHeight || 450;

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#020712");

    // Camera focused directly on Hand and Forearm Assembly (y = -6)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, -4, 26);
    camera.lookAt(0, -6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // ── High-Contrast Studio Lighting ──────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(15, 20, 25);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00E5FF, 2.2);
    fillLight.position.set(-20, 0, 20);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00E676, 2.0);
    rimLight.position.set(15, -20, -15);
    scene.add(rimLight);

    // ── Grid & Floor ────────────────────────────────────────────────────────────
    const gridHelper = new THREE.GridHelper(50, 25, 0x00E5FF, 0x102644);
    gridHelper.position.y = -18;
    scene.add(gridHelper);

    // ── Main Arm Assembly ──────────────────────────────────────────────────────
    const mainGroup = new THREE.Group();
    armGroupRef.current = mainGroup;
    scene.add(mainGroup);

    // High-Contrast Metallic Platinum Material
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      metalness: 0.9,
      roughness: 0.15,
    });

    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x00E5FF,
      emissive: 0x004466,
      metalness: 0.95,
      roughness: 0.1,
    });
    jointMatRef.current = jointMat;

    // FIX: Changed from near-black (0x1E293B) to visible steel-blue so fingers
    // are legible against the dark background
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x4A7FA5,
      metalness: 0.75,
      roughness: 0.25,
    });

    const fingerTipMat = new THREE.MeshStandardMaterial({
      color: 0x00E676,
      emissive: 0x003311,
      metalness: 0.9,
      roughness: 0.1,
    });

    // 1. Shoulder Socket (Top)
    const socketGeo = new THREE.CylinderGeometry(3.8, 3.0, 3.5, 24);
    const socketMesh = new THREE.Mesh(socketGeo, titaniumMat);
    socketMesh.position.y = 8;
    socketMeshRef.current = socketMesh;
    mainGroup.add(socketMesh);

    // 2. Upper Arm Shell
    const upperArmGeo = new THREE.CylinderGeometry(2.4, 2.1, 7, 24);
    const upperArmMesh = new THREE.Mesh(upperArmGeo, titaniumMat);
    upperArmMesh.position.y = 3.5;
    mainGroup.add(upperArmMesh);

    // 3. Elbow Joint Sphere
    const elbowGeo = new THREE.SphereGeometry(2.2, 24, 24);
    const elbowMesh = new THREE.Mesh(elbowGeo, jointMat);
    elbowMesh.position.y = 0;
    mainGroup.add(elbowMesh);
    elbowMeshRef.current = elbowMesh;

    // 4. Forearm Shell Group
    const forearmGroup = new THREE.Group();
    forearmGroupRef.current = forearmGroup;
    forearmGroup.position.y = 0;
    mainGroup.add(forearmGroup);

    const forearmGeo = new THREE.CylinderGeometry(2.0, 1.6, 8, 24);
    const forearmMesh = new THREE.Mesh(forearmGeo, titaniumMat);
    forearmMesh.position.y = -4.5;
    forearmGroup.add(forearmMesh);

    // 5. Wrist Joint & Palm Chassis Group
    const wristGroup = new THREE.Group();
    wristGroupRef.current = wristGroup;
    wristGroup.position.y = -9;
    forearmGroup.add(wristGroup);

    const wristGeo = new THREE.CylinderGeometry(1.6, 1.8, 1.4, 24);
    const wristMesh = new THREE.Mesh(wristGeo, jointMat);
    wristMesh.position.y = 0;
    wristGroup.add(wristMesh);

    // Palm Box Chassis
    const palmGeo = new THREE.BoxGeometry(4.8, 1.5, 4.0);
    const palmMesh = new THREE.Mesh(palmGeo, titaniumMat);
    palmMesh.position.y = -1.5;
    wristGroup.add(palmMesh);

    // 6. 5 Anatomically Opposed Articulating Fingers
    const fingerJoints = [];
    // FIX: Enlarged finger dimensions and repositioned below the palm so they
    // are clearly visible. Thumb spread outward; all fingers radii increased.
    const fingerConfigs = [
      { name: "Thumb",  x: -2.6, y: -0.5, z:  1.2, rotZ:  0.55, rotY:  0.45, len: 3.0 },
      { name: "Index",  x: -1.6, y: -2.5, z:  0.3, rotZ:  0.0,  rotY:  0.0,  len: 3.6 },
      { name: "Middle", x: -0.5, y: -2.5, z:  0.3, rotZ:  0.0,  rotY:  0.0,  len: 4.0 },
      { name: "Ring",   x:  0.6, y: -2.5, z:  0.3, rotZ:  0.0,  rotY:  0.0,  len: 3.5 },
      { name: "Little", x:  1.7, y: -2.5, z:  0.3, rotZ: -0.08, rotY:  0.0,  len: 2.8 },
    ];

    fingerConfigs.forEach((cfg) => {
      const totalLen = cfg.len;
      const proxLen = totalLen * 0.55;
      const distLen = totalLen * 0.45;

      const proxGroup = new THREE.Group();
      proxGroup.position.set(cfg.x, cfg.y, cfg.z);
      proxGroup.rotation.z = cfg.rotZ;
      proxGroup.rotation.y = cfg.rotY;

      // Larger knuckle sphere
      const knuckleGeo = new THREE.SphereGeometry(0.52, 16, 16);
      const knuckleMesh = new THREE.Mesh(knuckleGeo, jointMat);
      proxGroup.add(knuckleMesh);

      // Thicker prox phalanx
      const proxMeshGeo = new THREE.CylinderGeometry(0.44, 0.38, proxLen, 16);
      const proxMesh = new THREE.Mesh(proxMeshGeo, carbonMat);
      proxMesh.position.y = -proxLen / 2;
      proxGroup.add(proxMesh);

      const distGroup = new THREE.Group();
      distGroup.position.set(0, -proxLen, 0);

      // IP joint sphere
      const ipJointGeo = new THREE.SphereGeometry(0.40, 16, 16);
      const ipJointMesh = new THREE.Mesh(ipJointGeo, jointMat);
      distGroup.add(ipJointMesh);

      // Thicker distal phalanx
      const distMeshGeo = new THREE.CylinderGeometry(0.36, 0.26, distLen, 16);
      const distMesh = new THREE.Mesh(distMeshGeo, fingerTipMat);
      distMesh.position.y = -distLen / 2;
      distGroup.add(distMesh);

      proxGroup.add(distGroup);
      wristGroup.add(proxGroup);

      fingerJoints.push({ proxGroup, distGroup });
    });

    fingerJointsRef.current = fingerJoints;

    // ── Mouse Drag Orbit Rotation Controls ─────────────────────────────────────
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isMouseDown = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isMouseDown || !mainGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      mainGroup.rotation.y += deltaX * 0.01;
      mainGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // ── Animation Loop (Smooth Lerp Exploded Position Offsets) ───────────────
    let reqId;
    let t = 0;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      t += 0.015;

      if (mainGroup && !isMouseDown) {
        mainGroup.rotation.y += 0.006;
      }

      // Dynamic demo wrist tilting
      if (wristGroupRef.current) {
        wristGroupRef.current.rotation.z = Math.sin(t * 0.8) * 0.15;
      }

      // Smooth lerp positional offsets based on explodeRatioRef.current
      const exp = explodeRatioRef.current;

      // 1. Socket expands upwards
      if (socketMeshRef.current) {
        socketMeshRef.current.position.y = 8 + exp * 6;
      }

      // 2. Forearm expands downwards
      if (forearmGroupRef.current) {
        forearmGroupRef.current.position.y = 0 - exp * 4;
      }

      // 3. Wrist & Palm expand further downwards and forward
      if (wristGroupRef.current) {
        wristGroupRef.current.position.y = -9 - exp * 5;
        wristGroupRef.current.position.z = exp * 3;
      }

      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = entry.contentRect.width || 450;
        const h = entry.contentRect.height || 450;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Dynamically update joints & realistic finger flexions
  useEffect(() => {
    fingerJointsRef.current.forEach((joints, i) => {
      if (!joints || !joints.proxGroup || !joints.distGroup) return;
      const flexRatio = (fingers[i] || 0) / 100;
      joints.proxGroup.rotation.x = flexRatio * 1.5;
      joints.distGroup.rotation.x = flexRatio * 1.3;
    });

    if (forearmGroupRef.current) {
      forearmGroupRef.current.rotation.z = (elbow / 140) * 0.5;
    }
    if (jointMatRef.current && color) {
      jointMatRef.current.color.set(color);
    }
  }, [fingers, elbow, wrist, color]);

  const takeSnapshot = () => {
    if (!mountRef.current) return;
    const canvas = mountRef.current.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `project_phoenix_3d_cad_view_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const activeDetail = selectedComponent ? COMPONENT_DETAILS[selectedComponent] : null;

  return (
    <div style={{ position: "relative", width: '100%', height: '500px', display: "flex", flexDirection: "column" }}>
      {/* 3D Canvas Viewport */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #00E5FF',
          background: '#020712',
          boxShadow: '0 0 35px rgba(0, 229, 255, 0.25)',
          cursor: 'grab'
        }}
      />

      {/* Top Header Badge */}
      <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(3, 8, 18, 0.85)", border: "1px solid #00E5FF", padding: "4px 10px", borderRadius: 6, fontSize: 10, color: "#00E5FF", fontWeight: 800, pointerEvents: "none", display: "flex", alignItems: "center", gap: 6 }}>
        <span>📐 [ENGINEERING CAD MODEL]</span>
        <span style={{ background: "rgba(0, 229, 255, 0.15)", padding: "1px 6px", borderRadius: 3, fontSize: 9 }}>
          {explodeRatio > 0 ? `Exploded ${Math.round(explodeRatio * 100)}%` : "Assembled State"}
        </span>
      </div>

      {/* Exploded View Presets, Slider & Snapshot Export Overlay */}
      <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(10, 20, 36, 0.9)", border: "1px solid rgba(0, 229, 255, 0.3)", padding: "8px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(8px)", flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, color: "#B0C4DE", fontWeight: 700 }}>💥 PRESETS:</span>
        <button onClick={() => setExplodeRatio(0)} style={{ background: explodeRatio === 0 ? "#00E5FF" : "rgba(0, 229, 255, 0.1)", color: explodeRatio === 0 ? "#000" : "#00E5FF", border: "1px solid #00E5FF", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, cursor: "pointer" }}>0%</button>
        <button onClick={() => setExplodeRatio(0.35)} style={{ background: explodeRatio === 0.35 ? "#00E5FF" : "rgba(0, 229, 255, 0.1)", color: explodeRatio === 0.35 ? "#000" : "#00E5FF", border: "1px solid #00E5FF", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, cursor: "pointer" }}>35%</button>
        <button onClick={() => setExplodeRatio(0.70)} style={{ background: explodeRatio === 0.70 ? "#00E5FF" : "rgba(0, 229, 255, 0.1)", color: explodeRatio === 0.70 ? "#000" : "#00E5FF", border: "1px solid #00E5FF", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, cursor: "pointer" }}>70%</button>
        <button onClick={() => setExplodeRatio(1.0)} style={{ background: explodeRatio === 1.0 ? "#00E5FF" : "rgba(0, 229, 255, 0.1)", color: explodeRatio === 1.0 ? "#000" : "#00E5FF", border: "1px solid #00E5FF", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, cursor: "pointer" }}>100%</button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={explodeRatio}
          onChange={(e) => setExplodeRatio(parseFloat(e.target.value))}
          style={{ width: 80, accentColor: "#00E5FF", cursor: "pointer" }}
        />

        <button
          onClick={takeSnapshot}
          style={{ background: "rgba(0, 230, 118, 0.2)", color: "#00E676", border: "1px solid #00E676", padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: "pointer" }}
          title="Export high-resolution PNG screenshot of 3D CAD view"
        >
          📷 Snapshot (PNG)
        </button>
      </div>

      {/* Clickable 3D Component Callouts */}
      <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[
          { key: "socket", label: "🛡️ Socket Liner", col: "#00E5FF" },
          { key: "forearm", label: "🦴 Forearm Monocoque", col: "#CBD5E1" },
          { key: "palm", label: "🧠 Palm Syntiant PCB", col: "#00E676" },
          { key: "actuators", label: "⚙️ Maxon Motors", col: "#FFB300" },
          { key: "tendons", label: "🧵 Dyneema Tendons", col: "#E040FB" },
        ].map((comp) => (
          <button
            key={comp.key}
            onClick={() => setSelectedComponent(selectedComponent === comp.key ? null : comp.key)}
            style={{
              background: selectedComponent === comp.key ? "rgba(0, 229, 255, 0.25)" : "rgba(3, 8, 18, 0.85)",
              color: comp.col,
              border: `1px solid ${selectedComponent === comp.key ? "#00E5FF" : "rgba(23, 42, 69, 0.8)"}`,
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {comp.label}
          </button>
        ))}
      </div>

      {/* Component Details Card Overlay with Cross-Linked Documentation */}
      {activeDetail && (
        <div style={{ position: "absolute", bottom: 48, left: 12, right: 12, background: "rgba(10, 20, 36, 0.95)", border: "1px solid #00E5FF", borderRadius: 8, padding: 12, boxShadow: "0 0 20px rgba(0, 229, 255, 0.3)", backdropFilter: "blur(12px)", zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: "#FFFFFF" }}>{activeDetail.title}</span>
            <span style={{ background: "rgba(0, 229, 255, 0.2)", color: "#00E5FF", border: "1px solid #00E5FF", fontSize: 9, padding: "1px 6px", borderRadius: 4, fontWeight: 800 }}>
              {activeDetail.badge}
            </span>
          </div>
          <div style={{ fontSize: 10, color: "#B0C4DE", marginBottom: 2 }}><strong>Material:</strong> {activeDetail.material}</div>
          <div style={{ fontSize: 10, color: "#B0C4DE", marginBottom: 2 }}><strong>Function:</strong> {activeDetail.function}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748B", marginTop: 4 }}>
            <span><strong>Mass:</strong> {activeDetail.weight}</span>
            <span><strong>Spec Ref:</strong> <span style={{ color: "#00E5FF", textDecoration: "underline" }}>{activeDetail.ref}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
