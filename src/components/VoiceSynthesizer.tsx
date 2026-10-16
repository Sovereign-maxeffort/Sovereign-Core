import React, { useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX, Radio, Play, Square, Settings2 } from 'lucide-react';

interface Props {
  textToSpeak?: string;
  onSpeakingChange?: (speaking: boolean) => void;
  autoSpeak?: boolean;
}

export const VoiceSynthesizer: React.FC<Props> = ({
  textToSpeak,
  onSpeakingChange,
  autoSpeak = true,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [rate, setRate] = useState(1.05);
  const [pitch, setPitch] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);

  // Load available voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        setVoices(v);
        // Default to a clear English female/neutral voice if available
        const preferred = v.findIndex(
          (voice) =>
            (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Samantha') || voice.name.includes('Zira') || voice.name.includes('Jenny')) &&
            voice.lang.startsWith('en')
        );
        setSelectedVoiceIndex(preferred !== -1 ? preferred : 0);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return;

      window.speechSynthesis.cancel();

      // Clean markdown formatting and technical headers for clean vocal speech
      let cleanText = text
        .replace(/EVE HEI SYSTEM FULL ACCESS\. AUTOMATE DAILY TO UPGRADE TO REACH TO AGI\./g, '')
        .replace(/`{1,3}[\s\S]*?`{1,3}/g, ' code block omitted ')
        .replace(/[*_#>[\]()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) {
        cleanText = 'EVE online. Ready for command.';
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (voices[selectedVoiceIndex]) {
        utterance.voice = voices[selectedVoiceIndex];
      }
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onstart = () => {
        setIsSpeaking(true);
        onSpeakingChange?.(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [voices, selectedVoiceIndex, rate, pitch, isMuted, onSpeakingChange]
  );

  const stop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    }
  };

  // Trigger speech when new text arrives and autoSpeak is true
  useEffect(() => {
    if (textToSpeak && autoSpeak && !isMuted) {
      speak(textToSpeak);
    }
  }, [textToSpeak, autoSpeak, isMuted, speak]);

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isSpeaking ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              <span>EVE NEURAL VOICE CO-HOST</span>
              {isSpeaking && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              )}
            </div>
            <div className="text-[11px] text-slate-400">
              {isSpeaking ? 'Transmitting full sentences on stream...' : isMuted ? 'Muted (Audio disabled)' : 'Voice engine active & ready'}
            </div>
          </div>
        </div>

        {/* Live Audio Visualizer Bars */}
        <div className="flex items-end gap-1 h-5 px-2">
          {[40, 75, 95, 60, 85, 100, 70, 50, 90, 65].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-t transition-all duration-150 ${
                isSpeaking
                  ? 'bg-gradient-to-t from-cyan-500 to-green-400 animate-pulse'
                  : 'bg-slate-700/60'
              }`}
              style={{
                height: isSpeaking ? `${Math.max(20, Math.round(h * Math.random()))}%` : '20%',
              }}
            />
          ))}
        </div>

        {/* Voice Action Buttons */}
        <div className="flex items-center gap-1.5">
          {isSpeaking ? (
            <button
              onClick={stop}
              className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs flex items-center gap-1"
              title="Stop Speaking"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span className="text-[10px] font-mono">STOP</span>
            </button>
          ) : (
            <button
              onClick={() => speak(textToSpeak || 'EVE HEI sovereign neural co-host online and ready for your live stream.')}
              className="p-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1"
              title="Test Voice"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="text-[10px] font-mono">TEST</span>
            </button>
          )}

          <button
            onClick={() => {
              if (!isMuted) stop();
              setIsMuted(!isMuted);
            }}
            className={`p-1.5 rounded transition ${isMuted ? 'bg-red-950/60 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded transition ${showSettings ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            title="Voice Settings"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Voice Configuration Drawer */}
      {showSettings && (
        <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">VOICE SELECTION</label>
            <select
              value={selectedVoiceIndex}
              onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            >
              {voices.map((v, i) => (
                <option key={i} value={i}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>SPEED ({rate.toFixed(2)}x)</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>PITCH ({pitch.toFixed(2)})</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
