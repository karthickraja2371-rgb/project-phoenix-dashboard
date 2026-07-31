import React from 'react';

const P = {
  bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  red: "#FF3D00",
};

export default function TelemetryLog({ telemetryLogs, logContainerRef }) {
  return (
    <div style={{ background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", height: 180 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: P.t2, letterSpacing: 0.5 }}>
          💻 REAL-TIME SYSTEM TELEMETRY BUS LOG (CAN-FD 1Mbps / 2000Hz ADS1299)
        </span>
        <span style={{ fontSize: 10, color: P.cyan, background: "rgba(0, 229, 255, 0.1)", padding: "2px 6px", borderRadius: 4, border: `1px solid ${P.cyan}` }}>
          50ms WATCHDOG ACTIVE
        </span>
      </div>

      <div
        ref={logContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#020610",
          border: `1px solid ${P.bd}`,
          borderRadius: 6,
          padding: 8,
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 11,
          lineHeight: 1.4
        }}
      >
        {telemetryLogs.length === 0 ? (
          <div style={{ color: P.t3, fontStyle: "italic" }}>Initializing CAN-FD bus & TI ADS1299 telemetry stream...</div>
        ) : (
          telemetryLogs.map((log, idx) => (
            <div key={idx} style={{ color: log.color, marginBottom: 2 }}>
              <span style={{ color: P.t3, marginRight: 8 }}>[{log.time}]</span>
              {log.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
