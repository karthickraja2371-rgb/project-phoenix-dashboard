import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Arm3DViewer({ fingers = [0, 0, 0, 0, 0], elbow = 45, wrist = 12, color = "#00E5FF" }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const armGroupRef = useRef(null);
  const forearmGroupRef = useRef(null);
  const wristGroupRef = useRef(null);
  const fingerJointsRef = useRef([]); // Stores { proxGroup, distGroup } for each of the 5 fingers
  const elbowMeshRef = useRef(null);

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
      color: 0xE2E8F0, // Platinum Silver
      metalness: 0.9,
      roughness: 0.15,
    });

    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x00E5FF, // High-visibility Cyan Joint Ring
      emissive: 0x004466,
      metalness: 0.95,
      roughness: 0.1,
    });

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x1E293B, // Carbon Fiber Finger Phalanx
      metalness: 0.8,
      roughness: 0.2,
    });

    const fingerTipMat = new THREE.MeshStandardMaterial({
      color: 0x00E676, // Neon Green Tactile Fingertips
      emissive: 0x005522,
      metalness: 0.9,
      roughness: 0.1,
    });

    // 1. Shoulder Socket (Top)
    const socketGeo = new THREE.CylinderGeometry(3.8, 3.0, 3.5, 24);
    const socketMesh = new THREE.Mesh(socketGeo, titaniumMat);
    socketMesh.position.y = 8;
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
    // Positions for Thumb, Index, Middle, Ring, Little
    const fingerConfigs = [
      { name: "Thumb",  x: -2.3, y: -1.2, z:  0.8, rotZ:  0.6, rotY:  0.5, len: 2.5 }, // Anatomically Opposed Thumb
      { name: "Index",  x: -1.5, y: -2.3, z:  0.0, rotZ:  0.0, rotY:  0.0, len: 3.2 },
      { name: "Middle", x: -0.5, y: -2.3, z:  0.0, rotZ:  0.0, rotY:  0.0, len: 3.6 },
      { name: "Ring",   x:  0.5, y: -2.3, z:  0.0, rotZ:  0.0, rotY:  0.0, len: 3.1 },
      { name: "Little", x:  1.5, y: -2.3, z:  0.0, rotZ: -0.1, rotY:  0.0, len: 2.5 },
    ];

    fingerConfigs.forEach((cfg) => {
      const totalLen = cfg.len;
      const proxLen = totalLen * 0.55;
      const distLen = totalLen * 0.45;

      // Knuckle Joint Pivot Group (attached to wrist/palm group)
      const proxGroup = new THREE.Group();
      proxGroup.position.set(cfg.x, cfg.y, cfg.z);
      proxGroup.rotation.z = cfg.rotZ;
      proxGroup.rotation.y = cfg.rotY;

      // Knuckle sphere
      const knuckleGeo = new THREE.SphereGeometry(0.4, 14, 14);
      const knuckleMesh = new THREE.Mesh(knuckleGeo, jointMat);
      proxGroup.add(knuckleMesh);

      // Proximal Phalanx Mesh (extends downwards)
      const proxMeshGeo = new THREE.CylinderGeometry(0.36, 0.3, proxLen, 16);
      const proxMesh = new THREE.Mesh(proxMeshGeo, carbonMat);
      proxMesh.position.y = -proxLen / 2;
      proxGroup.add(proxMesh);

      // Interphalangeal Joint Pivot Group
      const distGroup = new THREE.Group();
      distGroup.position.set(0, -proxLen, 0);

      const ipJointGeo = new THREE.SphereGeometry(0.32, 14, 14);
      const ipJointMesh = new THREE.Mesh(ipJointGeo, jointMat);
      distGroup.add(ipJointMesh);

      // Distal Phalanx Fingertip Mesh
      const distMeshGeo = new THREE.CylinderGeometry(0.28, 0.2, distLen, 16);
      const distMesh = new THREE.Mesh(distMeshGeo, fingerTipMat);
      distMesh.position.y = -distLen / 2;
      distGroup.add(distMesh);

      proxGroup.add(distGroup);
      wristGroup.add(proxGroup);

      fingerJoints.push({ proxGroup, distGroup });
    });

    fingerJointsRef.current = fingerJoints;

    // ── Animation Loop (Continuous Rotation + Hand Articulation Demo) ──────
    let reqId;
    let t = 0;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      t += 0.015;

      if (mainGroup) {
        mainGroup.rotation.y += 0.01; // Continuous 360° rotation
      }

      // Dynamic demo wrist tilting for extra clear movement visibility
      if (wristGroupRef.current) {
        wristGroupRef.current.rotation.z = Math.sin(t * 0.8) * 0.15;
        wristGroupRef.current.rotation.x = Math.cos(t * 0.6) * 0.12;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize Observer ─────────────────────────────────────────────────────────
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
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Dynamically update joints & realistic finger flexions (Kinematic Curling)
  useEffect(() => {
    fingerJointsRef.current.forEach((joints, i) => {
      if (!joints || !joints.proxGroup || !joints.distGroup) return;
      const flexRatio = (fingers[i] || 0) / 100;
      
      // Knuckle curling angle (0° to 90°)
      joints.proxGroup.rotation.x = flexRatio * 1.5;
      
      // Fingertip curling angle (0° to 80° relative to proximal segment)
      joints.distGroup.rotation.x = flexRatio * 1.3;
    });

    if (forearmGroupRef.current) {
      forearmGroupRef.current.rotation.z = (elbow / 140) * 0.5;
    }
    if (wristGroupRef.current) {
      wristGroupRef.current.rotation.y = (wrist / 90) * 0.8;
    }
  }, [fingers, elbow, wrist]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '450px',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #00E5FF',
        background: '#020712',
        boxShadow: '0 0 35px rgba(0, 229, 255, 0.25)',
      }}
    />
  );
}
