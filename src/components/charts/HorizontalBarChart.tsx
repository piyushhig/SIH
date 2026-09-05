import React, { useState } from 'react';
import { MOCK_TOP_DELAY_FACTORS } from '../../data/mockData';
import { ShieldAlert, AlertTriangle, Layers } from 'lucide-react';

interface FactorDetail {
  category: 'Legal' | 'Cadastral' | 'Valuation' | 'Statutory';
  remedyAction: string;
}

const FACTOR_META: Record<string, FactorDetail> = {
  'Multi-heir Inheritance Title Disputes': {
    category: 'Legal',
    remedyAction: 'Invoke Section 3H(4) escrow deposit in Principal Civil Court to vacate land possession.',
  },
  'Circle Rate vs Market Rate Valuation Gap': {
    category: 'Valuation',
    remedyAction: 'Convene District Level Compensation Negotiation Committee (DLCNC) for consensual multiplier.',
  },
  'Cadastral Map Boundary Mismatch': {
    category: 'Cadastral',
    remedyAction: 'Deploy dual-frequency RTK DGPS joint ground verification with State Survey Dept.',
  },
  'Gram Sabha Resolution Delay': {
    category: 'Statutory',
    remedyAction: 'Schedule emergency PESA / FRA district nodal officer expedited quorum meeting.',
  },
  'Forest Clearance Dwell': {
    category: 'Statutory',
    remedyAction: 'Submit Stage-II compensatory afforestation land non-encumbrance certificate on PARIVESH.',
  },
  'Religious/Graveyard Relocation Obstacle': {
    category: 'Legal',
    remedyAction: 'Facilitate mutually agreed relocation site trust deed with District Magistrate oversight.',
  },
};

export const HorizontalBarChart: React.FC = () => {
  const [sortKey, setSortKey] = useState<'delay' | 'prevalence'>('delay');
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);

  const data = [...MOCK_TOP_DELAY_FACTORS].sort((a, b) => {
    if (sortKey === 'delay') {
      return b.avgDelayImpactDays - a.avgDelayImpactDays;
    }
    return b.prevalence - a.prevalence;
  });

  return (
    <div id="delay-factor-contribution-component" className="w-full space-y-3 font-sans">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2 text-[11px] font-mono">
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
          <button
            type="button"
            onClick={() => setSortKey('delay')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              sortKey === 'delay'
                ? 'bg-slate-800 text-white font-bold shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ORDER BY DELAY IMPACT (+DAYS)
          </button>
          <button
            type="button"
            onClick={() => setSortKey('prevalence')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              sortKey === 'prevalence'
                ? 'bg-slate-800 text-white font-bold shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ORDER BY FREQUENCY (% PREVALENCE)
          </button>
        </div>

        <span className="text-slate-400">
          RANKED BY <strong className="text-slate-200">{sortKey === 'delay' ? 'MEAN DAYS ADDED' : 'SYSTEM INCIDENCE'}</strong>
        </span>
      </div>

      {/* Factor List */}
      <div className="space-y-2.5">
        {data.map((item) => {
          let barColor = 'bg-slate-500';
          let badgeColor = 'bg-slate-900 text-slate-400 border-slate-800';

          if (item.severity === 'High') {
            barColor = 'bg-rose-500';
            badgeColor = 'bg-rose-950/60 text-rose-300 border-rose-800';
          } else if (item.severity === 'Medium') {
            barColor = 'bg-amber-500';
            badgeColor = 'bg-amber-950/60 text-amber-300 border-amber-800';
          } else {
            barColor = 'bg-emerald-500';
            badgeColor = 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
          }

          const isHovered = hoveredFactor === item.factor;
          const meta = FACTOR_META[item.factor] || {
            category: 'Statutory',
            remedyAction: 'Verify through competent authority district land acquisition liaison officer.',
          };

          return (
            <div
              key={item.factor}
              onMouseEnter={() => setHoveredFactor(item.factor)}
              onMouseLeave={() => setHoveredFactor(null)}
              className={`p-2.5 rounded border transition-all cursor-pointer ${
                isHovered
                  ? 'bg-slate-800/90 border-blue-500/80 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between text-xs gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-bold ${badgeColor}`}>
                    {item.severity}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-slate-900 border-slate-800 font-mono text-slate-300">
                    {meta.category}
                  </span>
                  <span className="font-semibold text-white font-mono text-xs">{item.factor}</span>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Frequency: <strong className="text-slate-200">{item.prevalence}%</strong>
                  </span>
                  <span className="text-slate-300 font-semibold text-xs">
                    Impact: <strong className="text-rose-400 font-mono">+{item.avgDelayImpactDays} days</strong>
                  </span>
                </div>
              </div>

              {/* Progress bar reflecting delay weight */}
              <div className="w-full h-1.5 bg-slate-900 rounded overflow-hidden flex">
                <div
                  className={`h-full rounded transition-all duration-300 ${barColor} ${
                    isHovered ? 'brightness-125' : ''
                  }`}
                  style={{
                    width: `${
                      sortKey === 'delay'
                        ? Math.min(100, Math.round((item.avgDelayImpactDays / 90) * 100))
                        : Math.min(100, Math.round(item.prevalence * 2.1))
                    }%`,
                  }}
                />
              </div>

              {/* Actionable Statutory Mitigation Protocol */}
              {isHovered && (
                <div className="mt-2 pt-1.5 border-t border-slate-800 text-[11px] font-mono text-slate-300">
                  <span className="font-bold text-white">MITIGATION PROTOCOL: </span>
                  <span className="text-slate-400">{meta.remedyAction}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
