import React from 'react';
import { 
  Sliders, 
  RefreshCw, 
  Share2, 
  Clock, 
  Dna, 
  Scale, 
  Globe2, 
  TrendingUp, 
  FileText,
  LayoutGrid,
  Layers,
  ArrowDown
} from 'lucide-react';
import { TabId } from '../types';

export interface TabNavProps {
  activeTab: TabId;
  onSelectTab: (tabId: TabId) => void;
  viewMode: 'tabs' | 'continuous';
  onToggleViewMode: (mode: 'tabs' | 'continuous') => void;
}

export const MODULE_DEFINITIONS: {
  id: TabId;
  number: number;
  label: string;
  shortDesc: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}[] = [
  {
    id: 'simulador',
    number: 1,
    label: '1. Simulador Fisicoquímico',
    shortDesc: 'Cinética, reología, hilatura y propiedades',
    icon: <Sliders className="w-4 h-4" />,
    badge: 'Tiempo Real',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  {
    id: 'inverso',
    number: 2,
    label: '2. Ingeniería Inversa',
    shortDesc: 'Optimización de formulación hacia ASTM D3822',
    icon: <RefreshCw className="w-4 h-4" />,
    badge: 'IA Inversa',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  {
    id: 'grafos',
    number: 3,
    label: '3. Grafos Moleculares (3D)',
    shortDesc: 'Topología Celobiosa & GNN Message Passing',
    icon: <Share2 className="w-4 h-4" />,
    badge: '3D Interactivo',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  },
  {
    id: 'cinetica',
    number: 4,
    label: '4. Cinética Arrhenius & DP',
    shortDesc: 'Ecuación de Ekenstam y despolimerización',
    icon: <Clock className="w-4 h-4" />,
    badge: 'Ekenstam',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  {
    id: 'generativo',
    number: 5,
    label: '5. IA Generativa (VAE)',
    shortDesc: 'Espacio latente z₁/z₂ y muestreo continuo',
    icon: <Dna className="w-4 h-4" />,
    badge: 'Latent 2D',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'multiobjetivo',
    number: 6,
    label: '6. Optimización Circular',
    shortDesc: 'Frente de Pareto NSGA-II & Análisis LCA/CO₂',
    icon: <Scale className="w-4 h-4" />,
    badge: 'NSGA-II',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
  },
  {
    id: 'federado',
    number: 7,
    label: '7. Aprendizaje FedGNN',
    shortDesc: 'Consorcio federado UdeC & Mamonal (FedAvg)',
    icon: <Globe2 className="w-4 h-4" />,
    badge: 'FedGNN',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
  },
  {
    id: 'validacion',
    number: 8,
    label: '8. Validación Científica',
    shortDesc: 'Paridad experimental y matriz de correlación',
    icon: <TrendingUp className="w-4 h-4" />,
    badge: 'R² = 0.952',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  },
  {
    id: 'informe',
    number: 9,
    label: '9. Dictamen Técnico APA 7ª',
    shortDesc: 'Monografía académica, balances y PDF',
    icon: <FileText className="w-4 h-4" />,
    badge: 'PDF / Print',
    badgeColor: 'bg-emerald-600/30 text-emerald-200 border-emerald-500/40'
  },
];

export const TabNav: React.FC<TabNavProps> = ({
  activeTab,
  onSelectTab,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <div className="space-y-3 mb-6 print:hidden">
      
      {/* View Mode Bar & Module Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#111722]/95 border border-slate-800 rounded-xl shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Módulos del Gemelo Digital (9 Bloques Integrados)
          </span>
        </div>

        {/* View Mode Switch Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => onToggleViewMode('tabs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              viewMode === 'tabs'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Mostrar un módulo seleccionado individualmente"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Vista por Módulo</span>
          </button>

          <button
            onClick={() => onToggleViewMode('continuous')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              viewMode === 'continuous'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Mostrar todos los módulos apilados uno debajo del otro de forma continua"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Vista Continua (Todos Uno Debajo de Otro)</span>
          </button>
        </div>
      </div>

      {/* Structured Grid of All 9 Module Selection Blocks - Completely Visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {MODULE_DEFINITIONS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-block-btn-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 border cursor-pointer group ${
                isActive
                  ? 'bg-gradient-to-br from-cyan-950/50 via-[#131d2a] to-slate-900 border-cyan-500/70 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/40'
                  : 'bg-[#111722]/80 hover:bg-[#151e2c] border-slate-800/90 hover:border-slate-700 text-slate-300'
              }`}
            >
              {/* Number Badge */}
              <div
                className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                }`}
              >
                {tab.number}
              </div>

              {/* Text & Metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className={`text-xs font-bold truncate ${isActive ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'}`}>
                    {tab.label.replace(/^\d+\.\s*/, '')}
                  </span>
                  {tab.badge && (
                    <span className={`flex-shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded border ${tab.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {tab.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 group-hover:text-slate-300">
                  {tab.shortDesc}
                </p>
              </div>

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute -left-[1px] top-2 bottom-2 w-1 bg-cyan-400 rounded-r" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
