import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight, Sliders, Dna, FileText, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { CATALOGO_BUSQUEDA } from '../data/constants';
import { SearchItem, TabId, SimulationParams } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: TabId) => void;
  onApplyParams?: (params: Partial<SimulationParams>) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onApplyParams,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveCategory('todos');
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    let list = CATALOGO_BUSQUEDA;
    if (activeCategory !== 'todos') {
      list = list.filter((item) => item.category === activeCategory);
    }
    if (!query.trim()) return list;

    const q = query.toLowerCase();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, activeCategory]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    }
  };

  const handleSelectItem = (item: SearchItem) => {
    onSelectTab(item.tabId);
    if (item.actionParams && onApplyParams) {
      onApplyParams(item.actionParams);
    }
    onClose();
  };

  if (!isOpen) return null;

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'módulo', label: 'Módulos' },
    { id: 'variable', label: 'Variables' },
    { id: 'receta', label: 'Recetas IA' },
    { id: 'ecuación', label: 'Ecuaciones' },
    { id: 'informe', label: 'Informe APA' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 pb-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#111722] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onKeyDown={handleKeyDown}
      >
        
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#171e2c]">
          <Search className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Buscar variables (ZnCl₂, temperatura, DP, tenacidad), recetas, módulos o informe..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <kbd className="text-[10px] font-mono">ESC</kbd>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#0e141e] border-b border-slate-800/80 overflow-x-auto text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-medium ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No se encontraron resultados para &quot;{query}&quot;</p>
              <p className="text-xs text-slate-500 mt-1">Prueba buscando &quot;temperatura&quot;, &quot;tenacidad&quot;, &quot;Arrhenius&quot;, &quot;Gen-01&quot; o &quot;GNN&quot;</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/40 to-slate-800/60 border border-cyan-500/40 text-white shadow-md'
                      : 'hover:bg-slate-800/40 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <div className={`p-2 rounded-lg mt-0.5 ${
                      item.category === 'módulo' ? 'bg-cyan-500/15 text-cyan-400' :
                      item.category === 'receta' ? 'bg-emerald-500/15 text-emerald-400' :
                      item.category === 'variable' ? 'bg-amber-500/15 text-amber-400' :
                      item.category === 'ecuación' ? 'bg-purple-500/15 text-purple-400' :
                      'bg-sky-500/15 text-sky-400'
                    }`}>
                      {item.category === 'módulo' && <Sliders className="w-4 h-4" />}
                      {item.category === 'receta' && <Dna className="w-4 h-4" />}
                      {item.category === 'variable' && <Sparkles className="w-4 h-4" />}
                      {item.category === 'ecuación' && <Share2 className="w-4 h-4" />}
                      {item.category === 'informe' && <FileText className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold truncate text-slate-100 group-hover:text-cyan-300">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.actionParams && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Cargar Valor
                      </span>
                    )}
                    <div className={`p-1.5 rounded-md ${isSelected ? 'bg-cyan-500 text-slate-950' : 'text-slate-500'}`}>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0d121b] border-t border-slate-800 text-[11px] text-slate-400">
          <span>Usa <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↓</kbd> para navegar</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Enter</kbd> para seleccionar</span>
        </div>
      </div>
    </div>
  );
};
