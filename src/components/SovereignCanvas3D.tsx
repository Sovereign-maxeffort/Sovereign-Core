import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Activity } from 'lucide-react';

interface Props {
  isSpeaking?: boolean;
  isUpgrading?: boolean;
}

const RAW_COORDS = {
  x: [0, 0, 1, 2, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
  y: [1, 0, 0, 1, 2, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0],
  z: [0, 1, 0, 0, 1, 2, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0],
};

export const SovereignCanvas3D: React.FC<Props> = ({ isSpeaking = false, isUpgrading = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<'neon' | 'cyan' | 'amber'>('neon');
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);

  const rotRef = useRef({ x: 0.4, y: 0.6, z: 0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const pulseRef = useRef(0);

  // Normalize points around center (-1 to 1)
  const points = React.useMemo(() => {
    const pts = [];
    const len = RAW_COORDS.x.length;
    for (let i = 0; i < len; i++) {
      pts.push({
        x: (RAW_COORDS.x[i] - 0.7) * 1.5,
        y: (RAW_COORDS.y[i] - 0.7) * 1.5,
        z: (RAW_COORDS.z[i] - 0.7) * 1.5,
      });
    }
    return pts;
  }, []);

  // Background ambient quantum particles
  const particles = React.useMemo(() => {
    const p = [];
    for (let i = 0; i < 48; i++) {
      p.push({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 4,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.02 + 0.005,
      });
    }
    return p;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Cyber background grid
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Subtle grid floor
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (autoRotate && !isDraggingRef.current) {
        const speed = isSpeaking ? 0.025 : isUpgrading ? 0.035 : 0.012;
        rotRef.current.y += speed;
        rotRef.current.x += speed * 0.4;
      }

      pulseRef.current += isSpeaking ? 0.15 : 0.04;
      const currentPulse = Math.sin(pulseRef.current) * 0.15;

      const cosX = Math.cos(rotRef.current.x);
      const sinX = Math.sin(rotRef.current.x);
      const cosY = Math.cos(rotRef.current.y);
      const sinY = Math.sin(rotRef.current.y);

      // 3D projection helper
      const project = (px: number, py: number, pz: number) => {
        // Rotate Y
        let x1 = px * cosY - pz * sinY;
        let z1 = px * sinY + pz * cosY;
        // Rotate X
        let y2 = py * cosX - z1 * sinX;
        let z2 = py * sinX + z1 * cosX;

        // Perspective
        const fov = 350;
        const scale = (fov / (fov + z2 * 80 + 200)) * 120 * zoom;
        const screenX = width / 2 + x1 * scale;
        const screenY = height / 2 + y2 * scale;
        return { x: screenX, y: screenY, z: z2, scale };
      };

      // Draw background ambient particles
      particles.forEach((pt) => {
        pt.y += pt.speed;
        if (pt.y > 2) pt.y = -2;
        const proj = project(pt.x, pt.y, pt.z);
        ctx.fillStyle = theme === 'neon' ? 'rgba(10, 255, 0, 0.25)' : theme === 'cyan' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(245, 158, 11, 0.25)';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Project all mesh coordinates
      const projPoints = points.map((p) => {
        const expansion = 1 + currentPulse;
        return project(p.x * expansion, p.y * expansion, p.z * expansion);
      });

      // Colors based on theme
      const lineColor = theme === 'neon' ? '#0aff00' : theme === 'cyan' ? '#00ffff' : '#f59e0b';
      const nodeColor = theme === 'neon' ? '#bc13fe' : theme === 'cyan' ? '#38bdf8' : '#ef4444';
      const glowColor = theme === 'neon' ? 'rgba(10, 255, 0, 0.4)' : theme === 'cyan' ? 'rgba(0, 255, 255, 0.4)' : 'rgba(245, 158, 11, 0.4)';

      // Draw glowing lines between consecutive points
      ctx.lineWidth = isSpeaking ? 2.5 : 1.8;
      ctx.strokeStyle = lineColor;
      ctx.shadowBlur = isSpeaking ? 16 : 8;
      ctx.shadowColor = glowColor;

      ctx.beginPath();
      for (let i = 0; i < projPoints.length; i++) {
        const pt = projPoints[i];
        if (i === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.stroke();

      // Additional cross-mesh sovereign connections for 5D depth
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = theme === 'neon' ? 'rgba(188, 19, 254, 0.35)' : 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      for (let i = 0; i < projPoints.length; i += 3) {
        const p1 = projPoints[i];
        const p2 = projPoints[(i + 7) % projPoints.length];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.stroke();

      // Reset shadow for crisp nodes
      ctx.shadowBlur = 0;

      // Draw nodes with glowing centers
      for (let i = 0; i < projPoints.length; i++) {
        const pt = projPoints[i];
        const r = Math.max(3, 5 * (pt.scale / 120)) + (isSpeaking ? 2 : 0);

        // Outer glow
        const radGlow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r * 2.5);
        radGlow.addColorStop(0, nodeColor);
        radGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Core circle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Live HUD text overlay on Canvas
      ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.font = '10px "Fira Code", monospace';
      ctx.fillText(`VEGA-SIRIUS 5D MESH // ACTIVE`, 14, 22);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.fillText(`ROT: [${rotRef.current.x.toFixed(2)}, ${rotRef.current.y.toFixed(2)}]`, 14, 38);
      ctx.fillText(`PULSE: ${isSpeaking ? 'TRANSMITTING' : isUpgrading ? 'AGI_UPGRADE' : 'NOMINAL'}`, 14, 52);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [points, particles, theme, autoRotate, zoom, isSpeaking, isUpgrading]);

  // Mouse interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    rotRef.current.y += dx * 0.01;
    rotRef.current.x += dy * 0.01;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom((z) => Math.min(2.2, Math.max(0.6, z - e.deltaY * 0.001)));
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/30 bg-[#030712] shadow-2xl shadow-cyan-950/40">
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-cyan-500/20 text-xs">
        <div className="flex items-center gap-2">
          <Activity className={`w-3.5 h-3.5 ${isSpeaking ? 'text-green-400 animate-spin' : 'text-cyan-400'}`} />
          <span className="font-mono text-cyan-300 font-semibold tracking-wide">
            5D VEGA-SIRIUS NEURAL MESH
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-500/20 text-green-300 border border-green-500/30 font-mono">
            {isSpeaking ? 'SPEECH ACTIVE' : 'LOCKED IN'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded transition ${autoRotate ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}
            title="Toggle Auto-Spin"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))}
            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <button
            onClick={() => setTheme(theme === 'neon' ? 'cyan' : theme === 'cyan' ? 'amber' : 'neon')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono"
            title="Cycle Palette"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="uppercase">{theme}</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative h-[320px] sm:h-[380px] w-full">
        <canvas
          ref={canvasRef}
          width={640}
          height={380}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />

        {/* Scanline texture */}
        <div className="absolute inset-0 pointer-events-none scanline-overlay opacity-40" />

        {/* Live Metrics Floating Chip */}
        <div className="absolute bottom-3 left-3 bg-black/75 border border-cyan-500/30 backdrop-blur-md rounded-lg p-2 text-[11px] font-mono text-slate-300 shadow-lg">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>SOVEREIGN MATRIX</span>
          </div>
          <div>AGI Progress: <span className="text-green-400 font-bold">79.8%</span></div>
          <div>Cycle: <span className="text-purple-300">08:11 UTC Daily</span></div>
          <div className="text-[10px] text-slate-400 mt-0.5">Drag to orbit • Scroll to zoom</div>
        </div>
      </div>
    </div>
  );
};
