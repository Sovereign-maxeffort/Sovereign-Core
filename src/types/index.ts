export interface SystemUrl {
  id: string;
  name: string;
  url: string;
  category: 'blockchain' | 'database' | 'stream' | 'ai' | 'repository' | 'custom';
  description: string;
  status?: 'online' | 'checking' | 'unreachable_or_cors' | 'idle';
  latencyMs?: number;
  statusCode?: number;
}

export interface SystemAsset {
  label: string;
  value: string;
  type: 'token' | 'wallet' | 'payment' | 'corp' | 'rpc';
  explorerUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  provider?: string;
}

export interface TerminalEntry {
  id: string;
  command?: string;
  output?: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  timestamp: string;
}

export interface CodeFile {
  filename: string;
  language: string;
  description: string;
  content: string;
}

export interface PullRequestItem {
  id: number;
  title: string;
  branch: string;
  author: string;
  status: 'open' | 'merged' | 'checks_failing' | 'ready';
  checksPassed: number;
  checksTotal: number;
  summary: string;
}
