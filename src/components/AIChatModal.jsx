import React, { useEffect, useRef } from 'react';

const P = {
  bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  purple: "#E040FB",
};

function renderFormattedText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} style={{ fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function AIChatModal({
  isChatOpen,
  setIsChatOpen,
  chatMessages,
  chatInput,
  setChatInput,
  handleSendChat
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen && messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  if (!isChatOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 12, width: "90%", maxWidth: 640, height: 520, display: "flex", flexDirection: "column", boxShadow: "0 20px 50px rgba(0,0,0,0.8)", overflow: "hidden" }}>
        {/* Modal Header */}
        <div style={{ background: P.bg3, borderBottom: `1px solid ${P.bd}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: P.t1 }}>Project Phoenix AI Assistant</div>
              <div style={{ fontSize: 10, color: P.t3 }}>Instant Q&A for Patent #202641077314, Specs, Gestures & Clinical Roadmap</div>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            style={{ background: "transparent", border: "none", color: P.t3, fontSize: 20, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        {/* Messages Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: msg.sender === "user" ? "linear-gradient(135deg, #00E5FF, #2979FF)" : P.bg3,
                color: msg.sender === "user" ? "#000" : P.t1,
                border: msg.sender === "user" ? "none" : `1px solid ${P.bd}`,
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 12,
                lineHeight: 1.5,
                fontWeight: msg.sender === "user" ? 700 : 400
              }}
            >
              {renderFormattedText(msg.text)}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
          style={{ padding: 12, background: P.bg3, borderTop: `1px solid ${P.bd}`, display: "flex", gap: 8 }}
        >
          <input
            type="text"
            autoFocus
            placeholder="Ask about 16 gestures, patent claims, 20.0 kPa lock, TI ADS1299..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={{ flex: 1, background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 6, padding: "10px 12px", color: P.t1, fontSize: 12, outline: "none" }}
          />
          <button
            type="submit"
            style={{ background: P.cyan, color: "#000", border: "none", borderRadius: 6, padding: "0 16px", fontWeight: 800, fontSize: 12, cursor: "pointer" }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
