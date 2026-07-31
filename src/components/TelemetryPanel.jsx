import React from 'react';

const P = {
  bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  red: "#FF3D00", blue: "#2979FF", purple: "#E040FB",
};

function GaugeBar({ label, value, max, warn, danger, unit = "", small = false }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const col = value >= danger ? P.red : value >= warn ? P.amber : P.green;
  return (
    <div style={{ marginBottom: small ? 6 : 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: small ? 10 : 11, marginBottom: 3 }}>
        <span style={{ color: P.t2 }}>{label}</span>
        <span style={{ color: col, fontWeight: 700 }}>
          {value.toFixed(1)}{unit} / {max}{unit}
        </span>
      </div>
      <div style={{ height: small ? 6 : 8, background: P.bg3, borderRadius: 4, overflow: "hidden", position: "relative", border: `1px solid ${P.bd}` }}>
        {warn && <div style={{ position: "absolute", top: 0, left: `${(warn / max) * 100}%`, width: 1, height: "100%", background: P.amber, opacity: 0.7 }} />}
        {danger && <div style={{ position: "absolute", top: 0, left: `${(danger / max) * 100}%`, width: 1, height: "100%", background: P.red, opacity: 0.8 }} />}
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${col}aa, ${col})`, borderRadius: 4, transition: "width 0.2s ease" }} />
      </div>
    </div>
  );
}

function SVGWaveform({ data, color, height = 36 }) {
  if (!data || data.length === 0) return null;
  const width = 280;
  const maxVal = 1.2;
  const EMG_LEN = 80;
  const points = data
    .map((val, idx) => {
      const x = (idx / (EMG_LEN - 1)) * width;
      const y = height - (val / maxVal) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <polyline fill="none" stroke={color} strokeWidth="1.8" points={points} />
    </svg>
  );
}

export default function TelemetryPanel({
  d,
  currentGesture,
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
  audioTelemetry
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Syntiant NDP120 & Gesture Card */}
      <div style={{ background: P.bg2, border: `1px solid ${P.cyan}`, borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: P.cyan, letterSpacing: 1, marginBottom: 4 }}>
          OFFLINE EDGE AI NEURAL CLASSIFIER (NDP120)
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: currentGesture.color }}>{currentGesture.name}</span>
          <span style={{ background: "rgba(0, 230, 118, 0.15)", color: P.green, border: `1px solid ${P.green}`, fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 800 }}>
            {(d.confidence * 100).toFixed(1)}% CONFIDENCE
          </span>
        </div>
        <div style={{ fontSize: 11, color: P.t2, marginBottom: 8 }}>{currentGesture.desc}</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: P.bg3, padding: 8, borderRadius: 6 }}>
          <div>
            <div style={{ fontSize: 9, color: P.t3 }}>INFERENCE LATENCY</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: P.cyan }}>{d.latency} ms <span style={{ fontSize: 9, color: P.t3 }}>(Simulated)</span></div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: P.t3 }}>POWER DRAW</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: P.green }}>4.8 mW <span style={{ fontSize: 9, color: P.t3 }}>(Modeled)</span></div>
          </div>
        </div>
      </div>

      {/* Safety Interlocks & Biosensors */}
      <div style={{ background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: P.t1, marginBottom: 10 }}>
          🛡️ SKIN GRAFT SAFETY INTERLOCKS & BIOSENSORS
        </div>

        <GaugeBar label="Peak Socket Pressure (8-FSR Array)" value={d.pressure} max={30} warn={15} danger={20} unit=" kPa" />
        <GaugeBar label="Sweat Cortisol Stress Sensor" value={d.cortisol} max={1.0} warn={0.5} danger={0.6} unit=" ug/dL" />
        <GaugeBar label="Socket Microclimate Temperature" value={d.temperature} max={45} warn={36} danger={38} unit="°C" small />
        <GaugeBar label="Socket Microclimate Humidity" value={d.humidity} max={100} warn={75} danger={80} unit="%" small />

        <div style={{ marginTop: 8, background: P.bg3, padding: 8, borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: P.t3 }}>GRIP TORQUE CEILING</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: d.gripCeiling < 100 ? P.amber : P.green }}>
              {d.gripCeiling}% MAXIMUM
            </div>
          </div>
          <span style={{ fontSize: 10, color: d.gripCeiling < 100 ? P.amber : P.t3 }}>
            {d.gripCeiling < 100 ? "⚠️ Cortisol Cap Active" : "Normal Torque"}
          </span>
        </div>
      </div>

      {/* 2000Hz sEMG Waveforms */}
      <div style={{ background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 10, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: P.t1 }}>⚡ 2000Hz sEMG AFE WAVEFORMS (TI ADS1299)</span>
          <span style={{ fontSize: 9, color: P.cyan }}>CH1-CH4 24-BIT</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: P.bg3, padding: 6, borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: P.t3 }}>CH1: BICEPS BRACHII</div>
            <SVGWaveform data={d.emg[0]} color={P.cyan} />
          </div>
          <div style={{ background: P.bg3, padding: 6, borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: P.t3 }}>CH2: TRICEPS BRACHII</div>
            <SVGWaveform data={d.emg[1]} color={P.green} />
          </div>
          <div style={{ background: P.bg3, padding: 6, borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: P.t3 }}>CH3: BRACHIALIS {sensorFailure && "(FAIL)"}</div>
            <SVGWaveform data={d.emg[2]} color={sensorFailure ? P.red : P.amber} />
          </div>
          <div style={{ background: P.bg3, padding: 6, borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: P.t3 }}>CH4: ANCONEUS</div>
            <SVGWaveform data={d.emg[3]} color={P.purple} />
          </div>
        </div>
      </div>

      {/* Fault Injection Controls */}
      <div style={{ background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: P.t1, marginBottom: 8 }}>
          🧪 HIL SIMULATION FAULT INJECTION CONTROLS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <button
            onClick={() => {
              const nextP = !pressureSpike;
              setPressureSpike(nextP);
              if (nextP && audioTelemetry && audioTelemetry.enabled && typeof audioTelemetry.speak === 'function') {
                audioTelemetry.speak("Warning: Socket pressure at 24.5 kilopascals. Passive lock engaged to protect skin graft.", true);
              }
            }}
            style={{
              background: pressureSpike ? P.red : P.bg3,
              color: pressureSpike ? "#FFF" : P.t2,
              border: `1px solid ${pressureSpike ? P.red : P.bd}`,
              padding: 6, borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer"
            }}
          >
            {pressureSpike ? "🚨 Clear 20.0 kPa Lock" : "💥 Inject 24.5 kPa Spike"}
          </button>

          <button
            onClick={() => {
              const nextCort = cortisolOverride > 0.5 ? 0.28 : 0.75;
              setCortisolOverride(nextCort);
              if (nextCort > 0.5 && audioTelemetry && audioTelemetry.enabled && typeof audioTelemetry.speak === 'function') {
                audioTelemetry.speak("Sweat cortisol detected above threshold. Grip torque capped to 80 percent.", false);
              }
            }}
            style={{
              background: cortisolOverride > 0.5 ? P.amber : P.bg3,
              color: cortisolOverride > 0.5 ? "#000" : P.t2,
              border: `1px solid ${cortisolOverride > 0.5 ? P.amber : P.bd}`,
              padding: 6, borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer"
            }}
          >
            {cortisolOverride > 0.5 ? "🧪 Reset Cortisol 0.28" : "🧪 Inject Cortisol >0.60"}
          </button>

          <button
            onClick={() => setSensorFailure(!sensorFailure)}
            style={{
              background: sensorFailure ? P.amber : P.bg3,
              color: sensorFailure ? "#000" : P.t2,
              border: `1px solid ${sensorFailure ? P.amber : P.bd}`,
              padding: 6, borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer"
            }}
          >
            {sensorFailure ? "🔌 Reconnect CH3 Sensor" : "🔌 Inject CH3 Sensor Drop"}
          </button>

          <button
            onClick={() => setLowBattery(!lowBattery)}
            style={{
              background: lowBattery ? P.amber : P.bg3,
              color: lowBattery ? "#000" : P.t2,
              border: `1px solid ${lowBattery ? P.amber : P.bd}`,
              padding: 6, borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer"
            }}
          >
            {lowBattery ? "🔋 Restore Voltage 22.4V" : "🔋 Drop Battery <18.5V"}
          </button>
        </div>

        <button
          onClick={runFullSystemDiagnostics}
          disabled={isDiagnosticRunning}
          style={{
            width: "100%", marginTop: 10, background: "linear-gradient(135deg, #00E5FF, #2979FF)",
            color: "#000", border: "none", padding: 8, borderRadius: 6, fontWeight: 800, fontSize: 11, cursor: isDiagnosticRunning ? "not-allowed" : "pointer"
          }}
        >
          {isDiagnosticRunning ? `⏳ Running Diagnostics (${diagnosticProgress}%)...` : "🔍 Run Full 13-Claim HIL Diagnostics Test"}
        </button>
      </div>
    </div>
  );
}
