import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { InstitutionalHeader } from './components/InstitutionalHeader';
import { TabNav, MODULE_DEFINITIONS } from './components/TabNav';
import { SimulatorTab } from './components/SimulatorTab';
import { InverseDesignTab } from './components/InverseDesignTab';
import { GraphSimulationTab } from './components/GraphSimulationTab';
import { KineticsTab } from './components/KineticsTab';
import { GenerativeVAETab } from './components/GenerativeVAETab';
import { MultiObjectiveTab } from './components/MultiObjectiveTab';
import { FederatedGNNTab } from './components/FederatedGNNTab';
import { ValidationTab } from './components/ValidationTab';
import { ReportTab } from './components/ReportTab';
import { FloatingExportBtn } from './components/FloatingExportBtn';
import { TabId, SimulationParams } from './types';
import { calcularModeloFisicoquimico } from './utils/physicsEngine';
import { openPrintWindow, triggerDirectPrint } from './utils/pdfExport';
import { Bookmark, ChevronUp, Layers } from 'lucide-react';

const INITIAL_PARAMS: SimulationParams = {
  znRatio: 1.10,
  temp: 50,
  tiempo: 60,
  estiraje: 1.60,
  cel: 100,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('simulador');
  const [viewMode, setViewMode] = useState<'tabs' | 'continuous'>('tabs');
  const [params, setParams] = useState<SimulationParams>(INITIAL_PARAMS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Real-time forward physicochemical model simulation
  const results = useMemo(() => calcularModeloFisicoquimico(params), [params]);

  // Global keyboard shortcut (⌘K or Ctrl+K) to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleApplyRecipe = (partialParams: Partial<SimulationParams>) => {
    setParams((prev) => ({ ...prev, ...partialParams }));
    if (viewMode === 'tabs') {
      setActiveTab('simulador');
    } else {
      const el = document.getElementById('modulo-simulador');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTab = (tabId: TabId) => {
    setActiveTab(tabId);
    if (viewMode === 'continuous') {
      const target = document.getElementById(`modulo-${tabId}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleExportPDF = () => {
    setActiveTab('informe');
    setTimeout(() => {
      const success = openPrintWindow('area-informe-apa');
      if (!success) {
        triggerDirectPrint();
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans antialiased flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Responsive Navbar with Search button */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onExportPDF={handleExportPDF}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Institutional Research Header */}
        <InstitutionalHeader />

        {/* Responsive Grid/Block Module Navigator with View Mode Switch */}
        <TabNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />

        {/* Quick jump navigation sticky bar for Continuous Mode */}
        {viewMode === 'continuous' && (
          <div className="sticky top-18 z-30 mb-6 p-2 bg-[#0e141e]/90 border border-slate-700/80 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-1.5 overflow-x-auto print:hidden">
            <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-400 whitespace-nowrap">
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>Salto Rápido:</span>
            </div>
            {MODULE_DEFINITIONS.map((mod) => (
              <button
                key={mod.id}
                onClick={() => handleSelectTab(mod.id)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-200 border border-slate-700/60 whitespace-nowrap transition-colors cursor-pointer"
              >
                {mod.number}. {mod.label.replace(/^\d+\.\s*/, '')}
              </button>
            ))}
          </div>
        )}

        {/* =========================================================================
            VIEW MODE 1: INDIVIDUAL TAB VIEW (Focused on active module)
           ========================================================================= */}
        {viewMode === 'tabs' && (
          <div className="min-h-[500px]">
            {activeTab === 'simulador' && (
              <SimulatorTab
                params={params}
                onChangeParams={setParams}
                results={results}
                onReset={() => setParams(INITIAL_PARAMS)}
              />
            )}

            {activeTab === 'inverso' && (
              <InverseDesignTab onApplyRecipeToSimulator={handleApplyRecipe} />
            )}

            {activeTab === 'grafos' && (
              <GraphSimulationTab params={params} />
            )}

            {activeTab === 'cinetica' && (
              <KineticsTab params={params} results={results} />
            )}

            {activeTab === 'generativo' && (
              <GenerativeVAETab
                params={params}
                results={results}
                onApplyRecipeToSimulator={handleApplyRecipe}
              />
            )}

            {activeTab === 'multiobjetivo' && (
              <MultiObjectiveTab params={params} results={results} />
            )}

            {activeTab === 'federado' && (
              <FederatedGNNTab />
            )}

            {activeTab === 'validacion' && (
              <ValidationTab params={params} results={results} />
            )}

            {activeTab === 'informe' && (
              <ReportTab
                params={params}
                results={results}
                onExportPDF={handleExportPDF}
              />
            )}
          </div>
        )}

        {/* =========================================================================
            VIEW MODE 2: CONTINUOUS VERTICAL STACK (All 9 modules stacked one below the other)
           ========================================================================= */}
        {viewMode === 'continuous' && (
          <div className="space-y-12">
            
            {/* MODULE 1 */}
            <section id="modulo-simulador" className="scroll-mt-32 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/40">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 font-bold font-mono text-xs">
                    1
                  </span>
                  <h2 className="text-lg font-bold text-cyan-300">
                    Módulo 1: Simulador Fisicoquímico en Tiempo Real
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Cinética, Reología &amp; Hilatura</span>
              </div>
              <SimulatorTab
                params={params}
                onChangeParams={setParams}
                results={results}
                onReset={() => setParams(INITIAL_PARAMS)}
              />
            </section>

            {/* MODULE 2 */}
            <section id="modulo-inverso" className="scroll-mt-32 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/40">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500 text-white font-bold font-mono text-xs">
                    2
                  </span>
                  <h2 className="text-lg font-bold text-purple-300">
                    Módulo 2: Ingeniería Inversa &amp; Optimización de Formulación
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Objetivo ASTM D3822</span>
              </div>
              <InverseDesignTab onApplyRecipeToSimulator={handleApplyRecipe} />
            </section>

            {/* MODULE 3 */}
            <section id="modulo-grafos" className="scroll-mt-32 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-500/40">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500 text-white font-bold font-mono text-xs">
                    3
                  </span>
                  <h2 className="text-lg font-bold text-blue-300">
                    Módulo 3: Grafos Moleculares 3D &amp; GNN Message Passing
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Topología Celobiosa / DES</span>
              </div>
              <GraphSimulationTab params={params} />
            </section>

            {/* MODULE 4 */}
            <section id="modulo-cinetica" className="scroll-mt-32 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/40">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold font-mono text-xs">
                    4
                  </span>
                  <h2 className="text-lg font-bold text-amber-300">
                    Módulo 4: Cinética de Arrhenius &amp; Ecuación de Ekenstam (DP)
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Degradación Térmica &amp; Disolución</span>
              </div>
              <KineticsTab params={params} results={results} />
            </section>

            {/* MODULE 5 */}
            <section id="modulo-generativo" className="scroll-mt-32 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/40">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-bold font-mono text-xs">
                    5
                  </span>
                  <h2 className="text-lg font-bold text-emerald-300">
                    Módulo 5: IA Generativa &amp; Autoencoder Variacional (VAE)
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Espacio Latente Continuo</span>
              </div>
              <GenerativeVAETab
                params={params}
                results={results}
                onApplyRecipeToSimulator={handleApplyRecipe}
              />
            </section>

            {/* MODULE 6 */}
            <section id="modulo-multiobjetivo" className="scroll-mt-32 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-teal-500/40">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500 text-slate-950 font-bold font-mono text-xs">
                    6
                  </span>
                  <h2 className="text-lg font-bold text-teal-300">
                    Módulo 6: Optimización Multiobjetivo Circular (NSGA-II)
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Frente de Pareto &amp; LCA</span>
              </div>
              <MultiObjectiveTab params={params} results={results} />
            </section>

            {/* MODULE 7 */}
            <section id="modulo-federado" className="scroll-mt-32 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-500/40">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500 text-white font-bold font-mono text-xs">
                    7
                  </span>
                  <h2 className="text-lg font-bold text-indigo-300">
                    Módulo 7: Red de Aprendizaje Federado (FedGNN)
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Consorcio Industrial &amp; FedAvg</span>
              </div>
              <FederatedGNNTab />
            </section>

            {/* MODULE 8 */}
            <section id="modulo-validacion" className="scroll-mt-32 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/40">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500 text-white font-bold font-mono text-xs">
                    8
                  </span>
                  <h2 className="text-lg font-bold text-rose-300">
                    Módulo 8: Validación Científica &amp; Métricas Estadísticas
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Paridad Experimental R² = 0.952</span>
              </div>
              <ValidationTab params={params} results={results} />
            </section>

            {/* MODULE 9 */}
            <section id="modulo-informe" className="scroll-mt-32 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/60">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold font-mono text-xs">
                    9
                  </span>
                  <h2 className="text-lg font-bold text-emerald-300">
                    Módulo 9: Dictamen Técnico de Investigación (Normas APA 7ª Ed.)
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Monografía Científica &amp; Exportación PDF</span>
              </div>
              <ReportTab
                params={params}
                results={results}
                onExportPDF={handleExportPDF}
              />
            </section>

          </div>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0c1018] py-8 text-center text-xs text-slate-500 space-y-1.5 print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-400 font-medium">
            Gemelo Digital de Fibras Textiles &amp; Reciclado Químico con DES · Universidad de Cartagena
          </p>
          <p>
            Grupo de Investigación CARBOQUÍMICA (GrupLAC COL0001226) · Convocatoria IA Generativa &amp; GNNs (Dotaciones H-SEG)
          </p>
          <p className="text-[11px] text-slate-600 pt-1">
            Fundamento: Tong et al. (2021) <em>Green Chem.</em>, Scarselli et al. (2009), Liu et al. (2025) <em>IEEE TNNLS</em>.
          </p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <FloatingExportBtn onExportPDF={handleExportPDF} />

      {/* Interactive Command Palette Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={handleSelectTab}
        onApplyParams={handleApplyRecipe}
      />

    </div>
  );
}
