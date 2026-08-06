import { useState, useEffect, useRef } from 'react';

const P = {
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  red: "#FF3D00", blue: "#2979FF", purple: "#E040FB",
};

export const GESTURES = [
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

const EMG_LEN = 80;

export function useTelemetry(isAutoCycle, manualGestureIdx, cortisolOverride, pressureSpike) {
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [tick, setTick] = useState(0);

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
    lockEngaged: false,
  });

  const tickRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const t = tickRef.current;
      tickRef.current += 1;

      const d = dataRef.current;
      const currentIdx = isAutoCycle ? d.gIdx : manualGestureIdx;
      const g = GESTURES[currentIdx % GESTURES.length];

      // Auto cycle gesture every 200 ticks (10 seconds)
      if (isAutoCycle && t % 200 === 0 && t > 0) {
        d.gIdx = (d.gIdx + 1) % GESTURES.length;
        const timeStr = new Date().toLocaleTimeString();
        setTelemetryLogs((prev) => [
          ...prev.slice(-30),
          { time: timeStr, text: `🔄 [AUTONOMOUS AI GESTURE] Switched to ${GESTURES[d.gIdx].name}`, color: P.cyan }
        ]);
      }

      d.targetFingers = g.fingers;

      // Smooth kinematic finger interpolation
      d.fingers = d.fingers.map((cur, i) => {
        const targ = d.targetFingers[i];
        return Math.round(cur + (targ - cur) * 0.15);
      });

      // sEMG Waveform Synthesis
      d.emg = d.emg.map((ch, ci) => {
        const baseAmp = (g.fingers[ci % 5] / 100) * 400 + 50;
        const noise = (Math.random() - 0.5) * 80;
        const wave = Math.sin(t * 0.2 + ci) * baseAmp + noise;
        const newCh = [...ch, wave];
        if (newCh.length > EMG_LEN) newCh.shift();
        return newCh;
      });

      // Cortisol Torque Ceiling Safeguard
      d.cortisol = cortisolOverride;
      if (cortisolOverride > 0.60) {
        d.gripCeiling = 80; // Cortisol cap to 80%
      } else {
        d.gripCeiling = 100;
      }

      // Pressure Failsafe Lock Simulation
      if (pressureSpike) {
        d.fsrSensors = [21.4, 22.8, 20.9, 23.1, 21.8, 22.0, 20.5, 21.9];
        d.pressure = 22.8;
        d.lockEngaged = true;
      } else {
        d.lockEngaged = false;
        d.fsrSensors = d.fsrSensors.map((p, idx) => {
          const delta = (Math.random() - 0.5) * 0.4;
          return parseFloat(Math.max(6.0, Math.min(18.0, p + delta)).toFixed(1));
        });
        d.pressure = Math.max(...d.fsrSensors);
      }

      // Dynamic Battery & Temperature Fluctuation
      d.batteryV = parseFloat((22.4 - (t * 0.0001)).toFixed(2));
      d.temperature = parseFloat((34.5 + Math.sin(t * 0.05) * 0.3).toFixed(1));
      d.humidity = Math.round(61 + Math.cos(t * 0.03) * 2);

      setTick(t);
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [isAutoCycle, manualGestureIdx, cortisolOverride, pressureSpike]);

  const addLog = (logObj) => {
    setTelemetryLogs((prev) => [...prev.slice(-30), logObj]);
  };

  const exportCSV = () => {
    const d = dataRef.current;
    const currentIdx = isAutoCycle ? d.gIdx : manualGestureIdx;
    const headers = "Timestamp,Gesture,PeakPressure_kPa,Temp_C,Humidity_RH,Cortisol_ug_dL,GripCeiling_Pct,Battery_V\n";
    const row = `${new Date().toISOString()},${GESTURES[currentIdx % GESTURES.length].name},${d.pressure},${d.temperature},${d.humidity},${d.cortisol},${d.gripCeiling},${d.batteryV}\n`;
    const blob = new Blob([headers + row], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_phoenix_telemetry_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    telemetryData: dataRef.current,
    telemetryLogs,
    addLog,
    exportCSV,
    tick,
  };
}
