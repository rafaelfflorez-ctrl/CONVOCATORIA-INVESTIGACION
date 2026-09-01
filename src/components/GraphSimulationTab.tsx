import React, { useState, useEffect, useRef } from 'react';
import { Share2, Play, Pause, Zap, RotateCcw, Sparkles, Activity } from 'lucide-react';
import { SimulationParams } from '../types';

interface GraphSimulationTabProps {
  params: SimulationParams;
}

type GraphLevel = 'molecular' | 'proceso' | 'hibrido';

interface GraphNode {
  id: string;
  tipo: string;
  nombre: string;
  sub?: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radio: number;
  dpLocal?: number;
  val?: string | number;
  icon?: string;
  temp?: string;
  masa?: string;
  sensor?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radio: number;
  ion: string;
  color: string;
}

export const GraphSimulationTab: React.FC<GraphSimulationTabProps> = ({ params }) => {
  const [level, setLevel] = useState<GraphLevel>('molecular');
  const [isPaused, setIsPaused] = useState(false);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; content: React.ReactNode }>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  const nodesRef = useRef<GraphNode[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const draggedNodeRef = useRef<GraphNode | null>(null);
  const simTimeRef = useRef<number>(0);
  const gnnWaveRef = useRef<{ active: boolean; progress: number }>({ active: false, progress: 0 });

  const initScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    nodesRef.current = [];
    particlesRef.current = [];

    if (level === 'molecular') {
      const num = 4;
      const sp = 240;
      const startX = (w - (num - 1) * sp) / 2;
      for (let i = 0; i < num; i++) {
        nodesRef.current.push({
          id: `glucosa_${i + 1}`,
          tipo: 'anillo_glucosa',
          nombre: `Glucosa β-${i + 1}`,
          x: startX + i * sp,
          y: h / 2,
          baseX: startX + i * sp,
          baseY: h / 2,
          vx: 0,
          vy: 0,
          radio: 46,
          dpLocal: Math.round(510 - i * 18),
        });
      }

      const numPart = Math.max(8, Math.round(18 * params.znRatio));
      for (let p = 0; p < numPart; p++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2.0,
          vy: (Math.random() - 0.5) * 2.0,
          radio: p % 2 === 0 ? 11 : 8,
          ion: p % 2 === 0 ? 'Zn²⁺' : 'H₂PO₄⁻',
          color: p % 2 === 0 ? '#38bdf8' : '#c084fc',
        });
      }
    } else if (level === 'proceso') {
      const etapas = [
        { id: 'op1', nombre: '1. Desfibrado', sub: 'Residuo H-SEG', x: w * 0.12, y: h / 2, icon: '✂️', temp: '28°C', masa: '100 kg/h', sensor: 'Cizallamiento' },
        { id: 'op2', nombre: '2. Reactor DES', sub: 'Solvatación', x: w * 0.32, y: h / 2, icon: '⚗️', temp: `${params.temp}°C`, masa: '98% Solvatado', sensor: 'Viscosidad η' },
        { id: 'op3', nombre: '3. Coagulación', sub: 'Baño Antisolv.', x: w * 0.52, y: h / 2, icon: '💧', temp: '10°C (Frío)', masa: 'Celulosa II', sensor: 'Precipitación' },
        { id: 'op4', nombre: '4. Hilatura', sub: 'Estiraje Axial', x: w * 0.72, y: h / 2, icon: '🧵', temp: `λ = ${params.estiraje.toFixed(2)}`, masa: '24.8 cN/tex', sensor: 'Tensión' },
        { id: 'op5', nombre: '5. Recuperación', sub: 'Reciclaje DES', x: w * 0.90, y: h / 2, icon: '♻️', temp: 'Evaporación', masa: '94.5% Recuperado', sensor: 'Pureza DES' },
      ];

      etapas.forEach((et) => {
        nodesRef.current.push({
          ...et,
          tipo: 'operacion_unitaria',
          baseX: et.x,
          baseY: et.y,
          vx: 0,
          vy: 0,
          radio: 42,
        });
      });
    } else {
      // Híbrido GNN
      const numCols = 6;
      for (let c = 0; c < numCols; c++) {
        const cx = w * 0.15 + c * (w * 0.14);
        nodesRef.current.push({
          id: `mol_${c}`,
          tipo: 'hibrido_molecular',
          nombre: `Micro-DP_${c + 1}`,
          x: cx,
          y: h * 0.30,
          baseX: cx,
          baseY: h * 0.30,
          vx: 0,
          vy: 0,
          radio: 24,
          val: Math.round(520 - c * 25),
        });
        nodesRef.current.push({
          id: `macro_${c}`,
          tipo: 'hibrido_macro',
          nombre: `Tenacidad_${c + 1}`,
          x: cx,
          y: h * 0.70,
          baseX: cx,
          baseY: h * 0.70,
          vx: 0,
          vy: 0,
          radio: 24,
          val: (25.5 - c * 0.7).toFixed(1),
        });
      }
    }
  };

  useEffect(() => {
    initScene();
  }, [level, params.znRatio, params.temp, params.estiraje]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (!isPaused) {
        simTimeRef.current++;
        // Update physics
        const w = canvas.width;
        const h = canvas.height;

        nodesRef.current.forEach((n) => {
          if (n !== draggedNodeRef.current) {
            const dx = n.baseX - n.x;
            const dy = n.baseY - n.y;
            n.vx = (n.vx + dx * 0.06) * 0.82;
            n.vy = (n.vy + dy * 0.06) * 0.82;
            n.x += n.vx;
            n.y += n.vy;
          }
        });

        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 10 || p.x > w - 10) p.vx *= -1;
          if (p.y < 10 || p.y > h - 10) p.vy *= -1;

          if (level === 'molecular') {
            nodesRef.current.forEach((n) => {
              const d = Math.hypot(n.x - p.x, n.y - p.y);
              if (d < 140 && d > 35) {
                p.vx += (n.x - p.x) * 0.0006;
                p.vy += (n.y - p.y) * 0.0006;
              }
            });
          }
        });

        if (gnnWaveRef.current.active) {
          gnnWaveRef.current.progress += 0.02;
          if (gnnWaveRef.current.progress > 1.0) {
            gnnWaveRef.current.active = false;
          }
        }
      }

      // Draw Scene
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      if (level === 'molecular') {
        // Particles
        particlesRef.current.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#04101d';
          ctx.font = 'bold 8px "JetBrains Mono"';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.ion, p.x, p.y);
        });

        // Glycosidic bonds
        for (let i = 0; i < nodesRef.current.length - 1; i++) {
          const n1 = nodesRef.current[i];
          const n2 = nodesRef.current[i + 1];
          const midX = (n1.x + n2.x) / 2;
          const midY = (n1.y + n2.y) / 2 - 14;

          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(n1.x + 44, n1.y);
          ctx.quadraticCurveTo(midX, midY, n2.x - 44, n2.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(midX, midY + 4, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#f43f5e';
          ctx.fill();
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 9px "JetBrains Mono"';
          ctx.textAlign = 'center';
          ctx.fillText('β(1→4)', midX, midY - 10);
        }

        // Glucose rings
        nodesRef.current.forEach((n) => {
          const radio = 44;
          const vertices: { x: number; y: number }[] = [];
          for (let v = 0; v < 6; v++) {
            const ang = ((v * 60 - 30) * Math.PI) / 180;
            vertices.push({
              x: n.x + radio * Math.cos(ang),
              y: n.y + radio * Math.sin(ang),
            });
          }

          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(vertices[0].x, vertices[0].y);
          for (let v = 1; v < 6; v++) ctx.lineTo(vertices[v].x, vertices[v].y);
          ctx.closePath();
          ctx.stroke();

          vertices.forEach((vt, vIdx) => {
            ctx.beginPath();
            ctx.arc(vt.x, vt.y, 6.5, 0, Math.PI * 2);
            ctx.fillStyle = vIdx === 0 ? '#f43f5e' : '#1e293b';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          });

          // OH branches
          const ohs = [
            { x: n.x - 20, y: n.y - 58, lbl: 'C6-OH' },
            { x: n.x + 42, y: n.y + 42, lbl: 'C2-OH' },
            { x: n.x - 42, y: n.y + 42, lbl: 'C3-OH' },
          ];

          ohs.forEach((oh) => {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(oh.x, oh.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(oh.x, oh.y, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#f43f5e';
            ctx.fill();

            ctx.fillStyle = '#94a3b8';
            ctx.font = '600 9px "JetBrains Mono"';
            ctx.textAlign = 'center';
            ctx.fillText(oh.lbl, oh.x, oh.y + (oh.y < n.y ? -10 : 16));
          });

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 11px "Plus Jakarta Sans"';
          ctx.textAlign = 'center';
          ctx.fillText(n.nombre, n.x, n.y + 4);
        });
      } else if (level === 'proceso') {
        // Pipes & flow
        for (let i = 0; i < nodesRef.current.length - 1; i++) {
          const n1 = nodesRef.current[i];
          const n2 = nodesRef.current[i + 1];

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(n1.x + 42, n1.y);
          ctx.lineTo(n2.x - 42, n2.y);
          ctx.stroke();

          for (let f = 0; f < 3; f++) {
            const offset = (simTimeRef.current * 2.2 + f * 45) % (n2.x - n1.x - 84);
            ctx.beginPath();
            ctx.arc(n1.x + 42 + offset, n1.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8';
            ctx.fill();
          }
        }

        nodesRef.current.forEach((n, idx) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 42, 0, Math.PI * 2);
          ctx.fillStyle = '#171d26';
          ctx.fill();
          ctx.strokeStyle = idx === 1 ? '#f59e0b' : '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(n.icon || '⚙️', n.x, n.y - 6);

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 11px "Plus Jakarta Sans"';
          ctx.fillText(n.nombre, n.x, n.y + 60);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px "JetBrains Mono"';
          ctx.fillText(n.sub || '', n.x, n.y + 75);
        });
      } else {
        // Híbrido Message Passing
        const numCols = 6;
        for (let c = 0; c < numCols; c++) {
          const nMol = nodesRef.current[c];
          const nMac = nodesRef.current[c + numCols];

          ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(nMol.x, nMol.y + nMol.radio);
          ctx.lineTo(nMac.x, nMac.y - nMac.radio);
          ctx.stroke();
          ctx.setLineDash([]);

          if (c < numCols - 1) {
            const nMolNext = nodesRef.current[c + 1];
            const nMacNext = nodesRef.current[c + 1 + numCols];

            ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(nMol.x + nMol.radio, nMol.y);
            ctx.lineTo(nMolNext.x - nMolNext.radio, nMolNext.y);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(nMac.x + nMac.radio, nMac.y);
            ctx.lineTo(nMacNext.x - nMacNext.radio, nMacNext.y);
            ctx.stroke();
          }
        }

        if (gnnWaveRef.current.active) {
          const waveX = w * 0.15 + gnnWaveRef.current.progress * (w * 0.70);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.moveTo(waveX, h * 0.2);
          ctx.lineTo(waveX, h * 0.82);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        nodesRef.current.forEach((n) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radio, 0, Math.PI * 2);
          ctx.fillStyle = '#171d26';
          ctx.fill();
          ctx.strokeStyle = n.tipo === 'hibrido_molecular' ? '#38bdf8' : '#10b981';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = n.tipo === 'hibrido_molecular' ? '#38bdf8' : '#34d399';
          ctx.font = 'bold 10px "JetBrains Mono"';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(n.val), n.x, n.y);
        });

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px "Plus Jakarta Sans"';
        ctx.textAlign = 'left';
        ctx.fillText('Capa 1: Topología Molecular & Cinética (DP)', 24, h * 0.30);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 12px "Plus Jakarta Sans"';
        ctx.textAlign = 'left';
        ctx.fillText('Capa 2: Respuesta Macroscópica a Tracción (cN/tex)', 24, h * 0.70);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [level, isPaused]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    for (const n of nodesRef.current) {
      const dist = Math.hypot(n.x - mx, n.y - my);
      if (dist < n.radio + 8) {
        draggedNodeRef.current = n;
        break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = mx;
      draggedNodeRef.current.y = my;
    }

    // Hover tooltip
    let hovered: GraphNode | null = null;
    for (const n of nodesRef.current) {
      if (Math.hypot(n.x - mx, n.y - my) < n.radio + 8) {
        hovered = n;
        break;
      }
    }

    if (hovered) {
      setTooltip({
        visible: true,
        x: e.clientX - rect.left + 15,
        y: e.clientY - rect.top + 15,
        content: (
          <div className="text-xs space-y-1">
            <strong className="text-cyan-300 font-semibold block">{hovered.nombre}</strong>
            {hovered.tipo === 'anillo_glucosa' && (
              <>
                <p>• Enlaces: β(1→4) glicosídicos</p>
                <p>• DP Local Estimado: {hovered.dpLocal}</p>
                <p className="text-emerald-400">• Solvatación Activa con Zn²⁺</p>
              </>
            )}
            {hovered.tipo === 'operacion_unitaria' && (
              <>
                <p>• Sub-etapa: {hovered.sub}</p>
                <p>• Condición: {hovered.temp}</p>
                <p>• Flujo: {hovered.masa}</p>
              </>
            )}
            {hovered.tipo.startsWith('hibrido') && (
              <p>• Valor latente: {hovered.val}</p>
            )}
          </div>
        ),
      });
    } else {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleMouseUp = () => {
    draggedNodeRef.current = null;
  };

  const triggerGnnInference = () => {
    gnnWaveRef.current = { active: true, progress: 0 };
  };

  return (
    <div className="bg-[#171d26] border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in duration-300">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            Simulación Interactiva de Grafos en 3 Niveles (GNN)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Explora la física molecular en tiempo real, el diagrama de planta y la propagación neuronal (Message Passing)
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => setLevel('molecular')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              level === 'molecular'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔬 1. Molecular
          </button>
          <button
            onClick={() => setLevel('proceso')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              level === 'proceso'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏭 2. Planta
          </button>
          <button
            onClick={() => setLevel('hibrido')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              level === 'hibrido'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧠 3. Híbrido GNN
          </button>
        </div>
      </div>

      {/* Stage Wrapper */}
      <div className="relative rounded-xl bg-radial from-[#111722] to-[#0a0d13] border border-slate-800 overflow-hidden shadow-inner">
        
        {/* Floating Actions */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#0f141c]/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
          </button>
          
          <button
            onClick={triggerGnnInference}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Inferencia GNN</span>
          </button>

          <button
            onClick={initScene}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Resetear vista"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={480}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-[400px] sm:h-[480px] block cursor-grab active:cursor-grabbing"
        />

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute z-20 pointer-events-none p-3 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md max-w-xs text-slate-200"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.content}
          </div>
        )}
      </div>

      {/* Explanatory contextual footer */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 text-xs text-slate-300 leading-relaxed">
        {level === 'molecular' && (
          <p>
            <strong className="text-cyan-300 font-semibold">🔬 Nivel 1: Grafo Molecular Interactivo &amp; Dinámica de Solvatación:</strong>{' '}
            Haz clic y arrastra los anillos de glucosa con el cursor. Observa cómo los iones de <span className="font-mono text-cyan-400">Zn²⁺</span> (celeste) y <span className="font-mono text-purple-400">H₂PO₄⁻</span> (púrpura) difunden e interactúan con los grupos <span className="font-mono text-slate-200">C2-OH</span>, <span className="font-mono text-slate-200">C3-OH</span> y <span className="font-mono text-slate-200">C6-CH₂OH</span> rompiendo los puentes de H cristalinos y preparando la cadena para hilatura.
          </p>
        )}
        {level === 'proceso' && (
          <p>
            <strong className="text-cyan-300 font-semibold">🏭 Nivel 2: Grafo de Proceso Químico (Diagrama de Planta Interactivo):</strong>{' '}
            Pasa el cursor sobre los reactores y tuberías para inspeccionar la telemetría en tiempo real (Caudal, Temperatura, Viscosidad del licor y Tasa de Recuperación de DES). El flujo animado representa el transporte continuo de masa.
          </p>
        )}
        {level === 'hibrido' && (
          <p>
            <strong className="text-cyan-300 font-semibold">🧠 Nivel 3: Grafo Híbrido Espaciotemporal &amp; Message Passing:</strong>{' '}
            Haz clic en <strong>&quot;⚡ Inferencia GNN&quot;</strong> para observar cómo las ondas de propagación neuronal transmiten la información topológica molecular hacia la predicción de tenacidad macroscópica de la fibra.
          </p>
        )}
      </div>

    </div>
  );
};
