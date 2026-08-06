import React from 'react';

const P = {
  bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  red: "#FF3D00", blue: "#2979FF", purple: "#E040FB",
};

export default function HeaderNavbar({
  viewMode,
  setViewMode,
  isVoiceListening,
  toggleVoiceListening,
  isAudioTelemetryActive,
  setIsAudioTelemetryActive,
  setIsChatOpen,
  pressureSpike,
  sensorFailure,
  lowBattery,
  viewModeType = "engineer",
  setViewModeType,
  exportCSV,
  onConnectWebSerial,
  isSerialConnected = false
}) {
  return (
    <header style={{ background: P.bg2, borderBottom: `1px solid ${P.bd}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ background: "linear-gradient(135deg, #00E5FF, #2979FF)", width: 38, height: 38, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: 20 }}>
          🦅
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: P.t1, letterSpacing: 1 }}>PROJECT PHOENIX</span>
            <span style={{ background: "rgba(0, 229, 255, 0.15)", color: P.cyan, border: `1px solid ${P.cyan}`, fontSize: 10, padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
              PATENT NO. 202641077314
            </span>
          </div>
          <div style={{ fontSize: 11, color: P.t3 }}>
            Transhumeral Bionic Arm · Syntiant NDP120 Edge AI · TI ADS1299 AFE · 20.0 kPa Safety Interlock
          </div>
        </div>
      </div>

      {/* 8-LED Subsystem Hardware Health Status Matrix */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: P.bg3, padding: "4px 10px", borderRadius: 6, border: `1px solid ${P.bd}` }}>
        <span style={{ fontSize: 10, color: P.t3, fontWeight: 700 }}>SUBSYSTEMS:</span>
        {["MCU", "CAN", "NDP", "FSR", "SHT", "TENS", "CAM", "BAT"].map((sys) => (
          <span key={sys} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: P.t2, fontWeight: 700 }} title={`${sys} Hardware Normal`}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.green, boxShadow: `0 0 6px ${P.green}` }}></span>
            {sys}
          </span>
        ))}
      </div>

      {/* Navigation Tabs & Clinician/Engineer Mode Switch */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", background: P.bg3, padding: 3, borderRadius: 8, border: `1px solid ${P.bd}` }}>
          <button
            onClick={() => setViewMode("dashboard")}
            style={{
              background: viewMode === "dashboard" ? P.cyan : "transparent",
              color: viewMode === "dashboard" ? "#000" : P.t2,
              border: "none", padding: "6px 12px", borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: "pointer"
            }}
          >
            🎛️ Digital Twin
          </button>
          <button
            onClick={() => setViewMode("cad")}
            style={{
              background: viewMode === "cad" ? P.cyan : "transparent",
              color: viewMode === "cad" ? "#000" : P.t2,
              border: "none", padding: "6px 12px", borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: "pointer"
            }}
          >
            🎨 3D Model
          </button>
          <button
            onClick={() => setViewMode("video")}
            style={{
              background: viewMode === "video" ? P.cyan : "transparent",
              color: viewMode === "video" ? "#000" : P.t2,
              border: "none", padding: "6px 12px", borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: "pointer"
            }}
          >
            🎬 Storyboard
          </button>
        </div>

        {/* Clinician vs Engineer View Mode Toggle */}
        <div style={{ display: "flex", background: P.bg3, padding: 3, borderRadius: 8, border: `1px solid ${P.bd}` }}>
          <button
            onClick={() => setViewModeType && setViewModeType("clinician")}
            style={{
              background: viewModeType === "clinician" ? P.green : "transparent",
              color: viewModeType === "clinician" ? "#000" : P.t2,
              border: "none", padding: "6px 10px", borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: "pointer"
            }}
            title="Simplified view for prosthetists & patient fitting"
          >
            🩺 Clinician
          </button>
          <button
            onClick={() => setViewModeType && setViewModeType("engineer")}
            style={{
              background: viewModeType === "engineer" ? P.blue : "transparent",
              color: viewModeType === "engineer" ? "#FFF" : P.t2,
              border: "none", padding: "6px 10px", borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: "pointer"
            }}
            title="Detailed multi-channel telemetry view for engineers"
          >
            ⚡ Engineer
          </button>
        </div>
      </div>

      {/* Status Badges & Action Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* USB WebSerial Connect Button */}
        <button
          onClick={onConnectWebSerial}
          style={{
            background: isSerialConnected ? "rgba(0, 230, 118, 0.2)" : "rgba(255, 179, 0, 0.15)",
            color: isSerialConnected ? P.green : P.amber,
            border: `1px solid ${isSerialConnected ? P.green : P.amber}`,
            padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer"
          }}
          title="Connect live hardware (Arduino/STM32/Syntiant) over USB serial port"
        >
          {isSerialConnected ? "🔌 USB Serial Live" : "🔌 USB WebSerial"}
        </button>

        {/* CSV Export Button */}
        {exportCSV && (
          <button
            onClick={exportCSV}
            style={{
              background: "rgba(0, 229, 255, 0.1)",
              color: P.cyan,
              border: `1px solid ${P.cyan}`,
              padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer"
            }}
            title="Download real-time telemetry stream as CSV file"
          >
            📥 Export CSV
          </button>
        )}

        {/* Voice Command Button (Claim 7) */}
        <button
          onClick={toggleVoiceListening}
          style={{
            background: isVoiceListening ? "rgba(255, 61, 0, 0.2)" : "rgba(0, 229, 255, 0.1)",
            color: isVoiceListening ? P.red : P.cyan,
            border: `1px solid ${isVoiceListening ? P.red : P.cyan}`,
            padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
          }}
        >
          {isVoiceListening ? "🎙️ Voice Active" : "🎤 Voice (Claim 7)"}
        </button>

        {/* Audio Telemetry Toggle */}
        <button
          onClick={() => setIsAudioTelemetryActive(!isAudioTelemetryActive)}
          style={{
            background: isAudioTelemetryActive ? "rgba(0, 230, 118, 0.15)" : "rgba(100, 116, 139, 0.2)",
            color: isAudioTelemetryActive ? P.green : P.t3,
            border: `1px solid ${isAudioTelemetryActive ? P.green : P.bd}`,
            padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer"
          }}
        >
          {isAudioTelemetryActive ? "🔊 Speech ON" : "🔇 Mute"}
        </button>

        {/* AI Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          style={{
            background: "linear-gradient(135deg, #E040FB, #7C4DFF)",
            color: "#FFF", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
          }}
        >
          🤖 AI Chat
        </button>

        {/* System Warnings */}
        {pressureSpike && (
          <span style={{ background: "rgba(255, 61, 0, 0.2)", color: P.red, border: `1px solid ${P.red}`, padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
            🚨 20.0 kPa LOCK
          </span>
        )}
        {sensorFailure && (
          <span style={{ background: "rgba(255, 179, 0, 0.2)", color: P.amber, border: `1px solid ${P.amber}`, padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
            ⚠️ EMG CH3 FAIL
          </span>
        )}
        {lowBattery && (
          <span style={{ background: "rgba(255, 179, 0, 0.2)", color: P.amber, border: `1px solid ${P.amber}`, padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
            🔋 LOW BATT
          </span>
        )}
      </div>
    </header>
  );
}
