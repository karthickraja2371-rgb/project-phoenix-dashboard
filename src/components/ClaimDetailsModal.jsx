import React from 'react';

const P = {
  bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  red: "#FF3D00", blue: "#2979FF",
};

export default function ClaimDetailsModal({ selectedClaim, setSelectedClaim }) {
  if (!selectedClaim) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: P.bg2, border: `1px solid ${P.cyan}`, borderRadius: 12, width: "90%", maxWidth: 560, padding: 24, boxShadow: "0 20px 50px rgba(0,229,255,0.2)", position: "relative" }}>
        <button
          onClick={() => setSelectedClaim(null)}
          style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", color: P.t3, fontSize: 20, cursor: "pointer" }}
        >
          ✕
        </button>

        <div style={{ color: P.cyan, fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 4 }}>
          INDIAN PROVISIONAL PATENT APP NO. 202641077314
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: P.t1, marginBottom: 8 }}>
          {selectedClaim.claim}: {selectedClaim.name}
        </h3>

        <div style={{ background: P.bg3, border: `1px solid ${P.bd}`, borderRadius: 8, padding: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: P.green, fontWeight: 700, marginBottom: 4 }}>EVIDENCE TYPE: {selectedClaim.evidence}</div>
          <div style={{ fontSize: 12, color: P.t2 }}>{selectedClaim.sub}</div>
        </div>

        <p style={{ fontSize: 13, color: P.t2, lineHeight: 1.6, marginBottom: 20 }}>
          {selectedClaim.detail}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${P.bd}` }}>
          <span style={{ fontSize: 11, color: P.t3 }}>Status: <strong style={{ color: P.green }}>SIMULATION VALIDATED</strong></span>
          <button
            onClick={() => setSelectedClaim(null)}
            style={{ background: P.cyan, color: "#000", border: "none", padding: "6px 16px", borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: "pointer" }}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
