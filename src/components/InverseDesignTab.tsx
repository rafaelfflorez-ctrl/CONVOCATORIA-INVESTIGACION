import React, { useState } from 'react';
import { RefreshCw, ArrowDownToLine, Shirt, CheckCircle2 } from 'lucide-react';
import { deducirVariablesInversas } from '../utils/physicsEngine';
import { InverseResult, SimulationParams } from '../types';

interface InverseDesignTabProps {
  onApplyRecipeToSimulator: (params: Partial<SimulationParams>) => void;
}

export const InverseDesignTab: React.FC<InverseDesignTabProps> = ({
  onApplyRecipeToSimulator,
}) => {
  const [pctReciclado, setPctReciclado] = useState(70);
  const [tenacidad, setTenacidad] = useState(23.5);
  const [tipoPrenda, setTipoPrenda] = useState('media');
  const [colorDeltaE, setColorDeltaE] = useState(2.4);

  const [resultadoInverso, setResultadoInverso] = useState<InverseResult>(() =>
    deducirVariablesInversas(70, 23.5, 'media', 2.4)
  );

  const handleCalcular = () => {
    const res = deducirVariablesInversas(pctReciclado, tenacidad, tipoPrenda, colorDeltaE);
    setResultadoInverso(res);
  };

  const handleTransferir = () => {
    onApplyRecipeToSimulator({
      znRatio: resultadoInverso.znRatio,
      temp: resultadoInverso.temp,
      tiempo: resultadoInverso.tiempo,
      estiraje: resultadoInverso.estiraje,
      cel: resultadoInverso.cel,
    });
  };

  return (
    <div className="bg-[#171d26] border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            Módulo de Ingeniería Inversa: Deducción de Variables a partir del Textil
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Ingresa las características de un textil ya fabricado o reciclado para deducir las condiciones químicas y operativas con las que fue procesado.
          </p>
        </div>
        <button
          onClick={handleCalcular}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-amber-950/40 border border-amber-500/40 transition-all cursor-pointer flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Deducir Variables Operativas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Entradas de la prenda */}
        <div className="lg:col-span-6 bg-[#0f141c]/60 p-5 rounded-xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Shirt className="w-4 h-4" /> Especificaciones del Textil Fabricado / Reciclado
          </h4>

          {/* % Reciclado */}
          <div className="space-y-1.5 bg-[#141b25] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-200">% de Fibra Reciclada en el Tejido</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="5"
                  min="10"
                  max="100"
                  value={pctReciclado}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 10;
                    setPctReciclado(v);
                    setResultadoInverso(deducirVariablesInversas(v, tenacidad, tipoPrenda, colorDeltaE));
                  }}
                  className="w-20 px-2 py-1 rounded bg-[#0d121a] border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs text-right outline-none"
                />
                <span className="text-[11px] font-mono text-slate-400">%</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Proporción de celulosa reciclada respecto a fibra virgen o poliéster.</p>
          </div>

          {/* Tenacidad */}
          <div className="space-y-1.5 bg-[#141b25] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-200">Tenacidad a Tracción Medida en el Textil</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.5"
                  min="12"
                  max="30"
                  value={tenacidad}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 12;
                    setTenacidad(v);
                    setResultadoInverso(deducirVariablesInversas(pctReciclado, v, tipoPrenda, colorDeltaE));
                  }}
                  className="w-20 px-2 py-1 rounded bg-[#0d121a] border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs text-right outline-none"
                />
                <span className="text-[11px] font-mono text-slate-400">cN/tex</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Resistencia mecánica obtenida en ensayo dinamométrico (ISO 2062 / ASTM D2256).</p>
          </div>

          {/* Tipo de Prenda */}
          <div className="space-y-1.5 bg-[#141b25] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-200">Tipo de Prenda / Exigencia</span>
              <select
                value={tipoPrenda}
                onChange={(e) => {
                  setTipoPrenda(e.target.value);
                  setResultadoInverso(deducirVariablesInversas(pctReciclado, tenacidad, e.target.value, colorDeltaE));
                }}
                className="px-2.5 py-1 rounded bg-[#0d121a] border border-cyan-500/40 text-xs text-slate-200 outline-none"
              >
                <option value="pesada">Overol Industrial / Ignífugo (Dotación Pesada)</option>
                <option value="media">Camisa / Pantalón de Faena (Uso Medio)</option>
                <option value="ligera">Tejido Liviano / Forrería / No-Tejido</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-400">Determina el grado de orientación molecular requerido en la hilatura.</p>
          </div>

          {/* Nivel de Blancura */}
          <div className="space-y-1.5 bg-[#141b25] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-200">Nivel de Descoloración Obtenido</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.2"
                  min="1.0"
                  max="8.0"
                  value={colorDeltaE}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 1.0;
                    setColorDeltaE(v);
                    setResultadoInverso(deducirVariablesInversas(pctReciclado, tenacidad, tipoPrenda, v));
                  }}
                  className="w-20 px-2 py-1 rounded bg-[#0d121a] border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs text-right outline-none"
                />
                <span className="text-[11px] font-mono text-slate-400">ΔE*</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Eficiencia de descoloración espectral respecto a los tintes originales.</p>
          </div>

        </div>

        {/* Columna Derecha: Receta Deducida */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#121924] border border-cyan-500/30 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Receta de Reciclado Deducida (Variables Inversas)
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Inferencia Inversa
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Para fabricar un textil con <strong className="text-slate-100">{pctReciclado}% de material reciclado</strong> y tenacidad de <strong className="text-slate-100">{tenacidad} cN/tex</strong>, el modelo inverso determinó:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f141c] p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Relación ZnCl₂ en DES</div>
                <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                  {resultadoInverso.znRatio.toFixed(2)} <span className="text-xs font-normal text-slate-400">mol/mol</span>
                </div>
              </div>

              <div className="bg-[#0f141c] p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Temperatura Reactor</div>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  {resultadoInverso.temp} <span className="text-xs font-normal text-slate-400">°C</span>
                </div>
              </div>

              <div className="bg-[#0f141c] p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Tiempo Residencia</div>
                <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                  {resultadoInverso.tiempo} <span className="text-xs font-normal text-slate-400">min</span>
                </div>
              </div>

              <div className="bg-[#0f141c] p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Relación Estiraje (λ)</div>
                <div className="text-lg font-bold font-mono text-indigo-400 mt-0.5">
                  {resultadoInverso.estiraje.toFixed(2)} <span className="text-xs font-normal text-slate-400">axial</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-3.5 text-xs text-slate-300 space-y-1">
              <strong className="text-cyan-300 font-semibold block">Diagnóstico Fisicoquímico Inverso:</strong>
              <p className="text-[11px] leading-relaxed">
                A <strong>{resultadoInverso.temp}°C</strong> durante <strong>{resultadoInverso.tiempo} min</strong>, el DES ternario desaglomera selectivamente la celulosa sin romper en exceso los enlaces β(1→4), preservando un <strong>DP = {resultadoInverso.dpResultante}</strong>. El estiraje <strong>λ = {resultadoInverso.estiraje.toFixed(2)}</strong> induce la cristalinidad Celulosa II requerida para alcanzar los <strong>{resultadoInverso.tenacidadEstimada.toFixed(1)} cN/tex</strong> de la prenda.
              </p>
            </div>

            <button
              onClick={handleTransferir}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 border border-emerald-500/40 transition-all cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Transferir Variables Deducidas al Simulador</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
