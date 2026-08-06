import { useState, useEffect, useRef } from 'react';
import { VoiceCommandEngine } from '../utils/voiceCommandEngine';
import { audioTelemetry } from '../utils/audioTelemetryEngine';
import { GESTURES } from './useTelemetry';

const P = {
  cyan: "#00E5FF", amber: "#FFB300"
};

export function useVoiceEngine(onGestureRecognized, addLog) {
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const voiceEngineRef = useRef(null);

  useEffect(() => {
    voiceEngineRef.current = new VoiceCommandEngine(
      (res) => {
        onGestureRecognized(res.gestureIdx);
        const timeStr = new Date().toLocaleTimeString();
        addLog({
          time: timeStr,
          text: `🎤 [CLAIM 7 VOICE COMMAND] Recognized keyword "${res.keyword}" -> Posing ${GESTURES[res.gestureIdx].name}`,
          color: P.cyan
        });
        if (audioTelemetry.enabled) {
          audioTelemetry.speakGesture(GESTURES[res.gestureIdx].name);
        }
      },
      (errType, errMsg) => {
        const timeStr = new Date().toLocaleTimeString();
        addLog({
          time: timeStr,
          text: `⚠️ [VOICE ENGINE NOTICE] ${errMsg}`,
          color: P.amber
        });
        setIsVoiceListening(false);
      }
    );

    return () => {
      if (voiceEngineRef.current) {
        voiceEngineRef.current.stop();
      }
    };
  }, [onGestureRecognized, addLog]);

  const toggleVoiceListening = () => {
    if (!voiceEngineRef.current) return;
    if (isVoiceListening) {
      voiceEngineRef.current.stop();
      setIsVoiceListening(false);
    } else {
      const started = voiceEngineRef.current.start();
      setIsVoiceListening(started);
    }
  };

  return {
    isVoiceListening,
    toggleVoiceListening,
  };
}
