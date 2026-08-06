import React from 'react';

const P = {
  bg2: "#0A1424", bg3: "#101F36", bd: "#172A45",
  t1: "#FFFFFF", t2: "#CBD5E1", t3: "#64748B",
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
};

export default function VideoPlayer({
  activeVideoLoop,
  setActiveVideoLoop,
  isVideoPlaying,
  setIsVideoPlaying
}) {
  const VIDEO_LOOPS = [
    {
      id: 0,
      title: "LOOP 1: 20.0 kPa Socket Pressure Lock & Passive Tendon Interrupt",
      sub: "8-point FSR sensor array detecting skin graft shear stress → STM32 hardware comparator cuts motor PWM in <5ms.",
      poster: "/loop1_safety_lock.jpg",
      tags: ["Claim 8", "FSR Array", "<5ms Hardware Cutoff", "Skin Graft Safety"]
    },
    {
      id: 1,
      title: "LOOP 2: Precision Actuation & Maxon ECX Worm Gear Drive",
      sub: "50:1 non-backdrivable GP 16 C worm gear holding heavy objects with 0W passive electrical power draw.",
      poster: "/loop2_precision_actuation.jpg",
      tags: ["Maxon ECX 16", "50:1 Worm Gear", "0W Holding Power", "1.18kg Monocoque"]
    },
    {
      id: 2,
      title: "LOOP 3: Intent Fusion Engine — Vision Camera + 2000Hz sEMG AFE",
      sub: "OV2640 palmar camera object pre-shaping 300ms prior to contact + Syntiant NDP120 edge AI classification.",
      poster: "/loop3_logic_fusion.jpg",
      tags: ["Claim 2 Vision Fusion", "Syntiant NDP120", "OV2640 Palmar Camera", "22ms Latency"]
    }
  ];

  const currentLoop = VIDEO_LOOPS[activeVideoLoop];

  return (
    <div style={{ background: P.bg2, border: `1px solid ${P.bd}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: P.t1, margin: 0 }}>
            🎬 3D ANIMATION STORYBOARD & CLINICAL SHOWCASE
          </h2>
          <div style={{ fontSize: 11, color: P.t3 }}>
            High-Definition Storyboard Renderings & Kinematic Motion Sequences
          </div>
        </div>
        <button
          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
          style={{
            background: isVideoPlaying ? "rgba(0, 229, 255, 0.15)" : "rgba(255, 179, 0, 0.15)",
            color: isVideoPlaying ? P.cyan : P.amber,
            border: `1px solid ${isVideoPlaying ? P.cyan : P.amber}`,
            padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 800, cursor: "pointer"
          }}
        >
          {isVideoPlaying ? "⏸ Pause Auto-Play (4s Loop)" : "▶ Resume Auto-Play"}
        </button>
      </div>

      {/* Main Video Viewport */}
      <div style={{ background: "#000", border: `1px solid ${P.cyan}`, borderRadius: 10, overflow: "hidden", position: "relative", minHeight: 340, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <img
          src={currentLoop.poster}
          alt={currentLoop.title}
          onError={(e) => { e.target.onerror = null; e.target.src = '/hero_render_phoenix.jpg'; }}
          style={{ width: "100%", height: 340, objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(3,8,18,0.95) 0%, rgba(3,8,18,0.2) 60%, transparent 100%)" }} />

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, zIndex: 10 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            {currentLoop.tags.map((tag, idx) => (
              <span key={idx} style={{ background: "rgba(0,229,255,0.2)", color: P.cyan, border: `1px solid ${P.cyan}`, fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                {tag}
              </span>
            ))}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: P.t1, margin: "0 0 4px 0" }}>{currentLoop.title}</h3>
          <p style={{ fontSize: 12, color: P.t2, margin: 0, lineHeight: 1.5 }}>{currentLoop.sub}</p>
        </div>
      </div>

      {/* Loop Selector Thumbnails */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {VIDEO_LOOPS.map((loop) => {
          const isActive = loop.id === activeVideoLoop;
          return (
            <div
              key={loop.id}
              onClick={() => {
                setActiveVideoLoop(loop.id);
                setIsVideoPlaying(false);
              }}
              style={{
                background: isActive ? P.bg3 : P.bg2,
                border: `2px solid ${isActive ? P.cyan : P.bd}`,
                borderRadius: 8,
                padding: 10,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <img
                src={loop.poster}
                alt={loop.title}
                onError={(e) => { e.target.onerror = null; e.target.src = '/hero_render_phoenix.jpg'; }}
                style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 4, marginBottom: 6 }}
              />
              <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? P.cyan : P.t1 }}>Loop #{loop.id + 1}</div>
              <div style={{ fontSize: 9, color: P.t3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{loop.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
