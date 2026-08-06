import React from 'react';
import Arm3DViewer from './Arm3DViewer';
import GestureSelector from './GestureSelector';
import TelemetryPanel from './TelemetryPanel';
import TelemetryLog from './TelemetryLog';

const P = {
  bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  blue: "#2979FF",
};

export default function Dashboard({
  GESTURES,
  currentGestureIdx,
  setManualGestureIdx,
  isAutoCycle,
  setIsAutoCycle,
  audioTelemetry,
  d,
  cortisolOverride,
  setCortisolOverride,
  pressureSpike,
  setPressureSpike,
  sensorFailure,
  setSensorFailure,
  lowBattery,
  setLowBattery,
  isDiagnosticRunning,
  diagnosticProgress,
  runFullSystemDiagnostics,
  telemetryLogs,
  logContainerRef
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
      {/* Left Column: 3D Canvas, Gesture Library & Telemetry Bus Log */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* 3D WebGL Digital Twin Viewport */}
        <div style={{ background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 10, padding: 14, minHeight: 380, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: P.t1, letterSpacing: 0.5 }}>
              🤖 THREE.JS REAL-TIME 3D DIGITAL TWIN KINEMATIC SIMULATION
            </span>
            <span style={{ fontSize: 10, color: P.green, background: "rgba(0, 230, 118, 0.15)", padding: "2px 8px", borderRadius: 4, border: `1px solid ${P.green}`, fontWeight: 700 }}>
              60 FPS REAL-TIME
            </span>
          </div>

          <div style={{ width: "100%", height: 320, borderRadius: 8, overflow: "hidden", background: "#020610", border: `1px solid ${P.bd}` }}>
            {/* FIX: was passing gesture/elbowAngle/wristAngle/pressureSpike — Arm3DViewer
                only accepts fingers/elbow/wrist/color. Fixed to pass the correct props. */}
            <Arm3DViewer
              fingers={GESTURES[currentGestureIdx].fingers}
              elbow={d.elbow}
              wrist={d.wrist}
              color={GESTURES[currentGestureIdx].color}
            />
          </div>
        </div>

        {/* 16 Gesture Grid */}
        <GestureSelector
          GESTURES={GESTURES}
          activeGestureIdx={currentGestureIdx}
          setManualGestureIdx={setManualGestureIdx}
          isAutoCycle={isAutoCycle}
          setIsAutoCycle={setIsAutoCycle}
          audioTelemetry={audioTelemetry}
        />

        {/* Telemetry Bus Log Terminal */}
        <TelemetryLog telemetryLogs={telemetryLogs} logContainerRef={logContainerRef} />
      </div>

      {/* Right Column: Real-time Telemetry Panel & Fault Controls */}
      <TelemetryPanel
        d={d}
        currentGesture={GESTURES[currentGestureIdx]}
        cortisolOverride={cortisolOverride}
        setCortisolOverride={setCortisolOverride}
        pressureSpike={pressureSpike}
        setPressureSpike={setPressureSpike}
        sensorFailure={sensorFailure}
        setSensorFailure={setSensorFailure}
        lowBattery={lowBattery}
        setLowBattery={setLowBattery}
        isDiagnosticRunning={isDiagnosticRunning}
        diagnosticProgress={diagnosticProgress}
        runFullSystemDiagnostics={runFullSystemDiagnostics}
        audioTelemetry={audioTelemetry}
      />
    </div>
  );
}
