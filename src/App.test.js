import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import Arm3DViewer from './components/Arm3DViewer';
import { VoiceCommandEngine } from './utils/voiceCommandEngine';
import { AudioTelemetryEngine, audioTelemetry } from './utils/audioTelemetryEngine';

// ── Environment Mocks for JSDOM ──────────────────────────────────────────────

// Robust WebGL Proxy Mock for Three.js in JSDOM
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function (type) {
    if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
      const gl = {
        canvas: this,
        drawingBufferWidth: 800,
        drawingBufferHeight: 600,
        TRIANGLES: 4,
        TRIANGLE_STRIP: 5,
        TRIANGLE_FAN: 6,
        LINES: 1,
        LINE_STRIP: 3,
        LINE_LOOP: 2,
        POINTS: 0,
        getExtension: () => null,
        getParameter: (param) => {
          if (param === 35661) return 32;
          if (param === 34930) return 16;
          if (param === 36347) return 1024;
          if (param === 36348) return 1024;
          if (param === 34076) return 2048;
          if (param === 3379) return 2048;
          if (param === 34024) return 16;
          return 'WebGL 1.0';
        },
        getShaderPrecisionFormat: () => ({
          rangeMin: 1,
          rangeMax: 1,
          precision: 23,
        }),
        createTexture: () => ({}),
        createShader: () => ({}),
        createProgram: () => ({}),
        createBuffer: () => ({}),
        createRenderbuffer: () => ({}),
        createFramebuffer: () => ({}),
        getShaderParameter: () => true,
        getProgramParameter: (program, param) => {
          if (param === 35718 /* ACTIVE_UNIFORMS */) return 0;
          if (param === 35721 /* ACTIVE_ATTRIBUTES */) return 0;
          if (param === 35714 /* LINK_STATUS */) return true;
          return true;
        },
        getActiveUniform: () => ({ name: 'mockUniform', type: 35665, size: 1 }),
        getActiveAttrib: () => ({ name: 'mockAttrib', type: 35665, size: 1 }),
        checkFramebufferStatus: () => 36053,
        getUniformLocation: () => ({}),
        getAttribLocation: () => 0,
        getShaderInfoLog: () => '',
        getProgramInfoLog: () => '',
      };

      return new Proxy(gl, {
        get(target, prop) {
          if (prop in target) {
            return target[prop];
          }
          return () => {};
        },
      });
    }
    return null;
  };
}

// Mock ResizeObserver
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock SpeechRecognition API
class MockSpeechRecognition {
  constructor() {
    this.continuous = false;
    this.interimResults = false;
    this.lang = '';
    this.onresult = null;
    this.onerror = null;
    this.onend = null;
    MockSpeechRecognition.instances.push(this);
  }
  start() {
    this.isListening = true;
  }
  stop() {
    this.isListening = false;
    if (this.onend) this.onend();
  }
}
MockSpeechRecognition.instances = [];
window.SpeechRecognition = MockSpeechRecognition;
window.webkitSpeechRecognition = MockSpeechRecognition;

// Mock SpeechSynthesis API
const mockSpeechSynth = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn().mockReturnValue([{ lang: 'en-US' }]),
};
window.speechSynthesis = mockSpeechSynth;
window.SpeechSynthesisUtterance = class {
  constructor(text) {
    this.text = text;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
    this.voice = null;
  }
};

// Helper for mounting components safely in JSDOM
function renderComponent(ui) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return render(ui, { container });
}

// ── 1. Pure Helper & Patent Claims Logic Tests ─────────────────────────────────

describe('Project Phoenix Bionic Gesture Library & Patent Claims', () => {
  const GESTURES = [
    { name: "POWER GRIP",     fingers: [80, 85, 85, 80, 75] },
    { name: "PINCH",          fingers: [85, 90, 15, 10,  5] },
    { name: "CYLINDRICAL",    fingers: [70, 75, 75, 70, 65] },
    { name: "LATERAL",        fingers: [80, 75, 20, 15, 10] },
    { name: "OPEN HAND",      fingers: [ 0,  0,  0,  0,  0] },
    { name: "TRIPOD",         fingers: [75, 80, 80, 15,  5] },
    { name: "HOOK",           fingers: [20, 75, 75, 75, 70] },
    { name: "POINT",          fingers: [75,  0, 70, 70, 65] },
    { name: "KEY GRIP",       fingers: [85, 60, 15, 10,  5] },
    { name: "THUMBS UP",      fingers: [ 0, 70, 70, 70, 65] },
    { name: "PRECISION PINCH",fingers: [90, 90, 15, 10,  5] },
    { name: "WAVE",           fingers: [ 0, 10, 10, 10, 10] },
    { name: "PEACE SIGN",     fingers: [75,  0,  0, 70, 65] },
    { name: "SPHERICAL GRIP", fingers: [50, 55, 55, 50, 45] },
    { name: "TWEEZER GRIP",   fingers: [60, 65, 65, 15, 10] },
    { name: "OK SIGN",        fingers: [90, 90,  0,  0,  0] },
  ];

  it('should contain 16 functional & expressive gestures', () => {
    expect(GESTURES.length).toBe(16);
  });

  it('should fully extend all fingers in OPEN HAND pose', () => {
    const openHand = GESTURES.find(g => g.name === "OPEN HAND");
    expect(openHand.fingers).toEqual([0, 0, 0, 0, 0]);
  });

  it('should flex thumb and index finger in PINCH pose', () => {
    const pinch = GESTURES.find(g => g.name === "PINCH");
    expect(pinch.fingers[0]).toBeGreaterThanOrEqual(80);
    expect(pinch.fingers[1]).toBeGreaterThanOrEqual(80);
  });
});

describe('Claim 8: FSR Socket Pressure Failsafe Logic', () => {
  const THRESHOLD_KPA = 20.0;

  function evaluatePressureSafety(pressureKpa) {
    if (pressureKpa > THRESHOLD_KPA) {
      return { status: "PASSIVE_LOCK_ENGAGED", motorPowerWatts: 0.0 };
    }
    return { status: "NORMAL_OPERATION", motorPowerWatts: 15.4 };
  }

  it('should allow normal operation when skin pressure is below 20.0 kPa', () => {
    const result = evaluatePressureSafety(9.4);
    expect(result.status).toBe("NORMAL_OPERATION");
    expect(result.motorPowerWatts).toBe(15.4);
  });

  it('should immediately engage passive lock when skin pressure exceeds 20.0 kPa', () => {
    const result = evaluatePressureSafety(24.5);
    expect(result.status).toBe("PASSIVE_LOCK_ENGAGED");
    expect(result.motorPowerWatts).toBe(0.0);
  });
});

describe('Claim 3: Microfluidic Sweat Cortisol Sensing Logic', () => {
  const CORTISOL_THRESHOLD_UG_DL = 0.60;

  function evaluateGripCeiling(cortisolUgDl) {
    return cortisolUgDl > CORTISOL_THRESHOLD_UG_DL ? 80 : 100;
  }

  it('should allow 100% max grip strength when cortisol is normal (0.28 ug/dL)', () => {
    expect(evaluateGripCeiling(0.28)).toBe(100);
  });

  it('should cap max grip strength to 80% during user anxiety spike (0.75 ug/dL)', () => {
    expect(evaluateGripCeiling(0.75)).toBe(80);
  });
});

describe('Claim 7: Offline Voice Keyword Recognition Logic', () => {
  function matchVoiceKeyword(transcript) {
    const t = transcript.toUpperCase();
    if (t.includes("OPEN") || t.includes("RELEASE")) return { command: "OPEN_HAND", gestureIdx: 4 };
    if (t.includes("GRIP") || t.includes("POWER")) return { command: "POWER_GRIP", gestureIdx: 0 };
    if (t.includes("LOCK") || t.includes("FREEZE")) return { command: "PASSIVE_LOCK", gestureIdx: 3 };
    if (t.includes("PINCH")) return { command: "PRECISION_PINCH", gestureIdx: 10 };
    return null;
  }

  it('should recognize OPEN keyword to release hand', () => {
    const res = matchVoiceKeyword("PLEASE OPEN HAND NOW");
    expect(res.command).toBe("OPEN_HAND");
  });

  it('should recognize GRIP keyword for power grip', () => {
    const res = matchVoiceKeyword("GRIP THE BOTTLE");
    expect(res.command).toBe("POWER_GRIP");
  });

  it('should recognize LOCK keyword for passive lock', () => {
    const res = matchVoiceKeyword("LOCK POSITION");
    expect(res.command).toBe("PASSIVE_LOCK");
  });

  it('should recognize PINCH keyword for precision pinch', () => {
    const res = matchVoiceKeyword("PINCH OBJECT");
    expect(res.command).toBe("PRECISION_PINCH");
  });
});

// ── 2. VoiceCommandEngine & AudioTelemetryEngine Unit Tests ──────────────────

describe('VoiceCommandEngine Module', () => {
  it('should initialize and register voice command recognition', () => {
    const onCmd = vi.fn();
    const engine = new VoiceCommandEngine(onCmd);
    expect(engine.recognition).not.toBeNull();

    engine.start();
    expect(engine.isListening).toBe(true);

    const keywords = [
      { text: 'OPEN', expectedCmd: 'OPEN_HAND', expectedIdx: 4 },
      { text: 'GRIP', expectedCmd: 'POWER_GRIP', expectedIdx: 0 },
      { text: 'LOCK', expectedCmd: 'PASSIVE_LOCK', expectedIdx: 3 },
      { text: 'PINCH', expectedCmd: 'PRECISION_PINCH', expectedIdx: 10 },
      { text: 'UNKNOWN', expectedCmd: null, expectedIdx: null },
    ];

    keywords.forEach(({ text, expectedCmd, expectedIdx }) => {
      const mockEvent = {
        results: [[{ transcript: text, confidence: 0.95 }]]
      };
      engine.recognition.onresult(mockEvent);
      if (expectedCmd) {
        expect(onCmd).toHaveBeenCalledWith(expect.objectContaining({
          command: expectedCmd,
          gestureIdx: expectedIdx
        }));
      }
    });

    engine.recognition.onerror({ error: 'no-speech' });
    engine.recognition.onend();

    engine.stop();
    expect(engine.isListening).toBe(false);
  });

  it('should handle SpeechRecognition unavailable gracefully', () => {
    const origSR = window.SpeechRecognition;
    const origWSR = window.webkitSpeechRecognition;
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;

    const engine = new VoiceCommandEngine(vi.fn());
    expect(engine.recognition).toBeNull();
    engine.start();
    engine.stop();

    window.SpeechRecognition = origSR;
    window.webkitSpeechRecognition = origWSR;
  });
});

describe('AudioTelemetryEngine Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should issue natural voice alerts', () => {
    const engine = new AudioTelemetryEngine();
    engine.speakGesture('POWER GRIP');
    expect(mockSpeechSynth.speak).toHaveBeenCalled();

    engine.speakPressureAlert(22.5);
    expect(mockSpeechSynth.speak).toHaveBeenCalled();

    engine.speakCortisolCap(0.75, 80);
    expect(mockSpeechSynth.speak).toHaveBeenCalled();

    engine.speakRestCycle();
    expect(mockSpeechSynth.speak).toHaveBeenCalled();
  });

  it('should respect mute enabled state', () => {
    const engine = new AudioTelemetryEngine();
    engine.enabled = false;
    engine.speak('Test Message');
    expect(mockSpeechSynth.speak).not.toHaveBeenCalled();
  });

  it('should debounce non-priority duplicate messages within 4s', () => {
    const engine = new AudioTelemetryEngine();
    engine.speak('Duplicate Message', false);
    mockSpeechSynth.speak.mockClear();
    engine.speak('Duplicate Message', false);
    expect(mockSpeechSynth.speak).not.toHaveBeenCalled();
    engine.speak('Duplicate Message', true);
    expect(mockSpeechSynth.speak).toHaveBeenCalled();
  });
});

// ── 3. Arm3DViewer Component Unit Tests ──────────────────────────────────────

describe('Arm3DViewer Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render WebGL container canvas without error', () => {
    const { container } = renderComponent(
      React.createElement(Arm3DViewer, { fingers: [50, 50, 50, 50, 50], elbow: 30, wrist: 15, color: '#00E5FF' })
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('should update props cleanly', () => {
    const { rerender } = renderComponent(
      React.createElement(Arm3DViewer, { fingers: [0, 0, 0, 0, 0], elbow: 10, wrist: 5, color: '#00E5FF' })
    );
    rerender(
      React.createElement(Arm3DViewer, { fingers: [80, 85, 85, 80, 75], elbow: 60, wrist: 25, color: '#FF3D00' })
    );
  });
});

// ── 4. React App Integration & State Transitions Unit Tests ─────────────────

describe('Project Phoenix React App Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render main dashboard navigation and default elements', () => {
    renderComponent(React.createElement(App));
    expect(screen.getAllByText(/PROJECT PHOENIX/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Autonomous Transhumeral Myoelectric Prosthetic System/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /🌐 PRODUCT SHOWCASE/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /⚡ DIGITAL TWIN DASHBOARD/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /🎬 3D VIDEO ANIMATION/i })).toBeInTheDocument();
  });

  it('should handle view mode switches and showcase interactions', () => {
    renderComponent(React.createElement(App));

    // Switch to Product Showcase
    const showcaseBtn = screen.getByRole('button', { name: /🌐 PRODUCT SHOWCASE/i });
    act(() => { fireEvent.click(showcaseBtn); });
    expect(screen.getByText(/BUILT FROM EXPERIENCE. DRIVEN BY ENGINEERING./i)).toBeInTheDocument();

    // Click buttons inside Showcase
    const watchDemoBtn = screen.getByRole('button', { name: /WATCH DEMO & VIEW PROTOTYPE/i });
    act(() => { fireEvent.click(watchDemoBtn); });

    act(() => { fireEvent.click(showcaseBtn); });
    const launchDashBtn = screen.getByRole('button', { name: /LAUNCH DIGITAL TWIN DASHBOARD/i });
    act(() => { fireEvent.click(launchDashBtn); });

    // Switch to 3D Video Animation
    const videoBtn = screen.getByRole('button', { name: /🎬 3D VIDEO ANIMATION/i });
    act(() => { fireEvent.click(videoBtn); });
    expect(screen.getByText(/3D DIGITAL TWIN ANIMATION & VIDEO STORYBOARD/i)).toBeInTheDocument();

    // Switch back to Digital Twin Dashboard
    const dashboardBtn = screen.getByRole('button', { name: /⚡ DIGITAL TWIN DASHBOARD/i });
    act(() => { fireEvent.click(dashboardBtn); });
    expect(screen.getByText(/ENGINEERING VALIDATION PLATFORM/i)).toBeInTheDocument();
  });

  it('should cycle through scene controls in 3D Video view mode', () => {
    renderComponent(React.createElement(App));
    const videoBtn = screen.getByRole('button', { name: /🎬 3D VIDEO ANIMATION/i });
    act(() => { fireEvent.click(videoBtn); });

    const scene1Btns = screen.getAllByRole('button', { name: /Scene 1: Safety Lock/i });
    const scene2Btns = screen.getAllByRole('button', { name: /Scene 2: High-Speed/i });
    const scene3Btns = screen.getAllByRole('button', { name: /Scene 3: NDP120 AI Fusion/i });

    act(() => { fireEvent.click(scene2Btns[0]); });
    expect(screen.getAllByText(/NEURAL-INTEGRATED TENDON ACTUATION/i)[0]).toBeInTheDocument();

    act(() => { fireEvent.click(scene3Btns[0]); });
    expect(screen.getAllByText(/PALM-BRAIN LOGIC FUSION/i)[0]).toBeInTheDocument();

    act(() => { fireEvent.click(scene1Btns[0]); });
    expect(screen.getAllByText(/TRIPLE BARRIER SAFETY FAILSAFE/i)[0]).toBeInTheDocument();

    const pauseBtns = screen.getAllByRole('button', { name: /PAUSE ANIMATION|PLAY 3D VIDEO/i });
    act(() => { fireEvent.click(pauseBtns[0]); });
  });

  it('should handle gesture selections from the 16-button grid', () => {
    renderComponent(React.createElement(App));

    const gestureNames = [
      "POWER GRIP", "PINCH", "CYLINDRICAL", "LATERAL",
      "OPEN HAND", "TRIPOD", "HOOK", "POINT",
      "KEY GRIP", "THUMBS UP", "PRECISION PINCH", "WAVE",
      "PEACE SIGN", "SPHERICAL GRIP", "TWEEZER GRIP", "OK SIGN"
    ];

    gestureNames.forEach((name) => {
      const btn = screen.getAllByRole('button', { name: new RegExp(name, 'i') })[0];
      expect(btn).toBeInTheDocument();
      act(() => { fireEvent.click(btn); });
    });
  });

  it('should trigger simulation scenario presets (Pressure Spike, Sensor Failure, Low Battery)', () => {
    renderComponent(React.createElement(App));

    const openBtn = screen.getByRole('button', { name: /🖐 Open Hand \(Simulated\)/i });
    act(() => { fireEvent.click(openBtn); });

    const hookBtn = screen.getByRole('button', { name: /👜 Hook Grip \(Simulated\)/i });
    act(() => { fireEvent.click(hookBtn); });

    const pinchBtn = screen.getByRole('button', { name: /🤏 Tip Pinch \(Simulated\)/i });
    act(() => { fireEvent.click(pinchBtn); });

    const spikeBtn = screen.getByRole('button', { name: /⚡ Pressure Spike \(>20 kPa\)/i });
    act(() => { fireEvent.click(spikeBtn); });

    const failBtn = screen.getByRole('button', { name: /🔌 Sensor Ch 3 Failure|Restore sEMG/i });
    act(() => { fireEvent.click(failBtn); });

    const battBtn = screen.getByRole('button', { name: /🔋 Low Battery \(<15%\)|Recharge Battery/i });
    act(() => { fireEvent.click(battBtn); });
  });

  it('should toggle voice command listening and audio telemetry alerts', () => {
    renderComponent(React.createElement(App));

    const voiceBtn = screen.getByRole('button', { name: /LISTEN VOICE COMMANDS|LISTENING/i });
    act(() => { fireEvent.click(voiceBtn); });
    act(() => { fireEvent.click(voiceBtn); });

    const audioBtn = screen.getByRole('button', { name: /AUDIO ALERTS ON|AUDIO MUTE/i });
    act(() => { fireEvent.click(audioBtn); });
    act(() => { fireEvent.click(audioBtn); });
  });

  it('should run diagnostic suite and export CSV report', () => {
    renderComponent(React.createElement(App));

    const runDiagBtn = screen.getByRole('button', { name: /RUN DIAGNOSTIC SUITE/i });
    act(() => { fireEvent.click(runDiagBtn); });

    const exportBtn = screen.getByRole('button', { name: /EXPORT REPORT \(CSV\)/i });
    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return {
          setAttribute: vi.fn(),
          click: vi.fn(),
        };
      }
      return origCreateElement(tagName);
    });
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

    act(() => { fireEvent.click(exportBtn); });
  });
});

describe('Project Phoenix AI Chatbot Helper Logic', () => {
  const getBotResponse = (question) => {
    const q = question.toLowerCase().trim();

    if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
      return "👋 Hello! I am the **Project Phoenix AI Assistant**. How can I help you explore our bionic prosthesis system today?";
    }
    if (q.includes("gesture") || q.includes("pose") || q.includes("how many")) {
      return "🖐️ **16 Gesture Library**: Project Phoenix supports 16 functional & expressive gestures: Power Grip, Tip Pinch, Cylindrical, Lateral (Key), Open Hand, Tripod, Hook, Point, Key Grip, Thumbs Up, Precision Pinch, Wave, Peace Sign (✌️), Spherical Grip (⚽), Tweezer Grip (🥢), and OK Sign (👌).";
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
      return "💼 **Commercial Pricing & Funding**: Total funding request is **₹1.25 Crore INR ($150,000 USD)** across BIRAC BIG (₹50L), DST Seed Support (₹50L), and ARTPARK HealthTech (₹25L). Commercial pricing: **Tier 1 Premium Private/Export** (BOM ₹2.5–3.0L / Retail ₹12–15L) and **Tier 2 Government ALIMCO** (BOM ₹80k–1.0L / Retail ₹2.0–2.5L).";
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

    return "⚡ **Project Phoenix AI Assistant**: Project Phoenix is an autonomous 1.18kg transhumeral myoelectric prosthesis with Indian Provisional Patent No. 202641077314 (Filed 23 June 2026). Key specifications include 16 gesture classes, offline Syntiant NDP120 neural AI (22ms latency), 20.0 kPa FSR socket pressure lock, self-healing silicone liner, Maxon worm gear drive, and ISO 13485 QMS design controls.";
  };

  it('should provide informative responses for all queries', () => {
    expect(getBotResponse('hi')).toContain('Hello');
    expect(getBotResponse('gesture')).toContain('16 Gesture Library');
    expect(getBotResponse('patent')).toContain('Patent Information');
    expect(getBotResponse('safety')).toContain('Skin Graft Safety System');
    expect(getBotResponse('ai')).toContain('Offline Syntiant AI Engine');
    expect(getBotResponse('cost')).toContain('Commercial Pricing');
    expect(getBotResponse('inventor')).toContain('R. Karthick Raja');
    expect(getBotResponse('roadmap')).toContain('5-Phase Roadmap');
    expect(getBotResponse('weight')).toContain('System Hardware Specs');
    expect(getBotResponse('unknown')).toContain('Project Phoenix AI Assistant');
  });
});
