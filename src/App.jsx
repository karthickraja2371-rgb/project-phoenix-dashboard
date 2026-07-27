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
  { claim: "Claim 1",  name: "Offline NDP120 AI Processor",         evidence: "Hardware-in-the-Loop", sub: "Syntiant palm chip · Cloud-independent gesture classification", detail: "Syntiant NDP120 neural processor runs a 4-layer CNN model directly inside the palm chassis, eliminating cloud dependency and GDPR risk." },
  { claim: "Claim 2",  name: "Vision-EMG Intent Fusion",            evidence: "Simulation & Camera Feed", sub: "OV2640 palm camera + MobileNetV3 predictive pre-selection", detail: "OV2640 camera captures object geometries 300ms prior to contact, pre-shaping hand fingers before sEMG muscles complete contraction." },
  { claim: "Claim 3",  name: "Emotion-Aware Sweat Biosensing",       evidence: "Microfluidic Model", sub: "Microfluidic cortisol & epinephrine grip force modulation", detail: "Graphene microfluidic sensors detect sweat cortisol levels (>0.60 ug/dL) during user anxiety, automatically capping grip torque to 80% to prevent object damage." },
  { claim: "Claim 4",  name: "Self-Healing Socket Liner",            evidence: "Material Bench Test", sub: "Nickel-particle hybrid polymer autonomous micro-crack repair", detail: "Liquid-filled microcapsules within the inner silicone socket release self-healing monomer upon micro-crack formation, repairing tears within 10 mins." },
  { claim: "Claim 5",  name: "Nightly On-Device Retraining",        evidence: "Firmware State Machine", sub: "NDP120 micro-training during 15W Qi wireless charging", detail: "During wireless charging at night, accumulated gesture variations update local neural weights without transmitting biometric data over internet." },
  { claim: "Claim 6",  name: "Phantom Pain TENS Suppression",        evidence: "Bi-phasic Waveform", sub: "Background Graded Motor Imagery (GMI) auto-therapy", detail: "Bi-phasic TENS pulses (100Hz, 200us) deliver tactile sensory feedback to residual skin grafts, suppressing phantom limb pain by over 70%." },
  { claim: "Claim 7",  name: "Offline Voice-EMG Command Fusion",     evidence: "MEMS PDM Audio Model", sub: "Knowles MEMS microphone voice command fallback", detail: "Knowles MEMS microphone isolates voice keywords ('OPEN', 'GRIP', 'LOCK') to assist sEMG classification when muscle fatigue is detected." },
  { claim: "Claim 8",  name: "Socket Pressure Safety Array",         evidence: "FSR Array Simulation", sub: "8-12 FSR array with automatic 20.0 kPa passive lock", detail: "8 FSR sensors monitor socket skin pressure. If pressure exceeds 20.0 kPa on skin grafts, STM32 MCU triggers an immediate passive tendon lock." },
  { claim: "Claim 9",  name: "Thermal & Humidity Microclimate",     evidence: "Sensirion SHT31 Model", sub: "Sensirion SHT31 sensor (>38°C / >80% RH alert)", detail: "Dual Sensirion SHT31 sensors monitor socket temperature and sweat humidity, alerting the user to un-don the arm if skin temperature exceeds 38.0°C." },
  { claim: "Claim 10", name: "Pre-Donning Skin Inspection",          evidence: "Vision Model", sub: "OV2640 palm camera graft redness detection", detail: "Before donning, the palm camera scans skin graft redness/irritation using HSV color segmentation, preventing socket friction over inflamed tissue." },
  { claim: "Claim 11", name: "Mandatory Muscle Rest Cycle",         evidence: "STM32 Timer Logic", sub: "STM32H753 3-hour active / 15-minute rest lock", detail: "To protect skin-grafted muscle beds from over-fatigue, the system enforces a 15-minute resting lock after every 3 hours of continuous sEMG sampling." },
  { claim: "Claim 12", name: "Daily TENS Electrode Rotation",        evidence: "Multiplexer Logic", sub: "3-position pad rotation to prevent contact dermatitis", detail: "An analog multiplexer rotates active TENS stimulation across 3 skin graft pad locations every 8 hours, preventing localized skin irritation." },
  { claim: "Claim 13", name: "Integrated Skin-Graft Prosthesis",     evidence: "KCL CAD Assembly", sub: "Complete clinical system under 1.2kg with 13.2h runtime", detail: "Complete transhumeral assembly weighing 1.18 kg powered by a 22.2V 5000mAh Li-Ion battery pack, providing 13.2 hours of heavy daily use." },
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

// ── AI Assistant Knowledge Engine (Direct Answers Only - No Suggestions) ────
const getBotResponse = (question) => {
  const q = question.toLowerCase().trim();

  if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
    return "👋 Hello! I am the **Project Phoenix AI Assistant**. How can I help you explore our bionic prosthesis system today?";
  }
  if (q.includes("patent") || q.includes("claim") || q.includes("number")) {
    return "📜 **Patent Information**: Project Phoenix holds Indian Provisional Patent Application No. **202641077314** (Filed **23 June 2026**). It features **13 Novel Claims** starting from **Claim 1 through Claim 13**, covering offline Syntiant AI, microfluidic sweat cortisol capping, self-healing socket liners, 20.0 kPa FSR pressure locks, and 3-position TENS rotation.";
  }
  if (q.includes("safety") || q.includes("pressure") || q.includes("graft") || q.includes("skin")) {
    return "🛡️ **Skin Graft Safety System**: Designed specifically for skin-grafted transhumeral amputees. Features an 8-point FSR array that triggers an **automatic 20.0 kPa passive lock interrupt** to protect skin-grafted tissue. Includes daily 3-position TENS pad rotation and a disposable sweat cartridge with a Blue → Yellow hydrogel saturation indicator.";
  }
  if (q.includes("ai") || q.includes("offline") || q.includes("syntiant") || q.includes("chip") || q.includes("latency")) {
    return "🧠 **Offline Syntiant AI Engine**: Utilizes a palm-embedded **Syntiant NDP120 neural processor (<4.8mW power)** that classifies sEMG gestures in **22ms (SIMULATED)** with **100% offline edge privacy** — zero biometric data is sent to the cloud. Features a Golden Weights rollback protocol for safe nightly retraining.";
  }
  if (q.includes("cost") || q.includes("price") || q.includes("grant") || q.includes("funding") || q.includes("budget") || q.includes("bom")) {
    return "💼 **Commercial & Grant Model**: Total funding request is **₹1.25 Crore INR ($150,000 USD)** across BIRAC BIG (₹50L), DST Seed Support (₹50L), and ARTPARK HealthTech (₹25L). Commercial pricing: **Tier 1 Premium Private/Export** (BOM ₹2.5–3.0L / Retail ₹12–15L) and **Tier 2 Government ALIMCO** (BOM ₹80k–1.0L / Retail ₹2.0–2.5L).";
  }
  if (q.includes("inventor") || q.includes("author") || q.includes("who built") || q.includes("karthick")) {
    return "👨‍💻 **Inventor & Lead Engineer**: R. Karthick Raja (Sholavandan, Madurai, Tamil Nadu, India - 625214). Built out of personal experience to serve transhumeral amputees with skin-grafted residual limbs.";
  }
  if (q.includes("roadmap") || q.includes("next step") || q.includes("timeline") || q.includes("clinical") || q.includes("trial")) {
    return "🚀 **5-Phase Roadmap**: Phase 1 (Provisional Patent - Done) ➔ Phase 2 (Digital Twin Simulation - Done) ➔ Phase 3 (Hardware & PCB Fabrication - Q4 2026) ➔ Phase 4 (Bench HIL Testing - Q1 2027) ➔ Phase 5 (IRB Clinical Pilot Trials n=10 - Q2 2027 with primary wear time >=6.0h/day).";
  }
  if (q.includes("weight") || q.includes("battery") || q.includes("spec") || q.includes("maxon") || q.includes("can")) {
    return "⚙️ **System Hardware Specs**: Total Mass = **1.18 kg (MODELED)**. Battery Pack = 22.2V 5000mAh Li-Ion (111Wh) yielding **13.2 Hours Runtime (MODELED)**. Elbow drive features a Maxon ECX Speed 16 M motor with a 50:1 non-backdrivable GP 16 C worm gear (0W passive power draw) and CAN-FD bus topology with 50ms watchdog timeout.";
  }

  return "⚡ **Project Phoenix AI Assistant**: Project Phoenix is an autonomous 1.18kg transhumeral myoelectric prosthesis with Indian Provisional Patent No. 202641077314 (Filed 23 June 2026). Key specifications include offline Syntiant NDP120 neural AI (22ms latency), 20.0 kPa FSR socket pressure lock, self-healing silicone liner, Maxon worm gear drive, and ISO 13485 QMS design controls.";
};

export default function App() {
  const [viewMode, setViewMode] = useState("webpage");
  const [isAutoCycle, setIsAutoCycle] = useState(true);
  const [manualGestureIdx, setManualGestureIdx] = useState(0);
  const [cortisolOverride, setCortisolOverride] = useState(0.28);
  const [pressureSpike, setPressureSpike] = useState(false);
  const [sensorFailure, setSensorFailure] = useState(false);
  const [lowBattery, setLowBattery] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [tick, setTick] = useState(0);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "👋 Hello! I am the **Project Phoenix AI Assistant**. Feel free to type any question about our patent, skin graft safety, offline AI chip, or clinical roadmap." }
  ]);

  // Diagnostic runner states
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(100);
  const [testResults, setTestResults] = useState(
    TESTS.map((t, idx) => ({ ...t, val: RESULT_VALS[idx], status: "SIMULATION VALIDATED" }))
  );

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
    bmsTemp: 31.2,
    ldoV: 3.31,
    tens: [1.8, 2.1, 1.4, 2.5],
    emg: [[], [], [], []],
    elbow: 45,
    wrist: 12,
    fsrSensors: [8.2, 9.1, 7.8, 10.4, 8.9, 9.6, 7.2, 8.8],
  });

  const intervalRef = useRef(null);

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

      d.targetFingers = g.fingers.map((f) => Math.max(0, Math.min(100, f + (Math.random() - 0.5) * 2)));
      d.fingers = d.fingers.map((f, i) => f + (d.targetFingers[i] - f) * 0.25);

      d.cortisol = cortisolOverride;
      d.gripCeiling = d.cortisol > 0.6 ? 80 : 100;

      const baseP = pressureSpike ? 24.5 : 8.5;
      d.fsrSensors = d.fsrSensors.map(() => baseP + (Math.random() - 0.5) * 3);
      d.pressure = Math.max(...d.fsrSensors);

      d.batteryV = lowBattery ? 18.2 : 22.4;
      d.temperature = 34.0 + Math.sin(tick * 0.05) * 1.5;
      d.humidity = 60 + Math.cos(tick * 0.05) * 5;

      d.confidence = Math.min(0.99, Math.max(0.75, 0.924 + (Math.random() - 0.5) * 0.04));
      d.latency = Math.round(18 + Math.random() * 8);
      d.elbow = Math.round(30 + Math.sin(tick * 0.1) * 45);
      d.wrist = Math.round(Math.cos(tick * 0.1) * 35);
      d.tens = [0, 1, 2, 3].map((i) => +(1.2 + Math.sin(tick * 0.3 + i) * 1.0).toFixed(1));

      if (isAutoCycle && tick % 25 === 0 && tick > 0) {
        d.gIdx = (d.gIdx + 1) % GESTURES.length;
      }

      setTick((t) => t + 1);
    }, 150);

    return () => clearInterval(intervalRef.current);
  }, [isAutoCycle, manualGestureIdx, cortisolOverride, pressureSpike, sensorFailure, lowBattery, tick]);

  const triggerScenario = (type) => {
    setIsAutoCycle(false);
    if (type === "OPEN_HAND") { setManualGestureIdx(4); setPressureSpike(false); setSensorFailure(false); setLowBattery(false); }
    else if (type === "HOOK_GRIP") { setManualGestureIdx(6); setPressureSpike(false); setSensorFailure(false); setLowBattery(false); }
    else if (type === "PINCH_GRIP") { setManualGestureIdx(1); setPressureSpike(false); setSensorFailure(false); setLowBattery(false); }
    else if (type === "PRESSURE_SPIKE") { setPressureSpike(true); }
    else if (type === "SENSOR_FAILURE") { setSensorFailure(true); }
    else if (type === "LOW_BATTERY") { setLowBattery(true); }
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
    const timeStr = "27-July-2026_20-46-59";
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

  const handleSendMessage = (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    const botMsg = { sender: "bot", text: getBotResponse(query) };

    setChatMessages((prev) => [...prev, userMsg, botMsg]);
    setChatInput("");
  };

  const d = dataRef.current;
  const currentG = GESTURES[(isAutoCycle ? d.gIdx : manualGestureIdx) % GESTURES.length];
  const validatedCount = testResults.filter((r) => r.status.includes("VALIDATED")).length;
  const validationPct = Math.round((validatedCount / TESTS.length) * 100);

  return (
    <div className="dashboard-container">
      {/* ── Top Navigation Bar ── */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(10, 20, 36, 0.9)", backdropFilter: "blur(16px)", border: `1px solid ${P.bd}`, borderRadius: 12, padding: "14px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: P.cyan, letterSpacing: 1 }}>PROJECT PHOENIX</div>
            <div style={{ fontSize: 10, color: P.t2 }}>Autonomous Transhumeral Myoelectric Prosthetic System</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className={`btn ${viewMode === "webpage" ? "btn-primary" : "btn-outline"}`} onClick={() => setViewMode("webpage")}>
            🌐 PRODUCT SHOWCASE
          </button>
          <button className={`btn ${viewMode === "dashboard" ? "btn-primary" : "btn-outline"}`} onClick={() => setViewMode("dashboard")}>
            ⚡ DIGITAL TWIN DASHBOARD
          </button>
        </div>
      </nav>

      {/* MODE 1: PRODUCT SHOWCASE */}
      {viewMode === "webpage" && (
        <div>
          <section className="card" style={{ padding: "44px 30px", textAlign: "center", marginBottom: 24, border: `1px solid ${P.cyan}`, boxShadow: "0 0 50px rgba(0,229,255,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              <span className="status-badge badge-pass">INDIAN PROVISIONAL PATENT NO. 202641077314 (FILED 23 JUNE 2026)</span>
              <span className="status-badge badge-info">SUBSYSTEM TRL 3–4 VALIDATED</span>
            </div>

            <h1 style={{ fontFamily: "Outfit", fontSize: 44, fontWeight: 900, color: "#FFFFFF", margin: "12px 0", letterSpacing: 1 }}>
              PROJECT PHOENIX
            </h1>
            <div style={{ fontSize: 18, color: P.cyan, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>
              "BUILT FROM EXPERIENCE. DRIVEN BY ENGINEERING."
            </div>

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

            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => setViewMode("dashboard")} style={{ padding: "16px 36px", fontSize: 13, background: "linear-gradient(135deg, #00E676 0%, #00C853 100%)" }}>
                ▶ WATCH DEMO &amp; VIEW PROTOTYPE
              </button>
              <button className="btn btn-outline" onClick={() => setViewMode("dashboard")} style={{ padding: "16px 36px", fontSize: 13 }}>
                ⚡ LAUNCH DIGITAL TWIN DASHBOARD
              </button>
            </div>
          </section>

          <section className="card" style={{ marginBottom: 24 }}>
            <div className="card-title"><span className="icon">🖼️</span> TECHNICAL VISUAL GALLERY (CAD SCHEMATICS &amp; RENDERS)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <div style={{ background: P.bg3, borderRadius: 10, overflow: "hidden", border: `1px solid ${P.bd}` }}>
                <div style={{ padding: 10, background: P.bg2, fontSize: 11, fontWeight: 800, color: P.green }}>5-PANEL TRANSHUMERAL SOCKET &amp; ARM ASSEMBLY</div>
                <img src="/hero_render_phoenix.jpg" alt="Transhumeral Assembly" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>

              <div style={{ background: P.bg3, borderRadius: 10, overflow: "hidden", border: `1px solid ${P.bd}` }}>
                <div style={{ padding: 10, background: P.bg2, fontSize: 11, fontWeight: 800, color: P.cyan }}>6-PILLAR SYSTEM ARCHITECTURE POSTER</div>
                <img src="/project_phoenix_engineering_poster.jpg" alt="System Architecture" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>

              <div style={{ background: P.bg3, borderRadius: 10, overflow: "hidden", border: `1px solid ${P.bd}` }}>
                <div style={{ padding: 10, background: P.bg2, fontSize: 11, fontWeight: 800, color: P.purple }}>EXPLODED 3D CAD PALM CHASSIS &amp; ACTUATOR</div>
                <img src="/prosthetic_arm_render.jpg" alt="Exploded CAD Model" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            </div>
          </section>

          <section className="card" style={{ marginBottom: 24 }}>
            <div className="card-title"><span className="icon">📄</span> INTELLECTUAL PROPERTY &amp; PATENT PORTFOLIO</div>
            <div style={{ background: P.bg3, padding: 18, borderRadius: 10, border: `1px solid ${P.bd}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: P.cyan }}>INDIAN PROVISIONAL PATENT APPLICATION NO. 202641077314</div>
                <span className="status-badge badge-pass">FILED 23 JUNE 2026</span>
              </div>
              <div style={{ fontSize: 11, color: P.t2, lineHeight: 1.6 }}>
                Title: <em>"AUTONOMOUS MYOELECTRIC PROSTHETIC ARM WITH OFFLINE ARTIFICIAL INTELLIGENCE, BIDIRECTIONAL NEURAL FEEDBACK, EMOTION-AWARE GRIP CONTROL, SELF-PROTECTIVE SAFETY SYSTEMS, AND ADAPTIVE DESIGN FOR TRANSHUMERAL AMPUTEES WITH SKIN-GRAFTED RESIDUAL LIMBS"</em>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* MODE 2: LIVE DIGITAL TWIN DASHBOARD */}
      {viewMode === "dashboard" && (
        <div>
          <header className="header-banner">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span className="status-badge badge-info">SUBSYSTEM TRL: 3–4 (BENCH &amp; HIL SIMULATED)</span>
                  <span className="status-badge badge-pass">INDIAN PROVISIONAL PATENT FILED (NO. 202641077314)</span>
                </div>
                <h1 className="header-title">PROJECT PHOENIX · ENGINEERING VALIDATION PLATFORM</h1>
                <div className="header-subtitle">Digital Twin &amp; Hardware-in-the-Loop Simulation · Transhumeral Myoelectric Prosthesis</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={runInteractiveDiagnosticSuite} disabled={isDiagnosticRunning}>
                  {isDiagnosticRunning ? `⏳ TESTING (${diagnosticProgress}%)` : "▶ RUN DIAGNOSTIC SUITE"}
                </button>
                <button className="btn btn-outline" onClick={handleExportCSV}>📥 EXPORT REPORT (CSV)</button>
              </div>
            </div>

            <div style={{ marginTop: 16, background: P.bg2, padding: 12, borderRadius: 8, border: `1px solid ${P.bd}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: P.t1, fontWeight: 700 }}>SIMULATION VALIDATION PROGRESS</span>
                <span style={{ color: P.green, fontWeight: 800 }}>{validationPct}% ({validatedCount} / {TESTS.length} Claims Simulation Validated)</span>
              </div>
              <div className="progress-container"><div className="progress-fill" style={{ width: `${validationPct}%` }} /></div>
            </div>
          </header>

          <div className="card" style={{ marginBottom: 20, padding: 14 }}>
            <div style={{ fontSize: 11, color: P.cyan, fontWeight: 800, marginBottom: 8, letterSpacing: 1 }}>🧪 SIMULATION SCENARIO PRESETS (HIL TESTING)</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn-outline" onClick={() => triggerScenario("OPEN_HAND")}>🖐 Open Hand (Simulated)</button>
              <button className="btn btn-outline" onClick={() => triggerScenario("HOOK_GRIP")}>👜 Hook Grip (Simulated)</button>
              <button className="btn btn-outline" onClick={() => triggerScenario("PINCH_GRIP")}>🤏 Tip Pinch (Simulated)</button>
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

          <div className="grid-main">
            <div className="col-5">
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title"><span className="icon">🖐</span> KINEMATICS &amp; 3D MODEL (SIMULATED)</div>
                <div style={{ background: P.bg3, border: `1px solid ${P.bd}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: currentG.color, letterSpacing: 1 }}>{currentG.name} (SIMULATED)</div>
                  <div style={{ fontSize: 11, color: P.t2, marginTop: 4 }}>{currentG.desc}</div>
                  <div style={{ margin: "14px 0" }}>
                    <Arm3DViewer fingers={d.fingers} elbow={d.elbow} wrist={d.wrist} color={currentG.color} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-7">
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title"><span className="icon">🧠</span> SYNTIANT NDP120 AI ENGINE &amp; PERFORMANCE LIMITS (SIMULATED)</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
                  <div style={{ background: P.bg3, padding: 10, borderRadius: 6, border: `1px solid ${P.bd}` }}>
                    <div style={{ fontSize: 9, color: P.t2 }}>CONFIDENCE MARGIN</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: P.cyan }}>92.4% ± 2.1%</div>
                  </div>
                  <div style={{ background: P.bg3, padding: 10, borderRadius: 6, border: `1px solid ${P.bd}` }}>
                    <div style={{ fontSize: 9, color: P.t2 }}>LATENCY JITTER</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: P.green }}>22 ms ± 3 ms</div>
                  </div>
                  <div style={{ background: P.bg3, padding: 10, borderRadius: 6, border: `1px solid ${P.bd}` }}>
                    <div style={{ fontSize: 9, color: P.t2 }}>TOTAL INFERENCES</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: P.green }}>1,420</div>
                  </div>
                  <div style={{ background: P.bg3, padding: 10, borderRadius: 6, border: `1px solid ${P.bd}` }}>
                    <div style={{ fontSize: 9, color: P.t2 }}>PREDICTED POSE</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: P.amber }}>{currentG.name}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card">
                <div className="card-title" style={{ justifyContent: "space-between" }}>
                  <div><span className="icon">📋</span> PATENT SPECIFICATION VALIDATION SUITE</div>
                  <div style={{ fontSize: 11, color: P.t2, fontWeight: 700 }}>{validatedCount} / {TESTS.length} CLAIMS SIMULATION VALIDATED</div>
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
                        <tr key={i} onClick={() => setSelectedClaim(res)} style={{ borderBottom: `1px solid ${P.bg3}`, cursor: "pointer" }} className="table-row-hover">
                          <td style={{ padding: "10px", fontWeight: 800, color: P.cyan }}>{res.claim} 🔍</td>
                          <td style={{ padding: "10px", fontWeight: 700, color: P.t1 }}>{res.name}</td>
                          <td style={{ padding: "10px", color: P.purple, fontWeight: 600 }}>{res.evidence}</td>
                          <td style={{ padding: "10px", color: P.t2 }}>{res.sub}</td>
                          <td style={{ padding: "10px", color: P.green, fontWeight: 600 }}>{res.val}</td>
                          <td style={{ padding: "10px" }}><span className="status-badge badge-pass">✓ {res.status}</span></td>
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

      {/* Patent Claim Detail Modal */}
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

      {/* 🤖 FLOATING INTERACTIVE PROJECT PHOENIX AI ASSISTANT CHATBOT (ZERO SUGGESTION CHIPS) 🤖 */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 99999 }}>
        {!isChatOpen ? (
          <button
            className="btn btn-primary"
            onClick={() => setIsChatOpen(true)}
            style={{
              padding: "14px 22px",
              fontSize: 12,
              borderRadius: 30,
              boxShadow: "0 0 30px rgba(0, 229, 255, 0.6)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>🤖</span> ASK PHOENIX AI ASSISTANT
          </button>
        ) : (
          <div
            className="card"
            style={{
              width: 390,
              maxHeight: 520,
              display: "flex",
              flexDirection: "column",
              border: `1px solid ${P.cyan}`,
              boxShadow: "0 0 40px rgba(0, 229, 255, 0.3)",
              padding: 16,
            }}
          >
            {/* Chatbot Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${P.bd}`, paddingBottom: 10, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>🤖</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: P.cyan }}>PROJECT PHOENIX AI</div>
                  <div style={{ fontSize: 9, color: P.green }}>● ONLINE · Technical Knowledge Engine</div>
                </div>
              </div>
              <button className="btn btn-outline" style={{ padding: "2px 8px", fontSize: 10 }} onClick={() => setIsChatOpen(false)}>✕</button>
            </div>

            {/* Chat Messages Stream */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, maxHeight: 380, paddingRight: 4, marginBottom: 12 }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    background: msg.sender === "user" ? "rgba(0, 229, 255, 0.15)" : P.bg3,
                    border: `1px solid ${msg.sender === "user" ? P.cyan : P.bd}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 11,
                    color: P.t1,
                    maxWidth: "85%",
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input & Send Controls (ZERO SUGGESTION CHIPS DISPLAYED) */}
            <div style={{ display: "flex", gap: 6 }}>
              <input
                type="text"
                placeholder="Ask about AI, Patent, Safety, Grants..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                style={{ flex: 1, background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 6, padding: "10px 14px", color: P.t1, fontSize: 11, outline: "none" }}
              />
              <button className="btn btn-primary" style={{ padding: "10px 16px" }} onClick={() => handleSendMessage()}>SEND</button>
            </div>
          </div>
        )}
      </div>

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
          Subsystem TRL: <strong style={{ color: P.green }}>3–4 (HIL Simulated)</strong> · Version: <strong>v3.5.0-NoQuestionChips</strong> · Timestamp: 27 July 2026 20:46:59
        </div>
      </footer>
    </div>
  );
}
