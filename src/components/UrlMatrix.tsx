import React, { useState } from 'react';
import { SystemUrl, SystemAsset } from '../types';
import {
  Globe,
  Plus,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Database,
  Radio,
  Cpu,
  Layers,
  Wallet,
  Coins,
  CreditCard,
  Building,
} from 'lucide-react';

interface Props {
  onNotify?: (msg: string) => void;
}

export const UrlMatrix: React.FC<Props> = ({ onNotify }) => {
  const [urls, setUrls] = useState<SystemUrl[]>([
    {
      id: 'url-solana',
      name: 'Solana Mainnet RPC',
      url: 'https://api.mainnet-beta.solana.com',
      category: 'blockchain',
      description: 'Primary high-throughput blockchain RPC bridge for sovereign token settlement',
      status: 'online',
      latencyMs: 142,
    },
    {
      id: 'url-appsheet',
      name: 'CEC WAM Master Ledger',
      url: 'https://www.appsheet.com/template/showcase?appId=CEC_WAM_LEDGERCVS-514022252',
      category: 'database',
      description: 'AppSheet Cloud relational database ledger (CEC_WAM_LEDGERCVS-514022252)',
      status: 'online',
      latencyMs: 98,
    },
    {
      id: 'url-stream',
      name: 'Streamlit Sovereign Stream',
      url: 'http://localhost:8502',
      category: 'stream',
      description: 'Local 100% Visual Streamlit broadcast server for live stream HUD',
      status: 'online',
      latencyMs: 12,
    },
    {
      id: 'url-ollama',
      name: 'Ollama Sovereign Brain Core',
      url: 'http://localhost:11434/api/chat',
      category: 'ai',
      description: 'Local 100% offline sovereign neural core fallback (llama3.1:8b)',
      status: 'online',
      latencyMs: 16,
    },
    {
      id: 'url-groq',
      name: 'Groq Cloud High-Speed API',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      category: 'ai',
      description: 'High-speed cloud inference engine for llama-3.3-70b-versatile',
      status: 'online',
      latencyMs: 185,
    },
    {
      id: 'url-github',
      name: 'GitHub HD Sovereign Core Repo',
      url: 'https://github.com/Quantum-Sovereign-Core',
      category: 'repository',
      description: 'Central version-controlled Git repository with PR verification hooks',
      status: 'online',
      latencyMs: 84,
    },
  ]);

  const [assets] = useState<SystemAsset[]>([
    {
      label: 'PSI Token Address',
      value: '7Avu2LscLpCNNDR8szDowyck3MCBecpCf1wHyjU3pump',
      type: 'token',
      explorerUrl: 'https://solscan.io/token/7Avu2LscLpCNNDR8szDowyck3MCBecpCf1wHyjU3pump',
    },
    {
      label: 'Solana Bridge Wallet',
      value: 'b59HHkFpg3g9yBwwLcuDH6z1d6d6z3vdGWX7mkX3txH',
      type: 'wallet',
      explorerUrl: 'https://solscan.io/account/b59HHkFpg3g9yBwwLcuDH6z1d6d6z3vdGWX7mkX3txH',
    },
    {
      label: 'PayPal Receiving Entity',
      value: 'HpME8sCYRbSuMVfxMQu8M5a7NBKdi29c9nvwJxjxkX4E',
      type: 'payment',
    },
    {
      label: 'Corporation Registration',
      value: 'Quantum Sovereign Logistics Corp (WA UBI: 606 116 126)',
      type: 'corp',
    },
  ]);

  // New URL Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCat, setNewCat] = useState<SystemUrl['category']>('custom');
  const [newDesc, setNewDesc] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pingingId, setPingingId] = useState<string | null>(null);

  // Ping test a URL
  const pingUrl = async (item: SystemUrl) => {
    setPingingId(item.id);
    try {
      const res = await fetch('/api/ping-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: item.url }),
      });
      const data = await res.json();

      setUrls((prev) =>
        prev.map((u) => {
          if (u.id === item.id) {
            return {
              ...u,
              status: data.status,
              latencyMs: data.latencyMs,
              statusCode: data.statusCode,
            };
          }
          return u;
        })
      );
      onNotify?.(`Ping complete for ${item.name}: ${data.latencyMs}ms`);
    } catch {
      setUrls((prev) =>
        prev.map((u) => (u.id === item.id ? { ...u, status: 'unreachable_or_cors' } : u))
      );
    } finally {
      setPingingId(null);
    }
  };

  const pingAll = async () => {
    for (const item of urls) {
      await pingUrl(item);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    let finalUrl = newUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    const newItem: SystemUrl = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      url: finalUrl,
      category: newCat,
      description: newDesc.trim() || 'Custom registered endpoint in Sovereign Matrix',
      status: 'idle',
    };

    setUrls((prev) => [newItem, ...prev]);
    setNewName('');
    setNewUrl('');
    setNewDesc('');
    setShowAddForm(false);
    onNotify?.(`Registered new URL endpoint: ${newItem.name}`);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getCategoryIcon = (cat: SystemUrl['category']) => {
    switch (cat) {
      case 'blockchain':
        return <Coins className="w-4 h-4 text-green-400" />;
      case 'database':
        return <Database className="w-4 h-4 text-blue-400" />;
      case 'stream':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'ai':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'repository':
        return <Layers className="w-4 h-4 text-yellow-400" />;
      default:
        return <Globe className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="p-3.5 bg-slate-900/90 border border-cyan-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
              <span>SYSTEM URLS & ASSET MATRIX (INTER URL)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-300 border border-green-500/30">
                SYNCHRONIZED
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Live endpoint monitor, latency testing, and Quantum Sovereign asset ledger
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={pingAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
            title="Ping all registered URLs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>PING ALL</span>
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>REGISTER URL</span>
          </button>
        </div>
      </div>

      {/* Add Custom URL Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddUrl} className="p-4 bg-slate-950/90 border border-cyan-500/30 rounded-xl space-y-3">
          <div className="text-xs font-mono font-bold text-cyan-300">REGISTER NEW SOVEREIGN URL ENDPOINT</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">ENDPOINT NAME</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. My Twitch Stream RTMP"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">TARGET URL</label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://... or http://localhost:..."
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">CATEGORY</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as SystemUrl['category'])}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none font-mono"
              >
                <option value="stream">Stream / Broadcast</option>
                <option value="blockchain">Blockchain / Crypto</option>
                <option value="database">Database / Ledger</option>
                <option value="ai">AI / Inference Core</option>
                <option value="repository">GitHub / Git Repo</option>
                <option value="custom">Custom Endpoint</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">DESCRIPTION</label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Brief description of this endpoint's role in the system"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 rounded bg-slate-800 text-slate-400 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-cyan-500 text-black font-semibold text-xs font-mono hover:bg-cyan-400"
            >
              Save to Matrix
            </button>
          </div>
        </form>
      )}

      {/* Grid of System URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {urls.map((item) => (
          <div
            key={item.id}
            className="p-3.5 bg-slate-900/80 border border-cyan-500/25 rounded-xl hover:border-cyan-500/50 transition space-y-2.5 shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-slate-200">{item.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    {item.category}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                {pingingId === item.id ? (
                  <span className="flex items-center gap-1 text-cyan-400 text-[11px]">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>PINGING...</span>
                  </span>
                ) : item.status === 'online' ? (
                  <span className="flex items-center gap-1 text-green-400 text-[11px] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{item.latencyMs ? `${item.latencyMs}ms` : 'ACTIVE'}</span>
                  </span>
                ) : item.status === 'unreachable_or_cors' ? (
                  <span className="flex items-center gap-1 text-yellow-400 text-[11px] bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30" title="Target server is local or CORS restricted">
                    <HelpCircle className="w-3 h-3" />
                    <span>LOCAL/CORS</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <XCircle className="w-3 h-3" />
                    <span>IDLE</span>
                  </span>
                )}
              </div>
            </div>

            {/* URL Display */}
            <div className="p-2 rounded bg-black/60 border border-slate-800 text-[11px] font-mono text-cyan-300 break-all flex items-center justify-between gap-2">
              <span className="truncate">{item.url}</span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => copyToClipboard(item.id, item.url)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  title="Copy URL"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  title="Open URL in new tab"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-snug">
              {item.description}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] font-mono">
              <button
                onClick={() => pingUrl(item)}
                disabled={pingingId === item.id}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${pingingId === item.id ? 'animate-spin' : ''}`} />
                <span>TEST LATENCY</span>
              </button>

              <button
                onClick={() => copyToClipboard(`curl-${item.id}`, `curl -I ${item.url}`)}
                className="text-slate-400 hover:text-slate-200"
                title="Copy curl command"
              >
                {copiedId === `curl-${item.id}` ? 'CURL COPIED' : 'COPY CURL'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Ledger & Critical Assets Section */}
      <div className="p-4 bg-slate-900/90 border border-cyan-500/30 rounded-xl space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              FINANCIAL LEDGER & SOVEREIGN ASSETS
            </span>
          </div>
          <span className="text-[11px] font-mono text-purple-300">PERMANENT MEMORY LOCK</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {assets.map((asset, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-black/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span className="flex items-center gap-1">
                  {asset.type === 'token' && <Coins className="w-3 h-3 text-green-400" />}
                  {asset.type === 'wallet' && <Wallet className="w-3 h-3 text-cyan-400" />}
                  {asset.type === 'payment' && <CreditCard className="w-3 h-3 text-yellow-400" />}
                  {asset.type === 'corp' && <Building className="w-3 h-3 text-purple-400" />}
                  <span>{asset.label}</span>
                </span>
                <button
                  onClick={() => copyToClipboard(`asset-${i}`, asset.value)}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-0.5"
                  title="Copy Asset"
                >
                  {copiedId === `asset-${i}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === `asset-${i}` ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              <div className="text-slate-200 font-semibold truncate text-[11px]">
                {asset.value}
              </div>

              {asset.explorerUrl && (
                <a
                  href={asset.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 pt-0.5"
                >
                  <span>View on Explorer</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
