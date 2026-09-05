import React, { useState } from 'react';

interface DelayBucket {
  range: string;
  label: string;
  count: number;
  percent: number;
  capitalAtRisk: string;
  statutoryImpact: string;
  color: string;
  badgeClass: string;
}

export const DelayDistributionChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const buckets: DelayBucket[] = [
    {
      range: '< 15 Days',
      label: 'Nominal Variance',
      count: 492,
      percent: 34.6,
      capitalAtRisk: '₹310.4 Cr',
      statutoryImpact: 'Absorbed in general buffer; on schedule for civil contract handover.',
      color: 'bg-emerald-500',
      badgeClass: 'text-emerald-300 bg-emerald-950/60 border-emerald-800',
    },
    {
      range: '15 – 30 Days',
      label: 'Moderate Dwell Friction',
      count: 438,
      percent: 30.8,
      capitalAtRisk: '₹284.1 Cr',
      statutoryImpact: 'Valuation objections filed under Sec 3G; SLA dilation observed.',
      color: 'bg-blue-500',
      badgeClass: 'text-blue-300 bg-blue-950/60 border-blue-800',
    },
    {
      range: '31 – 60 Days',
      label: 'Substantial Drag',
      count: 274,
      percent: 19.3,
      capitalAtRisk: '₹178.6 Cr',
      statutoryImpact: 'Civil contractor right-of-way handover milestone at risk.',
      color: 'bg-amber-500',
      badgeClass: 'text-amber-300 bg-amber-950/60 border-amber-800',
    },
    {
      range: '61 – 90 Days',
      label: 'Severe Statutory Breach',
      count: 132,
      percent: 9.3,
      capitalAtRisk: '₹102.3 Cr',
      statutoryImpact: 'Breaches statutory timeline; requires Collector / CALA intervention.',
      color: 'bg-orange-500',
      badgeClass: 'text-orange-300 bg-orange-950/60 border-orange-800',
    },
    {
      range: '> 90 Days',
      label: 'Critical Legal Freeze',
      count: 84,
      percent: 5.9,
      capitalAtRisk: '₹59.8 Cr',
      statutoryImpact: 'High Court writ petition stay or multi-heir succession impasse.',
      color: 'bg-rose-500',
      badgeClass: 'text-rose-300 bg-rose-950/60 border-rose-800',
    },
  ];

  const maxCount = Math.max(...buckets.map((b) => b.count));
  const totalParcels = buckets.reduce((acc, b) => acc + b.count, 0);

  return (
    <div id="delay-distribution-component" className="w-full space-y-3.5 font-sans">
      {/* Visual cumulative histogram bars */}
      <div className="space-y-2.5">
        {buckets.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const barWidth = Math.round((item.count / maxCount) * 100);

          return (
            <div
              key={item.range}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2.5 rounded border transition-all cursor-pointer ${
                isHovered
                  ? 'bg-slate-800/80 border-blue-500/80 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between text-xs gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-mono text-[11px] min-w-[76px]">
                    {item.range}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${item.badgeClass}`}>
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Value: <strong className="text-slate-200">{item.capitalAtRisk}</strong>
                  </span>
                  <span className="font-bold text-white tabular-nums">
                    {item.count} <span className="text-slate-500 font-normal text-[11px]">({item.percent}%)</span>
                  </span>
                </div>
              </div>

              {/* Progress Bar with technical tick marks */}
              <div className="w-full h-2 bg-slate-900 rounded overflow-hidden flex">
                <div
                  className={`h-full rounded transition-all duration-300 ${item.color} ${
                    isHovered ? 'brightness-125' : ''
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Collapsible / Interactive detail snippet */}
              {isHovered && (
                <p className="text-[11px] text-slate-300 font-mono mt-2 pt-1.5 border-t border-slate-800 leading-relaxed">
                  <strong className="text-white">STATUTORY IMPACT: </strong> {item.statutoryImpact}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footnote Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <span>TOTAL: {totalParcels.toLocaleString()} PARCELS EVALUATED</span>
        <span className="text-slate-300 font-semibold">
          PARCELS &gt; 30d DELAY: <span className="text-rose-400">490 (34.5%)</span>
        </span>
      </div>
    </div>
  );
};
