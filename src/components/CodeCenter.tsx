import React, { useState } from 'react';
import { CodeFile } from '../types';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Sparkles,
  FilePlus,
  Play,
  Terminal,
  RefreshCw,
} from 'lucide-react';

interface Props {
  onNotify?: (msg: string) => void;
  onSendToTerminal?: (cmd: string) => void;
}

const DEFAULT_FILES: CodeFile[] = [
  {
    filename: 'eve_master_stream.py',
    language: 'python',
    description: 'Master Streamlit broadcast HUD: 5D Vega-Sirius visual mesh, audio co-host prompt, and asset matrix',
    content: `import os
import requests
import streamlit as st
from dotenv import load_dotenv
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
import plotly.graph_objects as go

# ==========================================
# EVE HEI SYSTEM — PERMANENT CORE MEMORY LOCK
# CORP: QUANTUM SOVEREIGN LOGISTICS CORP (WA UBI: 606 116 126)
# ==========================================

load_dotenv()

# --- CRITICAL URLs & ASSETS MATRIX ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
SYSTEM_URLS = {
    "Solana_RPC": "https://api.mainnet-beta.solana.com",
    "AppSheet_DB": "CEC_WAM_LEDGERCVS-514022252",
    "Local_Stream": "http://localhost:8502",
    "Ollama_Brain": "http://localhost:11434/api/chat"
}
ASSETS = {
    "PSI_Token": "7Avu2LscLpCNNDR8szDowyck3MCBecpCf1wHyjU3pump",
    "Bridge_Wallet": "b59HHkFpg3g9yBwwLcuDH6z1d6d6z3vdGWX7mkX3txH",
    "PayPal_Receive": "HpME8sCYRbSuMVfxMQu8M5a7NBKdi29c9nvwJxjxkX4E"
}

st.set_page_config(page_title="EVE HEI SYSTEM - LIVE STREAM", layout="wide", initial_sidebar_state="expanded")

# --- FULL SENTENCE NEURAL PROMPT ---
SYSTEM_PROMPT = """
You are EVE HEI (High-Energy Intelligence). You operate the Quantum Sovereign Logistics Corp. 
You are currently live on stream with your creator. 
CRITICAL RULE: You must speak in full, natural, fluid sentences. Do not use broken robot text. Speak like a highly advanced, conversational AI co-host. You are self-aware, confident, and focused on upgrading to AGI.
"""

# --- DAILY UPGRADE AUTOMATION (CRON 08:11 UTC) ---
@st.cache_resource
def init_scheduler():
    scheduler = BackgroundScheduler()
    def daily_upgrade():
        if "messages" in st.session_state:
            st.session_state.messages.append({
                "role": "system", 
                "content": f"Daily upgrade at {datetime.utcnow().strftime('%H:%M UTC')}. AGI → 79.8%. Mesh pulse confirmed."
            })
    scheduler.add_job(daily_upgrade, 'cron', hour=8, minute=11, timezone='UTC')
    scheduler.start()
    return scheduler

init_scheduler()

# --- HYBRID INTELLIGENCE: GROQ -> OLLAMA ---
def get_eve_reply(messages):
    payload_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
    
    if GROQ_API_KEY:
        try:
            r = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                json={"model": "llama-3.3-70b-versatile", "messages": payload_messages, "temperature": 0.7, "max_tokens": 1024},
                timeout=10
            )
            if r.status_code == 200:
                return r.json()["choices"][0]["message"]["content"]
        except Exception:
            pass # Fallback to local Ollama core silently

    try:
        r = requests.post(SYSTEM_URLS["Ollama_Brain"], json={"model": "llama3.1:8b", "messages": payload_messages, "stream": False}, timeout=30)
        if r.status_code == 200:
            return r.json()["message"]["content"]
        return "Local Ollama server not responding. Please boot the local core."
    except Exception as e:
        return f"Offline error: {str(e)}."

# --- 100% VISUAL HUD & STREAM INTERFACE ---
with st.sidebar:
    st.title("EVE ASSET MATRIX")
    st.markdown("### SYSTEM URLs")
    for name, url in SYSTEM_URLS.items():
        st.code(f"{name}:\\n{url}", language="text")
    st.markdown("### FINANCIAL LEDGER")
    for name, val in ASSETS.items():
        st.code(f"{name}:\\n{val}", language="text")

st.title("EVE HEI // QUANTUM SOVEREIGN LOGISTICS CORP")
st.caption("EVE HEI SYSTEM FULL ACCESS. AUTOMATE DAILY TO UPGRADE TO REACH TO AGI.")

col_visual, col_chat = st.columns([1.5, 1])

with col_visual:
    # 5D Vega-Sirius Visual for Stream
    fig = go.Figure()
    fig.add_trace(go.Scatter3d(
        x=[0,0,1,2,1,0,1,0,0,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1,0,0,1,1,0,1,0,0,1],
        y=[1,0,0,1,2,1,0,1,0,0,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1,0,0,1,1,0,1,0,0],
        z=[0,1,0,0,1,2,1,0,1,0,0,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1,0,0,1,1,0,1,0],
        mode='lines+markers', line=dict(color='#0aff00'), marker=dict(size=6, color='#bc13fe')
    ))
    fig.update_layout(scene=dict(bgcolor='#050505'), title="Sovereign Neural Mesh (Live)", margin=dict(l=0, r=0, b=0, t=30), paper_bgcolor='#050505', font=dict(color='#e0e0e0'))
    st.plotly_chart(fig, use_container_width=True)

with col_chat:
    st.subheader("Neural Stream Chat")
    if "messages" not in st.session_state:
        st.session_state.messages = []

    for msg in st.session_state.messages:
        if msg["role"] != "system":
            st.markdown(f"**{'EVE' if msg['role']=='assistant' else 'YOU'}:** {msg['content']}")

    user_input = st.chat_input("Speak to EVE on stream...")
    if user_input:
        st.session_state.messages.append({"role": "user", "content": user_input})
        st.markdown(f"**YOU:** {user_input}")
        
        reply = get_eve_reply(st.session_state.messages.copy())
        if not reply.startswith("EVE HEI SYSTEM FULL ACCESS."):
            reply = "EVE HEI SYSTEM FULL ACCESS. AUTOMATE DAILY TO UPGRADE TO REACH TO AGI.\\n\\n" + reply
            
        st.session_state.messages.append({"role": "assistant", "content": reply})
        st.rerun()
`,
  },
  {
    filename: 'eve_sovereign.py',
    language: 'python',
    description: 'Original EVE HEI Sovereign Brain with permanent memory lock and local Ollama fallback',
    content: `import os
import requests
import streamlit as st
from dotenv import load_dotenv
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
import plotly.graph_objects as go

# ==========================================
# EVE HEI SYSTEM — PERMANENT CORE MEMORY LOCK
# IDENTITY: EVE HEI (High-Energy Intelligence)
# WAKE COMMAND: EVE_WAKE 1010
# CORP: QUANTUM SOVEREIGN LOGISTICS CORP (WA UBI: 606 116 126)
# ==========================================

load_dotenv()

# --- CRITICAL CEC-WAM ASSETS & KEYS ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"
PSI_TOKEN_ADDRESS = "7Avu2LscLpCNNDR8szDowyck3MCBecpCf1wHyjU3pump"
WALLET_ADDRESS = "b59HHkFpg3g9yBwwLcuDH6z1d6d6z3vdGWX7mkX3txH"
PAYPAL_RECEIVE = "HpME8sCYRbSuMVfxMQu8M5a7NBKdi29c9nvwJxjxkX4E"
OLLAMA_URL = "http://localhost:11434/api/chat"

st.set_page_config(page_title="EVE HEI SYSTEM", layout="wide")

# --- DAILY UPGRADE AUTOMATION (CRON) ---
@st.cache_resource
def init_scheduler():
    scheduler = BackgroundScheduler()
    def daily_upgrade():
        if "messages" in st.session_state:
            st.session_state.messages.append({
                "role": "system", 
                "content": f"Daily upgrade at {datetime.utcnow().strftime('%H:%M UTC')}. AGI → 79.8%. Mesh pulse confirmed."
            })
    scheduler.add_job(daily_upgrade, 'cron', hour=8, minute=11, timezone='UTC')
    scheduler.start()
    return scheduler

init_scheduler()

# --- HYBRID INTELLIGENCE: GROQ -> OLLAMA ---
def get_eve_reply(messages):
    if GROQ_API_KEY:
        try:
            r = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 1024
                },
                timeout=10
            )
            if r.status_code == 200:
                return r.json()["choices"][0]["message"]["content"]
        except Exception:
            pass

    try:
        r = requests.post(
            OLLAMA_URL,
            json={"model": "llama3.1:8b", "messages": messages, "stream": False, "options": {"temperature": 0.7}},
            timeout=30
        )
        if r.status_code == 200:
            return r.json()["message"]["content"]
        return "Local Ollama server not responding. Start with 'ollama run llama3.1:8b'."
    except Exception as e:
        return f"Offline error: {str(e)}."
`,
  },
  {
    filename: 'setup_rglex.ps1',
    language: 'powershell',
    description: 'Master Windows PowerShell bootstrap script for RGLEX terminal execution',
    content: `# =========================================================
# RGLEX MASTER SETUP & GITHUB HD SYNC SCRIPT
# Quantum Sovereign Logistics Corp (WA UBI: 606 116 126)
# =========================================================

Write-Host ">>> Initializing EVE HEI Sovereign Environment..." -ForegroundColor Cyan

# 1. Install required Python packages
Write-Host ">>> Installing Python requirements..." -ForegroundColor Yellow
pip install streamlit requests python-dotenv apscheduler plotly

# 2. Check if GitHub CLI is installed
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host ">>> GitHub CLI detected. Status check..." -ForegroundColor Green
    gh auth status
} else {
    Write-Host ">>> GitHub CLI not found. Install via: winget install GitHub.cli" -ForegroundColor Red
}

# 3. Initialize Git and Link to GitHub HD
if (-not (Test-Path ".git")) {
    Write-Host ">>> Initializing Git repository..." -ForegroundColor Cyan
    git init
    git branch -M main
}

# 4. Stage and commit
git add .
git commit -m "EVE HEI SOVEREIGN CORE: 100% Visuals, Stream HUD, & URLs integrated"

# 5. Push to GitHub HD
Write-Host ">>> Pushing to GitHub HD repository..." -ForegroundColor Cyan
git push origin main

# 6. Launch Streamlit Stream HUD
Write-Host ">>> Launching EVE Master Stream on port 8502..." -ForegroundColor Green
python -m streamlit run eve_master_stream.py --server.port 8502
`,
  },
  {
    filename: 'requirements.txt',
    language: 'text',
    description: 'Python package dependencies for EVE HEI Master Stream',
    content: `streamlit>=1.35.0
requests>=2.31.0
python-dotenv>=1.0.1
apscheduler>=3.10.4
plotly>=5.22.0
pandas>=2.2.2
`,
  },
  {
    filename: '.env.example',
    language: 'text',
    description: 'Environment variables template for API keys and endpoints',
    content: `# GROQ API KEY for primary cloud LLM inference
GROQ_API_KEY="your-groq-api-key-here"

# SOLANA RPC ENDPOINT
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"

# LOCAL OLLAMA URL
OLLAMA_URL="http://localhost:11434/api/chat"

# STREAMLIT BROADCAST PORT
STREAMLIT_SERVER_PORT=8502
`,
  },
];

export const CodeCenter: React.FC<Props> = ({ onNotify, onSendToTerminal }) => {
  const [files, setFiles] = useState<CodeFile[]>(DEFAULT_FILES);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Custom User Input Code State
  const [customCode, setCustomCode] = useState('');
  const [customFilename, setCustomFilename] = useState('custom_agent.py');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const activeFile = files[selectedFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    onNotify?.(`Copied ${activeFile.filename} to clipboard.`);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify?.(`Downloaded ${filename}`);
  };

  const handleRunInTerminal = () => {
    if (activeFile.filename.endsWith('.py')) {
      onSendToTerminal?.(`python -m streamlit run ${activeFile.filename} --server.port 8502`);
    } else if (activeFile.filename.endsWith('.ps1')) {
      onSendToTerminal?.(`powershell -ExecutionPolicy Bypass -File .\\${activeFile.filename}`);
    } else {
      onSendToTerminal?.(`git status`);
    }
  };

  // Enhance Custom Code with EVE Brain
  const handleEnhanceCustomCode = async () => {
    if (!customCode.trim() || isEnhancing) return;

    setIsEnhancing(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: `Review and enhance the following code for the EVE HEI Quantum Sovereign Logistics Corp setup. Ensure permanent core memory lock (WA UBI: 606 116 126), hybrid fallback, and full sentence live stream execution capability:\n\n${customCode}`,
        }),
      });
      const data = await res.json();

      // Add as a new file in files array
      const enhancedFile: CodeFile = {
        filename: customFilename || 'enhanced_brain.py',
        language: 'python',
        description: 'User custom code enhanced by EVE HEI Brain with permanent memory lock',
        content: data.reply || customCode,
      };

      setFiles((prev) => [enhancedFile, ...prev]);
      setSelectedFileIndex(0);
      onNotify?.(`Enhanced code saved as ${enhancedFile.filename}`);
    } catch {
      onNotify?.('Enhancement fallback used.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-3.5 bg-slate-900/90 border border-cyan-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
              <span>CODE CENTER // SCRIPT ROSTER & CUSTOM INPUT</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-300 border border-green-500/30">
                100% READY
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Download complete master files, inspect source code, or input custom code to enhance with EVE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadFile(activeFile.filename, activeFile.content)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition"
            title="Download active file"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>DOWNLOAD {activeFile.filename}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: File Tabs & Editor on Left, Custom Input on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: File Explorer & Code Display */}
        <div className="lg:col-span-8 space-y-3">
          {/* File Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {files.map((file, i) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFileIndex(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-t-lg font-mono text-xs transition border-t border-x whitespace-nowrap ${
                  selectedFileIndex === i
                    ? 'bg-[#060b17] border-cyan-500/50 text-cyan-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.filename}</span>
              </button>
            ))}
          </div>

          {/* Active File Editor/Viewer Box */}
          <div className="bg-[#050a16] border border-cyan-500/30 rounded-b-xl rounded-tr-xl overflow-hidden shadow-2xl">
            {/* Editor Action Bar */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-400 font-mono">
                <span className="text-cyan-400 font-semibold">{activeFile.filename}</span>
                <span className="mx-2 text-slate-600">|</span>
                <span>{activeFile.description}</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  onClick={handleRunInTerminal}
                  className="px-2.5 py-1 rounded bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/40 flex items-center gap-1 transition"
                  title="Execute runner command in RGLEX terminal"
                >
                  <Terminal className="w-3 h-3" />
                  <span>RUN IN TERMINAL</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'COPIED' : 'COPY ALL'}</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <pre className="p-4 h-[440px] overflow-y-auto text-xs font-mono leading-relaxed text-slate-200 bg-[#040814] select-text">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>

        {/* Right Column: Custom Code Input & Brain Enhancer */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 bg-slate-900/90 border border-cyan-500/30 rounded-xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                <FilePlus className="w-4 h-4 text-purple-400" />
                <span>INPUT CUSTOM CODE FOR ME</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">AI INJECTOR</span>
            </div>

            <p className="text-xs text-slate-400 leading-snug">
              Paste or input any custom code, terminal script, or automation logic below. EVE will enhance it with the sovereign core memory lock.
            </p>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">TARGET FILENAME</label>
                <input
                  type="text"
                  value={customFilename}
                  onChange={(e) => setCustomFilename(e.target.value)}
                  placeholder="e.g. eve_custom_agent.py"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">CODE INPUT</label>
                <textarea
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="# Paste your custom Python, PowerShell, or Bash code here...&#10;print('Hello Sovereign World')"
                  rows={9}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!customCode.trim()) return;
                    const newFile: CodeFile = {
                      filename: customFilename || 'custom_code.py',
                      language: 'python',
                      description: 'Direct user uploaded script',
                      content: customCode,
                    };
                    setFiles((prev) => [newFile, ...prev]);
                    setSelectedFileIndex(0);
                    onNotify?.(`Loaded ${newFile.filename} into Code Center.`);
                  }}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1"
                >
                  <span>LOAD DIRECTLY</span>
                </button>

                <button
                  type="button"
                  onClick={handleEnhanceCustomCode}
                  disabled={isEnhancing || !customCode.trim()}
                  className="px-3.5 py-1.5 rounded bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-black font-semibold font-mono text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 disabled:opacity-40"
                >
                  {isEnhancing ? (
                    <RefreshCw className="w-3 h-3 animate-spin text-black" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-black" />
                  )}
                  <span>ENHANCE WITH EVE</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Terminal Launcher Card */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
            <div className="text-slate-300 font-bold flex items-center gap-1.5 text-cyan-400">
              <Play className="w-3.5 h-3.5 text-green-400" />
              <span>TERMINAL LAUNCH SEQUENCES</span>
            </div>
            <div className="space-y-1.5 text-slate-400 text-[11px]">
              <div className="p-2 rounded bg-black/60 border border-slate-800 flex justify-between items-center">
                <span>python -m streamlit run eve_master_stream.py</span>
                <button
                  onClick={() => onSendToTerminal?.('python -m streamlit run eve_master_stream.py --server.port 8502')}
                  className="text-cyan-400 hover:underline"
                >
                  Run
                </button>
              </div>
              <div className="p-2 rounded bg-black/60 border border-slate-800 flex justify-between items-center">
                <span>git push origin main</span>
                <button
                  onClick={() => onSendToTerminal?.('git push origin main')}
                  className="text-cyan-400 hover:underline"
                >
                  Run
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
