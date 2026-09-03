import React from 'react';

interface DistrictMetric {
  district: string;
  state: string;
  totalParcels: number;
  highRiskCount: number;
  avgRiskScore: number;
  avgDelayDays: number;
}

const DISTRICT_DATA: DistrictMetric[] = [
  { district: 'Thane', state: 'Maharashtra', totalParcels: 280, highRiskCount: 52, avgRiskScore: 68, avgDelayDays: 46 },
  { district: 'Raigad', state: 'Maharashtra', totalParcels: 310, highRiskCount: 44, avgRiskScore: 64, avgDelayDays: 39 },
  { district: 'Ahmedabad', state: 'Gujarat', totalParcels: 220, highRiskCount: 28, avgRiskScore: 56, avgDelayDays: 31 },
  { district: 'Bengaluru Rural', state: 'Karnataka', totalParcels: 190, highRiskCount: 22, avgRiskScore: 52, avgDelayDays: 28 },
  { district: 'Kanchipuram', state: 'Tamil Nadu', totalParcels: 170, highRiskCount: 14, avgRiskScore: 48, avgDelayDays: 24 },
  { district: 'Ranchi', state: 'Jharkhand', totalParcels: 130, highRiskCount: 16, avgRiskScore: 54, avgDelayDays: 30 },
  { district: 'Varanasi', state: 'Uttar Pradesh', totalParcels: 70, highRiskCount: 4, avgRiskScore: 36, avgDelayDays: 16 },
  { district: 'Nagpur', state: 'Maharashtra', totalParcels: 50, highRiskCount: 2, avgRiskScore: 24, avgDelayDays: 9 },
];

export const DistrictRiskChart: React.FC = () => {
  const maxDelay = 50;

  return (
    <div className="space-y-3 font-sans">
      <div className="space-y-2">
        {DISTRICT_DATA.map((item) => {
          let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
          let barColor = 'bg-emerald-600';

          if (item.avgRiskScore >= 61) {
            badgeColor = 'text-rose-800 bg-rose-50 border-rose-200 font-semibold';
            barColor = 'bg-rose-600';
          } else if (item.avgRiskScore >= 31) {
            badgeColor = 'text-amber-800 bg-amber-50 border-amber-200 font-medium';
            barColor = 'bg-amber-500';
          }

          const delayPercent = Math.min(100, Math.round((item.avgDelayDays / maxDelay) * 100));

          return (
            <div
              key={item.district}
              className="p-2.5 rounded-xs border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition-colors space-y-1.5"
            >
              <div className="flex flex-wrap items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-sans text-xs">{item.district}</span>
                  <span className="text-[10px] text-slate-500">({item.state})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-600">
                    <strong className="text-slate-900">{item.highRiskCount}</strong> / {item.totalParcels} High Risk
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-xs border ${badgeColor}`}>
                    RISK {item.avgRiskScore}/100
                  </span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    +{item.avgDelayDays}d
                  </span>
                </div>
              </div>

              {/* Progress bar representing comparative delay horizon */}
              <div className="w-full h-1.5 bg-slate-200 rounded-xs overflow-hidden">
                <div
                  className={`h-full rounded-xs transition-all duration-300 ${barColor}`}
                  style={{ width: `${delayPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-2">
        <span>Source: Multi-project revenue jurisdiction registry</span>
        <span>Relative delay exposure normalized to statutory milestone targets</span>
      </div>
    </div>
  );
};
