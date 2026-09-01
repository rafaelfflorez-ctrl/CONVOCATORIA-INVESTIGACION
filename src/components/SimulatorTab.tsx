import React from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2, FlaskConical, Activity } from 'lucide-react';
import { SimulationParams, SimulationResults } from '../types';

interface SimulatorTabProps {
  params: SimulationParams;
  onChangeParams: (params: SimulationParams) => void;
  results: SimulationResults;
  onReset: () => void;
}

export const SimulatorTab: React.FC<SimulatorTabProps> = ({
  params,
  onChangeParams,
  results,
  onReset,
}) => {
  const updateParam = (key: keyof SimulationParams, value: number) => {
    onChangeParams({ ...params, [key]: value });
  };

  const isViable = results.DP_final >= 250 && results.alfa_dis >= 0.70;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Columna 1: Controles Fisicoquímicos */}
      <div className="lg:col-span-6 bg-[#171d26] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-cyan-400" />
              Variables Operativas de Disolución &amp; Hilatura
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ingresa valores numéricos directamente o ajusta con los deslizadores
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetear</span>
          </button>
        </div>

        {/* 1. Relación ZnCl2 */}
        <div className="bg-[#0f141c]/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Relación Molar ZnCl₂ en DES</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.05"
                min="0.5"
                max="2.0"
                value={params.znRatio}
                onChange={(e) => updateParam('znRatio', parseFloat(e.target.value) || 0.5)}
                className="w-20 px-2 py-1 rounded bg-[#0d121a] border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs text-right outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <span className="text-[11px] font-mono text-slate-400">mol/mol</span>
            </div>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={params.znRatio}
            onChange={(e) => updateParam('znRatio', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0.50 (Deficiencia Zn²⁺)</span>
            <span>1.00 (Eutéctico Óptimo)</span>
            <span>2.00 (Saturación)</span>
          </div>
        </div>

        {/* 2. Temperatura */}
        <div className="bg-[#0f141c]/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Temperatura del Reactor de Disolución</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="1"
                min="20"
                max="90"
                value={params.temp}
                onChange={(e) => updateParam('temp', parseInt(e.target.value) || 20)}
                className="w-20 px-2 py-1 rounded bg-[#0d121a] border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs text-right outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <span className="text-[11px] font-mono text-slate-400">°C</span>
            </div>
          </div>
          <input
            type="range"
            min="20"
            max="90"
            step="1"
            value={params.temp}
            onChange={(e) => updateParam('temp', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>20°C (Lenta Solvatación)</span>
            <span>45–60°C (Ventana Segura)</span>
            <span>90°C (Hidrólisis severa)</span>
          </div>
        </div>

        {/* 3. Tiempo */}
        <div className="bg-[#0f141c]/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Tiempo de Residencia / Agitación</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="5"
                min="15"
                max="180"
                value={params.tiempo}
                onChange={(e) => updateParam('tiempo', parseInt(e.target.value) || 15)}
                className="w-20 px-2 py-1 rounded bg-[#0d121a] border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs text-right outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <span className="text-[11px] font-mono text-slate-400">min</span>
            </div>
          </div>
          <input
            type="range"
            min="15"
            max="180"
            step="5"
            value={params.tiempo}
            onChange={(e) => updateParam('tiempo', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>15 min</span>
            <span>60 min (Disolución homogénea)</span>
            <span>180 min</span>
          </div>
        </div>

        {/* 4. Estiraje */}
        <div className="bg-[#0f141c]/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Relación de Estiraje en Hilatura (λ)</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="2.5"
                value={params.estiraje}
                onChange={(e) => updateParam('estiraje', parseFloat(e.target.value) || 1.0)}
                className="w-20 px-2 py-1 rounded bg-[#0d121a] border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs text-right outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <span className="text-[11px] font-mono text-slate-400">ratio</span>
            </div>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.05"
            value={params.estiraje}
            onChange={(e) => updateParam('estiraje', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1.00 (Isotrópico)</span>
            <span>1.40–1.80 (Orientación Axial)</span>
            <span>2.50 (Rotura filamento)</span>
          </div>
        </div>

        {/* 5. Contenido de Celulosa */}
        <div className="bg-[#0f141c]/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Contenido de Celulosa en Residuo H-SEG</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="5"
                min="50"
                max="100"
                value={params.cel}
                onChange={(e) => updateParam('cel', parseInt(e.target.value) || 50)}
                className="w-20 px-2 py-1 rounded bg-[#0d121a] border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs text-right outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <span className="text-[11px] font-mono text-slate-400">%</span>
            </div>
          </div>
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={params.cel}
            onChange={(e) => updateParam('cel', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>50% (Mezcla Algodón/PET)</span>
            <span>80%</span>
            <span>100% (Uniforme 100% Algodón)</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 border-l-4 border-cyan-400 p-4 text-xs text-slate-300 leading-relaxed border border-slate-800">
          <strong className="text-slate-100 font-semibold">🔬 Mecanismo de Solvatación:</strong> El catión{' '}
          <span className="font-mono bg-black/40 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">Zn²⁺</span> (ácido de Lewis fuerte) actúa como aceptor coordinante con los grupos hidroxilo en C2, C3 y C6 de la glucopiranosa, rompiendo los puentes de H intermoleculares (<span className="font-mono text-cyan-400">O6-H···O3&apos;&apos;</span>). El <span className="font-mono bg-black/40 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">H₃PO₄</span> modula la red de protones facilitando el desenrollamiento sin hidrólisis severa si <em>T ≤ 65 °C</em>.
        </div>
      </div>

      {/* Columna 2: Predicciones GNN y KPIs */}
      <div className="lg:col-span-6 bg-[#171d26] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Propiedades Predichas de la Nueva Fibra
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inferencia GNN multiescala acoplada a cinética y estructura molecular
            </p>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
            isViable 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            {isViable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {isViable ? 'Proceso Viable' : 'Condición Crítica'}
          </span>
        </div>

        {/* 6 KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          {/* Tenacidad */}
          <div className="relative p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center overflow-hidden hover:border-cyan-500/40 transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
              {results.tenacidad.toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">cN/tex</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Tenacidad a Tracción</div>
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {results.tenacidad >= 22 ? 'Excelente (Apta Confección)' : 'Aceptable'}
            </div>
          </div>

          {/* Módulo */}
          <div className="relative p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center overflow-hidden hover:border-emerald-500/40 transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400" />
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
              {results.modulo.toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">GPa</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Módulo de Young</div>
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Alineamiento Alto
            </div>
          </div>

          {/* Elongación */}
          <div className="relative p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center overflow-hidden hover:border-indigo-500/40 transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400" />
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
              {results.elongacion.toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">%</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Elongación Rotura</div>
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Flexible (10-15%)
            </div>
          </div>

          {/* DP */}
          <div className="relative p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center overflow-hidden hover:border-amber-500/40 transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
              {results.DP_final}
              <span className="text-xs font-normal text-slate-400 ml-1">DP</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Grado Polimerización</div>
            <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
              results.DP_final >= 350 && results.DP_final <= 650
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
            }`}>
              {results.DP_final >= 350 && results.DP_final <= 650 ? 'Óptimo (400-600)' : 'Riesgo Hidrólisis'}
            </div>
          </div>

          {/* Cristalinidad */}
          <div className="relative p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center overflow-hidden hover:border-cyan-500/40 transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
              {results.crI.toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">%</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Cristalinidad (XRD)</div>
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Celulosa II
            </div>
          </div>

          {/* Descoloración */}
          <div className="relative p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center overflow-hidden hover:border-emerald-500/40 transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400" />
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
              {results.deltaE.toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">ΔE*</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Descoloración</div>
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Blancura Aceptable
            </div>
          </div>

        </div>

        {/* Diagnóstico GNN dinámico */}
        {results.DP_final < 250 ? (
          <div className="rounded-xl bg-slate-900/80 border-l-4 border-rose-500 p-4 text-xs text-slate-300 leading-relaxed border border-slate-800">
            <strong className="text-rose-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> ALERTA QUÍMICA: Sobre-degradación de la Celulosa
            </strong>
            <p className="mt-1">
              A {params.temp}°C y {params.tiempo} min con relación molar Zn²⁺={params.znRatio.toFixed(2)}, el ácido fosfórico cataliza una hidrólisis excesiva de los enlaces β(1→4)-glucosídicos. El DP cayó a <strong>{results.DP_final}</strong>, impidiendo la formación de filamento continuo en la hilera de coagulación. Se recomienda operar a temperaturas <em>T ≤ 60 °C</em> o reducir el tiempo de residencia.
            </p>
          </div>
        ) : results.alfa_dis < 0.70 ? (
          <div className="rounded-xl bg-slate-900/80 border-l-4 border-amber-500 p-4 text-xs text-slate-300 leading-relaxed border border-slate-800">
            <strong className="text-amber-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> AVISO: Cinética Insuficiente (Fracción Disuelta {(results.alfa_dis * 100).toFixed(0)}%)
            </strong>
            <p className="mt-1">
              La solvatación macromolecular es incompleta. Los puentes de hidrógeno cristalinos de la celulosa I no se han desmantelado totalmente. Aumente la temperatura a 45–55°C o extienda el tiempo de agitación.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-900/80 border-l-4 border-emerald-400 p-4 text-xs text-slate-300 leading-relaxed border border-slate-800">
            <strong className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> CONDICIÓN ÓPTIMA DE RECICLADO QUÍMICO
            </strong>
            <p className="mt-1">
              Desaglomeración macromolecular selectiva: Fracción disuelta = <strong>{(results.alfa_dis * 100).toFixed(1)}%</strong> y Grado de Polimerización retenido en <strong>DP = {results.DP_final}</strong>. Con relación de estiraje <strong>λ = {params.estiraje.toFixed(2)}</strong>, se obtiene una tenacidad de <strong>{results.tenacidad.toFixed(1)} cN/tex</strong>, lista para reincorporación en la cadena de dotaciones textiles de Cartagena.
            </p>
          </div>
        )}

      </div>
    </div>
    </div>
  );
};
