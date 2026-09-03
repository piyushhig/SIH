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
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-[11px] font-mono">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xs border border-slate-200">
          <button
            type="button"
            onClick={() => setSortKey('delay')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              sortKey === 'delay'
                ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ORDER BY DELAY IMPACT (+DAYS)
          </button>
          <button
            type="button"
            onClick={() => setSortKey('prevalence')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              sortKey === 'prevalence'
                ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ORDER BY FREQUENCY (% PREVALENCE)
          </button>
        </div>

        <span className="text-slate-500">
          RANKED BY <strong className="text-slate-800">{sortKey === 'delay' ? 'MEAN DAYS ADDED' : 'SYSTEM INCIDENCE'}</strong>
        </span>
      </div>

      {/* Factor List */}
      <div className="space-y-2.5">
        {data.map((item) => {
          let barColor = 'bg-slate-400';
          let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';

          if (item.severity === 'High') {
            barColor = 'bg-rose-600';
            badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
          } else if (item.severity === 'Medium') {
            barColor = 'bg-amber-500';
            badgeColor = 'bg-amber-700 bg-amber-50 border-amber-200';
          } else {
            barColor = 'bg-emerald-600';
            badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
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
              className={`p-2.5 rounded-xs border transition-all cursor-pointer ${
                isHovered
                  ? 'bg-blue-50/50 border-blue-300 shadow-2xs'
                  : 'bg-slate-50/40 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between text-xs gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-xs border font-mono font-bold ${badgeColor}`}>
                    {item.severity}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-xs border bg-white border-slate-200 font-mono text-slate-600">
                    {meta.category}
                  </span>
                  <span className="font-semibold text-slate-900 font-mono text-xs">{item.factor}</span>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Frequency: <strong className="text-slate-800">{item.prevalence}%</strong>
                  </span>
                  <span className="text-slate-600 font-semibold text-xs">
                    Impact: <strong className="text-rose-600 font-mono">+{item.avgDelayImpactDays} days</strong>
                  </span>
                </div>
              </div>

              {/* Progress bar reflecting delay weight */}
              <div className="w-full h-2 bg-slate-200/80 rounded-xs overflow-hidden flex">
                <div
                  className={`h-full rounded-xs transition-all duration-300 ${barColor} ${
                    isHovered ? 'brightness-110' : ''
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
                <div className="mt-2 pt-1.5 border-t border-slate-200 text-[11px] font-mono text-slate-700">
                  <span className="font-bold text-slate-900">MITIGATION PROTOCOL: </span>
                  <span className="text-slate-600">{meta.remedyAction}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
