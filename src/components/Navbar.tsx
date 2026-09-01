import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  FlaskConical, 
  Sparkles, 
  FileText, 
  Sliders, 
  RefreshCw, 
  Share2, 
  Clock, 
  Dna, 
  Scale, 
  Globe2, 
  TrendingUp,
  Printer
} from 'lucide-react';
import { TabId } from '../types';

interface NavbarProps {
  activeTab: TabId;
  onSelectTab: (tabId: TabId) => void;
  onOpenSearch: () => void;
  onExportPDF: () => void;
}

const TAB_ITEMS: { id: TabId; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'simulador', label: 'Simulador Fisicoquímico', icon: <Sliders className="w-4 h-4" /> },
  { id: 'inverso', label: 'Ingeniería Inversa', icon: <RefreshCw className="w-4 h-4" />, badge: 'Nuevo' },
  { id: 'grafos', label: 'Grafos Interactivos (3D)', icon: <Share2 className="w-4 h-4" /> },
  { id: 'cinetica', label: 'Cinética Arrhenius & DP', icon: <Clock className="w-4 h-4" /> },
  { id: 'generativo', label: 'IA Generativa (VAE)', icon: <Dna className="w-4 h-4" /> },
  { id: 'multiobjetivo', label: 'Optimización Circular', icon: <Scale className="w-4 h-4" /> },
  { id: 'federado', label: 'Aprendizaje FedGNN', icon: <Globe2 className="w-4 h-4" /> },
  { id: 'validacion', label: 'Validación Científica', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'informe', label: 'Dictamen APA (PDF)', icon: <FileText className="w-4 h-4" />, badge: 'APA 7ª' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onExportPDF
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0f141c]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-950/40">
              <FlaskConical className="w-5 h-5 text-cyan-400" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-cyan-400 bg-clip-text text-transparent">
                  Gemelo Digital Textil
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <Sparkles className="w-2.5 h-2.5" /> GNN &amp; DES
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Universidad de Cartagena · Grupo CARBOQUÍMICA &amp; Dotaciones H-SEG
              </p>
            </div>
          </div>

          {/* Actions on the Right: Search Button & PDF & Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* SEARCH BUTTON in top-right */}
            <button
              id="btn-navbar-search"
              onClick={onOpenSearch}
              className="group flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/70 hover:border-cyan-500/50 shadow-inner transition-all duration-200 text-xs font-medium cursor-pointer"
              title="Buscar en módulos, variables, recetas y fórmulas (Ctrl+K / ⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline text-slate-300">Buscar en el gemelo...</span>
              <span className="inline md:hidden text-slate-300">Buscar</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Quick Export PDF Button */}
            <button
              id="btn-navbar-export-pdf"
              onClick={onExportPDF}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 hover:border-emerald-400/50 transition-all text-xs font-semibold cursor-pointer"
              title="Imprimir / Exportar Dictamen Técnico APA"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Exportar PDF</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex lg:hidden items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 focus:outline-none transition-colors"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0f141c]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-1 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Módulos del Gemelo Digital
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {TAB_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="pt-2 border-t border-slate-800/80 mt-2 flex gap-2">
            <button
              onClick={() => {
                onExportPDF();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Ver Dictamen Técnico PDF</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
