import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Layers,
  PieChart,
  HelpCircle,
  AlertTriangle,
  Info,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { DelayDistributionChart } from '../components/charts/DelayDistributionChart';
import { StageRiskChart } from '../components/charts/StageRiskChart';
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart';
import { LineTrendChart } from '../components/charts/LineTrendChart';
import { MOCK_PREDICTION_FACTORS, MOCK_PARCELS } from '../data/mockData';
import { Project, LandParcel } from '../types';

interface RiskAnalyticsPageProps {
  projects?: Project[];
  parcels?: LandParcel[];
}

export const RiskAnalyticsPage: React.FC<RiskAnalyticsPageProps> = ({
  projects = [],
  parcels = MOCK_PARCELS,
}) => {
  const totalParcels = parcels.length;
  const highCount = parcels.filter((p) => p.riskLevel === 'High').length;
  const mediumCount = parcels.filter((p) => p.riskLevel === 'Medium').length;
  const lowCount = parcels.filter((p) => p.riskLevel === 'Low').length;
  return (
    <div id="screen-risk-analytics" className="p-5 space-y-5 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight font-sans">Predictive Risk Analytics</h2>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded">
              PREDICTIVE MODEL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Macro-level predictive risk landscape and factor explanations across active infrastructure corridors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded font-mono shadow-sm">
            STATUTORY PREDICTIVE ENGINE • CALIBRATED
          </span>
        </div>
      </div>

      {/* Model Disclaimer Notice */}
      <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300 font-mono text-[11px] backdrop-blur-md">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5 font-sans">
          <p className="font-semibold text-white text-xs font-mono uppercase">
            EXPLANATORY MODELING CONTEXT & FEATURE WEIGHTS:
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            Prediction outputs shown in this prototype use simulated data calibrated against statutory acquisition records,
            dispute patterns, and survey timeline milestones to forecast delay risks before schedule overruns occur.
          </p>
        </div>
      </div>

      {/* Top 2 Visual Charts: Risk Distribution & Delay Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 1. Risk Distribution Chart */}
        <div className="lg:col-span-6 bg-slate-900/80 rounded-lg border border-slate-800 p-4 shadow-md space-y-3 backdrop-blur-md">
          <div className="border-b border-slate-800/80 pb-2.5 flex items-center justify-between font-mono">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Risk Level Distribution</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                Shows the breakdown of land parcels into High (&gt;60%), Medium (30-60%), and Low (&lt;30%) risk of delay.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              N={totalParcels.toLocaleString()} PARCELS
            </span>
          </div>

          <RiskDistributionChart
            lowCount={lowCount}
            mediumCount={mediumCount}
            highCount={highCount}
            total={totalParcels}
          />
        </div>

        {/* 2. Predicted Delay Distribution */}
        <div className="lg:col-span-6 bg-slate-900/80 rounded-lg border border-slate-800 p-4 shadow-md space-y-3 backdrop-blur-md">
          <div className="border-b border-slate-800/80 pb-2.5 flex items-center justify-between font-mono">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Forecasted Delay Timeline</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                How many parcels are expected to face minor delays (under 15 days) versus critical delays (over 45 days).
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              DAYS DELAYED
            </span>
          </div>

          <DelayDistributionChart />
        </div>
      </div>

      {/* Middle 2 Charts: Risk by Stage & Top Delay Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 3. Risk by Acquisition Stage */}
        <div className="lg:col-span-6 bg-slate-900/80 rounded-lg border border-slate-800 p-4 shadow-md space-y-3 backdrop-blur-md">
          <div className="border-b border-slate-800/80 pb-2.5 flex items-center justify-between font-mono">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Stage-Wise Delay Vulnerability
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                Identifies which statutory acquisition stages (such as Section 19 declaration or Award inquiry) encounter the highest delay probability.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              5 STAGES
            </span>
          </div>

          <StageRiskChart />
        </div>

        {/* 4. Top Delay Factors */}
        <div className="lg:col-span-6 bg-slate-900/80 rounded-lg border border-slate-800 p-4 shadow-md space-y-3 backdrop-blur-md">
          <div className="border-b border-slate-800/80 pb-2.5 flex items-center justify-between font-mono">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Top Delay Drivers Across All Parcels
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                The most frequent root causes causing timeline slippage, ranked by percentage of affected parcels.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              FREQUENCY %
            </span>
          </div>

          <HorizontalBarChart />
        </div>
      </div>

      {/* 5. Risk Trend Over Time */}
      <div className="bg-slate-900/80 rounded-lg border border-slate-800 p-4 shadow-md space-y-3 backdrop-blur-md">
        <div className="border-b border-slate-800/80 pb-2.5 flex items-center justify-between font-mono">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Project Risk Comparison & Trend
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
              Historical 6-month delay trend with 60-day projection to evaluate if risk is accelerating or stabilizing across projects.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            6-MONTH TREND
          </span>
        </div>

        <LineTrendChart />
      </div>

      {/* Section: Prediction Factors (Feature Importance Table) */}
      <div className="bg-slate-900/80 rounded-lg border border-slate-800 shadow-md overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Delay Prediction Factors & Relative Influence
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
            Key indicators monitored by the predictive engine to calculate parcel delay likelihood and their practical impact on acquisition schedules.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] font-mono tracking-wider sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3.5 min-w-[220px] border-r border-slate-800 sticky left-0 bg-slate-950 z-20">
                  Prediction Factor
                </th>
                <th className="py-2.5 px-3.5 text-center border-r border-slate-800">Relative Weight</th>
                <th className="py-2.5 px-3.5 border-r border-slate-800">Risk Impact Level</th>
                <th className="py-2.5 px-3.5 min-w-[320px]">How This Factor Causes Delay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {MOCK_PREDICTION_FACTORS.map((factor) => (
                <tr key={factor.factor} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="py-2.5 px-3.5 font-bold text-white font-sans text-xs border-r border-slate-800 sticky left-0 bg-slate-900 group-hover:bg-slate-800 z-10">
                    {factor.factor}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-mono font-bold text-blue-400 border-r border-slate-800/60 tabular-nums">
                    <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-white">
                      {factor.weight}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 border-r border-slate-800/60">
                    <span
                      className={`text-[11px] font-semibold ${
                        factor.correlation.includes('Critical')
                          ? 'text-rose-400'
                          : factor.correlation.includes('Strong')
                          ? 'text-amber-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {factor.correlation}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-300 leading-relaxed font-sans text-xs">
                    {factor.impactDescription}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
