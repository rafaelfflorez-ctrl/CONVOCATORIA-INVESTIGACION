import React, { useEffect, useRef } from 'react';
import { Globe2, ShieldCheck, Building2, Factory, Landmark, Cpu } from 'lucide-react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const FederatedGNNTab: React.FC = () => {
  const chartFedRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartFedRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      chartInstance.current = new Chart(chartFedRef.current, {
        type: 'bar',
        data: {
          labels: ['Dotaciones H-SEG', 'Petroquímica Mamonal', 'Lab Carboquímica UdeC', 'Modelo Global FedGNN'],
          datasets: [
            {
              label: 'Coeficiente R² de Generalización',
              data: [0.892, 0.885, 0.910, 0.948],
              backgroundColor: [
                'rgba(56, 189, 248, 0.75)',
                'rgba(129, 140, 248, 0.75)',
                'rgba(16, 185, 129, 0.75)',
                'rgba(245, 158, 11, 0.9)',
              ],
              borderColor: ['#38bdf8', '#818cf8', '#10b981', '#f59e0b'],
              borderWidth: 1.5,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              min: 0.8,
              max: 1.0,
              title: { display: true, text: 'Precisión R²', color: '#94a3b8', font: { size: 11 } },
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b949e', font: { size: 10 } },
            },
            x: {
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
  }, []);

  return (
    <div className="bg-[#171d26] border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-indigo-400" />
          Red de Aprendizaje Federado (FedGNN - Liu et al., 2025)
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
          Entrenamiento colaborativo interinstitucional sin transferir datos confidenciales ni patentes de formulación de la industria textil.
        </p>
      </div>

      {/* 3 Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Node 1 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Factory className="w-4 h-4" /> Nodo 1: Dotaciones H-SEG
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Privado
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Muestras de uniformes de faena y overoles ignífugos</p>
          <div className="text-xl font-extrabold font-mono text-slate-100">
            R² = 0.892
          </div>
        </div>

        {/* Node 2 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Nodo 2: Petroquímica Mamonal
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Privado
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Muestras de mezclas industriales Algodón/Poliéster</p>
          <div className="text-xl font-extrabold font-mono text-slate-100">
            R² = 0.885
          </div>
        </div>

        {/* Node 3 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Landmark className="w-4 h-4" /> Nodo 3: Lab Carboquímica UdeC
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Servidor
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Ensayos reológicos y difracción de rayos X (XRD)</p>
          <div className="text-xl font-extrabold font-mono text-slate-100">
            R² = 0.910
          </div>
        </div>

      </div>

      {/* Chart + Protocol Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Fed Bar Chart */}
        <div className="lg:col-span-6 bg-[#121822] border border-slate-700/60 rounded-xl p-5 shadow-md space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Comparación de Precisión Local vs Modelo Global FedGNN
          </h4>
          <div className="h-64 w-full pt-1">
            <canvas ref={chartFedRef} />
          </div>
        </div>

        {/* Protocol Details */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-center space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Protocolo FedAvg con Privacidad Diferencial:
          </h4>
          
          <p className="text-xs text-slate-300 leading-relaxed">
            Cada fábrica o laboratorio entrena un modelo GCN/GAT en su servidor local con sus datos experimentales confidenciales. Únicamente los <strong>pesos sinápticos W_k</strong> y gradientes se transmiten al servidor agregador de la Universidad de Cartagena.
          </p>

          <div className="p-3 rounded-lg bg-[#0f141c] border border-slate-800 text-xs text-cyan-300">
            El modelo global consolidado alcanza un <strong className="text-amber-400 font-mono text-sm">R² = 0.948</strong>, superando el rendimiento de cualquier nodo individual aislado gracias a la generalización multicliente.
          </div>
        </div>

      </div>

    </div>
  );
};
