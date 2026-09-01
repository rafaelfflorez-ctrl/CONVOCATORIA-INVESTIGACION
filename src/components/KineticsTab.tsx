import React, { useEffect, useRef } from 'react';
import { Clock, AlertTriangle, Atom, Flame, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { A_DEGRADACION, A_DISOLUCION, EA_DEGRADACION, EA_DISOLUCION, R_GAS } from '../data/constants';
import { SimulationParams, SimulationResults } from '../types';

Chart.register(...registerables);

interface KineticsTabProps {
  params?: SimulationParams;
  results?: SimulationResults;
}

export const KineticsTab: React.FC<KineticsTabProps> = ({
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
}) => {
  const chartArrheniusRef = useRef<HTMLCanvasElement>(null);
  const chartDPRef = useRef<HTMLCanvasElement>(null);
  const chartArrInstance = useRef<Chart | null>(null);
  const chartDPInstance = useRef<Chart | null>(null);

  const TK = params.temp + 273.15;
  const k_dis_actual = A_DISOLUCION * Math.exp(-EA_DISOLUCION / (R_GAS * TK));
  const k_deg_actual = A_DEGRADACION * Math.exp(-EA_DEGRADACION / (R_GAS * TK));
  const alfa_actual_pct = (results.alfa_dis * 100);

  useEffect(() => {
    // 1. Chart Arrhenius Disolución
    if (chartArrheniusRef.current) {
      if (chartArrInstance.current) chartArrInstance.current.destroy();

      const tiempos = Array.from({ length: 25 }, (_, i) => i * 5);
      const temps = [25, 45, 60, 75, 90];
      const colors = ['#64748b', '#10b981', '#f59e0b', '#f43f5e', '#c084fc'];

      const datasets: any[] = temps.map((T, idx) => {
        const tempK = T + 273.15;
        const k = A_DISOLUCION * Math.exp(-EA_DISOLUCION / (R_GAS * tempK));
        return {
          label: `${T} °C (k = ${k.toFixed(3)} min⁻¹)`,
          data: tiempos.map((t) => Math.min(100, (1 - Math.exp(-k * t)) * 100)),
          borderColor: colors[idx],
          backgroundColor: colors[idx] + '10',
          borderWidth: 1.5,
          tension: 0.35,
          pointRadius: 0,
        };
      });

      // Highlight active simulator temperature curve
      const isCustomTemp = !temps.includes(params.temp);
      if (isCustomTemp) {
        datasets.unshift({
          label: `⭐ Simulación Actual: ${params.temp} °C (k = ${k_dis_actual.toFixed(3)} min⁻¹)`,
          data: tiempos.map((t) => Math.min(100, (1 - Math.exp(-k_dis_actual * t)) * 100)),
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 0,
        });
      }

      // Add Current Operating Point marker
      datasets.push({
        label: `📍 Punto Operativo Actual (${params.tiempo} min, ${alfa_actual_pct.toFixed(1)}%)`,
        data: [{ x: params.tiempo, y: alfa_actual_pct }],
        type: 'scatter',
        backgroundColor: '#22d3ee',
        borderColor: '#ffffff',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10,
      });

      chartArrInstance.current = new Chart(chartArrheniusRef.current, {
        type: 'line',
        data: { labels: tiempos, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 10 } } },
            tooltip: { mode: 'index', intersect: false },
          },
          scales: {
            x: {
              title: { display: true, text: 'Tiempo de Reacción (min)', color: '#94a3b8', font: { size: 11 } },
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b949e', font: { size: 10 } },
            },
            y: {
              title: { display: true, text: 'Fracción Celulosa Disuelta (%)', color: '#94a3b8', font: { size: 11 } },
              min: 0,
              max: 105,
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b949e', font: { size: 10 } },
            },
          },
        },
      });
    }

    // 2. Chart DP Ekenstam Degradación
    if (chartDPRef.current) {
      if (chartDPInstance.current) chartDPInstance.current.destroy();

      const tiempos = Array.from({ length: 25 }, (_, i) => i * 5);
      const temps = [25, 45, 60, 75, 90];
      const colors = ['#64748b', '#10b981', '#f59e0b', '#f43f5e', '#c084fc'];

      const datasets: any[] = temps.map((T, idx) => {
        const tempK = T + 273.15;
        const k_deg = A_DEGRADACION * Math.exp(-EA_DEGRADACION / (R_GAS * tempK));
        return {
          label: `${T} °C`,
          data: tiempos.map((t) => {
            const invDP = 1 / 1850 + k_deg * t;
            return Math.max(100, Math.round(1 / invDP));
          }),
          borderColor: colors[idx],
          borderWidth: 1.5,
          tension: 0.35,
          pointRadius: 0,
        };
      });

      // Highlight active simulator temperature curve
      const isCustomTemp = !temps.includes(params.temp);
      if (isCustomTemp) {
        datasets.unshift({
          label: `⭐ Simulación Actual: ${params.temp} °C`,
          data: tiempos.map((t) => {
            const invDP = 1 / 1850 + k_deg_actual * t;
            return Math.max(100, Math.round(1 / invDP));
          }),
          borderColor: '#f59e0b',
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 0,
        });
      }

      // Add Current Operating Point marker
      datasets.push({
        label: `📍 DP Actual del Simulador (${params.tiempo} min, ${results.DP_final} DP)`,
        data: [{ x: params.tiempo, y: results.DP_final }],
        type: 'scatter',
        backgroundColor: '#fbbf24',
        borderColor: '#ffffff',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10,
      });

      chartDPInstance.current = new Chart(chartDPRef.current, {
        type: 'line',
        data: { labels: tiempos, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 10 } } },
          },
          scales: {
            x: {
              title: { display: true, text: 'Tiempo (min)', color: '#94a3b8', font: { size: 11 } },
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b949e', font: { size: 10 } },
            },
            y: {
              title: { display: true, text: 'Grado de Polimerización (DP)', color: '#94a3b8', font: { size: 11 } },
              min: 100,
              max: 1900,
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b949e', font: { size: 10 } },
            },
          },
        },
      });
    }

    return () => {
      if (chartArrInstance.current) chartArrInstance.current.destroy();
      if (chartDPInstance.current) chartDPInstance.current.destroy();
    };
  }, [params, results, k_dis_actual, k_deg_actual, alfa_actual_pct]);

  const isSafeDP = results.DP_final >= 350 && results.DP_final <= 650;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Real-Time Kinetic Status Banner (Linked to Simulator) */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-[#131d2a] to-slate-900 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-300">
                Parámetros Sincronizados con el Simulador Fisicoquímico
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Enlace en Vivo
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              T = <strong className="text-cyan-200">{params.temp} °C</strong> ({TK.toFixed(1)} K) · Tiempo = <strong className="text-cyan-200">{params.tiempo} min</strong> · ZnCl₂:H₃PO₄ = <strong className="text-cyan-200">{params.znRatio.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs">
            <span className="text-slate-400 block text-[10px]">Constante k_dis</span>
            <span className="font-mono font-bold text-cyan-300">{k_dis_actual.toFixed(4)} min⁻¹</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs">
            <span className="text-slate-400 block text-[10px]">Constante k_deg</span>
            <span className="font-mono font-bold text-amber-300">{k_deg_actual.toExponential(3)} min⁻¹</span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 ${
            isSafeDP 
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' 
              : 'bg-amber-950/50 border-amber-500/40 text-amber-300'
          }`}>
            {isSafeDP ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
            <div>
              <span className="block text-[10px] opacity-80">Ventana Hilatura</span>
              <span className="font-bold font-mono">{results.DP_final} DP ({isSafeDP ? 'Óptimo' : 'Fuera de Rango'})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Arrhenius */}
        <div className="lg:col-span-6 bg-[#171d26] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Cinética de Disolución vs Temperatura (Arrhenius)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
              Ea = 40 kJ/mol
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Evolución de la fracción de celulosa disuelta con constante cinética:{' '}
            <span className="font-mono text-cyan-400 font-semibold">α(t) = 1 − exp(−k_dis · t)</span>. El punto <strong className="text-cyan-300">📍 cian</strong> indica la condición actual configurada en el simulador.
          </p>
          <div className="h-72 w-full pt-2">
            <canvas ref={chartArrheniusRef} />
          </div>
        </div>

        {/* Chart 2: DP Degradation */}
        <div className="lg:col-span-6 bg-[#171d26] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Ventana de Seguridad: Grado de Polimerización (DP)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25">
              Hidrólisis Ácida
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Evolución macromolecular del peso de cadena por degradación de Ekenstam. Rango seguro:{' '}
            <span className="font-mono text-amber-400 font-semibold">DP = 350 – 650</span> para hilatura húmeda. El marcador <strong className="text-amber-300">📍 dorado</strong> refleja el DP actual.
          </p>
          <div className="h-72 w-full pt-2">
            <canvas ref={chartDPRef} />
          </div>
        </div>

      </div>

      {/* Formatted Equation Cards */}
      <div className="bg-[#171d26] border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="pb-3 border-b border-slate-800">
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <Atom className="w-5 h-5 text-indigo-400" />
            Fundamento Cinético y Termodinámico del Proceso
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ecuaciones fisicoquímicas que gobiernan la disolución, degradación y regeneración macromolecular en el Gemelo Digital
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Arrhenius */}
          <div className="bg-[#121822] border border-slate-700/60 rounded-xl p-5 shadow-lg space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200">1. Cinética de Solvatación</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Arrhenius
              </span>
            </div>

            <div className="bg-[#090d14] border border-cyan-500/20 rounded-lg p-4 text-center space-y-2 shadow-inner">
              <div className="text-lg font-serif text-sky-200 font-semibold">
                <em>k</em><sub>dis</sub> = <em>A</em> · <em>e</em><sup>−(<em>E</em><sub>a</sub> / <em>RT</em>)</sup>
              </div>
              <div className="text-xs font-mono text-slate-400">
                <em>k</em><sub>dis</sub> = 1.0 × 10⁵ · exp(−40000 / 8.314·<em>T</em>) min⁻¹
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex gap-2 items-start">
                <span className="font-mono text-cyan-400 font-semibold text-[11px] bg-cyan-500/10 px-1 rounded">E_a</span>
                <span><strong>40 kJ/mol</strong> · Energía de activación solvatación en DES.</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="font-mono text-cyan-400 font-semibold text-[11px] bg-cyan-500/10 px-1 rounded">A</span>
                <span><strong>1.0 × 10⁵ min⁻¹</strong> · Factor pre-exponencial de colisión.</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="font-mono text-cyan-400 font-semibold text-[11px] bg-cyan-500/10 px-1 rounded">T</span>
                <span><strong>Temperatura absoluta en Kelvin</strong> (T = °C + 273.15).</span>
              </div>
            </div>
          </div>

          {/* Card 2: Ekenstam */}
          <div className="bg-[#121822] border border-slate-700/60 rounded-xl p-5 shadow-lg space-y-4 hover:border-amber-500/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200">2. Despolimerización Ácida</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Ekenstam
              </span>
            </div>

            <div className="bg-[#090d14] border border-amber-500/20 rounded-lg p-4 text-center space-y-2 shadow-inner">
              <div className="text-lg font-serif text-amber-200 font-semibold">
                (1 / <em>DP</em><sub>t</sub>) − (1 / <em>DP</em>₀) = <em>k</em><sub>deg</sub> · <em>t</em>
              </div>
              <div className="text-xs font-mono text-slate-400">
                <em>DP</em><sub>t</sub> = 1 / [(1 / 1850) + <em>k</em><sub>deg</sub> · <em>t</em>]
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex gap-2 items-start">
                <span className="font-mono text-amber-400 font-semibold text-[11px] bg-amber-500/10 px-1 rounded">DP_0</span>
                <span><strong>1850 DP</strong> · Grado de polimerización inicial algodón.</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="font-mono text-amber-400 font-semibold text-[11px] bg-amber-500/10 px-1 rounded">DP_t</span>
                <span><strong>350–650 DP</strong> · Rango objetivo seguro para hilatura.</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="font-mono text-amber-400 font-semibold text-[11px] bg-amber-500/10 px-1 rounded">k_deg</span>
                <span><strong>Constante de hidrólisis ácida</strong> catalizada por H₃PO₄.</span>
              </div>
            </div>
          </div>

          {/* Card 3: Transición Celulosa II */}
          <div className="bg-[#121822] border border-slate-700/60 rounded-xl p-5 shadow-lg space-y-4 hover:border-emerald-500/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200">3. Transición de Fase</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Celulosa II
              </span>
            </div>

            <div className="bg-[#090d14] border border-emerald-500/20 rounded-lg p-4 text-center space-y-2 shadow-inner">
              <div className="text-lg font-serif text-emerald-200 font-semibold">
                α(<em>t</em>) = 1 − <em>e</em><sup>−<em>k</em><sub>dis</sub> · <em>t</em></sup>
              </div>
              <div className="text-xs font-mono text-emerald-400 font-semibold">
                Celulosa I_β ⟶ Celulosa II (Regenerada)
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex gap-2 items-start">
                <span className="font-mono text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-1 rounded">α(t)</span>
                <span><strong>Fracción disuelta</strong> de celulosa en licor DES (0 a 100%).</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="font-mono text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-1 rounded">H₂O</span>
                <span><strong>Baño frío</strong> · Colapsa iones Zn²⁺ y reorganiza cadenas.</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="font-mono text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-1 rounded">CrI %</span>
                <span><strong>48–58%</strong> · Índice de cristalinidad por Rayos X (XRD).</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
