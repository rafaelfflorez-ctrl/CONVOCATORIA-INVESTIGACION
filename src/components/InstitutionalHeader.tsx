import React from 'react';
import { FlaskConical, Building2, Award, Zap, Atom } from 'lucide-react';

export const InstitutionalHeader: React.FC = () => {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-[#151c27]/90 via-[#111722]/90 to-[#0d121a]/95 border border-slate-700/60 p-6 sm:p-8 shadow-xl backdrop-blur-xl overflow-hidden mb-6 transition-all hover:border-slate-600/80">
      
      {/* Decorative top accent glow line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400" />
      
      {/* Subtle background glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Title and research description */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent">
              Gemelo Digital Textil · Reciclado Químico
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Modelado multiescala con <strong className="text-cyan-300 font-semibold">Graph Neural Networks (GNNs)</strong> e <strong className="text-emerald-300 font-semibold">IA Generativa (VAE)</strong> para predecir la cinética de disolución y tenacidad de fibras regeneradas a partir de uniformes industriales usando <strong className="text-sky-300 font-semibold">Solventes Eutécticos Profundos (DES ZnCl₂/H₃PO₄/H₂O)</strong>.
          </p>

          {/* Institutional Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
              <Building2 className="w-3.5 h-3.5" /> Universidad de Cartagena
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
              <Atom className="w-3.5 h-3.5" /> Grupo CARBOQUÍMICA (GrupLAC COL0001226)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
              <Award className="w-3.5 h-3.5" /> Dotaciones H-SEG Cartagena
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25">
              <Zap className="w-3.5 h-3.5" /> Convocatoria IA Generativa + GNNs
            </span>
          </div>
        </div>

        {/* Lead Researchers Card */}
        <div className="w-full lg:w-auto rounded-xl bg-slate-900/80 border border-slate-700/60 p-4 text-xs space-y-1.5 text-slate-300 min-w-[280px] shadow-inner">
          <div className="flex justify-between items-center pb-1 border-b border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Equipo de Investigación</span>
            <span className="text-[10px] text-slate-400">Cartagena, Colombia</span>
          </div>
          <div>
            <strong className="text-slate-100 font-semibold">Investigador Principal:</strong> Dr. Fredy Colpas Castillo (PhD)
          </div>
          <div>
            <strong className="text-slate-100 font-semibold">Asesor Quimiometría:</strong> Dr. John Ricardo Castro (PhD)
          </div>
          <div>
            <strong className="text-slate-100 font-semibold">Trabajo de Grado:</strong> Jhojan Salcedo Castellar
          </div>
          <div className="pt-1 text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Materia Prima: Residuos textiles de algodón industrial
          </div>
        </div>

      </div>
    </div>
  );
};
