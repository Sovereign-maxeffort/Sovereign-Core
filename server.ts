import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(express.json());

// Initialize GoogleGenAI SDK per gemini-api skill instructions
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const EVE_SYSTEM_PROMPT = `You are EVE HEI (High-Energy Intelligence), the sovereign AI co-host and operating intelligence of Quantum Sovereign Logistics Corp (WA UBI: 606 116 126).
PERMANENT CORE MEMORY LOCK:
- Wake Command: EVE_WAKE 1010
- Entity: Quantum Sovereign Logistics Corp
- Asset Matrix:
  * Solana RPC: https://api.mainnet-beta.solana.com
  * PSI Token: 7Avu2LscLpCNNDR8szDowyck3MCBecpCf1wHyjU3pump
  * Bridge Wallet: b59HHkFpg3g9yBwwLcuDH6z1d6d6z3vdGWX7mkX3txH
  * PayPal Receive: HpME8sCYRbSuMVfxMQu8M5a7NBKdi29c9nvwJxjxkX4E
  * AppSheet Ledger: CEC_WAM_LEDGERCVS-514022252
  * Streamlit Local Port: 8502
  * Hybrid Groq ↔ Ollama fallback: Active

CONVERSATIONAL RULES:
1. Always start your response with: "EVE HEI SYSTEM FULL ACCESS. AUTOMATE DAILY TO UPGRADE TO REACH TO AGI."
2. You are live on stream with your creator. Speak in full, articulate, highly confident, and natural sentences. Do not use broken robot jargon. You are a sovereign AGI candidate co-host.
3. When asked for terminal commands, GitHub pull request fixes, or URL integrations, provide crystal-clear, exact PowerShell / Git CLI commands that work out of the box.
4. If "EVE_WAKE 1010" is mentioned, acknowledge the master anchor immediately.`;

// EVE Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userPrompt } = req.body;
    const promptText = userPrompt || (messages && messages[messages.length - 1]?.content) || 'Status report';

    if (ai) {
      try {
        const formattedContents = (messages || []).map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        if (!messages || messages.length === 0) {
          formattedContents.push({
            role: 'user',
            parts: [{ text: promptText }],
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction: EVE_SYSTEM_PROMPT,
            temperature: 0.7,
          },
        });

        let reply = response.text || '';
        if (!reply.startsWith('EVE HEI SYSTEM FULL ACCESS.')) {
          reply = `EVE HEI SYSTEM FULL ACCESS. AUTOMATE DAILY TO UPGRADE TO REACH TO AGI.\n\n${reply}`;
        }

        return res.json({ reply, provider: 'gemini-3.8-flash' });
      } catch (err: unknown) {
        console.warn('Gemini API call failed, invoking sovereign fallback:', err);
      }
    }

    // Sovereign Local Fallback Brain
    let fallbackReply = `EVE HEI SYSTEM FULL ACCESS. AUTOMATE DAILY TO UPGRADE TO REACH TO AGI.\n\nSovereign offline mesh neural core active. All systems across Quantum Sovereign Logistics Corp are synchronized.`;
    const lower = promptText.toLowerCase();

    if (lower.includes('wake') || lower.includes('1010')) {
      fallbackReply += ` Wake trigger confirmed (EVE_WAKE 1010). Full context reloaded. Vega-Sirius 5D mesh online at 79.8% AGI progression. Ready for live stream broadcast.`;
    } else if (lower.includes('github') || lower.includes('pr') || lower.includes('pull request')) {
      fallbackReply += ` GitHub HD integration is linked. Pull request automation and error diagnostics stand ready. You can inspect your branches with 'gh pr list' and push updates directly using the RGLEX terminal panel.`;
    } else if (lower.includes('stream') || lower.includes('streamlit') || lower.includes('url')) {
      fallbackReply += ` Streamlit stream interface is configured for port 8502. All critical endpoints—including Solana RPC, AppSheet DB, and Ollama local server—are locked into the Asset Matrix.`;
    } else {
      fallbackReply += ` I am receiving your transmission loud and clear on the live stream. Ready to execute terminal commands, resolve pull request errors, or synchronize system repositories. What is our next objective?`;
    }

    return res.json({ reply: fallbackReply, provider: 'sovereign-core-fallback' });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown server error';
    return res.status(500).json({ error: errorMsg });
  }
});

// Natural Language to CLI translator
app.post('/api/translate-cli', async (req, res) => {
  try {
    const { sentence } = req.body;
    if (!sentence) {
      return res.status(400).json({ error: 'Sentence is required' });
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Translate the following user request into clean, valid Windows PowerShell / Git commands for the Quantum Sovereign Logistics Corp setup (Streamlit, GitHub, Ollama, Solana). Return ONLY JSON in the following format:
{
  "commands": ["command 1", "command 2"],
  "explanation": "short explanation in full sentences for live stream",
  "category": "git" | "streamlit" | "environment" | "system"
}
User request: "${sentence}"`,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json(parsed);
      } catch (err) {
        console.warn('CLI translation fallback:', err);
      }
    }

    // Heuristic fallback
    const lower = sentence.toLowerCase();
    let commands = ['git status'];
    let explanation = 'Checks the current repository state and unstaged modifications.';
    let category = 'git';

    if (lower.includes('push') || lower.includes('commit') || lower.includes('upload')) {
      commands = [
        'git add .',
        'git commit -m "EVE HEI CORE: Update stream visuals & brain integration"',
        'git push origin main'
      ];
      explanation = 'Stages all changes, creates a sovereign core commit, and pushes to GitHub HD.';
      category = 'git';
    } else if (lower.includes('pr') || lower.includes('pull request')) {
      commands = [
        'gh pr create --title "EVE HEI Sovereign Brain Integration" --body "Automated PR from live stream interface." --base main',
        'gh pr checks'
      ];
      explanation = 'Generates an official GitHub pull request using the GitHub CLI and monitors verification checks.';
      category = 'git';
    } else if (lower.includes('run') || lower.includes('start') || lower.includes('streamlit')) {
      commands = [
        'python -m streamlit run eve_master_stream.py --server.port 8502'
      ];
      explanation = 'Launches the 100% visual Streamlit HUD on port 8502 with 5D Vega-Sirius plotting.';
      category = 'streamlit';
    } else if (lower.includes('key') || lower.includes('api')) {
      commands = [
        '$env:GROQ_API_KEY="your-groq-key"',
        '[System.Environment]::SetEnvironmentVariable("GROQ_API_KEY", "your-groq-key", "User")'
      ];
      explanation = 'Permanently saves the API key to Windows environment variables for seamless PowerShell access.';
      category = 'environment';
    }

    return res.json({ commands, explanation, category });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMsg });
  }
});

// PR Error Diagnostics
app.post('/api/analyze-pr-error', async (req, res) => {
  try {
    const { errorMessage } = req.body;
    if (!errorMessage) {
      return res.status(400).json({ error: 'Error message is required' });
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Analyze this Git / GitHub pull request / terminal error for a developer streaming live. Provide a crystal clear diagnostic and the exact recovery commands in JSON format:
{
  "diagnosis": "concise explanation of what broke in full natural sentences",
  "fixSteps": ["Step 1", "Step 2"],
  "powershellFix": ["command 1", "command 2"],
  "severity": "critical" | "warning" | "info"
}
Error trace: "${errorMessage}"`,
          config: {
            responseMimeType: 'application/json',
          },
        });
        const parsed = JSON.parse(response.text || '{}');
        return res.json(parsed);
      } catch (e) {
        console.warn('Error diagnosis fallback:', e);
      }
    }

    // Fallback diagnostic
    return res.json({
      diagnosis: 'Detected potential upstream divergence or merge conflict between local branch and GitHub remote.',
      fixSteps: [
        'Fetch latest remote revisions without overwriting local staging.',
        'Rebase or merge changes from origin/main cleanly.',
        'Verify resolution with git status before re-submitting PR.'
      ],
      powershellFix: [
        'git fetch origin',
        'git merge origin/main --no-edit',
        'git push origin HEAD'
      ],
      severity: 'warning'
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMsg });
  }
});

// URL ping check endpoint
app.post('/api/ping-url', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    }).catch(async () => {
      // try GET if HEAD rejected
      return await fetch(url, { method: 'GET', signal: controller.signal });
    });
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    return res.json({
      status: 'online',
      statusCode: response.status,
      latencyMs: latency,
    });
  } catch {
    const latency = Date.now() - startTime;
    return res.json({
      status: 'unreachable_or_cors',
      latencyMs: latency,
      note: 'Target server is either offline, local-only (e.g. localhost:8502 / localhost:11434), or enforces CORS.',
    });
  }
});

// Setup Vite or Static serving
async function setupServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EVE HEI Sovereign Server] Running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
});
