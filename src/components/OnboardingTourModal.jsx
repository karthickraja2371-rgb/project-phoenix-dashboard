import React, { useState } from 'react';

const P = {
  bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  purple: "#E040FB"
};

const TOUR_STEPS = [
  {
    title: "🧠 100% Offline Edge AI (Syntiant NDP120)",
    desc: "Project Phoenix utilizes an embedded Syntiant NDP120 neural decision processor inside the palm chassis, running sEMG gesture classification at <5mW power and 22ms latency with zero cloud biometric privacy leakage.",
    highlight: "Claim 1 & Claim 5",
  },
  {
    title: "🛡️ 20.0 kPa FSR Skin-Graft Pressure Lock Interlock",
    desc: "Designed specifically for transhumeral amputees with skin grafts. An 8-point FSR socket array scans pressure 2000 times/second; exceeding 20.0 kPa triggers an immediate STM32H753 hardware interrupt cutting motor power.",
    highlight: "Claim 8 & Article 14",
  },
  {
    title: "🖐️ 16 Bionic Kinematic Gesture Library",
    desc: "Supports 16 functional and expressive gestures (Power Grip, Pinch, Lateral Key Grip, Tripod, Wave, OK Sign). Pose kinematics update dynamically in 3D WebGL with smooth finger curling interpolation.",
    highlight: "16 Gestures",
  },
  {
    title: "🩺 Clinician vs. Engineer Dual View Modes",
    desc: "Toggle between Clinician Mode (simplified socket pressure, temperature, and battery runtime for fitting trials) and Engineer Mode (full 24-bit sEMG waveforms, CAN-FD logs, and microclimate telemetry).",
    highlight: "Dual View Modes",
  },
];

export default function OnboardingTourModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(3, 8, 18, 0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
      <div style={{ background: P.bg2, border: `1px solid ${P.cyan}`, borderRadius: 12, padding: 24, maxWidth: 520, width: "100%", boxShadow: "0 0 40px rgba(0, 229, 255, 0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: P.cyan, letterSpacing: 1 }}>
            GUIDED TOUR — STEP {currentStep + 1} OF {TOUR_STEPS.length}
          </span>
          <span style={{ background: "rgba(0, 229, 255, 0.15)", color: P.cyan, fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
            {step.highlight}
          </span>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 800, color: P.t1, marginBottom: 10 }}>
          {step.title}
        </h3>

        <p style={{ fontSize: 13, color: P.t2, lineHeight: 1.6, marginBottom: 20 }}>
          {step.desc}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: P.t3, fontSize: 12, cursor: "pointer", fontWeight: 700 }}
          >
            Skip Tour
          </button>

          <div style={{ display: "flex", gap: 8 }}>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                style={{ background: P.bg3, border: `1px solid ${P.bd}`, color: P.t2, padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >
                Previous
              </button>
            )}

            {currentStep < TOUR_STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                style={{ background: P.cyan, border: "none", color: "#000", padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 800, cursor: "pointer" }}
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={onClose}
                style={{ background: P.green, border: "none", color: "#000", padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 800, cursor: "pointer" }}
              >
                Explore Dashboard ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
