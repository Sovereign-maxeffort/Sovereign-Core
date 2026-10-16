import React, { useState, useRef, useEffect } from 'react';
import { SovereignCanvas3D } from './SovereignCanvas3D';
import { VoiceSynthesizer } from './VoiceSynthesizer';
import { ChatMessage } from '../types';
import {
  Send,
  Zap,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  Bot,
  User,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onSelectTab: (tab: string) => void;
}

export const StreamHUD: React.FC<Props> = ({
  messages,
  onSendMessage,
  isLoading,
  onSelectTab,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [streamOverlayMode, setStreamOverlayMode] = useState(false);
  const [copiedLog, setCopiedLog] = useState(false);
  const [latestAssistantText, setLatestAssistantText] = useState<string>('');
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // UTC Daily Clock Calculation
  const [utcTime, setUtcTime] = useState('');
  const [agiProgress, setAgiProgress] = useState(79.8);
  const [upgradeLogs, setUpgradeLogs] = useState<string[]>([
    '08:11 UTC: Scheduled sovereign mesh pulse completed. AGI progression -> 79.8%.',
    'Quantum Sovereign Logistics Corp registry verified (WA UBI: 606 116 126).',
    'Streamlit HUD session established on port 8502.',
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update latest speech text when a new assistant message arrives
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'assistant') {
      setLatestAssistantText(lastMsg.content);
    }
  }, [messages]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const txt = inputText.trim();
    setInputText('');
    await onSendMessage(txt);
  };

  const triggerWake = () => {
    onSendMessage('EVE_WAKE 1010');
  };

  const manualUpgradePulse = () => {
    const nextProg = +(agiProgress + 0.1).toFixed(2);
    setAgiProgress(nextProg);
    const newLog = `${utcTime}: Manual quantum upgrade pulse triggered. AGI -> ${nextProg}%. Sovereign neural mesh amplified.`;
    setUpgradeLogs((prev) => [newLog, ...prev.slice(0, 8)]);
    onSendMessage(`Daily upgrade mesh pulse confirmed. AGI progression advanced to ${nextProg}%.`);
  };

  const copyLogText = () => {
    const logStr = upgradeLogs.join('\n');
    navigator.clipboard.writeText(logStr);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className={`space-y-4 ${streamOverlayMode ? 'p-2 bg-black/95 rounded-2xl border border-cyan-500/50' : ''}`}>
      {/* Stream Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border border-cyan-500/25 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <span>LIVE STREAM HUD</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{utcTime}</span>
            <span className="text-slate-500">•</span>
            <span className="text-green-400 font-bold">AGI: {agiProgress}%</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerWake}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition hover:shadow-cyan-500/20 hover:shadow-md"
            title="Fire the master wake command"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>EVE_WAKE 1010</span>
          </button>

          <button
            onClick={manualUpgradePulse}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition"
            title="Trigger an AGI Upgrade cycle"
          >
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>PULSE AGI</span>
          </button>

          <button
            onClick={() => setStreamOverlayMode(!streamOverlayMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition ${
              streamOverlayMode
                ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle Streamer Overlay Mode for OBS"
          >
            {streamOverlayMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{streamOverlayMode ? 'NORMAL VIEW' : 'OBS OVERLAY'}</span>
          </button>
        </div>
      </div>

      {/* Voice Synthesizer Broadcast Engine */}
      <VoiceSynthesizer
        textToSpeak={latestAssistantText}
        onSpeakingChange={setIsSpeaking}
        autoSpeak={true}
      />

      {/* Main Grid: 5D Visual Mesh on Left, Stream Neural Chat on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 5D Mesh & System Status Panel */}
        <div className="lg:col-span-6 space-y-4">
          <SovereignCanvas3D isSpeaking={isSpeaking} />

          {/* Sovereign Core Parameters Card */}
          <div className="p-3.5 bg-slate-900/80 border border-cyan-500/20 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                QUANTUM SOVEREIGN LOGISTICS CORP
              </span>
              <span className="text-[11px] text-slate-400">WA UBI: 606 116 126</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                <div className="text-slate-400 text-[10px]">STREAM PORT</div>
                <div className="text-cyan-300 font-semibold">:8502 (Active)</div>
              </div>
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                <div className="text-slate-400 text-[10px]">SOLANA RPC</div>
                <div className="text-green-400 font-semibold truncate">mainnet-beta</div>
              </div>
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-slate-400 text-[10px]">OLLAMA SOVEREIGN</div>
                <div className="text-purple-300 font-semibold">:11434 (Hybrid)</div>
              </div>
            </div>

            {/* Daily AGI Upgrade Ticker */}
            <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-900/40 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="flex items-center gap-1 text-cyan-300">
                  <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                  DAILY AGI UPGRADE CYCLE
                </span>
                <button
                  onClick={copyLogText}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 text-[10px]"
                  title="Copy log to eve_log.txt"
                >
                  {copiedLog ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLog ? 'COPIED' : 'LOGS'}</span>
                </button>
              </div>
              <div className="text-[11px] text-slate-300 space-y-1 max-h-20 overflow-y-auto pr-1">
                {upgradeLogs.map((log, i) => (
                  <div key={i} className="text-slate-400 flex items-start gap-1">
                    <span className="text-cyan-500 font-bold">•</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Stream Chat Panel */}
        <div className="lg:col-span-6 flex flex-col h-[520px] sm:h-[600px] bg-slate-900/90 border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl">
          {/* Chat Header */}
          <div className="p-3 bg-slate-950/90 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <span>EVE HEI BRAIN // STREAM VOICE</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-green-500/20 text-green-300 border border-green-500/30">
                    FULL SENTENCES
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Communicating with your live stream audience in fluid, intelligent dialogue
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onSelectTab('urls')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
              >
                INTER URL
              </button>
              <button
                onClick={() => onSelectTab('github')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
              >
                GITHUB HD
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div ref={chatScrollRef} className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role !== 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex-shrink-0 flex items-center justify-center text-cyan-300 text-xs font-mono font-bold">
                    E
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-600/30 border border-cyan-400/40 text-cyan-50 rounded-br-none'
                      : 'bg-slate-950/80 border border-cyan-500/20 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] font-mono text-slate-400">
                    <span className="font-semibold text-cyan-400">
                      {msg.role === 'user' ? 'YOU (CREATOR)' : 'EVE HEI (CO-HOST)'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap font-sans text-xs">
                    {msg.content}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center text-slate-300 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-mono animate-pulse">
                  E
                </div>
                <div className="bg-slate-950/80 border border-cyan-500/20 rounded-xl p-3 text-xs text-cyan-300 font-mono flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>EVE synthesising neural response for stream...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
            <span className="text-slate-500 text-[10px] whitespace-nowrap">QUICK:</span>
            {[
              'Give my stream a briefing on our AGI progress and assets.',
              'Explain how our GitHub HD sync and PR workflow functions.',
              'Verify all system URLs including Solana and AppSheet.',
              'EVE_WAKE 1010',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(chip)}
                className="whitespace-nowrap px-2 py-0.5 rounded bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-400 transition text-[10px]"
              >
                {chip.slice(0, 32)}...
              </button>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSubmit} className="p-2.5 bg-slate-950 border-t border-cyan-500/25 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Speak to EVE on your stream... (Full sentences, commands, questions)"
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-lg px-3 py-2 text-xs text-slate-100 font-sans"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
            >
              <span>TRANSMIT</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
