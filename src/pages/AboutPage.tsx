import React from 'react';
import { ShieldCheck, ArrowRight, Eye, Sparkles, MapPin, Zap, Database, AlertOctagon } from 'lucide-react';
import { ScreenId } from '../types';

interface AboutPageProps {
  onNavigate?: (screen: ScreenId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div id="screen-about" className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto font-sans">
      {/* Prominent Demo Disclaimer Banner */}
      <div className="bg-slate-900 text-white rounded-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xs bg-blue-600 flex items-center justify-center font-mono text-sm font-bold text-white flex-shrink-0">
            LG
          </div>
          <div>
            <h1 className="text-sm font-bold font-mono tracking-tight text-white">
              LANDGUARD AI
            </h1>
            <p className="text-xs font-mono text-blue-300">
              SEE RISK EARLY → KNOW WHY → ACT BEFORE SLIPPAGE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-700/80 px-3 py-1 rounded-xs">
            DEMO ENVIRONMENT • SIMULATED DATA
          </span>
        </div>
      </div>

      {/* Section 1: WHAT IS LANDGUARD AI? */}
      <section className="bg-white border border-slate-200 rounded-xs p-6 shadow-2xs space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 block">
          PURPOSE & SCOPE
        </span>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          What is LANDGUARD AI?
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          A predictive analytics system for early detection of land acquisition delays. 
          Built for infrastructure authorities, project directors, and revenue administration 
          to monitor statutory milestones, forecast timeline variances, and intervene before 
          corridor construction faces costly schedule slippage.
        </p>
      </section>

      {/* Section 2: HOW IT WORKS */}
      <section className="bg-white border border-slate-200 rounded-xs p-6 shadow-2xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
            CORE METHODOLOGY
          </span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
            How It Works: Ingest → Predict → Explain → Act
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            The 4-step decision-support framework that transforms administrative signals into targeted interventions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. INGEST */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-xs bg-slate-200 text-slate-800 flex items-center justify-center font-mono text-[11px] font-bold">
                1
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                INGEST
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consolidates statutory land acquisition records, gazette notifications (Section 3A/4), 
              joint measurement surveys, award determination files, and compensation disbursement registers.
            </p>
          </div>

          {/* 2. PREDICT */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-xs bg-amber-200 text-amber-900 flex items-center justify-center font-mono text-[11px] font-bold">
                2
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                PREDICT
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Identifies projects and parcels that are likely to experience delays by evaluating stage dwell times, 
              historical bottleneck patterns, and compensation clearance velocity.
            </p>
          </div>

          {/* 3. EXPLAIN */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-xs bg-indigo-200 text-indigo-900 flex items-center justify-center font-mono text-[11px] font-bold">
                3
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                EXPLAIN
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Shows the major factors contributing to the predicted risk—such as disputed title chains, 
              unresolved award apportionment, pending revenue mutations, or High Court caveats.
            </p>
          </div>

          {/* 4. ACT */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-xs bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-[11px] font-bold">
                4
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                ACT
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides recommended interventions so administrators can act earlier—initiating Lok Adalat hearings, 
              collectorate camps, and legal dispute fast-tracking before schedules slip.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: GIS SPATIAL RISK */}
      <section className="bg-white border border-slate-200 rounded-xs p-6 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Spatial Intelligence (GIS)
          </h2>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          Helps identify where acquisition risk is concentrated across geographic stretches and corridor packages. 
          Enables teams to pinpoint cluster disputes, river crossings, or municipal boundary hurdles 
          that threaten contiguous right-of-way handover.
        </p>
      </section>

      {/* Section 4: Data Simulation Notice */}
      <section className="bg-slate-50 border border-slate-200 rounded-xs p-5 text-xs text-slate-600 space-y-1.5 font-mono">
        <div className="font-bold text-slate-900 uppercase">
          DEMO ENVIRONMENT • SIMULATED DATA
        </div>
        <p className="leading-relaxed">
          All projects, land parcels, Khasra numbers, and risk scoring indices featured in this prototype 
          are synthetic representations based on statutory land acquisition frameworks (RFCTLARR Act 2013 / National Highways Act 1956) 
          for prototype demonstration purposes.
        </p>
      </section>

      {/* Quick Navigation Links */}
      {onNavigate && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('overview')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xs text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 font-sans shadow-2xs"
          >
            <span>Back to Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('projects')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xs text-xs font-medium cursor-pointer transition-colors font-sans shadow-2xs"
          >
            View Projects
          </button>
          <button
            onClick={() => onNavigate('parcels')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xs text-xs font-medium cursor-pointer transition-colors font-sans shadow-2xs"
          >
            View Land Parcels
          </button>
        </div>
      )}
    </div>
  );
};
