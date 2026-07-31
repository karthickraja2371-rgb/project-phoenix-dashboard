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
  lowBattery
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

      {/* Navigation Tabs */}
      <div style={{ display: "flex", background: P.bg3, padding: 3, borderRadius: 8, border: `1px solid ${P.bd}` }}>
        <button
          onClick={() => setViewMode("dashboard")}
          style={{
            background: viewMode === "dashboard" ? P.cyan : "transparent",
            color: viewMode === "dashboard" ? "#000" : P.t2,
            border: "none", padding: "6px 14px", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer"
          }}
        >
          🎛️ Digital Twin Dashboard
        </button>
        <button
          onClick={() => setViewMode("cad")}
          style={{
            background: viewMode === "cad" ? P.cyan : "transparent",
            color: viewMode === "cad" ? "#000" : P.t2,
            border: "none", padding: "6px 14px", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer"
          }}
        >
          🎨 Tripo3D Model (#42691fd0)
        </button>
        <button
          onClick={() => setViewMode("video")}
          style={{
            background: viewMode === "video" ? P.cyan : "transparent",
            color: viewMode === "video" ? "#000" : P.t2,
            border: "none", padding: "6px 14px", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer"
          }}
        >
          🎬 3D Animation Storyboard
        </button>
      </div>

      {/* Status Badges & Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          {isVoiceListening ? "🎙️ Voice Active ('OPEN', 'GRIP', 'LOCK')" : "🎤 Voice Assistant (Claim 7)"}
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
          {isAudioTelemetryActive ? "🔊 Speech Alarms ON" : "🔇 Mute Speech"}
        </button>

        {/* AI Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          style={{
            background: "linear-gradient(135deg, #E040FB, #7C4DFF)",
            color: "#FFF", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
          }}
        >
          🤖 AI Assistant
        </button>

        {/* System Warnings */}
        {pressureSpike && (
          <span style={{ background: "rgba(255, 61, 0, 0.2)", color: P.red, border: `1px solid ${P.red}`, padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
            🚨 20.0 kPa LOCK ENGAGED
          </span>
        )}
        {sensorFailure && (
          <span style={{ background: "rgba(255, 179, 0, 0.2)", color: P.amber, border: `1px solid ${P.amber}`, padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
            ⚠️ EMG CH3 FAIL
          </span>
        )}
        {lowBattery && (
          <span style={{ background: "rgba(255, 179, 0, 0.2)", color: P.amber, border: `1px solid ${P.amber}`, padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
            🔋 LOW BATT 18.2V
          </span>
        )}
      </div>
    </header>
  );
}
