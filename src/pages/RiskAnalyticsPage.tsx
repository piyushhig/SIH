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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-sans">Predictive Risk Analytics</h2>
            <span className="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-xs">
              PREDICTIVE MODEL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Macro-level predictive risk landscape and factor explanations across active infrastructure corridors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-xs font-mono shadow-2xs">
            STATUTORY PREDICTIVE ENGINE • CALIBRATED
          </span>
        </div>
      </div>

      {/* Model Disclaimer Notice */}
      <div className="p-3 bg-slate-50 rounded-xs border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 font-mono text-[11px]">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5 font-sans">
          <p className="font-semibold text-slate-900 text-xs font-mono uppercase">
            EXPLANATORY MODELING CONTEXT & FEATURE WEIGHTS:
          </p>
          <p className="text-slate-600 text-xs leading-relaxed">
            Prediction outputs shown in this prototype use simulated data calibrated against statutory acquisition records,
            dispute patterns, and survey timeline milestones to forecast delay risks before schedule overruns occur.
          </p>
        </div>
      </div>

      {/* Top 2 Visual Charts: Risk Distribution & Delay Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 1. Risk Distribution Chart */}
        <div className="lg:col-span-6 bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between font-mono">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>Risk Level Distribution</span>
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5 font-sans">
                Shows the breakdown of land parcels into High (&gt;60%), Medium (30-60%), and Low (&lt;30%) risk of delay.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
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
        <div className="lg:col-span-6 bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between font-mono">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>Forecasted Delay Timeline</span>
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5 font-sans">
                How many parcels are expected to face minor delays (under 15 days) versus critical delays (over 45 days).
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
              DAYS DELAYED
            </span>
          </div>

          <DelayDistributionChart />
        </div>
      </div>

      {/* Middle 2 Charts: Risk by Stage & Top Delay Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 3. Risk by Acquisition Stage */}
        <div className="lg:col-span-6 bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between font-mono">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Stage-Wise Delay Vulnerability
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5 font-sans">
                Identifies which statutory acquisition stages (such as Section 19 declaration or Award inquiry) encounter the highest delay probability.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
              5 STAGES
            </span>
          </div>

          <StageRiskChart />
        </div>

        {/* 4. Top Delay Factors */}
        <div className="lg:col-span-6 bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between font-mono">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Top Delay Drivers Across All Parcels
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5 font-sans">
                The most frequent root causes causing timeline slippage, ranked by percentage of affected parcels.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
              FREQUENCY %
            </span>
          </div>

          <HorizontalBarChart />
        </div>
      </div>

      {/* 5. Risk Trend Over Time */}
      <div className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between font-mono">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Project Risk Comparison & Trend
            </h3>
            <p className="text-[11px] text-slate-600 mt-0.5 font-sans">
              Historical 6-month delay trend with 60-day projection to evaluate if risk is accelerating or stabilizing across projects.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
            6-MONTH TREND
          </span>
        </div>

        <LineTrendChart />
      </div>

      {/* Section: Prediction Factors (Feature Importance Table) */}
      <div className="bg-white rounded-xs border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
            Delay Prediction Factors & Relative Influence
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
            Key indicators monitored by the predictive engine to calculate parcel delay likelihood and their practical impact on acquisition schedules.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] font-mono tracking-wider sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3.5 min-w-[220px] border-r-2 border-slate-200 sticky left-0 bg-slate-100 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                  Prediction Factor
                </th>
                <th className="py-2.5 px-3.5 text-center border-r border-slate-200">Relative Weight</th>
                <th className="py-2.5 px-3.5 border-r border-slate-200">Risk Impact Level</th>
                <th className="py-2.5 px-3.5 min-w-[320px]">How This Factor Causes Delay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {MOCK_PREDICTION_FACTORS.map((factor) => (
                <tr key={factor.factor} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="py-2.5 px-3.5 font-bold text-slate-900 font-sans text-xs border-r-2 border-slate-200 sticky left-0 bg-white group-hover:bg-blue-50/95 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                    {factor.factor}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-mono font-bold text-blue-700 border-r border-slate-100 tabular-nums">
                    <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-xs text-slate-900">
                      {factor.weight}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 border-r border-slate-100">
                    <span
                      className={`text-[11px] font-semibold ${
                        factor.correlation.includes('Critical')
                          ? 'text-rose-700'
                          : factor.correlation.includes('Strong')
                          ? 'text-amber-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {factor.correlation}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-600 leading-relaxed font-sans text-xs">
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
