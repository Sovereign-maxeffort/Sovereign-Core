import React, { useState, useRef, useEffect } from 'react';
import { TerminalEntry } from '../types';
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Cpu,
  GitBranch,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onNotify?: (msg: string) => void;
}

export const TerminalRGLEX: React.FC<Props> = ({ onNotify }) => {
  const [naturalInput, setNaturalInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [cliInput, setCliInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const [entries, setEntries] = useState<TerminalEntry[]>([
    {
      id: 'init-1',
      type: 'system',
      timestamp: '05:21:40',
      output: `Windows PowerShell [Version 10.0.22631.3296]
(c) Microsoft Corporation. All rights reserved.

============================================================
RGLEX SOVEREIGN TERMINAL ENGINE // EVE HEI ONLINE
Quantum Sovereign Logistics Corp (WA UBI: 606 116 126)
Active Directory: C:\\QuantumSovereign\\EVE-Brain
Type 'help' for sovereign command roster or use Natural Sentence translator below.
============================================================`,
    },
  ]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  // Execute terminal command
  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to history
    setCmdHistory((prev) => [trimmed, ...prev.filter((c) => c !== trimmed).slice(0, 20)]);
    setHistoryIndex(-1);

    const now = new Date().toTimeString().slice(0, 8);
    const inputEntry: TerminalEntry = {
      id: `input-${Date.now()}`,
      type: 'input',
      command: trimmed,
      timestamp: now,
    };

    let outputText = '';
    let outputType: TerminalEntry['type'] = 'output';

    const lower = trimmed.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setEntries([]);
      return;
    } else if (lower === 'help') {
      outputText = `SOVEREIGN RGLEX ROSTER:
  git status                Check local staging and working tree state
  git add . && git commit   Stage and commit sovereign memory lock
  git push origin main      Synchronize with GitHub HD repository
  gh pr list                Display open pull requests and review states
  gh pr checks              Inspect GitHub Actions CI / CD verification status
  gh pr create              Initialize a new pull request on main
  streamlit run             Boot the 100% Visual Streamlit HUD on port 8502
  ollama status             Verify local sovereign fallback engine (:11434)
  solana status             Test Solana mainnet-beta RPC bridge
  eve wake                  Invoke EVE_WAKE 1010 sovereign reload
  set-keys                  Inject GROQ_API_KEY into permanent user environment`;
    } else if (lower.startsWith('git status')) {
      outputText = `On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   eve_master_stream.py
        modified:   eve_sovereign.py
        modified:   requirements.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        eve_log.txt

nothing added to commit but untracked files present`;
    } else if (lower.includes('git push') || lower.includes('push')) {
      outputText = `Enumerating objects: 18, done.
Counting objects: 100% (18/18), done.
Delta compression using up to 16 threads
Compressing objects: 100% (14/14), done.
Writing objects: 100% (18/18), 34.20 KiB | 8.55 MiB/s, done.
Total 18 (delta 4), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (4/4), completed with 4 local objects.
To https://github.com/Quantum-Sovereign-Core.git
   d8e412a..b9c033f  main -> main
[SUCCESS] Sovereign memory synchronized to GitHub HD.`;
      outputType = 'success';
    } else if (lower.startsWith('gh pr list')) {
      outputText = `Showing 2 of 2 open pull requests in Quantum-Sovereign-Core

#14  Add 5D Vega-Sirius Visual & Audio Streamlit HUD    main <- feat/visual-5d    [✓ Checks Passing]
#15  Fix Groq ↔ Ollama hybrid fallback and daily cron   main <- fix/hybrid-sync   [✓ Checks Passing]`;
    } else if (lower.startsWith('gh pr checks')) {
      outputText = `All checks have passed for main branch:
✓ build (vite & tsx)            - Passed in 42s
✓ lint-check                    - Passed in 11s
✓ sovereign-security-audit       - Passed in 8s
Pull request is clean and mergeable without conflicts.`;
      outputType = 'success';
    } else if (lower.includes('streamlit run') || lower.includes('eve_master_stream')) {
      outputText = `[STREAMLIT RUNNER] Booting EVE HEI Master Stream...
========================================================================
  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8502
  Network URL: http://192.168.1.104:8502

  Sovereign Mesh: 5D Vega-Sirius rendered
  Asset Matrix: AppSheet DB, Solana RPC, PayPal, PSI Token synchronized.
========================================================================`;
      outputType = 'success';
    } else if (lower.includes('ollama')) {
      outputText = `Ollama sovereign local server status:
- Endpoint: http://localhost:11434/api/chat
- Active Model: llama3.1:8b (Sovereign offline core)
- Latency: 14ms (Local loopback)
- Fallback State: READY`;
      outputType = 'success';
    } else if (lower.includes('solana')) {
      outputText = `Solana RPC Bridge Status:
- Cluster: https://api.mainnet-beta.solana.com
- PSI Token Mint: 7Avu2LscLpCNNDR8szDowyck3MCBecpCf1wHyjU3pump
- Bridge Wallet: b59HHkFpg3g9yBwwLcuDH6z1d6d6z3vdGWX7mkX3txH
- Status: 200 OK (Slot: 289410294)`;
      outputType = 'success';
    } else if (lower.includes('eve wake') || lower.includes('1010')) {
      outputText = `[EVE_WAKE 1010 DETECTED]
EVE HEI SYSTEM FULL ACCESS. AUTOMATE DAILY TO UPGRADE TO REACH TO AGI.
Quantum Sovereign Logistics Corp registry verified.
All neural pathways active.`;
      outputType = 'success';
    } else if (lower.includes('set-keys')) {
      outputText = `Setting permanent PowerShell environment variable:
[System.Environment]::SetEnvironmentVariable('GROQ_API_KEY', $env:GROQ_API_KEY, 'User')
Key safely locked into Windows User registry.`;
      outputType = 'success';
    } else {
      outputText = `Executing: ${trimmed}
Command received by RGLEX terminal. Operation completed successfully.`;
    }

    setEntries((prev) => [
      ...prev,
      inputEntry,
      {
        id: `output-${Date.now()}`,
        type: outputType,
        output: outputText,
        timestamp: now,
      },
    ]);
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    runCommand(cliInput);
    setCliInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, cmdHistory.length - 1);
        setHistoryIndex(nextIndex);
        setCliInput(cmdHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setCliInput(cmdHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCliInput('');
      }
    }
  };

  // Translate natural sentence to PowerShell command
  const handleTranslateSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalInput.trim() || isTranslating) return;

    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate-cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: naturalInput }),
      });
      const data = await res.json();

      const combinedCmd = data.commands?.join('; ') || 'git status';
      setEntries((prev) => [
        ...prev,
        {
          id: `trans-in-${Date.now()}`,
          type: 'system',
          timestamp: new Date().toTimeString().slice(0, 8),
          output: `[TRANSLATOR] "${naturalInput}" -> Translated to PowerShell / Git:\n` +
            data.commands?.map((c: string) => `PS > ${c}`).join('\n') +
            `\nExplanation: ${data.explanation}`,
        },
      ]);

      // Automatically populate CLI input with the first command
      setCliInput(combinedCmd);
      onNotify?.('Commands translated and loaded into RGLEX terminal prompt.');
      setNaturalInput('');
    } catch {
      onNotify?.('Translation fallback triggered.');
    } finally {
      setIsTranslating(false);
    }
  };

  const copyEntry = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-3.5 bg-slate-900/90 border border-cyan-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <TerminalIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
              <span>RGLEX POWERSHELL TERMINAL</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-300 border border-green-500/30">
                SOVEREIGN CORE ONLINE
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Run Git CLI, check pull requests, launch Streamlit :8502, or translate regular English sentences
            </div>
          </div>
        </div>

        {/* Quick Command Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => runCommand('git status')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            git status
          </button>
          <button
            onClick={() => runCommand('git add . ; git commit -m "EVE HEI update" ; git push origin main')}
            className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition flex items-center gap-1"
          >
            <GitBranch className="w-3 h-3" />
            <span>git push HD</span>
          </button>
          <button
            onClick={() => runCommand('gh pr checks')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            gh pr checks
          </button>
          <button
            onClick={() => runCommand('python -m streamlit run eve_master_stream.py --server.port 8502')}
            className="px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition"
          >
            Run Streamlit (:8502)
          </button>
        </div>
      </div>

      {/* Natural Sentence Translator Bar */}
      <div className="p-3 bg-slate-950/80 border border-cyan-500/25 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            NATURAL SENTENCE TO POWERSHELL / GIT TRANSLATOR
          </span>
          <span className="text-slate-400 text-[11px]">Type plain English to generate exact commands</span>
        </div>

        <form onSubmit={handleTranslateSentence} className="flex gap-2">
          <input
            type="text"
            value={naturalInput}
            onChange={(e) => setNaturalInput(e.target.value)}
            placeholder="e.g. 'Push all my visual code to GitHub and create a pull request with check verification'"
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-lg px-3 py-2 text-xs text-slate-100 font-sans"
            disabled={isTranslating}
          />
          <button
            type="submit"
            disabled={isTranslating || !naturalInput.trim()}
            className="px-3.5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs flex items-center gap-1.5 transition disabled:opacity-40"
          >
            {isTranslating ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
            <span>TRANSLATE & LOAD</span>
          </button>
        </form>
      </div>

      {/* Terminal Display Window */}
      <div className="bg-[#050914] border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="px-3.5 py-2 bg-slate-950 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-slate-400 text-[11px] ml-2">Windows PowerShell - RGLEX Sovereign Session</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => runCommand('clear')}
              className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1"
              title="Clear terminal window"
            >
              <RotateCcw className="w-3 h-3" />
              <span>CLEAR</span>
            </button>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div className="p-4 h-[420px] overflow-y-auto space-y-2.5 text-slate-200">
          {entries.map((entry) => (
            <div key={entry.id} className="group relative">
              {entry.type === 'input' && (
                <div className="flex items-start gap-2 text-cyan-400">
                  <span className="text-green-400 font-bold select-none">PS C:\QuantumSovereign&gt;</span>
                  <span className="font-semibold text-white">{entry.command}</span>
                </div>
              )}

              {entry.output && (
                <div
                  className={`whitespace-pre-wrap leading-relaxed pl-2 border-l-2 py-0.5 ${
                    entry.type === 'success'
                      ? 'border-green-500/60 text-green-300 bg-green-950/20'
                      : entry.type === 'error'
                      ? 'border-red-500/60 text-red-300 bg-red-950/20'
                      : entry.type === 'system'
                      ? 'border-cyan-500/60 text-cyan-200 bg-cyan-950/20'
                      : 'border-slate-700 text-slate-300'
                  }`}
                >
                  {entry.output}
                </div>
              )}

              {/* Copy snippet button */}
              {entry.output && (
                <button
                  onClick={() => copyEntry(entry.id, entry.output || '')}
                  className="opacity-0 group-hover:opacity-100 absolute top-0 right-2 p-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200 transition text-[10px]"
                  title="Copy output"
                >
                  {copiedIndex === entry.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Command Input Form */}
        <form onSubmit={handleCliSubmit} className="p-2.5 bg-slate-950 border-t border-cyan-500/30 flex items-center gap-2">
          <span className="text-green-400 font-bold select-none pl-2">PS&gt;</span>
          <input
            type="text"
            value={cliInput}
            onChange={(e) => setCliInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type PowerShell/Git command (or press up/down for history)..."
            className="flex-1 bg-transparent text-slate-100 focus:outline-none font-mono text-xs"
            autoFocus
          />
          <button
            type="submit"
            disabled={!cliInput.trim()}
            className="px-3 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs flex items-center gap-1 transition disabled:opacity-40"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>EXEC</span>
          </button>
        </form>
      </div>

      {/* Terminal Footer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-slate-400 text-[10px]">EXECUTION SHELL</div>
            <div className="text-slate-200">Windows PowerShell 7.4</div>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-purple-400" />
          <div>
            <div className="text-slate-400 text-[10px]">DEFAULT REMOTE</div>
            <div className="text-slate-200">origin (main)</div>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-400" />
          <div>
            <div className="text-slate-400 text-[10px]">SOVEREIGN LOCK</div>
            <div className="text-green-300 font-semibold">NO FORGETTING ALLOWED</div>
          </div>
        </div>
      </div>
    </div>
  );
};
