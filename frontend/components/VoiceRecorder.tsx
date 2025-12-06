import React, { useState, useRef, useEffect } from 'react';
import { parseVoiceCommand } from '../services/geminiService';
import { ParsedTaskResponse } from '../types';

interface VoiceRecorderProps {
  onProcessingStart: () => void;
  onProcessingComplete: (result: ParsedTaskResponse) => void;
  onError: (error: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onProcessingStart, onProcessingComplete, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Silence Detection Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastSoundTimeRef = useRef<number>(0);

  // Silence Detection Configuration
  const SILENCE_THRESHOLD = 15; // Volume threshold (0-255). Below this is considered silence.
  const SILENCE_DURATION = 2000; // Duration in ms to wait before stopping automatically.

  // Clean up audio resources to prevent memory leaks
  const cleanupAudioContext = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanupAudioContext();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // --- Silence Detection Setup ---
      // We use the Web Audio API to analyze the volume levels in real-time.
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Small FFT size for faster processing
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      lastSoundTimeRef.current = Date.now();

      const checkSilence = () => {
        if (!analyserRef.current || !isRecording) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume of the current frame
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / dataArray.length;

        // If volume is above threshold, reset the silence timer
        if (average > SILENCE_THRESHOLD) {
          lastSoundTimeRef.current = Date.now();
        } else {
          // If silence persists longer than the duration, stop recording
          const timeSinceLastSound = Date.now() - lastSoundTimeRef.current;
          if (timeSinceLastSound > SILENCE_DURATION) {
            stopRecording();
            return;
          }
        }

        rafRef.current = requestAnimationFrame(checkSilence);
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        cleanupAudioContext();
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop()); // Stop the microphone stream
        processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start the silence detection loop
      checkSilence();

    } catch (err) {
      console.error("Error accessing microphone:", err);
      onError("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (blob: Blob) => {
    onProcessingStart();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64Audio = (reader.result as string).split(',')[1];
      try {
        const result = await parseVoiceCommand(base64Audio, 'audio/webm');
        onProcessingComplete(result);
      } catch (err) {
        onError("Failed to analyze voice command. Please try again.");
      }
    };
  };

  return (
    <div className="relative group z-50">
      {/* Ripple Effect when Recording */}
      {isRecording && (
        <>
          <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute -inset-2 bg-rose-500 rounded-full animate-pulse opacity-10"></div>
        </>
      )}

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`relative p-5 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 focus:outline-none focus:ring-4 ${isRecording
          ? 'bg-gradient-to-r from-rose-500 to-pink-600 ring-rose-200'
          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 ring-indigo-200'
          }`}
        aria-label={isRecording ? "Stop Recording" : "Start Voice Command"}
      >
        {isRecording ? (
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 relative">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-25 animate-ping"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </div>
          </div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-2 bg-slate-900/90 backdrop-blur-sm text-white text-xs font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none shadow-xl">
        {isRecording ? "Listening... (Stops automatically)" : "Tap to Speak"}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900/90 rotate-45"></div>
      </div>
    </div>
  );
};

export default VoiceRecorder;