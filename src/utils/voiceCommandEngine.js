/**
 * @file voiceCommandEngine.js
 * @brief Claim 7: Offline Voice-EMG Command Fusion Engine
 * @details Implements local offline voice recognition for voice keywords
 * ('OPEN', 'GRIP', 'LOCK', 'PINCH') as specified in Indian Patent App No. 202641077314.
 */

export class VoiceCommandEngine {
  constructor(onCommandRecognized) {
    this.onCommandRecognized = onCommandRecognized;
    this.recognition = null;
    this.isListening = false;
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("[VOICE ENGINE] Web Speech API not supported in this browser environment.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = "en-US";

    this.recognition.onresult = (event) => {
      const lastIndex = event.results.length - 1;
      const transcript = event.results[lastIndex][0].transcript.toUpperCase().trim();
      const confidence = event.results[lastIndex][0].confidence;

      console.log(`[CLAIM 7 VOICE RECOGNITION] Keyword detected: "${transcript}" (Confidence: ${(confidence * 100).toFixed(1)}%)`);

      if (transcript.includes("OPEN") || transcript.includes("RELEASE")) {
        this.onCommandRecognized({ command: "OPEN_HAND", keyword: "OPEN", gestureIdx: 4, confidence });
      } else if (transcript.includes("GRIP") || transcript.includes("POWER")) {
        this.onCommandRecognized({ command: "POWER_GRIP", keyword: "GRIP", gestureIdx: 0, confidence });
      } else if (transcript.includes("LOCK") || transcript.includes("FREEZE")) {
        this.onCommandRecognized({ command: "PASSIVE_LOCK", keyword: "LOCK", gestureIdx: 3, confidence });
      } else if (transcript.includes("PINCH")) {
        this.onCommandRecognized({ command: "PRECISION_PINCH", keyword: "PINCH", gestureIdx: 10, confidence });
      }
    };

    this.recognition.onerror = (err) => {
      console.error("[VOICE ENGINE ERROR]", err.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        try {
          this.recognition.start();
        } catch (e) {
          // Engine restarting
        }
      }
    };
  }

  start() {
    if (this.recognition && !this.isListening) {
      this.isListening = true;
      try {
        this.recognition.start();
        console.log("🎤 [CLAIM 7 VOICE ENGINE] Active & Listening for Keywords: 'OPEN', 'GRIP', 'LOCK', 'PINCH'");
      } catch (e) {
        console.warn("[VOICE ENGINE] Start error:", e);
      }
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      try {
        this.recognition.stop();
        console.log("⏸ [CLAIM 7 VOICE ENGINE] Stopped.");
      } catch (e) {}
    }
  }
}
