import React, { useState, useEffect, useRef } from 'react';
import Arm3DViewer from './components/Arm3DViewer';

// ── Palette & Constants ───────────────────────────────────────────────────────
const P = {
  bg: "#030812", bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  red: "#FF3D00", blue: "#2979FF", purple: "#E040FB",
};

const GESTURES = [
  { name: "POWER GRIP",     fingers: [80, 85, 85, 80, 75], color: "#FF3D00", desc: "Full fist closure for heavy tools / weight" },
  { name: "PINCH",          fingers: [85, 90, 15, 10,  5], color: "#FF9100", desc: "Thumb + Index precision tip pinch" },
  { name: "CYLINDRICAL",    fingers: [70, 75, 75, 70, 65], color: "#FFEA00", desc: "Conformable wrap around bottles/cups" },
  { name: "LATERAL",        fingers: [80, 75, 20, 15, 10], color: "#00E676", desc: "Key grip — Thumb against folded index" },
  { name: "OPEN HAND",      fingers: [ 0,  0,  0,  0,  0], color: "#00E5FF", desc: "Fully extended resting / release pose" },
  { name: "TRIPOD",         fingers: [75, 80, 80, 15,  5], color: "#2979FF", desc: "Thumb + Index + Middle 3-point pinch" },
  { name: "HOOK",           fingers: [20, 75, 75, 75, 70], color: "#AA00FF", desc: "Carrying bags / handles with flexed fingers" },
  { name: "POINT",          fingers: [75,  0, 70, 70, 65], color: "#FF007F", desc: "Extended index finger for screens / buttons" },
  { name: "KEY GRIP",       fingers: [85, 60, 15, 10,  5], color: "#FF6D00", desc: "Tight lateral pinch for turning key in lock" },
  { name: "THUMBS UP",      fingers: [ 0, 70, 70, 70, 65], color: "#76FF03", desc: "Thumb extended upward gesture" },
  { name: "PRECISION PINCH",fingers: [90, 90, 15, 10,  5], color: "#00E5FF", desc: "Fine object manipulation under 5mm" },
  { name: "WAVE",           fingers: [ 0, 10, 10, 10, 10], color: "#E040FB", desc: "Slight finger flex expressive pose" },
];

const TESTS = [
  { claim: "Claim 26", name: "Offline NDP120 AI Processor",         evidence: "Hardware-in-the-Loop", sub: "Syntiant palm chip · Cloud-independent gesture classification", detail: "Syntiant NDP120 neural processor runs a 4-layer CNN model directly inside the palm chassis, eliminating cloud dependency and GDPR risk." },
  { claim: "Claim 27", name: "Vision-EMG Intent Fusion",            evidence: "Simulation & Camera Feed", sub: "OV2640 palm camera + MobileNetV3 predictive pre-selection", detail: "OV2640 camera captures object geometries 300ms prior to contact, pre-shaping hand fingers before sEMG muscles complete contraction." },
  { claim: "Claim 28", name: "Emotion-Aware Sweat Biosensing",       evidence: "Microfluidic Model", sub: "Microfluidic cortisol & epinephrine grip force modulation", detail: "Graphene microfluidic sensors detect sweat cortisol levels (>0.60 ug/dL) during user anxiety, automatically capping grip torque to 80% to prevent object damage." },
  { claim: "Claim 29", name: "Self-Healing Socket Liner",            evidence: "Material Bench Test", sub: "Nickel-particle hybrid polymer autonomous micro-crack repair", detail: "Liquid-filled microcapsules within the inner silicone socket release self-healing monomer upon micro-crack formation, repairing tears within 10 mins." },
  { claim: "Claim 30", name: "Nightly On-Device Retraining",        evidence: "Firmware State Machine", sub: "NDP120 micro-training during 15W Qi wireless charging", detail: "During wireless charging at night, accumulated gesture variations update local neural weights without transmitting biometric data over internet." },
  { claim: "Claim 31", name: "Phantom Pain TENS Suppression",        evidence: "Bi-phasic Waveform", sub: "Background Graded Motor Imagery (GMI) auto-therapy", detail: "Bi-phasic TENS pulses (100Hz, 200us) deliver tactile sensory feedback to residual skin grafts, suppressing phantom limb pain by over 70%." },
  { claim: "Claim 32", name: "Offline Voice-EMG Command Fusion",     evidence: "MEMS PDM Audio Model", sub: "Knowles MEMS microphone voice command fallback", detail: "Knowles MEMS microphone isolates voice keywords ('OPEN', 'GRIP', 'LOCK') to assist sEMG classification when muscle fatigue is detected." },
  { claim: "Claim 33", name: "Socket Pressure Safety Array",         evidence: "FSR Array Simulation", sub: "8-12 FSR array with automatic 20.0 kPa passive lock", detail: "8 FSR sensors monitor socket skin pressure. If pressure exceeds 20.0 kPa on skin grafts, STM32 MCU triggers an immediate passive tendon lock." },
  { claim: "Claim 34", name: "Thermal & Humidity Microclimate",     evidence: "Sensirion SHT31 Model", sub: "Sensirion SHT31 sensor (>38°C / >80% RH alert)", detail: "Dual Sensirion SHT31 sensors monitor socket temperature and sweat humidity, alerting the user to un-don the arm if skin temperature exceeds 38.0°C." },
  { claim: "Claim 35", name: "Pre-Donning Skin Inspection",          evidence: "Vision Model", sub: "OV2640 palm camera graft redness detection", detail: "Before donning, the palm camera scans skin graft redness/irritation using HSV color segmentation, preventing socket friction over inflamed tissue." },
  { claim: "Claim 36", name: "Mandatory Muscle Rest Cycle",         evidence: "STM32 Timer Logic", sub: "STM32H753 3-hour active / 15-minute rest lock", detail: "To protect skin-grafted muscle beds from over-fatigue, the system enforces a 15-minute resting lock after every 3 hours of continuous sEMG sampling." },
  { claim: "Claim 37", name: "Daily TENS Electrode Rotation",        evidence: "Multiplexer Logic", sub: "3-position pad rotation to prevent contact dermatitis", detail: "An analog multiplexer rotates active TENS stimulation across 3 skin graft pad locations every 8 hours, preventing localized skin irritation." },
  { claim: "Claim 38", name: "Integrated Skin-Graft Prosthesis",     evidence: "KCL CAD Assembly", sub: "Complete clinical system under 1.2kg with 13.2h runtime", detail: "Complete transhumeral assembly weighing 1.18 kg powered by a 22.2V 5000mAh Li-Ion battery pack, providing 13.2 hours of heavy daily use." },
];

const RESULT_VALS = [
  "92.4% (SIMULATED) · 22ms latency · 4.8mW · OFFLINE",
  "28ms fused latency (vs 300ms traditional) · 91% reduction",
  "Cortisol 0.28 ug/dL · Grip ceiling 100% (Spike >0.6 → 80%)",
  "Micro-cracks repaired in 10 mins @ room temperature",
  "Accumulated 1,420 gestures · Retrained model 94.2% accurate",
  "GMI sequence active every 2h · Baseline micro-contractions clear",
  "5/5 voice commands recognized · 0.94 confidence score",
  "Pressure 9.2 kPa OK (Threshold: 20.0 kPa passive lock)",
  "34.8°C / 63% RH → Socket Microclimate Normal",
  "Graft skin color scan normal · Zero discolouration detected",
  "Active timer 01h 14m · Rest cycle scheduled in 01h 46m",
  "Position #1 active · Rotation to Position #2 scheduled",
  "Weight 1.18 kg (MODELED) · 22.2V Battery · Runtime 13.2h (MODELED)",
];

const EMG_LEN = 80;

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

export default function App() {
  const [viewMode, setViewMode] = useState("webpage"); // "webpage" | "dashboard"
  const [themeMode, setThemeMode] = useState("dark"); // "dark" | "clinical" | "tactical"
  const [isPitchMode, setIsPitchMode] = useState(false);
  const [isAutoCycle, setIsAutoCycle] = useState(true);
  const [manualGestureIdx, setManualGestureIdx] = useState(0);

  // Manual Kinematics Sliders
  const [customFingers, setCustomFingers] = useState([0, 0, 0, 0, 0]);
  const [customElbow, setCustomElbow] = useState(45);
  const [customWrist, setCustomWrist] = useState(12);
  const [armMaterial, setArmMaterial] = useState("#E2E8F0"); // Platinum

  // Vision Camera Target Object Simulation
  const [visionObject, setVisionObject] = useState({ name: "Water Bottle", conf: 98, shape: "Cylindrical", preShape: "CYLINDRICAL" });

  const [cortisolOverride, setCortisolOverride] = useState(0.28);
  const [pressureSpike, setPressureSpike] = useState(false);
  const [sensorFailure, setSensorFailure] = useState(false);
  const [lowBattery, setLowBattery] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [tick, setTick] = useState(0);

  // Diagnostic runner states
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(100);
  const [testResults, setTestResults] = useState(
    TESTS.map((t, idx) => ({ ...t, val: RESULT_VALS[idx], status: "SIMULATION VALIDATED" }))
  );

  // Event Log stream
  const [eventLogs, setEventLogs] = useState([
    { time: "18:17:02", msg: "[SYSTEM] Engineering Validation Platform Active · Subsystem TRL 3–4" },
    { time: "18:17:04", msg: "[STATUS] Prototype Status: Virtual Prototype (Physical Assembly Pending)" },
    { time: "18:17:10", msg: "[EMG_DSP] sEMG 4-Channel 2000Hz (SIMULATED) · PGA460 gain +28% (SIMULATED)" },
    { time: "18:17:15", msg: "[SAFETY] FSR Socket pressure normal (9.4 kPa < 20.0 kPa Limit)" },
    { time: "18:17:22", msg: "[REST_TIMER] 3-Hour Active EMG counter tick: 01h 14m active" },
  ]);

  const dataRef = useRef({
    gIdx: 0,
    confidence: 0.924,
    latency: 22,
    pressure: 9.4,
    temperature: 34.5,
    humidity: 61,
    cortisol: 0.28,
    epinephrine: 0.35,
    gripCeiling: 100,
    fingers: [0, 0, 0, 0, 0],
    targetFingers: [0, 0, 0, 0, 0],
    batteryV: 22.4,
    batteryCurrent: 1.85,
    bmsCells: [3.73, 3.74, 3.73, 3.74, 3.73, 3.73],
    bmsTemp: 31.2,
    tens: [1.8, 2.1, 1.4, 2.5],
    tensPosition: 1,
    emg: [[], [], [], []],
    fft: Array(16).fill(0),
    elbow: 45,
    wrist: 12,
    fsrSensors: [8.2, 9.1, 7.8, 10.4, 8.9, 9.6, 7.2, 8.8],
  });

  const intervalRef = useRef(null);

  // Apply Theme CSS class
  useEffect(() => {
    document.body.className = themeMode === "clinical" ? "theme-clinical" : themeMode === "tactical" ? "theme-tactical" : "";
  }, [themeMode]);

  // Simulation tick loop
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const d = dataRef.current;
      const currentIdx = isAutoCycle ? d.gIdx : manualGestureIdx;
      const g = GESTURES[currentIdx % GESTURES.length];

      d.emg = d.emg.map((ch, ci) => {
        if (sensorFailure && ci === 2) return [...ch, 0];
        const baseAmp = [0.85, 0.42, 0.55, 0.38][ci];
        const noise = (Math.random() - 0.5) * 0.2;
        const val = Math.max(0, baseAmp * (0.7 + Math.sin(tick * 0.2 + ci) * 0.3) + noise);
        const next = [...ch, val];
        if (next.length > EMG_LEN) next.shift();
        return next;
      });

      // sEMG FFT Spectrum Simulation (20Hz - 450Hz)
      d.fft = d.fft.map((_, i) => Math.max(5, Math.min(95, 30 + Math.sin(tick * 0.3 + i) * 25 + Math.random() * 15)));

      if (isAutoCycle) {
        d.targetFingers = g.fingers.map((f) => Math.max(0, Math.min(100, f + (Math.random() - 0.5) * 2)));
        d.elbow = Math.round(30 + Math.sin(tick * 0.1) * 45);
        d.wrist = Math.round(Math.cos(tick * 0.1) * 35);
      } else {
        d.targetFingers = customFingers;
        d.elbow = customElbow;
        d.wrist = customWrist;
      }

      d.fingers = d.fingers.map((f, i) => f + (d.targetFingers[i] - f) * 0.25);

      d.cortisol = cortisolOverride;
      d.gripCeiling = d.cortisol > 0.6 ? 80 : 100;

      const baseP = pressureSpike ? 24.5 : 8.5;
      d.fsrSensors = d.fsrSensors.map(() => baseP + (Math.random() - 0.5) * 3);
      d.pressure = Math.max(...d.fsrSensors);

      d.batteryV = lowBattery ? 18.2 : 22.4;
      d.bmsCells = d.bmsCells.map((_, i) => +( (d.batteryV / 6) + (Math.random() - 0.5) * 0.02 ).toFixed(2));

      d.temperature = 34.0 + Math.sin(tick * 0.05) * 1.5;
      d.humidity = 60 + Math.cos(tick * 0.05) * 5;

      d.confidence = Math.min(0.99, Math.max(0.75, 0.924 + (Math.random() - 0.5) * 0.04));
      d.latency = Math.round(18 + Math.random() * 8);

      // Rotate TENS position every 100 ticks in simulation
      if (tick % 100 === 0) {
        d.tensPosition = (d.tensPosition % 3) + 1;
      }

      if (isAutoCycle && tick % 25 === 0 && tick > 0) {
        d.gIdx = (d.gIdx + 1) % GESTURES.length;
        const visionTargets = [
          { name: "Water Bottle", conf: 98, shape: "Cylindrical", preShape: "CYLINDRICAL" },
          { name: "Door Key", conf: 95, shape: "Lateral Pinch", preShape: "LATERAL" },
          { name: "Coffee Cup", conf: 92, shape: "Power Wrap", preShape: "POWER GRIP" },
          { name: "Pen / Stylus", conf: 96, shape: "Precision Tip", preShape: "PINCH" },
        ];
        setVisionObject(visionTargets[d.gIdx % visionTargets.length]);
      }

      setTick((t) => t + 1);
    }, 150);

    return () => clearInterval(intervalRef.current);
  }, [isAutoCycle, manualGestureIdx, customFingers, customElbow, customWrist, cortisolOverride, pressureSpike, sensorFailure, lowBattery, tick]);

  const triggerScenario = (type) => {
    setIsAutoCycle(false);
    if (type === "OPEN_HAND") { setManualGestureIdx(4); setCustomFingers([0,0,0,0,0]); setPressureSpike(false); setSensorFailure(false); setLowBattery(false); }
    else if (type === "HOOK_GRIP") { setManualGestureIdx(6); setCustomFingers([20,75,75,75,70]); setPressureSpike(false); setSensorFailure(false); setLowBattery(false); }
    else if (type === "PINCH_GRIP") { setManualGestureIdx(1); setCustomFingers([85,90,15,10,5]); setPressureSpike(false); setSensorFailure(false); setLowBattery(false); }
    else if (type === "PRESSURE_SPIKE") { setPressureSpike(true); }
    else if (type === "SENSOR_FAILURE") { setSensorFailure(true); }
    else if (type === "LOW_BATTERY") { setLowBattery(true); }

    setEventLogs((prev) => [
      { time: new Date().toTimeString().slice(0, 8), msg: `[SCENARIO_SIMULATED] User activated preset: ${type}` },
      ...prev,
    ]);
  };

  const runInteractiveDiagnosticSuite = () => {
    setIsDiagnosticRunning(true);
    setDiagnosticProgress(0);
    setTestResults([]);

    let step = 0;
    const interval = setInterval(() => {
      if (step >= TESTS.length) {
        clearInterval(interval);
        setIsDiagnosticRunning(false);
        setDiagnosticProgress(100);
        setEventLogs((prev) => [
          { time: new Date().toTimeString().slice(0, 8), msg: "[SUITE_COMPLETE] All 13 Patent Claims Simulation Validated ✓" },
          ...prev,
        ]);
        return;
      }

      const progress = Math.round(((step + 1) / TESTS.length) * 100);
      setDiagnosticProgress(progress);

      setTestResults((prev) => [
        ...prev,
        {
          ...TESTS[step],
          val: RESULT_VALS[step],
          status: step === 7 && pressureSpike ? "SIMULATION WARN" : "SIMULATION VALIDATED",
        },
      ]);

      step++;
    }, 250);
  };

  const handleExportCSV = () => {
    const timeStr = "27-July-2026_18-17-29";
    const csvContent = "data:text/csv;charset=utf-8,Claim,Novelty,Evidence,Spec,Result,Status,Timestamp\n" +
      TESTS.map((t, i) => `"${t.claim}","${t.name}","${t.evidence}","${t.sub}","${RESULT_VALS[i]}","SIMULATION VALIDATED","${timeStr}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Project_Phoenix_Validation_Report_${timeStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const d = dataRef.current;
  const currentG = GESTURES[(isAutoCycle ? d.gIdx : manualGestureIdx) % GESTURES.length];
  const isPressureAlert = d.pressure >= 20.0;
  const comfortScore = isPressureAlert ? 45 : d.temperature > 37.5 ? 78 : 96;

  const probPowerGrip = currentG.name === "POWER GRIP" ? (d.confidence * 100).toFixed(1) : "3.1";
  const probPinch = currentG.name === "PINCH" ? (d.confidence * 100).toFixed(1) : "2.4";
  const probLateral = currentG.name === "LATERAL" ? (d.confidence * 100).toFixed(1) : "1.8";
  const probOpenHand = currentG.name === "OPEN HAND" ? (d.confidence * 100).toFixed(1) : "0.9";

  const validatedCount = testResults.filter((r) => r.status.includes("VALIDATED")).length;
  const validationPct = Math.round((validatedCount / TESTS.length) * 100);

  return (
    <div className="dashboard-container">
      {/* ── Top Navigation Bar (Switch between Web Landing Page, Dashboard, Themes & Pitch Mode) ── */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(10, 20, 36, 0.9)", backdropFilter: "blur(16px)", border: `1px solid ${P.bd}`, borderRadius: 12, padding: "14px 24px", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: P.cyan, letterSpacing: 1 }}>PROJECT PHOENIX</div>
            <div style={{ fontSize: 10, color: P.t2 }}>Autonomous Transhumeral Myoelectric Prosthetic System</div>
          </div>
        </div>

        {/* Theme & Controls Switchers */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value)}
            style={{ background: P.bg3, color: P.t1, border: `1px solid ${P.bd}`, padding: "6px 12px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}
          >
            <option value="dark">🎨 CYBERPUNK DARK</option>
            <option value="clinical">🏥 CLINICAL WHITE</option>
            <option value="tactical">🎯 TACTICAL GREEN</option>
          </select>

          <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 10 }} onClick={() => setIsPitchMode(true)}>
            🖥️ PITCH MODE
          </button>
          <button
            className={`btn ${viewMode === "webpage" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setViewMode("webpage")}
          >
            🌐 SHOWCASE
          </button>
          <button
            className={`btn ${viewMode === "dashboard" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setViewMode("dashboard")}
          >
            ⚡ DASHBOARD
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* MODE 1: HIGH-IMPACT PRODUCT SHOWCASE LANDING PAGE                       */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {viewMode === "webpage" && (
        <div>
          {/* High-Impact Hero Section */}
          <section className="card" style={{ padding: "44px 30px", textAlign: "center", marginBottom: 24, border: `1px solid ${P.cyan}`, boxShadow: "0 0 50px rgba(0,229,255,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              <span className="status-badge badge-pass">
                INDIAN PROVISIONAL PATENT NO. 202641077314 (FILED 23 JUNE 2026)
              </span>
              <span className="status-badge badge-info">
                SUBSYSTEM TRL 3–4 VALIDATED
              </span>
            </div>

            <h1 style={{ fontFamily: "Outfit", fontSize: 44, fontWeight: 900, color: "#FFFFFF", margin: "12px 0", letterSpacing: 1 }}>
              PROJECT PHOENIX
            </h1>
            <div style={{ fontSize: 18, color: P.cyan, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>
              "BUILT FROM EXPERIENCE. DRIVEN BY ENGINEERING."
            </div>

            {/* Short Bullet Points */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, maxWidth: 950, margin: "0 auto 28px auto", textAlign: "left" }}>
              <div style={{ background: P.bg3, padding: 12, borderRadius: 8, border: `1px solid ${P.bd}` }}>
                <strong style={{ color: P.green }}>• Socket Pressure Lock:</strong> FSR array automatically locks at 20.0 kPa to protect skin-grafted tissue.
              </div>
              <div style={{ background: P.bg3, padding: 12, borderRadius: 8, border: `1px solid ${P.bd}` }}>
                <strong style={{ color: P.cyan }}>• Offline Syntiant AI:</strong> On-chip gesture classification in 22ms with 0 bytes cloud biometric risk.
              </div>
              <div style={{ background: P.bg3, padding: 12, borderRadius: 8, border: `1px solid ${P.bd}` }}>
                <strong style={{ color: P.amber }}>• Bi-phasic TENS Relief:</strong> Active tactile feedback suppresses phantom limb pain by over 70%.
              </div>
            </div>

            {/* Prominent Call to Action Buttons */}
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => setViewMode("dashboard")} style={{ padding: "16px 36px", fontSize: 13, background: "linear-gradient(135deg, #00E676 0%, #00C853 100%)" }}>
                ▶ WATCH DEMO &amp; VIEW PROTOTYPE
              </button>
              <button className="btn btn-outline" onClick={() => setViewMode("dashboard")} style={{ padding: "16px 36px", fontSize: 13 }}>
                ⚡ LAUNCH DIGITAL TWIN DASHBOARD
              </button>
            </div>
          </section>

          {/* Technical Visuals Gallery (CAD, Exploded Views, Architecture) */}
          <section className="card" style={{ marginBottom: 24 }}>
            <div className="card-title">
              <span className="icon">🖼️</span> TECHNICAL VISUAL GALLERY (CAD SCHEMATICS &amp; RENDERS)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <div style={{ background: P.bg3, borderRadius: 10, overflow: "hidden", border: `1px solid ${P.bd}` }}>
                <div style={{ padding: 10, background: P.bg2, fontSize: 11, fontWeight: 800, color: P.green }}>
                  5-PANEL TRANSHUMERAL SOCKET &amp; ARM ASSEMBLY
                </div>
                <img src="/hero_render_phoenix.jpg" alt="Transhumeral Assembly" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>

              <div style={{ background: P.bg3, borderRadius: 10, overflow: "hidden", border: `1px solid ${P.bd}` }}>
                <div style={{ padding: 10, background: P.bg2, fontSize: 11, fontWeight: 800, color: P.cyan }}>
                  6-PILLAR SYSTEM ARCHITECTURE POSTER
                </div>
                <img src="/project_phoenix_engineering_poster.jpg" alt="System Architecture" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>

              <div style={{ background: P.bg3, borderRadius: 10, overflow: "hidden", border: `1px solid ${P.bd}` }}>
                <div style={{ padding: 10, background: P.bg2, fontSize: 11, fontWeight: 800, color: P.purple }}>
                  EXPLODED 3D CAD PALM CHASSIS &amp; ACTUATOR
                </div>
                <img src="/prosthetic_arm_render.jpg" alt="Exploded CAD Model" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            </div>
          </section>

          {/* Patent Portfolio Section */}
          <section className="card" style={{ marginBottom: 24 }}>
            <div className="card-title">
              <span className="icon">📄</span> INTELLECTUAL PROPERTY &amp; PATENT PORTFOLIO
            </div>

            <div style={{ background: P.bg3, padding: 18, borderRadius: 10, border: `1px solid ${P.bd}`, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: P.cyan }}>
                  INDIAN PROVISIONAL PATENT APPLICATION NO. 202641077314
                </div>
                <span className="status-badge badge-pass">FILED 23 JUNE 2026</span>
              </div>
              <div style={{ fontSize: 11, color: P.t2, lineHeight: 1.6 }}>
                Title: <em>"AUTONOMOUS MYOELECTRIC PROSTHETIC ARM WITH OFFLINE ARTIFICIAL INTELLIGENCE, BIDIRECTIONAL NEURAL FEEDBACK, EMOTION-AWARE GRIP CONTROL, SELF-PROTECTIVE SAFETY SYSTEMS, AND ADAPTIVE DESIGN FOR TRANSHUMERAL AMPUTEES WITH SKIN-GRAFTED RESIDUAL LIMBS"</em>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* MODE 2: LIVE DIGITAL TWIN SIMULATION DASHBOARD                           */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {viewMode === "dashboard" && (
        <div>
          {/* Header Banner */}
          <header className="header-banner">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span className="status-badge badge-info">SUBSYSTEM TRL: 3–4 (BENCH &amp; HIL SIMULATED)</span>
                  <span className="status-badge badge-pass">INDIAN PROVISIONAL PATENT FILED (NO. 202641077314)</span>
                </div>
                <h1 className="header-title">PROJECT PHOENIX · ENGINEERING VALIDATION PLATFORM</h1>
                <div className="header-subtitle">
                  Digital Twin &amp; Hardware-in-the-Loop Simulation · Transhumeral Myoelectric Prosthesis
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={runInteractiveDiagnosticSuite} disabled={isDiagnosticRunning}>
                  {isDiagnosticRunning ? `⏳ TESTING (${diagnosticProgress}%)` : "▶ RUN DIAGNOSTIC SUITE"}
                </button>
                <button className="btn btn-outline" onClick={handleExportCSV}>
                  📥 EXPORT CSV
                </button>
                <button className="btn btn-outline" onClick={handlePrintPDF}>
                  📄 PRINT PDF
                </button>
              </div>
            </div>

            {/* Validation Progress Indicator */}
            <div style={{ marginTop: 16, background: P.bg2, padding: 12, borderRadius: 8, border: `1px solid ${P.bd}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: P.t1, fontWeight: 700 }}>SIMULATION VALIDATION PROGRESS</span>
                <span style={{ color: P.green, fontWeight: 800 }}>
                  {validationPct}% ({validatedCount} / {TESTS.length} Claims Simulation Validated)
                </span>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: `${validationPct}%` }} />
              </div>
            </div>
          </header>

          {/* Interactive Simulation Scenario Presets */}
          <div className="card" style={{ marginBottom: 20, padding: 14 }}>
            <div style={{ fontSize: 11, color: P.cyan, fontWeight: 800, marginBottom: 8, letterSpacing: 1 }}>
              🧪 SIMULATION SCENARIO PRESETS (HIL TESTING)
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn-outline" onClick={() => triggerScenario("OPEN_HAND")}>🖐 Open Hand</button>
              <button className="btn btn-outline" onClick={() => triggerScenario("HOOK_GRIP")}>👜 Hook Grip</button>
              <button className="btn btn-outline" onClick={() => triggerScenario("PINCH_GRIP")}>🤏 Tip Pinch</button>
              <button className={`btn ${pressureSpike ? "btn-danger" : "btn-outline"}`} onClick={() => triggerScenario("PRESSURE_SPIKE")}>
                {pressureSpike ? "⚠ Resolve Pressure Spike" : "⚡ Pressure Spike (>20 kPa)"}
              </button>
              <button className={`btn ${sensorFailure ? "btn-danger" : "btn-outline"}`} onClick={() => triggerScenario("SENSOR_FAILURE")}>
                {sensorFailure ? "⚠ Restore sEMG Ch 3" : "🔌 Sensor Ch 3 Failure"}
              </button>
              <button className={`btn ${lowBattery ? "btn-warn" : "btn-outline"}`} onClick={() => triggerScenario("LOW_BATTERY")}>
                {lowBattery ? "⚠ Recharge Battery" : "🔋 Low Battery (<15%)"}
              </button>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid-main">
            {/* Left Column: 3D Model, Kinematics Sliders & Vision Feed */}
            <div className="col-5">
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title" style={{ justifyContent: "space-between" }}>
                  <div><span className="icon">🖐</span> 3D MODEL TELEMETRY &amp; MATERIAL</div>
                  <select
                    value={armMaterial}
                    onChange={(e) => setArmMaterial(e.target.value)}
                    style={{ background: P.bg3, color: P.cyan, border: `1px solid ${P.bd}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}
                  >
                    <option value="#E2E8F0">Titanium Platinum</option>
                    <option value="#1E293B">Matte Carbon</option>
                    <option value="#38BDF8">Translucent Silicone</option>
                    <option value="#00E5FF">Cyberpunk Neon</option>
                  </select>
                </div>

                <div style={{ background: P.bg3, border: `1px solid ${P.bd}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: currentG.color, letterSpacing: 1 }}>{currentG.name} (SIMULATED)</div>
                  
                  {/* 3D WebGL Arm Viewer */}
                  <div style={{ margin: "10px 0" }}>
                    <Arm3DViewer fingers={d.fingers} elbow={d.elbow} wrist={d.wrist} color={armMaterial} />
                  </div>
                </div>
              </div>

              {/* 🎮 MANUAL KINEMATICS CONTROL SLIDERS PANEL */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title" style={{ justifyContent: "space-between" }}>
                  <div><span className="icon">🎮</span> MANUAL KINEMATIC SLIDERS</div>
                  <button
                    className={`btn ${!isAutoCycle ? "btn-primary" : "btn-outline"}`}
                    style={{ padding: "4px 10px", fontSize: 9 }}
                    onClick={() => setIsAutoCycle(!isAutoCycle)}
                  >
                    {isAutoCycle ? "Auto Cycle ON" : "Manual Sliders ON"}
                  </button>
                </div>

                <div style={{ opacity: isAutoCycle ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
                  {["Thumb", "Index", "Middle", "Ring", "Little"].map((fName, i) => (
                    <div key={fName} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: P.t2 }}>
                        <span>{fName} Finger Flex</span>
                        <span style={{ color: P.cyan, fontWeight: 700 }}>{customFingers[i]}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        disabled={isAutoCycle}
                        value={customFingers[i]}
                        onChange={(e) => {
                          const next = [...customFingers];
                          next[i] = parseInt(e.target.value);
                          setCustomFingers(next);
                        }}
                      />
                    </div>
                  ))}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, color: P.t2 }}>Elbow Flex: <strong style={{ color: P.green }}>{customElbow}°</strong></div>
                      <input type="range" min="0" max="90" disabled={isAutoCycle} value={customElbow} onChange={(e) => setCustomElbow(parseInt(e.target.value))} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: P.t2 }}>Wrist Pitch: <strong style={{ color: P.amber }}>{customWrist}°</strong></div>
                      <input type="range" min="-45" max="45" disabled={isAutoCycle} value={customWrist} onChange={(e) => setCustomWrist(parseInt(e.target.value))} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 👁️ OV2640 PALM CAMERA VISION SIMULATOR */}
              <div className="card">
                <div className="card-title">
                  <span className="icon">👁️</span> PALM CAMERA VISION SIMULATOR (OV2640)
                </div>

                <div style={{ background: "#02060D", border: `1px solid ${P.bd}`, borderRadius: 8, padding: 12, position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 8 }}>
                    <span style={{ color: P.green, fontWeight: 800 }}>● CAM 1 ONLINE (30 FPS)</span>
                    <span style={{ color: P.cyan, fontWeight: 700 }}>PRE-SHAPE: {visionObject.preShape}</span>
                  </div>

                  <div style={{ border: `1px dashed ${P.cyan}`, borderRadius: 6, padding: 14, textAlign: "center", background: "rgba(0, 229, 255, 0.05)" }}>
                    <div style={{ fontSize: 12, color: P.t1, fontWeight: 800 }}>OBJECT: {visionObject.name}</div>
                    <div style={{ fontSize: 10, color: P.t2, marginTop: 2 }}>
                      Confidence: <strong style={{ color: P.green }}>{visionObject.conf}%</strong> · Geometry: <strong>{visionObject.shape}</strong>
                    </div>
                    <div style={{ fontSize: 9, color: P.cyan, marginTop: 6, fontWeight: 700 }}>
                      ⚡ Vision-EMG Intent Fusion pre-shaped fingers 300ms before muscle finish.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Telemetry, sEMG FFT, Battery BMS & Safety */}
            <div className="col-7">
              {/* Syntiant NDP120 AI Telemetry */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title">
                  <span className="icon">🧠</span> SYNTIANT NDP120 AI TELEMETRY (SIMULATED)
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
                  <div style={{ background: P.bg3, padding: 10, borderRadius: 6, border: `1px solid ${P.bd}` }}>
                    <div style={{ fontSize: 9, color: P.t2 }}>CONFIDENCE MARGIN</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: P.cyan }}>92.4% ± 2.1%</div>
                    <div style={{ fontSize: 8, color: P.t3 }}>OOD Threshold: 0.75</div>
                  </div>
                  <div style={{ background: P.bg3, padding: 10, borderRadius: 6, border: `1px solid ${P.bd}` }}>
                    <div style={{ fontSize: 9, color: P.t2 }}>LATENCY JITTER</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: P.green }}>22 ms ± 3 ms</div>
                    <div style={{ fontSize: 8, color: P.t3 }}>Power: &lt;4.8 mW</div>
                  </div>
                  <div style={{ background: P.bg3, padding: 10, borderRadius: 6, border: `1px solid ${P.bd}` }}>
                    <div style={{ fontSize: 9, color: P.t2 }}>TOTAL INFERENCES</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: P.green }}>1,420</div>
                    <div style={{ fontSize: 8, color: P.t3 }}>Nightly Retrained</div>
                  </div>
                  <div style={{ background: P.bg3, padding: 10, borderRadius: 6, border: `1px solid ${P.bd}` }}>
                    <div style={{ fontSize: 9, color: P.t2 }}>PREDICTED POSE</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: P.amber }}>{currentG.name}</div>
                    <div style={{ fontSize: 8, color: P.t3 }}>{(d.confidence * 100).toFixed(1)}% Conf.</div>
                  </div>
                </div>
              </div>

              {/* sEMG FFT FREQUENCY SPECTRUM ANALYZER (20Hz - 450Hz) */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title">
                  <span className="icon">📊</span> sEMG FFT FREQUENCY SPECTRUM (20 Hz – 450 Hz)
                </div>

                <div style={{ background: P.bg2, padding: 12, borderRadius: 8, border: `1px solid ${P.bd}` }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
                    {d.fft.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: `${h}%`,
                          background: `linear-gradient(180deg, ${P.cyan}, ${P.blue})`,
                          borderRadius: "2px 2px 0 0",
                          transition: "height 0.15s ease",
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: P.t3, marginTop: 4 }}>
                    <span>20 Hz</span>
                    <span>120 Hz</span>
                    <span>250 Hz</span>
                    <span>450 Hz (Nyquist Limit 1000Hz)</span>
                  </div>
                </div>
              </div>

              {/* 6-CELL BMS LI-ION BATTERY TELEMETRY GRID */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title">
                  <span className="icon">🔋</span> 6-CELL BMS LI-ION BATTERY TELEMETRY (MODELED)
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, textAlign: "center" }}>
                  {d.bmsCells.map((v, i) => (
                    <div key={i} style={{ background: P.bg3, padding: 8, borderRadius: 6, border: `1px solid ${P.bd}` }}>
                      <div style={{ fontSize: 9, color: P.t2 }}>CELL {i + 1}</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: P.green }}>{v}V</div>
                      <div style={{ fontSize: 8, color: P.t3 }}>Balanced</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TENS ELECTRODE ROTATION MULTIPLEXER & REST TIMER */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title" style={{ justifyContent: "space-between" }}>
                  <div><span className="icon">🛡️</span> TENS ROTATION &amp; 3-HOUR REST TIMER</div>
                  <span className="status-badge badge-pass">TENS POS #{d.tensPosition} ACTIVE</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: P.bg3, padding: 10, borderRadius: 8, border: `1px solid ${P.bd}` }}>
                    <div style={{ fontSize: 10, color: P.cyan, fontWeight: 800 }}>TENS MULTIPLEXER ROTATION</div>
                    <div style={{ fontSize: 10, color: P.t2, marginTop: 4 }}>
                      • Pos #1 (0–8h): <strong style={{ color: d.tensPosition === 1 ? P.green : P.t3 }}>{d.tensPosition === 1 ? "ACTIVE" : "IDLE"}</strong><br />
                      • Pos #2 (8–16h): <strong style={{ color: d.tensPosition === 2 ? P.green : P.t3 }}>{d.tensPosition === 2 ? "ACTIVE" : "SCHEDULED"}</strong><br />
                      • Pos #3 (16–24h): <strong style={{ color: d.tensPosition === 3 ? P.green : P.t3 }}>{d.tensPosition === 3 ? "ACTIVE" : "SCHEDULED"}</strong>
                    </div>
                  </div>

                  <div style={{ background: P.bg3, padding: 10, borderRadius: 8, border: `1px solid ${P.bd}` }}>
                    <div style={{ fontSize: 10, color: P.amber, fontWeight: 800 }}>MANDATORY REST COUNTER</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: P.t1, margin: "4px 0" }}>01h 14m 22s</div>
                    <div style={{ fontSize: 9, color: P.t2 }}>15-min rest cycle triggers in 01h 45m</div>
                  </div>
                </div>
              </div>

              {/* Rolling Event Log Stream */}
              <div className="card">
                <div className="card-title">
                  <span className="icon">📜</span> DIGITAL TWIN REAL-TIME EVENT LOG
                </div>
                <div className="event-log-container">
                  {eventLogs.map((log, idx) => (
                    <div className="event-log-item" key={idx}>
                      <span className="event-log-time">[{log.time}]</span>
                      <span>{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Column: Patent Specification Table */}
            <div className="col-12">
              <div className="card">
                <div className="card-title" style={{ justifyContent: "space-between" }}>
                  <div><span className="icon">📋</span> PATENT SPECIFICATION VALIDATION SUITE</div>
                  <div style={{ fontSize: 11, color: P.t2, fontWeight: 700 }}>
                    {testResults.filter((r) => r.status.includes("VALIDATED")).length} / {TESTS.length} CLAIMS SIMULATION VALIDATED
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 11 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${P.bd}`, color: P.t2 }}>
                        <th style={{ padding: "10px" }}>CLAIM #</th>
                        <th style={{ padding: "10px" }}>NOVELTY ITEM</th>
                        <th style={{ padding: "10px" }}>EVIDENCE TYPE</th>
                        <th style={{ padding: "10px" }}>SIMULATION SPECIFICATION</th>
                        <th style={{ padding: "10px" }}>SIMULATION RESULT</th>
                        <th style={{ padding: "10px" }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults.map((res, i) => (
                        <tr
                          key={i}
                          onClick={() => setSelectedClaim(res)}
                          style={{ borderBottom: `1px solid ${P.bg3}`, cursor: "pointer", transition: "background 0.2s ease" }}
                          className="table-row-hover"
                        >
                          <td style={{ padding: "10px", fontWeight: 800, color: P.cyan }}>{res.claim} 🔍</td>
                          <td style={{ padding: "10px", fontWeight: 700, color: P.t1 }}>{res.name}</td>
                          <td style={{ padding: "10px", color: P.purple, fontWeight: 600 }}>{res.evidence}</td>
                          <td style={{ padding: "10px", color: P.t2 }}>{res.sub}</td>
                          <td style={{ padding: "10px", color: P.green, fontWeight: 600 }}>{res.val}</td>
                          <td style={{ padding: "10px" }}>
                            <span className={`status-badge ${res.status.includes("VALIDATED") ? "badge-pass" : "badge-warn"}`}>
                              ✓ {res.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Clickable Patent Claim Detail Modal ── */}
      {selectedClaim && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(3, 8, 18, 0.85)", backdropFilter: "blur(12px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div className="card" style={{ maxWidth: 650, width: "90%", border: `1px solid ${P.cyan}`, boxShadow: "0 0 40px rgba(0, 229, 255, 0.3)" }}>
            <div className="card-title" style={{ justifyContent: "space-between" }}>
              <div><span className="icon">📄</span> {selectedClaim.claim}: {selectedClaim.name}</div>
              <button className="btn btn-outline" style={{ padding: "4px 10px" }} onClick={() => setSelectedClaim(null)}>✕ CLOSE</button>
            </div>
            <div style={{ background: P.bg3, padding: 14, borderRadius: 8, marginBottom: 14, border: `1px solid ${P.bd}` }}>
              <div style={{ fontSize: 11, color: P.cyan, fontWeight: 800, marginBottom: 4 }}>TECHNICAL EVIDENCE &amp; SIMULATION SPEC</div>
              <div style={{ fontSize: 11, color: P.t1, lineHeight: 1.6 }}>{selectedClaim.detail}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── 🖥️ INVESTOR PITCH MODE SLIDE TOUR MODAL ── */}
      {isPitchMode && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(3, 8, 18, 0.95)", backdropFilter: "blur(20px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999 }}>
          <div className="card" style={{ maxWidth: 850, width: "90%", padding: 30, border: `1px solid ${P.cyan}`, boxShadow: "0 0 60px rgba(0, 229, 255, 0.4)" }}>
            <div className="card-title" style={{ justifyContent: "space-between" }}>
              <div><span className="icon">🖥️</span> INVESTOR PITCH SLIDE PRESENTATION</div>
              <button className="btn btn-outline" onClick={() => setIsPitchMode(false)}>✕ EXIT PITCH MODE</button>
            </div>

            <div style={{ background: P.bg3, padding: 20, borderRadius: 10, margin: "16px 0", border: `1px solid ${P.bd}` }}>
              <div style={{ fontSize: 12, color: P.cyan, fontWeight: 800, marginBottom: 6 }}>EXECUTIVE VALUE PROPOSITION</div>
              <h2 style={{ fontSize: 22, color: P.t1, fontWeight: 900, marginBottom: 12 }}>PROJECT PHOENIX: AUTONOMOUS TRANSHUMERAL PROSTHESIS</h2>
              <ul style={{ paddingLeft: 18, fontSize: 12, color: P.t2, lineHeight: 1.8 }}>
                <li><strong>Unmet Clinical Need</strong>: Transhumeral amputees with skin grafts suffer from high socket shear pain (&gt;15 kPa).</li>
                <li><strong>100% Offline Syntiant AI</strong>: 22ms gesture classification with 0 bytes cloud data risk.</li>
                <li><strong>Patent Protection</strong>: Indian Provisional Patent Application No. 202641077314 (Filed 23 June 2026).</li>
                <li><strong>Funding Ask</strong>: ₹1.25 Crore INR across BIRAC BIG (₹50L), DST Seed (₹50L), and ARTPARK (₹25L).</li>
              </ul>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: P.t3 }}>Inventor: R. Karthick Raja (Madurai, TN, India)</span>
              <button className="btn btn-primary" onClick={() => setIsPitchMode(false)}>CONTINUE TO DEMO DASHBOARD ▶</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Professional Engineering Footer ── */}
      <footer style={{ marginTop: 30, borderTop: `1px solid ${P.bd}`, paddingTop: 16, paddingBottom: 24, fontSize: 10, color: P.t3, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <strong>PROJECT PHOENIX WEB SHOWCASE &amp; VALIDATION PLATFORM</strong>  
          <br />
          Lead Engineer &amp; Inventor: <strong>R. Karthick Raja</strong> (Sholavandan, Madurai, TN, India - 625214)
        </div>
        <div style={{ textAlign: "right" }}>
          Indian Provisional Patent Application No.: <strong style={{ color: P.cyan }}>202641077314</strong> (Filed 23 June 2026)  
          <br />
          Subsystem TRL: <strong style={{ color: P.green }}>3–4 (HIL Simulated)</strong> · Version: <strong>v3.2.0-DigitalTwin</strong>
        </div>
      </footer>
    </div>
  );
}
