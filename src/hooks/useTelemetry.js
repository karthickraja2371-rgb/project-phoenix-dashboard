import { useState, useEffect, useRef, useCallback } from 'react';

const P = {
  cyan: "#00E5FF", green: "#00E676", amber: "#FFB300",
  red: "#FF3D00",
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

export function useTelemetry(
  isAutoCycle,
  manualGestureIdx,
  cortisolOverride,
  pressureSpike,
  sensorFailure = false,
  lowBattery = false
) {
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

      // sEMG Waveform Synthesis (zero out failed channel)
      d.emg = d.emg.map((ch, ci) => {
        if (sensorFailure && ci === 2) return [...ch, 0];
        const baseAmp = [0.85, 0.42, 0.55, 0.38][ci];
        const noise = (Math.random() - 0.5) * 0.2;
        const val = Math.max(0, baseAmp * (0.7 + Math.sin(t * 0.2 + ci) * 0.3) + noise);
        const next = [...ch, val];
        if (next.length > EMG_LEN) next.shift();
        return next;
      });

      // Finger Kinematic Interpolation
      d.targetFingers = g.fingers.map((f) => Math.max(0, Math.min(100, f + (Math.random() - 0.5) * 2)));
      d.fingers = d.fingers.map((f, i) => f + (d.targetFingers[i] - f) * 0.25);

      // Cortisol Torque Ceiling Safeguard
      d.cortisol = cortisolOverride;
      d.gripCeiling = cortisolOverride > 0.6 ? 80 : 100;

      // Pressure Failsafe Lock Simulation
      const baseP = pressureSpike ? 24.5 : 8.5;
      d.fsrSensors = d.fsrSensors.map(() => baseP + (Math.random() - 0.5) * 3);
      d.pressure = Math.max(...d.fsrSensors);
      d.lockEngaged = pressureSpike;

      // Battery & Environment
      d.batteryV = lowBattery ? 18.2 : 22.4;
      d.temperature = 34.0 + Math.sin(t * 0.05) * 1.5;
      d.humidity = 60 + Math.cos(t * 0.05) * 5;

      d.confidence = Math.min(0.99, Math.max(0.75, 0.924 + (Math.random() - 0.5) * 0.04));
      d.latency = Math.round(18 + Math.random() * 8);
      d.elbow = Math.round(30 + Math.sin(t * 0.1) * 45);
      d.wrist = Math.round(Math.cos(t * 0.1) * 35);
      d.tens = [0, 1, 2, 3].map((i) => +(1.2 + Math.sin(t * 0.3 + i) * 1.0).toFixed(1));

      // Real-Time Telemetry Log Generation
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      let logMsg = '';
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
          `[EMG SIMULATED] 2000Hz TI ADS1299 Sampling | CH1: ${d.emg[0][d.emg[0].length - 1]?.toFixed(2)}mV, CH2: ${d.emg[1][d.emg[1].length - 1]?.toFixed(2)}mV`,
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

      // Auto-cycle gesture every 25 ticks
      if (isAutoCycle && t % 25 === 0 && t > 0) {
        d.gIdx = (d.gIdx + 1) % GESTURES.length;
      }

      setTick(t + 1);
    }, 150);

    return () => clearInterval(intervalRef.current);
  }, [isAutoCycle, manualGestureIdx, cortisolOverride, pressureSpike, sensorFailure, lowBattery]);

  // Stable addLog — useCallback prevents infinite re-renders in consumers
  const addLog = useCallback((logObj) => {
    setTelemetryLogs((prev) => {
      const next = [...prev, logObj];
      if (next.length > 50) next.shift();
      return next;
    });
  }, []);

  const exportCSV = useCallback(() => {
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
  }, []);

  return {
    telemetryData: dataRef.current,
    telemetryLogs,
    addLog,
    exportCSV,
    tick,
  };
}
