import React from 'react';

const P = {
  bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
};

export default function GestureSelector({
  GESTURES,
  activeGestureIdx,
  manualGestureIdx,
  setManualGestureIdx,
  isAutoCycle,
  setIsAutoCycle,
  audioTelemetry
}) {
  return (
    <div style={{ background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: P.t1, letterSpacing: 0.5 }}>
            🖐️ 16 FUNCTIONAL & EXPRESSIVE BIONIC GESTURE LIBRARY
          </span>
          <span style={{ fontSize: 11, color: P.t3, marginLeft: 8 }}>
            (Syntiant NDP120 Edge AI Neural Classifier)
          </span>
        </div>
        <button
          onClick={() => setIsAutoCycle(!isAutoCycle)}
          style={{
            background: isAutoCycle ? "rgba(0, 229, 255, 0.15)" : "rgba(255, 179, 0, 0.15)",
            color: isAutoCycle ? P.cyan : P.amber,
            border: `1px solid ${isAutoCycle ? P.cyan : P.amber}`,
            padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 800, cursor: "pointer"
          }}
        >
          {isAutoCycle ? "🔄 Auto-Cycle Active (Every 3.75s)" : "⏸ Manual Pose Locked"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, maxHeight: 190, overflowY: "auto", paddingRight: 4 }}>
        {GESTURES.map((g, idx) => {
          const isActive = idx === activeGestureIdx;
          return (
            <div
              key={idx}
              onClick={() => {
                setIsAutoCycle(false);
                setManualGestureIdx(idx);
                if (audioTelemetry && audioTelemetry.enabled) {
                  audioTelemetry.speakGesture(g.name);
                }
              }}
              style={{
                background: isActive ? `rgba(0, 229, 255, 0.15)` : P.bg3,
                border: `1px solid ${isActive ? g.color : P.bd}`,
                borderRadius: 6,
                padding: "8px 10px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: isActive ? P.t1 : P.t2 }}>{g.name}</span>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: g.color }} />
              </div>
              <div style={{ fontSize: 9, color: P.t3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {g.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
