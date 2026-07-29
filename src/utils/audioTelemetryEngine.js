/**
 * @file audioTelemetryEngine.js
 * @brief Natural Voice Telemetry & Clinical Alert Engine
 * @details Uses speech synthesis (TTS) to speak real-time safety alerts and state transitions
 * for Project Phoenix Digital Twin.
 */

export class AudioTelemetryEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.enabled = true;
    this.lastSpokenText = "";
    this.lastSpokenTime = 0;
  }

  speak(text, priority = false) {
    if (!this.synth || !this.enabled) return;

    const now = Date.now();
    // Prevent duplicate speech spam within 4 seconds unless high priority
    if (!priority && text === this.lastSpokenText && now - this.lastSpokenTime < 4000) {
      return;
    }

    this.lastSpokenText = text;
    this.lastSpokenTime = now;

    if (priority) {
      this.synth.cancel(); // Cancel any ongoing non-priority speech
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    // Select a clear English voice if available
    const voices = this.synth.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    this.synth.speak(utterance);
    console.log(`🔊 [AUDIO TELEMETRY] Speaking: "${text}"`);
  }

  speakPressureAlert(kpa) {
    this.speak(`Warning: Socket pressure at ${kpa.toFixed(1)} kilopascals. Passive lock engaged to protect skin graft.`, true);
  }

  speakCortisolCap(cortisol, torqueCap) {
    this.speak(`Sweat cortisol detected at ${cortisol.toFixed(2)} micrograms per deciliter. Grip torque capped to ${torqueCap} percent.`, false);
  }

  speakGesture(gestureName) {
    this.speak(`Gesture selected: ${gestureName}.`, false);
  }

  speakRestCycle() {
    this.speak(`3-hour active sampling complete. Initiating 15-minute mandatory muscle rest cycle.`, true);
  }
}

export const audioTelemetry = new AudioTelemetryEngine();
