import React, { useState, useEffect, useRef } from 'react';
import { Dna, Sparkles, ArrowDownToLine, Leaf, Activity } from 'lucide-react';
import { HISTORIAL_MUESTRAS, RECETAS_VAE_PRESET } from '../data/constants';
import { SimulationParams, SimulationResults, VAERecipe } from '../types';

interface GenerativeVAETabProps {
  params?: SimulationParams;
  results?: SimulationResults;
  onApplyRecipeToSimulator: (params: Partial<SimulationParams>) => void;
}

export const GenerativeVAETab: React.FC<GenerativeVAETabProps> = ({
  params = { znRatio: 1.10, temp: 50, tiempo: 60, estiraje: 1.60, cel: 100 },
  results = {
    viscosidad: 24.5,
    tenacidad: 25.1,
    modulo: 11.2,
    elongacion: 12.4,
    DP_final: 520,
    alfa_dis: 0.965,
    crI: 54.2,
    tiempo_hilado: 4.8,
  },
  onApplyRecipeToSimulator,
}) => {
  const [recetas, setRecetas] = useState<VAERecipe[]>(RECETAS_VAE_PRESET);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawLatentSpace = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(120,140,170,0.06)';
    ctx.fillRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2, 20);
    ctx.lineTo(w / 2, h - 20);
    ctx.moveTo(20, h / 2);
    ctx.lineTo(w - 20, h / 2);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('z₁ (Factor Solvatación DES)', w - 160, h / 2 - 8);
    ctx.fillText('z₂ (Factor Cinético DP)', w / 2 + 8, 30);

    // Historical Points (cyan dots)
    HISTORIAL_MUESTRAS.forEach((m) => {
      const x = w / 2 + (m.znRatio - 1.0) * 200 + (m.temp - 50) * 1.5;
      const y = h / 2 - (m.dp - 500) * 0.14;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Generated AI Recipes (gold stars)
    recetas.forEach((r) => {
      const x = w / 2 + (r.ratioZn - 1.0) * 200 + (r.temp - 50) * 1.5;
      const y = h / 2 - (r.dp - 500) * 0.14;

      ctx.beginPath();
      ctx.arc(x, y, 7.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Live Simulator Point (Pulsing glowing Emerald/Cyan beacon)
    const curX = w / 2 + (params.znRatio - 1.0) * 200 + (params.temp - 50) * 1.5;
    const curY = h / 2 - (results.DP_final - 500) * 0.14;

    // Outer glow
    ctx.beginPath();
    ctx.arc(curX, curY, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center core
    ctx.beginPath();
    ctx.arc(curX, curY, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text Tag
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
    ctx.fillText('📍 SIMULADOR ACTUAL', curX + 10, curY - 6);
  };

  useEffect(() => {
    drawLatentSpace();
  }, [recetas, params, results]);

  const handleGenerarNuevas = () => {
    const jitter = () => (Math.random() - 0.5) * 0.08;
    const nuevas = recetas.map((r, i) => ({
      ...r,
      ratioZn: parseFloat(Math.max(0.7, Math.min(1.8, r.ratioZn + jitter())).toFixed(2)),
      temp: Math.round(r.temp + (Math.random() - 0.5) * 4),
      tiempo: Math.round(r.tiempo + (Math.random() - 0.5) * 6),
      ten: parseFloat((r.ten + (Math.random() - 0.5) * 0.6).toFixed(1)),
      co2: parseFloat((r.co2 + (Math.random() - 0.5) * 0.08).toFixed(2)),
    }));
    setRecetas(nuevas);
  };

  return (
    <div className="bg-[#171d26] border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <Dna className="w-5 h-5 text-emerald-400" />
            Autoencoder Variacional (VAE) para Diseño Inverso de Recetas
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            La IA Generativa explora combinaciones químicas no probadas experimentalmente para maximizar tenacidad y sostenibilidad.
          </p>
        </div>
        <button
          onClick={handleGenerarNuevas}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 border border-emerald-500/40 transition-all cursor-pointer flex-shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generar 3 Nuevas Recetas Óptimas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Latent Space 2D Map */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              🗺️ Espacio Latente Químico 2D (VAE Latent Space)
            </h4>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span> Ensayos Históricos</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Recetas VAE</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Proyección del espacio latente (z₁, z₂). El modelo interpola entre la conservación de peso molecular y la cinética de disolución rápida.
          </p>
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2 overflow-hidden shadow-inner">
            <canvas ref={canvasRef} width={620} height={320} className="w-full h-64 block rounded-lg" />
          </div>
        </div>

        {/* Recipe Cards List */}
        <div className="lg:col-span-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            🧪 Recetas Químicas Formuladas por el Modelo
          </h4>

          <div className="space-y-3">
            {recetas.map((r, idx) => (
              <div
                key={r.id || idx}
                className="bg-[#121822] border border-slate-700/60 rounded-xl p-4 shadow-md hover:border-cyan-500/30 transition-all space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-cyan-300">{r.nombre}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{r.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {r.ten} cN/tex
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="bg-[#0f141c] p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">DES ZnCl₂</span>
                    <span className="text-slate-200 font-semibold">{r.ratioZn} mol/mol</span>
                  </div>
                  <div className="bg-[#0f141c] p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Temperatura</span>
                    <span className="text-slate-200 font-semibold">{r.temp} °C</span>
                  </div>
                  <div className="bg-[#0f141c] p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Tiempo</span>
                    <span className="text-slate-200 font-semibold">{r.tiempo} min</span>
                  </div>
                  <div className="bg-[#0f141c] p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Estiraje</span>
                    <span className="text-slate-200 font-semibold">λ = {r.estiraje}</span>
                  </div>
                  <div className="bg-[#0f141c] p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">DP Final</span>
                    <span className="text-slate-200 font-semibold">{r.dp} DP</span>
                  </div>
                  <div className="bg-[#0f141c] p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Huella CO₂</span>
                    <span className="text-emerald-400 font-semibold">{r.co2} kg/kg</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onApplyRecipeToSimulator({
                      znRatio: r.ratioZn,
                      temp: r.temp,
                      tiempo: r.tiempo,
                      estiraje: r.estiraje,
                      cel: r.cel,
                    })
                  }
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Cargar en Simulador</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
