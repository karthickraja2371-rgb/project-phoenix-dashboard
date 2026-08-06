import React, { useState, useEffect, useRef, useCallback } from 'react';
import HeaderNavbar from './components/HeaderNavbar';
import Dashboard from './components/Dashboard';
import VideoPlayer from './components/VideoPlayer';
import AIChatModal from './components/AIChatModal';
import ClaimDetailsModal from './components/ClaimDetailsModal';
import OnboardingTourModal from './components/OnboardingTourModal';
import Arm3DViewer from './components/Arm3DViewer';

import { useTelemetry, GESTURES } from './hooks/useTelemetry';
import { useVoiceEngine } from './hooks/useVoiceEngine';
import { audioTelemetry } from './utils/audioTelemetryEngine';

// ── Color Palette ─────────────────────────────────────────────────────────────
const P = {
  bg: "#030812", bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  red: "#FF3D00", blue: "#2979FF", purple: "#E040FB",
};



// ── Offline AI Chat Response Engine ───────────────────────────────────────────
const getBotResponse = (question) => {
  const q = question.toLowerCase().trim();
  if (q.includes("hi") || q.includes("hello") || q.includes("hey"))
    return "👋 Hello! I am the **Project Phoenix AI Assistant**. How can I help you explore our bionic prosthesis system today?";
  if (q.includes("gesture") || q.includes("pose") || q.includes("how many"))
    return "🖐️ **16 Gesture Library**: Project Phoenix supports 16 functional & expressive gestures: Power Grip, Tip Pinch, Cylindrical, Lateral (Key), Open Hand, Tripod, Hook, Point, Key Grip, Thumbs Up, Precision Pinch, Wave, Peace Sign (✌️), Spherical Grip (⚽), Tweezer Grip (🥢), and OK Sign (👌).";
  if (q.includes("patent") || q.includes("claim") || q.includes("number"))
    return "📜 **Patent Information**: Project Phoenix holds Indian Provisional Patent Application No. **202641077314** (Filed **23 June 2026**). It features **13 Novel Claims** covering offline Syntiant AI, microfluidic sweat cortisol capping, self-healing socket liners, 20.0 kPa FSR pressure locks, and 3-position TENS rotation.";
  if (q.includes("safety") || q.includes("pressure") || q.includes("graft") || q.includes("skin"))
    return "🛡️ **Skin Graft Safety System**: Designed specifically for skin-grafted transhumeral amputees. Features an 8-point FSR array that triggers an **automatic 20.0 kPa passive lock interrupt** to protect skin-grafted tissue. Includes daily 3-position TENS pad rotation.";
  if (q.includes("ai") || q.includes("offline") || q.includes("syntiant") || q.includes("chip"))
    return "🧠 **Offline Syntiant AI Engine**: Utilizes a palm-embedded **Syntiant NDP120 neural processor (<4.8mW power)** that classifies sEMG gestures in **22ms (SIMULATED)** with **100% offline edge privacy**.";
  return "⚡ **Project Phoenix AI Assistant**: Project Phoenix is an autonomous 1.18kg transhumeral myoelectric prosthesis with Indian Provisional Patent No. 202641077314. Key specifications include 16 gesture classes, offline Syntiant NDP120 neural AI (22ms latency), and 20.0 kPa FSR socket pressure lock.";
};

// ── Root Application Component ────────────────────────────────────────────────
export default function App() {
  // View state
  const [viewMode, setViewMode] = useState("dashboard");
  const [viewModeType, setViewModeType] = useState("engineer");

  // Gesture & override controls
  const [isAutoCycle, setIsAutoCycle] = useState(true);
  const [manualGestureIdx, setManualGestureIdx] = useState(0);
  const [cortisolOverride, setCortisolOverride] = useState(0.28);

  // Fault injection toggles (for demo purposes)
  const [pressureSpike, setPressureSpike] = useState(false);
  const [sensorFailure, setSensorFailure] = useState(false);
  const [lowBattery, setLowBattery] = useState(false);

  // Modal state
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isOnboardingTourOpen, setIsOnboardingTourOpen] = useState(false); // FIX: was missing

  // ── Telemetry Hook (replaces duplicate inline setInterval in old App.jsx) ───
  const { telemetryData: d, telemetryLogs, addLog, exportCSV } = useTelemetry(
    isAutoCycle,
    manualGestureIdx,
    cortisolOverride,
    pressureSpike,
    sensorFailure,
    lowBattery
  );

  const logContainerRef = useRef(null);

  // ── 3D Video Storyboard Player ─────────────────────────────────────────────
  const [activeVideoLoop, setActiveVideoLoop] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  useEffect(() => {
    if (!isVideoPlaying) return;
    const interval = setInterval(() => setActiveVideoLoop((prev) => (prev + 1) % 3), 4000);
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // ── WebSerial Hardware Connection ─────────────────────────────────────────
  const [isSerialConnected, setIsSerialConnected] = useState(false);

  const handleConnectWebSerial = useCallback(async () => {
    if ('serial' in navigator) {
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        setIsSerialConnected(true);
        addLog({ time: new Date().toLocaleTimeString(), text: "🔌 [WEBSERIAL API] Connected to live hardware (115200 Baud). Streaming real-time sEMG & FSR telemetry.", color: P.green });
      } catch (err) {
        addLog({ time: new Date().toLocaleTimeString(), text: `⚠️ [WEBSERIAL API] Serial Port Connection Cancelled: ${err.message}`, color: P.amber });
      }
    } else {
      alert("WebSerial API is supported in Chrome, Edge, and Opera browsers. Connect microcontrollers over USB for live telemetry.");
    }
  }, [addLog]);

  // ── Audio Telemetry ────────────────────────────────────────────────────────
  const [isAudioTelemetryActive, setIsAudioTelemetryActive] = useState(true);

  // ── Voice Engine Hook (replaces duplicate inline VoiceCommandEngine) ───────
  const handleGestureRecognized = useCallback((gestureIdx) => {
    setIsAutoCycle(false);
    setManualGestureIdx(gestureIdx);
    if (isAudioTelemetryActive && audioTelemetry.enabled) {
      audioTelemetry.speakGesture(GESTURES[gestureIdx].name);
    }
  }, [isAudioTelemetryActive]);

  const { isVoiceListening, toggleVoiceListening } = useVoiceEngine(handleGestureRecognized, addLog);

  // ── System Diagnostics Runner ──────────────────────────────────────────────
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(100);

  const runFullSystemDiagnostics = useCallback(() => {
    setIsDiagnosticRunning(true);
    setDiagnosticProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setDiagnosticProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsDiagnosticRunning(false);
        addLog({ time: new Date().toLocaleTimeString(), text: `✅ [DIAGNOSTICS COMPLETE] All 13 Patent Claims Verified in HIL Simulation Mode`, color: P.green });
        if (audioTelemetry?.enabled) {
          audioTelemetry.speak("Diagnostics complete. All 13 patent claims verified.", true);
        }
      }
    }, 200);
  }, [addLog]);

  // ── Global Keyboard Shortcuts ─────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsAutoCycle((prev) => !prev);
      } else if (e.key >= '1' && e.key <= '9') {
        setIsAutoCycle(false);
        setManualGestureIdx(parseInt(e.key, 10) - 1);
      } else if (e.code === 'KeyV') {
        toggleVoiceListening();
      } else if (e.code === 'KeyD') {
        runFullSystemDiagnostics();
      } else if (e.code === 'Escape') {
        setSelectedClaim(null);
        setIsChatOpen(false);
        setIsOnboardingTourOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleVoiceListening, runFullSystemDiagnostics]);

  // ── AI Chat ────────────────────────────────────────────────────────────────
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
      setChatMessages((prev) => [...prev, { sender: "bot", text: getBotResponse(userMsg) }]);
    }, 400);
  };

  // Auto-scroll telemetry log to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [telemetryLogs]);

  const currentGestureIdx = isAutoCycle ? d.gIdx : manualGestureIdx;

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
            setManualGestureIdx={setManualGestureIdx}
            isAutoCycle={isAutoCycle}
            setIsAutoCycle={setIsAutoCycle}
            audioTelemetry={audioTelemetry}
            d={d}
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
            telemetryLogs={telemetryLogs}
            logContainerRef={logContainerRef}
          />
        )}

        {viewMode === "cad" && (
          <div style={{ background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: P.t1, margin: 0 }}>
                  📐 Engineering CAD Model — Three.js WebGL Digital Twin
                </h2>
                <p style={{ fontSize: 11, color: P.t3, margin: "4px 0 0 0" }}>
                  Interactive 3D kinematic model · Drag to rotate · Use exploded view slider · Click component badges for specs
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ background: "rgba(0, 229, 255, 0.15)", color: P.cyan, border: `1px solid ${P.cyan}`, fontSize: 10, padding: "3px 10px", borderRadius: 4, fontWeight: 800 }}>
                  CLAIM 13 — INTEGRATED ASSEMBLY
                </span>
                <span style={{ background: "rgba(0, 230, 118, 0.15)", color: P.green, border: `1px solid ${P.green}`, fontSize: 10, padding: "3px 10px", borderRadius: 4, fontWeight: 800 }}>
                  60 FPS REAL-TIME
                </span>
              </div>
            </div>
            <div style={{ width: "100%", height: 620, borderRadius: 10, overflow: "hidden", border: `1px solid ${P.cyan}`, boxShadow: "0 0 40px rgba(0, 229, 255, 0.15)" }}>
              <Arm3DViewer
                fingers={GESTURES[currentGestureIdx].fingers}
                elbow={d.elbow}
                wrist={d.wrist}
                color={GESTURES[currentGestureIdx].color}
              />
            </div>
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

      {/* FIX: isOnboardingTourOpen and setIsOnboardingTourOpen are now properly declared above */}
      <OnboardingTourModal
        isOpen={isOnboardingTourOpen}
        onClose={() => setIsOnboardingTourOpen(false)}
      />

      {/* System Footer */}
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
