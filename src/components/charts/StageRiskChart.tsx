import React, { useState } from 'react';
import { MOCK_STAGE_RISK } from '../../data/mockData';
import { Clock, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface StageMeta {
  statutoryRef: string;
  legalSlaDays: number;
  actualAvgDays: number;
  primaryRiskFactor: string;
}

const STAGE_METADATA: Record<string, StageMeta> = {
  'Preliminary Notification': {
    statutoryRef: 'Section 3A (NH Act) / Sec 11 (RFCTLARR)',
    legalSlaDays: 30,
    actualAvgDays: 42,
    primaryRiskFactor: 'Missing or legacy record-of-rights (Jamabandi discrepancies)',
  },
  'Survey & Boundary': {
    statutoryRef: 'Section 3A(2) / Drone & DGPS Cadastral Verification',
    legalSlaDays: 45,
    actualAvgDays: 68,
    primaryRiskFactor: 'Encroachment along ROW and fragmented boundary pillars',
  },
  'Objections & Hearings': {
    statutoryRef: 'Section 3C Hearing by CALA',
    legalSlaDays: 21,
    actualAvgDays: 52,
    primaryRiskFactor: 'Multiple classification disputes (Agricultural vs Commercial)',
  },
  'Declaration': {
    statutoryRef: 'Section 3D Gazette Publication',
    legalSlaDays: 365,
    actualAvgDays: 195,
    primaryRiskFactor: 'Risk of statutory lapse if not notified within 1 year of 3A',
  },
  'Award Determination': {
    statutoryRef: 'Section 3G Valuation & Solatium (100% factor)',
    legalSlaDays: 60,
    actualAvgDays: 114,
    primaryRiskFactor: 'Severe valuation resistance; market rate vs circle rate gap',
  },
  'Disbursement': {
    statutoryRef: 'Section 3H Compensation Deposit & Account Credit',
    legalSlaDays: 30,
    actualAvgDays: 78,
    primaryRiskFactor: 'Multi-heir title litigation and pending succession certificates',
  },
  'Possession Handover': {
    statutoryRef: 'Section 3E / Civil Contractor ROW Handover',
    legalSlaDays: 60,
    actualAvgDays: 89,
    primaryRiskFactor: 'Standing crop clearance and rehabilitation resistance',
  },
};

export const StageRiskChart: React.FC = () => {
  const [sortBy, setSortBy] = useState<'pipeline' | 'risk'>('risk');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const stages = [...MOCK_STAGE_RISK].sort((a, b) => {
    if (sortBy === 'risk') {
      return b.avgRisk - a.avgRisk;
    }
    return 0; // Default pipeline order
  });

  return (
    <div id="stage-risk-analytics-component" className="w-full space-y-3 font-sans">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2 font-mono text-xs">
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800 text-[11px]">
          <button
            type="button"
            onClick={() => setSortBy('risk')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              sortBy === 'risk'
                ? 'bg-slate-800 text-white font-bold shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            HIGHEST RISK FIRST
          </button>
          <button
            type="button"
            onClick={() => setSortBy('pipeline')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              sortBy === 'pipeline'
                ? 'bg-slate-800 text-white font-bold shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            WORKFLOW PIPELINE ORDER
          </button>
        </div>

        <span className="text-[11px] text-slate-400">
          STATUTORY SLA BENCHMARK: <strong className="text-slate-200">RFCTLARR / NHAI 2013</strong>
        </span>
      </div>

      {/* Stage Cards Grid */}
      <div className="grid grid-cols-1 gap-2.5">
        {stages.map((stage, index) => {
          const meta = STAGE_METADATA[stage.stage] || {
            statutoryRef: `Milestone ${stage.stage}`,
            legalSlaDays: 60,
            actualAvgDays: stage.avgDaysSpent,
            primaryRiskFactor: 'Administrative dwell latency',
          };

          const isCritical = stage.avgRisk >= 60;
          const isElevated = stage.avgRisk >= 45 && stage.avgRisk < 60;
          const isSelected = selectedStage === stage.stage;

          const slaDelay = Math.max(0, meta.actualAvgDays - meta.legalSlaDays);

          return (
            <div
              key={stage.stage}
              onClick={() => setSelectedStage(isSelected ? null : stage.stage)}
              className={`p-3 rounded border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-blue-500/80 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500 font-bold">
                    0{index + 1}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">
                    {stage.stage}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
                    {meta.statutoryRef}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">
                    Parcels: <strong className="text-slate-200">{stage.parcels}</strong>
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    High-Risk: <strong className="text-rose-400">{stage.highRiskCount}</strong>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-[11px]">Index:</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded border text-[11px] ${
                        isCritical
                          ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                          : isElevated
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {stage.avgRisk}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar comparison */}
              <div className="space-y-1 mb-2">
                <div className="w-full h-1.5 bg-slate-900 rounded overflow-hidden flex">
                  <div
                    className={`h-full rounded transition-all duration-300 ${
                      isCritical
                        ? 'bg-rose-500'
                        : isElevated
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${stage.avgRisk}%` }}
                  />
                </div>
              </div>

              {/* Statutory Metric Telemetry */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1.5 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Statutory SLA: <strong className="text-slate-200">{meta.legalSlaDays}d</strong> (Actual: {meta.actualAvgDays}d)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <AlertTriangle className={`w-3.5 h-3.5 ${slaDelay > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <span>
                    Dwell Slippage: <strong className={slaDelay > 0 ? 'text-rose-400' : 'text-emerald-400'}>+{slaDelay} days</strong>
                  </span>
                </div>

                <div className="truncate text-slate-500">
                  Driver: <span className="text-slate-300 font-medium">{meta.primaryRiskFactor}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
