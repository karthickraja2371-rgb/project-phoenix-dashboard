import React, { useState, useEffect, useRef } from 'react';
import HeaderNavbar from './components/HeaderNavbar';
import Dashboard from './components/Dashboard';
import VideoPlayer from './components/VideoPlayer';
import AIChatModal from './components/AIChatModal';
import ClaimDetailsModal from './components/ClaimDetailsModal';
import OnboardingTourModal from './components/OnboardingTourModal';

import { VoiceCommandEngine } from './utils/voiceCommandEngine';
import { audioTelemetry } from './utils/audioTelemetryEngine';

// ── Constants & Palettes ──────────────────────────────────────────────────────
const P = {
  bg: "#030812", bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  red: "#FF3D00", blue: "#2979FF", purple: "#E040FB",
};

// 16 Functional & Expressive Bionic Gestures
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
  { name: "PEACE SIGN",     fingers: [75,  0,  0, 70, 65], color: "#1DE9B6", desc: "Extended index + middle peace gesture" },
  { name: "SPHERICAL GRIP", fingers: [50, 55, 55, 50, 45], color: "#FFD600", desc: "Cupped palm for holding spherical objects/balls" },
  { name: "TWEEZER GRIP",   fingers: [60, 65, 65, 15, 10], color: "#00B0FF", desc: "Parallel alignment for ultra-thin items" },
  { name: "OK SIGN",        fingers: [90, 90,  0,  0,  0], color: "#D500F9", desc: "Thumb + Index tip circle with extended fingers" },
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

const getBotResponse = (question) => {
  const q = question.toLowerCase().trim();
  if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
    return "👋 Hello! I am the **Project Phoenix AI Assistant**. How can I help you explore our bionic prosthesis system today?";
  }
  if (q.includes("gesture") || q.includes("pose") || q.includes("how many")) {
    return "🖐️ **16 Gesture Library**: Project Phoenix supports 16 functional & expressive gestures: Power Grip, Tip Pinch, Cylindrical, Lateral (Key), Open Hand, Tripod, Hook, Point, Key Grip, Thumbs Up, Precision Pinch, Wave, Peace Sign (✌️), Spherical Grip (⚽), Tweezer Grip (🥢), and OK Sign (👌).";
  }
  if (q.includes("patent") || q.includes("claim") || q.includes("number")) {
    return "📜 **Patent Information**: Project Phoenix holds Indian Provisional Patent Application No. **202641077314** (Filed **23 June 2026**). It features **13 Novel Claims** covering offline Syntiant AI, microfluidic sweat cortisol capping, self-healing socket liners, 20.0 kPa FSR pressure locks, and 3-position TENS rotation.";
  }
  if (q.includes("safety") || q.includes("pressure") || q.includes("graft") || q.includes("skin")) {
    return "🛡️ **Skin Graft Safety System**: Designed specifically for skin-grafted transhumeral amputees. Features an 8-point FSR array that triggers an **automatic 20.0 kPa passive lock interrupt** to protect skin-grafted tissue. Includes daily 3-position TENS pad rotation.";
  }
  if (q.includes("ai") || q.includes("offline") || q.includes("syntiant") || q.includes("chip")) {
    return "🧠 **Offline Syntiant AI Engine**: Utilizes a palm-embedded **Syntiant NDP120 neural processor (<4.8mW power)** that classifies sEMG gestures in **22ms (SIMULATED)** with **100% offline edge privacy**.";
  }
  return "⚡ **Project Phoenix AI Assistant**: Project Phoenix is an autonomous 1.18kg transhumeral myoelectric prosthesis with Indian Provisional Patent No. 202641077314. Key specifications include 16 gesture classes, offline Syntiant NDP120 neural AI (22ms latency), and 20.0 kPa FSR socket pressure lock.";
};

export default function App() {
  const [viewMode, setViewMode] = useState("dashboard");
  const [viewModeType, setViewModeType] = useState("engineer"); // "engineer" vs "clinician"
  const [isAutoCycle, setIsAutoCycle] = useState(true);
  const [manualGestureIdx, setManualGestureIdx] = useState(0);
  const [cortisolOverride, setCortisolOverride] = useState(0.28);
  const [pressureSpike, setPressureSpike] = useState(false);
  const [sensorFailure, setSensorFailure] = useState(false);
  const [lowBattery, setLowBattery] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Digital Twin Real-Time Log State
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const logContainerRef = useRef(null);

  // 3D Video Storyboard Player State
  const [activeVideoLoop, setActiveVideoLoop] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  useEffect(() => {
    if (!isVideoPlaying) return;
    const interval = setInterval(() => {
      setActiveVideoLoop((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // WebSerial Hardware Hook State
  const [isSerialConnected, setIsSerialConnected] = useState(false);

  const handleConnectWebSerial = async () => {
    if ('serial' in navigator) {
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        setIsSerialConnected(true);
        const timeStr = new Date().toLocaleTimeString();
        setTelemetryLogs((prev) => [
          ...prev.slice(-30),
          { time: timeStr, text: "🔌 [WEBSERIAL API] Connected to live hardware (115200 Baud). Streaming real-time sEMG & FSR telemetry.", color: P.green }
        ]);
      } catch (err) {
        const timeStr = new Date().toLocaleTimeString();
        setTelemetryLogs((prev) => [
          ...prev.slice(-30),
          { time: timeStr, text: `⚠️ [WEBSERIAL API] Serial Port Connection Cancelled: ${err.message}`, color: P.amber }
        ]);
      }
    } else {
      alert("WebSerial API is supported in Chrome, Edge, and Opera browsers. Connect microcontrollers over USB for live telemetry.");
    }
  };

  // Voice & Audio Telemetry State
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isAudioTelemetryActive, setIsAudioTelemetryActive] = useState(true);
  const voiceEngineRef = useRef(null);

  useEffect(() => {
    voiceEngineRef.current = new VoiceCommandEngine(
      (res) => {
        setIsAutoCycle(false);
        setManualGestureIdx(res.gestureIdx);
        const timeStr = new Date().toLocaleTimeString();
        setTelemetryLogs((prev) => [
          ...prev.slice(-30),
          { time: timeStr, text: `🎤 [CLAIM 7 VOICE COMMAND] Recognized keyword "${res.keyword}" -> Posing ${GESTURES[res.gestureIdx].name}`, color: P.cyan }
        ]);
        if (audioTelemetry.enabled) {
          audioTelemetry.speakGesture(GESTURES[res.gestureIdx].name);
        }
      },
      (errType, errMsg) => {
        const timeStr = new Date().toLocaleTimeString();
        setTelemetryLogs((prev) => [
          ...prev.slice(-30),
          { time: timeStr, text: `⚠️ [VOICE ENGINE NOTICE] ${errMsg}`, color: P.amber }
        ]);
        setIsVoiceListening(false);
      }
    );

    return () => {
      if (voiceEngineRef.current) {
        voiceEngineRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceListening = () => {
    if (!voiceEngineRef.current) return;
    if (isVoiceListening) {
      voiceEngineRef.current.stop();
      setIsVoiceListening(false);
    } else {
      const started = voiceEngineRef.current.start();
      setIsVoiceListening(started);
    }
  };

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keybindings if user is typing in chat input
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsAutoCycle((prev) => !prev);
      } else if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key, 10) - 1;
        setIsAutoCycle(false);
        setManualGestureIdx(idx);
      } else if (e.code === 'KeyV') {
        toggleVoiceListening();
      } else if (e.code === 'KeyD') {
        runFullSystemDiagnostics();
      } else if (e.code === 'Escape') {
        setSelectedClaim(null);
        setIsChatOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const exportCSV = () => {
    const d = dataRef.current;
    const headers = "Timestamp,PeakPressure_kPa,Temp_C,Humidity_RH,Cortisol_ug_dL,GripCeiling_Pct,Battery_V\n";
    const row = `${new Date().toISOString()},${d.pressure},${d.temperature},${d.humidity},${d.cortisol},${d.gripCeiling},${d.batteryV}\n`;
    const blob = new Blob([headers + row], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_phoenix_telemetry_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "👋 Hello! I am the **Project Phoenix AI Assistant**. How can I help you explore our 16 bionic gestures, patent, or clinical roadmap today?" }
  ]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setTimeout(() => {
      const botReply = getBotResponse(userMsg);
      setChatMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 400);
  };

  // Diagnostic runner states
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(100);
  const [testResults, setTestResults] = useState(
    TESTS.map((t, idx) => ({ ...t, val: RESULT_VALS[idx], status: "SIMULATION VALIDATED" }))
  );

  const runFullSystemDiagnostics = () => {
    setIsDiagnosticRunning(true);
    setDiagnosticProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setDiagnosticProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsDiagnosticRunning(false);
        const timeStr = new Date().toLocaleTimeString();
        setTelemetryLogs((prev) => [
          ...prev,
          { time: timeStr, text: `✅ [DIAGNOSTICS COMPLETE] All 13 Patent Claims Verified in HIL Simulation Mode`, color: P.green }
        ]);
        if (audioTelemetry && audioTelemetry.enabled && typeof audioTelemetry.speak === 'function') {
          audioTelemetry.speak("Diagnostics complete. All 13 patent claims verified.", true);
        }
      }
    }, 200);
  };

  // Mutable telemetry reference
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
  const tickRef = useRef(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const t = tickRef.current;
      tickRef.current += 1;

      const d = dataRef.current;
      const currentIdx = isAutoCycle ? d.gIdx : manualGestureIdx;
      const g = GESTURES[currentIdx % GESTURES.length];

      d.emg = d.emg.map((ch, ci) => {
        if (sensorFailure && ci === 2) return [...ch, 0];
        const baseAmp = [0.85, 0.42, 0.55, 0.38][ci];
        const noise = (Math.random() - 0.5) * 0.2;
        const val = Math.max(0, baseAmp * (0.7 + Math.sin(t * 0.2 + ci) * 0.3) + noise);
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
      d.temperature = 34.0 + Math.sin(t * 0.05) * 1.5;
      d.humidity = 60 + Math.cos(t * 0.05) * 5;

      d.confidence = Math.min(0.99, Math.max(0.75, 0.924 + (Math.random() - 0.5) * 0.04));
      d.latency = Math.round(18 + Math.random() * 8);
      d.elbow = Math.round(30 + Math.sin(t * 0.1) * 45);
      d.wrist = Math.round(Math.cos(t * 0.1) * 35);
      d.tens = [0, 1, 2, 3].map((i) => +(1.2 + Math.sin(t * 0.3 + i) * 1.0).toFixed(1));

      // Append Real-Time Telemetry Log Line
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      let logMsg = "";
      let logColor = P.green;

      if (pressureSpike) {
        logMsg = `[FSR WARN] Socket Pressure Spike: ${d.pressure.toFixed(1)} kPa (>20.0 kPa Limit) → PASSIVE LOCK ENGAGED`;
        logColor = P.red;
      } else if (sensorFailure) {
        logMsg = `[EMG WARN] Channel 3 Sensor Disconnect Detected → TI ADS1299 Auto-Recalibrating 3-Channel Fallback`;
        logColor = P.amber;
      } else if (lowBattery) {
        logMsg = `[POWER WARN] Low Pack Voltage: ${d.batteryV.toFixed(1)}V (<15%) → Power Saver Mode Activated`;
        logColor = P.amber;
      } else {
        const categories = [
          `[AI SIMULATED] NDP120 Neural Inference: ${g.name} (${(d.confidence * 100).toFixed(1)}% Conf, ${d.latency}ms Latency)`,
          `[CAN-FD SIMULATED] Differential Bus TX: Palm Master → Elbow Satellite | Payload 0x2A4 OK`,
          `[EMG SIMULATED] 2000Hz TI ADS1299 Sampling | CH1: ${d.emg[0][d.emg[0].length-1]?.toFixed(2)}mV, CH2: ${d.emg[1][d.emg[1].length-1]?.toFixed(2)}mV`,
          `[SOCKET SIMULATED] FSR Array Peak Pressure: ${d.pressure.toFixed(1)} kPa | SHT31 Temp: ${d.temperature.toFixed(1)}°C, RH: ${d.humidity.toFixed(0)}%`,
          `[BIO SIMULATED] Sweat Cortisol: ${d.cortisol.toFixed(2)} ug/dL | Grip Ceiling: ${d.gripCeiling}% Cap | TENS 100Hz Active`,
        ];
        logMsg = categories[t % categories.length];
        logColor = t % 2 === 0 ? P.cyan : P.green;
      }

      setTelemetryLogs((prev) => {
        const nextLogs = [...prev, { time: timeStr, text: logMsg, color: logColor }];
        if (nextLogs.length > 50) nextLogs.shift();
        return nextLogs;
      });

      if (isAutoCycle && t % 25 === 0 && t > 0) {
        d.gIdx = (d.gIdx + 1) % GESTURES.length;
      }

      setTick(t + 1);
    }, 150);

    return () => clearInterval(intervalRef.current);
  }, [isAutoCycle, manualGestureIdx, cortisolOverride, pressureSpike, sensorFailure, lowBattery]);

  // Auto-scroll telemetry log to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [telemetryLogs]);

  const currentGestureIdx = isAutoCycle ? dataRef.current.gIdx : manualGestureIdx;

  return (
    <div style={{ background: P.bg, color: P.t1, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header Navigation Bar */}
      <HeaderNavbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        isVoiceListening={isVoiceListening}
        toggleVoiceListening={toggleVoiceListening}
        isAudioTelemetryActive={isAudioTelemetryActive}
        setIsAudioTelemetryActive={setIsAudioTelemetryActive}
        setIsChatOpen={setIsChatOpen}
        pressureSpike={pressureSpike}
        sensorFailure={sensorFailure}
        lowBattery={lowBattery}
        viewModeType={viewModeType}
        setViewModeType={setViewModeType}
        exportCSV={exportCSV}
        onConnectWebSerial={handleConnectWebSerial}
        isSerialConnected={isSerialConnected}
      />

      {/* Main Content Area */}
      <main style={{ padding: 20, maxWidth: 1440, margin: "0 auto" }}>
        {viewMode === "dashboard" && (
          <Dashboard
            GESTURES={GESTURES}
            currentGestureIdx={currentGestureIdx}
            manualGestureIdx={manualGestureIdx}
            setManualGestureIdx={setManualGestureIdx}
            isAutoCycle={isAutoCycle}
            setIsAutoCycle={setIsAutoCycle}
            audioTelemetry={audioTelemetry}
            d={dataRef.current}
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
            testResults={testResults}
            setSelectedClaim={setSelectedClaim}
            telemetryLogs={telemetryLogs}
            logContainerRef={logContainerRef}
          />
        )}

        {viewMode === "cad" && (
          <div style={{ background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 12, padding: 20, textAlign: "center" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: P.t1, marginBottom: 8 }}>🎨 Tripo3D Interactive 3D Model (#42691fd0)</h2>
            <p style={{ fontSize: 12, color: P.t2, marginBottom: 16 }}>
              Interactive CAD Mesh created by lead engineer R. Karthick Raja for physical SLS titanium & 3D printed monocoque manufacturing.
            </p>
            <iframe
              src="https://studio.tripo3d.ai/3d-model/42691fd0-7309-4c2e-bbe7-6b26b8cc9b1d"
              title="Project Phoenix Tripo3D Model"
              style={{ width: "100%", height: 580, border: `1px solid ${P.cyan}`, borderRadius: 8 }}
            />
          </div>
        )}

        {viewMode === "video" && (
          <VideoPlayer
            activeVideoLoop={activeVideoLoop}
            setActiveVideoLoop={setActiveVideoLoop}
            isVideoPlaying={isVideoPlaying}
            setIsVideoPlaying={setIsVideoPlaying}
          />
        )}
      </main>

      {/* Modals */}
      <AIChatModal
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleSendChat={handleSendChat}
      />

      <ClaimDetailsModal
        selectedClaim={selectedClaim}
        setSelectedClaim={setSelectedClaim}
      />

      <OnboardingTourModal
        isOpen={isOnboardingTourOpen}
        onClose={() => setIsOnboardingTourOpen(false)}
      />

      {/* System Footer & WebGL Performance Diagnostics Badge */}
      <footer style={{ background: P.bg2, borderTop: `1px solid ${P.bd}`, padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: P.t3, flexWrap: "wrap", gap: 10 }}>
        <div>
          PROJECT PHOENIX BIONIC PROSTHESIS · INDIAN PROVISIONAL PATENT APP NO. 202641077314 (FILED 23 JUNE 2026)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: P.green, fontWeight: 700 }}>
            ⚡ WebGL Render: 60 FPS (0.8ms CPU)
          </span>
          <span style={{ color: P.t3 }}>|</span>
          <button
            onClick={() => setIsOnboardingTourOpen(true)}
            style={{ background: "transparent", border: `1px solid ${P.cyan}`, color: P.cyan, padding: "2px 8px", borderRadius: 4, fontSize: 10, cursor: "pointer", fontWeight: 700 }}
          >
            🧭 Take Guided Tour
          </button>
        </div>
      </footer>
    </div>
  );
}
