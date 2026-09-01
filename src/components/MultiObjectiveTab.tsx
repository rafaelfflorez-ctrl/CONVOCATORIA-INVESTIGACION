import React, { useEffect, useRef } from 'react';
import { Scale, Leaf, Droplets, RefreshCw, CheckCircle2, Activity } from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { SimulationParams, SimulationResults } from '../types';

Chart.register(...registerables);

interface MultiObjectiveTabProps {
  params?: SimulationParams;
  results?: SimulationResults;
}

export const MultiObjectiveTab: React.FC<MultiObjectiveTabProps> = ({
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
  const chartParetoRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Dynamic LCA calculation based on simulator inputs
  const currentCO2 = parseFloat((1.15 + (params.temp - 30) * 0.022 + (params.tiempo / 60) * 0.20 + (params.znRatio - 0.8) * 0.32).toFixed(2));
  const currentAgua = Math.round(380 + (params.temp - 30) * 1.8 + (100 - params.cel) * 5);
  const currentRecupDES = parseFloat((96.0 - (params.temp - 30) * 0.04).toFixed(1));

  useEffect(() => {
    if (chartParetoRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      const dataPareto = [
        { x: 1.32, y: 23.8, label: 'Receta Eco (35°C)' },
        { x: 1.65, y: 25.5, label: 'Equilibrio Óptimo (45°C)' },
        { x: 1.85, y: 27.4, label: 'Alta Tenacidad (55°C)' },
        { x: 2.45, y: 28.2, label: 'Máx. Tenacidad (65°C)' },
        { x: 3.10, y: 16.0, label: 'Zona Degradada (80°C)' },
      ];

      chartInstance.current = new Chart(chartParetoRef.current, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Frente de Pareto Teórico (NSGA-II)',
              data: dataPareto,
              backgroundColor: '#10b981',
              borderColor: '#34d399',
              pointRadius: 6,
              showLine: true,
              tension: 0.25,
            },
            {
              label: `⭐ Simulación Actual (${currentCO2} kg CO₂, ${results.tenacidad.toFixed(1)} cN/tex)`,
              data: [{ x: currentCO2, y: results.tenacidad, label: 'Punto Operativo Actual' }],
              backgroundColor: '#38bdf8',
              borderColor: '#ffffff',
              borderWidth: 2,
              pointRadius: 9,
              pointHoverRadius: 12,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 10 } } },
            tooltip: {
              callbacks: {
                label: (c: any) => `${c.dataset.label}: CO₂=${c.raw.x} kg/kg, Tenacidad=${c.raw.y} cN/tex`,
              },
            },
          },
          scales: {
            x: {
              title: { display: true, text: 'Huella de Carbono (kg CO₂-eq / kg fibra)', color: '#94a3b8', font: { size: 11 } },
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b949e', font: { size: 10 } },
            },
            y: {
              title: { display: true, text: 'Tenacidad de Fibra (cN/tex)', color: '#94a3b8', font: { size: 11 } },
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b949e', font: { size: 10 } },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [params, results, currentCO2]);

  return (
    <div className="bg-[#171d26] border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            Frente de Pareto: Calidad Mecánica vs Costo vs Huella Ambiental
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Evaluación de sostenibilidad (TEA/LCA) en el marco de la economía circular para la industria de Cartagena y el corredor de Mamonal.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>T: {params.temp}°C · λ: {params.estiraje.toFixed(2)}</span>
        </div>
      </div>

      {/* 3 Circular Economy KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1 hover:border-emerald-500/40 transition-all">
          <div className="flex justify-center text-emerald-400 mb-1">
            <Leaf className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            {currentCO2} <span className="text-xs font-normal text-slate-400">kg CO₂/kg</span>
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Huella de Carbono Actual</div>
          <div className="text-[11px] text-emerald-400 font-semibold pt-1">
            −{((1 - currentCO2 / 5.9) * 100).toFixed(0)}% vs Algodón Virgen (5.9)
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1 hover:border-cyan-500/40 transition-all">
          <div className="flex justify-center text-cyan-400 mb-1">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">
            {currentAgua} <span className="text-xs font-normal text-slate-400">L H₂O/kg</span>
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Consumo de Agua Estimado</div>
          <div className="text-[11px] text-cyan-400 font-semibold pt-1">
            −95.8% vs Cultivo Algodón (10.000 L)
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1 hover:border-amber-500/40 transition-all">
          <div className="flex justify-center text-amber-400 mb-1">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
            {currentRecupDES} <span className="text-xs font-normal text-slate-400">%</span>
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Tasa de Recuperación del DES</div>
          <div className="text-[11px] text-amber-400 font-semibold pt-1">
            Reciclaje por Evaporación al Vacío
          </div>
        </div>

      </div>

      {/* Chart + Industrial Impact Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pareto Chart */}
        <div className="lg:col-span-6 bg-[#121822] border border-slate-700/60 rounded-xl p-5 shadow-md space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Curva de Compromiso Multi-Objetivo (NSGA-II)
          </h4>
          <div className="h-72 w-full pt-1">
            <canvas ref={chartParetoRef} />
          </div>
        </div>

        {/* Industrial text */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-center space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-cyan-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Impacto Sectorial en la Ciudad de Cartagena:
          </h4>
          
          <ul className="space-y-2.5 text-xs text-slate-300 pl-2">
            <li className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span>
              <span><strong className="text-slate-100">Desvío de Rellenos Sanitarios:</strong> Reincorpora toneladas anuales de uniformes industriales de Mamonal y Dotaciones H-SEG en la cadena productiva.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
              <span><strong className="text-slate-100">Cierre de Ciclo Químico:</strong> El sistema DES opera a presión atmosférica y baja temperatura (&lt;60°C), evitando el uso de sulfuro de carbono (CS₂) altamente tóxico del proceso Viscosa.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
              <span><strong className="text-slate-100">Análisis Tecnoeconómico (TEA):</strong> Costo proyectado de <strong className="text-emerald-300">1.35 USD/kg</strong> de fibra regenerada frente a 2.40 USD/kg de hilado virgen importado.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
