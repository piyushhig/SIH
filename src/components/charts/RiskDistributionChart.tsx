import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';
import { PORTFOLIO_METRICS } from '../../data/mockData';

interface RiskDistributionChartProps {
  lowCount?: number;
  mediumCount?: number;
  highCount?: number;
  total?: number;
}

type MetricView = 'counts' | 'delays' | 'capital';

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({
  lowCount = PORTFOLIO_METRICS.lowRiskParcels,
  mediumCount = PORTFOLIO_METRICS.mediumRiskParcels,
  highCount = PORTFOLIO_METRICS.highRiskParcels,
  total = PORTFOLIO_METRICS.totalParcels,
}) => {
  const [selectedView, setSelectedView] = useState<MetricView>('counts');
  const [hoveredTier, setHoveredTier] = useState<'low' | 'medium' | 'high' | null>(null);

  const lowPct = Math.round((lowCount / total) * 1000) / 10;
  const medPct = Math.round((mediumCount / total) * 1000) / 10;
  const highPct = Math.round((highCount / total) * 1000) / 10;

  // Domain specific values for LANDGUARD AI
  const tierDetails = {
    low: {
      label: 'Low Risk',
      sublabel: 'Parcels on schedule',
      count: lowCount,
      pct: lowPct,
      avgDelay: '0 – 7 days',
      delayVal: '+3.2d avg',
      capital: '₹428.4 Cr',
      slaStatus: '98.4% Within SLA',
      keyStage: 'Sec 3A/4 Survey Verified',
      color: '#10B981',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      activeClass: 'ring-1 ring-emerald-500 bg-emerald-50/70',
      icon: ShieldCheck,
    },
    medium: {
      label: 'Medium Risk',
      sublabel: 'Early delay friction observed',
      count: mediumCount,
      pct: medPct,
      avgDelay: '15 – 35 days',
      delayVal: '+22.4d avg',
      capital: '₹318.2 Cr',
      slaStatus: 'Dwell Dilation 34%',
      keyStage: 'Sec 3G Award Valuation',
      color: '#F59E0B',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      activeClass: 'ring-1 ring-amber-500 bg-amber-50/70',
      icon: AlertTriangle,
    },
    high: {
      label: 'High Risk',
      sublabel: 'Immediate mitigation required',
      count: highCount,
      pct: highPct,
      avgDelay: '45 – 120+ days',
      delayVal: '+74.8d avg',
      capital: '₹186.5 Cr',
      slaStatus: 'Critical SLA Breach',
      keyStage: 'Sec 3H Title / Court Dispute',
      color: '#E11D48',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
      activeClass: 'ring-1 ring-rose-500 bg-rose-50/70',
      icon: AlertOctagon,
    },
  };

  return (
    <div id="acquisition-risk-overview-component" className="w-full space-y-3.5">
      {/* View Switcher & Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xs border border-slate-200 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setSelectedView('counts')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              selectedView === 'counts'
                ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PARCEL VOLUME
          </button>
          <button
            type="button"
            onClick={() => setSelectedView('delays')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              selectedView === 'delays'
                ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            DELAY EXPOSURE
          </button>
          <button
            type="button"
            onClick={() => setSelectedView('capital')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              selectedView === 'capital'
                ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            COMPENSATION VALUE
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span>CALIBRATED REGISTRY</span>
          <span className="font-bold text-slate-800">{total.toLocaleString()} PARCELS</span>
        </div>
      </div>

      {/* Visual Proportional Segmented Meter */}
      <div className="space-y-1">
        <div className="w-full h-5 bg-slate-100 rounded-xs overflow-hidden flex p-0.5 border border-slate-200 relative">
          <div
            onMouseEnter={() => setHoveredTier('low')}
            onMouseLeave={() => setHoveredTier(null)}
            className={`h-full bg-emerald-600 rounded-l-xs transition-all duration-200 cursor-pointer ${
              hoveredTier === 'low' ? 'brightness-110' : hoveredTier ? 'opacity-50' : 'opacity-100'
            }`}
            style={{ width: `${lowPct}%` }}
            title={`Low Risk: ${lowCount} parcels (${lowPct}%)`}
          />
          <div
            onMouseEnter={() => setHoveredTier('medium')}
            onMouseLeave={() => setHoveredTier(null)}
            className={`h-full bg-amber-500 transition-all duration-200 cursor-pointer ${
              hoveredTier === 'medium' ? 'brightness-110' : hoveredTier ? 'opacity-50' : 'opacity-100'
            }`}
            style={{ width: `${medPct}%` }}
            title={`Medium Risk: ${mediumCount} parcels (${medPct}%)`}
          />
          <div
            onMouseEnter={() => setHoveredTier('high')}
            onMouseLeave={() => setHoveredTier(null)}
            className={`h-full bg-rose-600 rounded-r-xs transition-all duration-200 cursor-pointer ${
              hoveredTier === 'high' ? 'brightness-110' : hoveredTier ? 'opacity-50' : 'opacity-100'
            }`}
            style={{ width: `${highPct}%` }}
            title={`High Risk: ${highCount} parcels (${highPct}%)`}
          />
        </div>

        {/* Meter Percentage Ticks */}
        <div className="flex justify-between text-[10px] font-mono text-slate-500 px-0.5">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> LOW {lowPct}%
          </span>
          <span className="flex items-center gap-1 text-amber-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> MEDIUM {medPct}%
          </span>
          <span className="flex items-center gap-1 text-rose-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> HIGH {highPct}%
          </span>
        </div>
      </div>

      {/* Breakdown Cards Grid with dynamic view values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
        {/* Low Risk Card */}
        <div
          onMouseEnter={() => setHoveredTier('low')}
          onMouseLeave={() => setHoveredTier(null)}
          className={`rounded-xs border border-slate-200 bg-slate-50/50 p-3 transition-all cursor-pointer ${
            hoveredTier === 'low' ? tierDetails.low.activeClass : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
              <span className="h-2 w-2 rounded-xs bg-emerald-600" />
              Low Risk
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-xs font-bold">
              {lowPct}%
            </span>
          </div>

          <div className="my-1">
            {selectedView === 'counts' && (
              <>
                <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {lowCount.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Parcels on schedule</p>
              </>
            )}
            {selectedView === 'delays' && (
              <>
                <p className="text-xl font-bold text-emerald-700 font-mono tabular-nums">
                  {tierDetails.low.delayVal}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Range: {tierDetails.low.avgDelay}</p>
              </>
            )}
            {selectedView === 'capital' && (
              <>
                <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {tierDetails.low.capital}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Earmarked compensation</p>
              </>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200/70 text-[10px] font-mono space-y-0.5 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">SLA Rating:</span>
              <span className="font-semibold text-emerald-700">{tierDetails.low.slaStatus}</span>
            </div>
            <div className="flex justify-between truncate">
              <span className="text-slate-500">Milestone:</span>
              <span className="font-medium text-slate-800">{tierDetails.low.keyStage}</span>
            </div>
          </div>
        </div>

        {/* Medium Risk Card */}
        <div
          onMouseEnter={() => setHoveredTier('medium')}
          onMouseLeave={() => setHoveredTier(null)}
          className={`rounded-xs border border-slate-200 bg-slate-50/50 p-3 transition-all cursor-pointer ${
            hoveredTier === 'medium' ? tierDetails.medium.activeClass : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
              <span className="h-2 w-2 rounded-xs bg-amber-500" />
              Medium Risk
            </span>
            <span className="text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-xs font-bold">
              {medPct}%
            </span>
          </div>

          <div className="my-1">
            {selectedView === 'counts' && (
              <>
                <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {mediumCount.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Early friction noted</p>
              </>
            )}
            {selectedView === 'delays' && (
              <>
                <p className="text-xl font-bold text-amber-700 font-mono tabular-nums">
                  {tierDetails.medium.delayVal}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Range: {tierDetails.medium.avgDelay}</p>
              </>
            )}
            {selectedView === 'capital' && (
              <>
                <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {tierDetails.medium.capital}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Valuation under review</p>
              </>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200/70 text-[10px] font-mono space-y-0.5 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">SLA Rating:</span>
              <span className="font-semibold text-amber-700">{tierDetails.medium.slaStatus}</span>
            </div>
            <div className="flex justify-between truncate">
              <span className="text-slate-500">Milestone:</span>
              <span className="font-medium text-slate-800">{tierDetails.medium.keyStage}</span>
            </div>
          </div>
        </div>

        {/* High Risk Card */}
        <div
          onMouseEnter={() => setHoveredTier('high')}
          onMouseLeave={() => setHoveredTier(null)}
          className={`rounded-xs border border-slate-200 bg-slate-50/50 p-3 transition-all cursor-pointer ${
            hoveredTier === 'high' ? tierDetails.high.activeClass : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
              <span className="h-2 w-2 rounded-xs bg-rose-600" />
              High Risk
            </span>
            <span className="text-[10px] font-mono text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-xs font-bold">
              {highPct}%
            </span>
          </div>

          <div className="my-1">
            {selectedView === 'counts' && (
              <>
                <p className="text-xl font-bold text-rose-600 font-mono tabular-nums">
                  {highCount.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Critical intervention</p>
              </>
            )}
            {selectedView === 'delays' && (
              <>
                <p className="text-xl font-bold text-rose-600 font-mono tabular-nums">
                  {tierDetails.high.delayVal}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Range: {tierDetails.high.avgDelay}</p>
              </>
            )}
            {selectedView === 'capital' && (
              <>
                <p className="text-xl font-bold text-rose-700 font-mono tabular-nums">
                  {tierDetails.high.capital}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Stalled compensation</p>
              </>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200/70 text-[10px] font-mono space-y-0.5 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">SLA Rating:</span>
              <span className="font-semibold text-rose-600">{tierDetails.high.slaStatus}</span>
            </div>
            <div className="flex justify-between truncate">
              <span className="text-slate-500">Milestone:</span>
              <span className="font-medium text-slate-800">{tierDetails.high.keyStage}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
