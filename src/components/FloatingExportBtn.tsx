import React from 'react';
import { Printer } from 'lucide-react';

interface FloatingExportBtnProps {
  onExportPDF: () => void;
}

export const FloatingExportBtn: React.FC<FloatingExportBtnProps> = ({ onExportPDF }) => {
  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2 group print:hidden">
      <div className="px-2.5 py-1 rounded-md bg-[#0f141c]/95 border border-slate-700 text-[11px] font-semibold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
        Exportar Dictamen APA (PDF)
      </div>
      <button
        id="btn-fab-export-pdf"
        onClick={onExportPDF}
        className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-xl shadow-emerald-950/60 border-2 border-emerald-300/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Exportar Dictamen Técnico como PDF"
      >
        <Printer className="w-6 h-6" />
      </button>
    </div>
  );
};
