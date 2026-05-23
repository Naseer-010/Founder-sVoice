/**
 * useBrowserTTS.js — Browser Speech Synthesis wrapper.
 *
 * Provides queue-managed text-to-speech with interruption support.
 * Used as the initial TTS solution (zero network latency).
 * Can be swapped for a server-side TTS later without changing the interface.
 */

import { useCallback, useRef, useEffect, useState } from "react";

/**
 * Browser-based text-to-speech hook.
 *
 * @returns {{
 *   speak: (text: string) => void,
 *   stop: () => void,
 *   isSpeaking: boolean,
 *   isSupported: boolean,
 * }}
 */
export function useBrowserTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(null);
  const queueRef = useRef([]);
  const isProcessingRef = useRef(false);

  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (isSupported) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isSupported]);

  const processQueue = useCallback(() => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;
    if (!synthRef.current) return;

    isProcessingRef.current = true;
    const text = queueRef.current.shift();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to select a good English voice
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel"))
    );
    if (preferred) {
      utterance.voice = preferred;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      isProcessingRef.current = false;
      if (queueRef.current.length === 0) {
        setIsSpeaking(false);
      } else {
        processQueue();
      }
    };
    utterance.onerror = () => {
      isProcessingRef.current = false;
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }, []);

  const speak = useCallback(
    (text) => {
      if (!text || !synthRef.current) return;
      queueRef.current.push(text);
      processQueue();
    },
    [processQueue]
  );

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      queueRef.current = [];
      isProcessingRef.current = false;
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking, isSupported };
}
