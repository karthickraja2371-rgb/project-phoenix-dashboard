import { useState, useEffect, useRef } from 'react';
import { VoiceCommandEngine } from '../utils/voiceCommandEngine';

const P = {
  cyan: "#00E5FF", amber: "#FFB300",
};

/**
 * useVoiceEngine — wraps VoiceCommandEngine in a React hook.
 * Uses refs for callbacks so the engine is only created ONCE on mount,
 * preventing infinite re-renders when addLog or onGestureRecognized change.
 */
export function useVoiceEngine(onGestureRecognized, addLog) {
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const voiceEngineRef = useRef(null);

  // Keep callback refs up to date on every render without recreating the engine
  const onGestureRef = useRef(onGestureRecognized);
  const addLogRef = useRef(addLog);
  useEffect(() => { onGestureRef.current = onGestureRecognized; });
  useEffect(() => { addLogRef.current = addLog; });

  useEffect(() => {
    voiceEngineRef.current = new VoiceCommandEngine(
      (res) => {
        onGestureRef.current(res.gestureIdx);
        const timeStr = new Date().toLocaleTimeString();
        addLogRef.current({
          time: timeStr,
          text: `🎤 [CLAIM 7 VOICE COMMAND] Recognized keyword "${res.keyword}" → Gesture activated`,
          color: P.cyan,
        });
      },
      (errType, errMsg) => {
        const timeStr = new Date().toLocaleTimeString();
        addLogRef.current({
          time: timeStr,
          text: `⚠️ [VOICE ENGINE NOTICE] ${errMsg}`,
          color: P.amber,
        });
        setIsVoiceListening(false);
      }
    );

    return () => {
      if (voiceEngineRef.current) {
        voiceEngineRef.current.stop();
      }
    };
  }, []); // Run only once on mount — callbacks are read via refs

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

  return { isVoiceListening, toggleVoiceListening };
}
