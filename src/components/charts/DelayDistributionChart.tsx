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
      color: 'bg-emerald-600',
      badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      range: '15 – 30 Days',
      label: 'Moderate Dwell Friction',
      count: 438,
      percent: 30.8,
      capitalAtRisk: '₹284.1 Cr',
      statutoryImpact: 'Valuation objections filed under Sec 3G; SLA dilation observed.',
      color: 'bg-blue-600',
      badgeClass: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      range: '31 – 60 Days',
      label: 'Substantial Drag',
      count: 274,
      percent: 19.3,
      capitalAtRisk: '₹178.6 Cr',
      statutoryImpact: 'Civil contractor right-of-way handover milestone at risk.',
      color: 'bg-amber-500',
      badgeClass: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    {
      range: '61 – 90 Days',
      label: 'Severe Statutory Breach',
      count: 132,
      percent: 9.3,
      capitalAtRisk: '₹102.3 Cr',
      statutoryImpact: 'Breaches statutory timeline; requires Collector / CALA intervention.',
      color: 'bg-orange-600',
      badgeClass: 'text-orange-800 bg-orange-50 border-orange-200',
    },
    {
      range: '> 90 Days',
      label: 'Critical Legal Freeze',
      count: 84,
      percent: 5.9,
      capitalAtRisk: '₹59.8 Cr',
      statutoryImpact: 'High Court writ petition stay or multi-heir succession impasse.',
      color: 'bg-rose-600',
      badgeClass: 'text-rose-800 bg-rose-50 border-rose-200',
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
              className={`p-2 rounded-xs border transition-all cursor-pointer ${
                isHovered
                  ? 'bg-blue-50/50 border-blue-300 shadow-2xs'
                  : 'bg-slate-50/40 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between text-xs gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-mono text-[11px] min-w-[76px]">
                    {item.range}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-xs border ${item.badgeClass}`}>
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Value: <strong className="text-slate-800">{item.capitalAtRisk}</strong>
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {item.count} <span className="text-slate-500 font-normal text-[11px]">({item.percent}%)</span>
                  </span>
                </div>
              </div>

              {/* Progress Bar with technical tick marks */}
              <div className="w-full h-2.5 bg-slate-200/70 rounded-xs overflow-hidden flex">
                <div
                  className={`h-full rounded-xs transition-all duration-300 ${item.color} ${
                    isHovered ? 'brightness-110' : ''
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Collapsible / Interactive detail snippet */}
              {isHovered && (
                <p className="text-[11px] text-slate-600 font-mono mt-2 pt-1.5 border-t border-slate-200/60 leading-relaxed">
                  <strong className="text-slate-900">STATUTORY IMPACT: </strong> {item.statutoryImpact}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footnote Bar */}
      <div className="pt-1 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
        <span>TOTAL: {totalParcels.toLocaleString()} PARCELS EVALUATED</span>
        <span className="text-slate-800 font-semibold">
          PARCELS &gt; 30d DELAY: <span className="text-rose-600">490 (34.5%)</span>
        </span>
      </div>
    </div>
  );
};
