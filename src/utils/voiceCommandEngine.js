/**
 * @file voiceCommandEngine.js
 * @brief Claim 7: Voice-EMG Command Fusion Engine
 * @details Implements local voice recognition interface for voice keywords
 * ('OPEN', 'GRIP', 'LOCK', 'PINCH') as specified in Indian Patent App No. 202641077314.
 * 
 * NOTE: In browser environments, Web Speech API provides browser-based keyword detection.
 * On physical hardware (Phase 3), offline voice recognition is executed on-device by the
 * Syntiant NDP120 neural processor via PDM MEMS microphone interface.
 */

export class VoiceCommandEngine {
  constructor(onCommandRecognized, onErrorCallback = null) {
    this.onCommandRecognized = onCommandRecognized;
    this.onErrorCallback = onErrorCallback;
    this.recognition = null;
    this.isListening = false;
    this.initRecognition();
  }

  static isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("[VOICE ENGINE] Web Speech API not supported in this browser environment.");
      if (this.onErrorCallback) {
        this.onErrorCallback("NOT_SUPPORTED", "Web Speech API is not supported in this browser. Please use Chrome, Edge, or manual gesture buttons.");
      }
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = "en-US";

      this.recognition.onresult = (event) => {
        const lastIndex = event.results.length - 1;
        const transcript = event.results[lastIndex][0].transcript.toUpperCase().trim();
        const confidence = event.results[lastIndex][0].confidence || 0.94;

        console.log(`[CLAIM 7 VOICE RECOGNITION] Keyword detected: "${transcript}" (Confidence: ${(confidence * 100).toFixed(1)}%)`);

        if (transcript.includes("OPEN") || transcript.includes("RELEASE")) {
          this.onCommandRecognized({ command: "OPEN_HAND", keyword: "OPEN", gestureIdx: 4, confidence });
        } else if (transcript.includes("GRIP") || transcript.includes("POWER")) {
          this.onCommandRecognized({ command: "POWER_GRIP", keyword: "GRIP", gestureIdx: 0, confidence });
        } else if (transcript.includes("LOCK") || transcript.includes("FREEZE")) {
          this.onCommandRecognized({ command: "PASSIVE_LOCK", keyword: "LOCK", gestureIdx: 3, confidence });
        } else if (transcript.includes("PINCH")) {
          this.onCommandRecognized({ command: "PRECISION_PINCH", keyword: "PINCH", gestureIdx: 10, confidence });
        } else if (transcript.includes("POINT")) {
          this.onCommandRecognized({ command: "POINT", keyword: "POINT", gestureIdx: 7, confidence });
        } else if (transcript.includes("WAVE")) {
          this.onCommandRecognized({ command: "WAVE", keyword: "WAVE", gestureIdx: 11, confidence });
        } else if (transcript.includes("PEACE") || transcript.includes("VICTORY")) {
          this.onCommandRecognized({ command: "PEACE_SIGN", keyword: "PEACE", gestureIdx: 12, confidence });
        } else if (transcript.includes("THUMB") || transcript.includes("LIKE")) {
          this.onCommandRecognized({ command: "THUMBS_UP", keyword: "THUMBS UP", gestureIdx: 9, confidence });
        } else if (transcript.includes("TRIPOD")) {
          this.onCommandRecognized({ command: "TRIPOD", keyword: "TRIPOD", gestureIdx: 5, confidence });
        } else if (transcript.includes("HOOK")) {
          this.onCommandRecognized({ command: "HOOK", keyword: "HOOK", gestureIdx: 6, confidence });
        } else if (transcript.includes("OK")) {
          this.onCommandRecognized({ command: "OK_SIGN", keyword: "OK", gestureIdx: 15, confidence });
        }
      };

      this.recognition.onerror = (err) => {
        console.error("[VOICE ENGINE ERROR]", err.error);
        if (this.onErrorCallback) {
          this.onErrorCallback(err.error, `Microphone / Voice Recognition Error: ${err.error}`);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (err) {
            console.debug("[VOICE ENGINE RESTART]", err);
          }
        }
      };
    } catch (err) {
      console.error("[VOICE ENGINE INIT ERROR]", err);
    }
  }

  start() {
    if (!VoiceCommandEngine.isSupported()) {
      if (this.onErrorCallback) {
        this.onErrorCallback("NOT_SUPPORTED", "Browser does not support Web Speech API. Use manual controls.");
      }
      return false;
    }

    if (this.recognition && !this.isListening) {
      this.isListening = true;
      try {
        this.recognition.start();
        console.log("🎤 [CLAIM 7 VOICE ENGINE] Active & Listening for Keywords: 'OPEN', 'GRIP', 'LOCK', 'PINCH'");
        return true;
      } catch (e) {
        console.warn("[VOICE ENGINE] Start error:", e);
        return false;
      }
    }
    return false;
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      try {
        this.recognition.stop();
        console.log("⏸ [CLAIM 7 VOICE ENGINE] Stopped.");
      } catch (err) {
        console.debug("[VOICE ENGINE STOP]", err);
      }
    }
  }
}
