import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Building2,
  FileCheck,
} from 'lucide-react';
import { Project, LandParcel, AcquisitionStage } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { CountUpNumber } from '../components/common/CountUpNumber';

interface ProjectDetailPageProps {
  project: Project;
  parcels: LandParcel[];
  onBack: () => void;
  onSelectParcel: (parcelId: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  parcels,
  onBack,
  onSelectParcel,
}) => {
  // Parcels belonging to this project
  const projectParcels = parcels.filter((p) => p.projectId === project.id);
  // Sort priority parcels by risk score descending
  const priorityParcels = [...projectParcels].sort((a, b) => b.riskScore - a.riskScore);

  const stages: AcquisitionStage[] = ['Notification', 'Survey', 'Valuation', 'Compensation', 'Possession'];

  return (
    <div id="screen-project-intelligence" className="p-5 space-y-5 max-w-7xl mx-auto font-sans">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xs hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> [ ESC ] BACK TO PROJECTS
        </button>

        <span className="text-[11px] text-slate-700 bg-white px-2.5 py-1 rounded-xs border border-slate-200 font-mono shadow-2xs font-semibold">
          PROJECT INTELLIGENCE
        </span>
      </div>

      {/* Header Card: PROJECT SUMMARY */}
      <div className="bg-white rounded-xs border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            PROJECT SUMMARY
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            ID: {project.code}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold bg-slate-900 text-blue-400 px-2 py-0.5 rounded-xs border border-slate-800">
                {project.code}
              </span>
              <span className="text-xs font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded-xs border border-blue-200 font-medium">
                {project.type}
              </span>
              <StatusBadge status={project.status} size="sm" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
              {project.name}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono text-[11px] bg-slate-50 p-3 rounded-xs border border-slate-200">
              <div>
                <span className="text-slate-500 uppercase block text-[10px]">Corridor Type</span>
                <strong className="text-slate-900 font-sans text-xs">{project.type}</strong>
              </div>
              <div>
                <span className="text-slate-500 uppercase block text-[10px]">Total Parcels</span>
                <strong className="text-slate-900 font-mono text-xs tabular-nums">{project.totalParcels}</strong>
              </div>
              <div>
                <span className="text-slate-500 uppercase block text-[10px]">Target Completion</span>
                <strong className="text-slate-900 font-sans text-xs">{project.targetCompletion}</strong>
              </div>
              <div>
                <span className="text-slate-500 uppercase block text-[10px]">Agency & District</span>
                <strong className="text-slate-900 font-sans text-xs truncate block">{project.implementingAgency} ({project.district})</strong>
              </div>
            </div>
          </div>

          {/* Prominent Risk & Delay Box */}
          <div className="w-full lg:w-72 bg-rose-50/50 rounded-xs border-2 border-rose-300 p-3.5 font-mono space-y-2 flex-shrink-0">
            <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block">
              PROJECT DELAY RISK
            </span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Project Risk</span>
                <span className={`text-base font-extrabold uppercase ${project.overallRisk === 'High' ? 'text-rose-700' : project.overallRisk === 'Medium' ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {project.overallRisk} RISK
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block">Estimated Project Delay</span>
                <span className="text-base font-extrabold text-rose-700 tabular-nums">
                  +{project.predictedDelayDays} days
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between text-[11px] text-slate-600">
              <span>Acquisition Clearance:</span>
              <strong className="text-slate-900">{project.progressPercent}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Top Summary Cards (5 Cards) - Responsive vertical stacking on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Parcels */}
        <div className="bg-white rounded-xs border border-slate-200 p-3 shadow-2xs border-t-2 border-t-slate-700">
          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
            Total Parcels
          </span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
            <CountUpNumber value={project.totalParcels} durationMs={250} />
          </p>
          <span className="text-[10px] font-mono text-slate-400">Total earmarked stretch</span>
        </div>

        {/* Acquired */}
        <div className="bg-white rounded-xs border border-slate-200 p-3 shadow-2xs border-t-2 border-t-emerald-600">
          <span className="text-[10px] font-mono font-semibold text-emerald-800 uppercase tracking-wider">
            Acquired
          </span>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-0.5 tabular-nums">
            <CountUpNumber value={project.acquiredParcels} durationMs={250} />
          </p>
          <span className="text-[10px] font-mono text-slate-400">Possession handed over</span>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xs border border-slate-200 p-3 shadow-2xs border-t-2 border-t-amber-500">
          <span className="text-[10px] font-mono font-semibold text-amber-800 uppercase tracking-wider">
            Pending
          </span>
          <p className="text-xl font-bold font-mono text-amber-700 mt-0.5 tabular-nums">
            <CountUpNumber value={project.pendingParcels} durationMs={250} />
          </p>
          <span className="text-[10px] font-mono text-slate-400">In various stages</span>
        </div>

        {/* High Risk */}
        <div className="bg-white rounded-xs border border-slate-200 p-3 shadow-2xs border-t-2 border-t-rose-600">
          <span className="text-[10px] font-mono font-semibold text-rose-800 uppercase tracking-wider">
            High Risk
          </span>
          <p className="text-xl font-bold font-mono text-rose-700 mt-0.5 tabular-nums">
            <CountUpNumber value={project.highRiskParcels} durationMs={250} />
          </p>
          <span className="text-[10px] font-mono text-rose-600 font-medium">Delay likely &gt; 30d</span>
        </div>

        {/* Average Risk Score */}
        <div className="bg-white rounded-xs border border-slate-200 p-3 shadow-2xs sm:col-span-2 lg:col-span-1 border-t-2 border-t-blue-600">
          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
            Avg Risk Score
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
              <CountUpNumber value={project.avgRiskScore} durationMs={250} />
            </span>
            <span className="text-[10px] font-mono text-slate-400">/ 100</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Predicted +{project.predictedDelayDays}d delay</span>
        </div>
      </div>

      {/* Main Visual: Large Acquisition Progress Visualization */}
      <div className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
              <span>Statutory Acquisition Progress Breakdown</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              Cumulative progress against project baseline statutory targets
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-sm font-bold text-slate-900 tabular-nums">
              {project.acquiredParcels} / {project.totalParcels}
            </span>
            <span className="text-[10px] text-slate-500 block uppercase">Parcels Cleared</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full h-4 bg-slate-100 rounded-xs overflow-hidden flex border border-slate-200/80 p-0.5">
            <div
              className="h-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${project.progressPercent}%` }}
              title={`Possession Completed: ${project.progressPercent}%`}
            />
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{
                width: `${Math.round((project.mediumRiskParcels / project.totalParcels) * 100)}%`,
              }}
              title="Medium Risk in pipeline"
            />
            <div
              className="h-full bg-rose-600 transition-all duration-500"
              style={{
                width: `${Math.round((project.highRiskParcels / project.totalParcels) * 100)}%`,
              }}
              title="High Risk bottlenecks"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-xs bg-emerald-600" />
              <span>
                Acquired / Handed Over: <strong>{project.acquiredParcels}</strong> ({project.progressPercent}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-xs bg-amber-500" />
              <span>
                Medium Risk: <strong>{project.mediumRiskParcels}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-xs bg-rose-600" />
              <span>
                Critical Bottlenecks: <strong>{project.highRiskParcels}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Risk Distribution & Acquisition Stage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Risk Distribution */}
        <div className="lg:col-span-5 bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
              Risk Distribution
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              Classification of active pending parcels
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Low */}
            <div className="p-2.5 bg-emerald-50/50 rounded-xs border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-900 font-mono">Low Risk</span>
                <p className="text-[10px] text-slate-500 font-mono">Statutory timelines intact</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-base font-bold text-emerald-800 tabular-nums">
                  {project.lowRiskParcels}
                </span>
                <span className="text-[10px] text-slate-400 block uppercase">parcels</span>
              </div>
            </div>

            {/* Medium */}
            <div className="p-2.5 bg-amber-50/50 rounded-xs border border-amber-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-900 font-mono">Medium Risk</span>
                <p className="text-[10px] text-slate-500 font-mono">Stage variance 10-30 days</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-base font-bold text-amber-800 tabular-nums">
                  {project.mediumRiskParcels}
                </span>
                <span className="text-[10px] text-slate-400 block uppercase">parcels</span>
              </div>
            </div>

            {/* High */}
            <div className="p-2.5 bg-rose-50/50 rounded-xs border border-rose-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-900 font-mono">High Risk</span>
                <p className="text-[10px] text-slate-500 font-mono">Disputes or procedural stall</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-base font-bold text-rose-800 tabular-nums">
                  {project.highRiskParcels}
                </span>
                <span className="text-[10px] text-slate-400 block uppercase">parcels</span>
              </div>
            </div>
          </div>
        </div>

        {/* STAGE BREAKDOWN */}
        <div className="lg:col-span-7 bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
              STAGE BREAKDOWN
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              Parcels, at-risk cases, and predicted delay probability by acquisition stage
            </p>
          </div>

          <div className="space-y-2.5">
            {stages.map((stage) => {
              const count = project.stageBreakdown[stage] || 0;
              const stageParcels = projectParcels.filter((p) => p.stage === stage);
              const atRisk = stageParcels.filter((p) => p.riskLevel === 'High').length;
              const stageDelayProb =
                stage === 'Compensation'
                  ? 78
                  : stage === 'Valuation'
                  ? 56
                  : stage === 'Survey'
                  ? 38
                  : stage === 'Notification'
                  ? 22
                  : 12;

              return (
                <div key={stage} className="p-2.5 rounded-xs bg-slate-50 border border-slate-200 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-sans text-xs">{stage}</span>
                    <span className="text-[11px] text-slate-500">
                      Stage Delay Probability: <strong className="text-rose-700 font-bold">{stageDelayProb}%</strong>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                    <span>Total Parcels: <strong className="text-slate-900">{count}</strong></span>
                    <span>
                      At-Risk Parcels:{' '}
                      <strong className={atRisk > 0 ? 'text-rose-700 font-bold' : 'text-slate-700 font-semibold'}>
                        {atRisk}
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PRIORITY PARCELS Table */}
      <div className="bg-white rounded-xs border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
              <span>PRIORITY PARCELS</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
              Highest-risk parcels in this corridor requiring administrative intervention and clearance
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded-xs border border-slate-200">
            {priorityParcels.length} TRACKED RECORDS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] font-mono tracking-wider sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3.5 border-r-2 border-slate-200 sticky left-0 bg-slate-100 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                  Parcel ID
                </th>
                <th className="py-2.5 px-3.5 border-r border-slate-200">Stage</th>
                <th className="py-2.5 px-3.5 text-center border-r border-slate-200">Risk</th>
                <th className="py-2.5 px-3.5 text-right border-r border-slate-200">Predicted Delay</th>
                <th className="py-2.5 px-3.5 min-w-[240px] border-r border-slate-200">Top Issue</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {priorityParcels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No detailed parcels loaded for this project in demo dataset.
                  </td>
                </tr>
              ) : (
                priorityParcels.map((parcel) => (
                  <tr
                    key={parcel.id}
                    onClick={() => onSelectParcel(parcel.id)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3.5 font-bold text-slate-900 group-hover:text-blue-600 border-r-2 border-slate-200 sticky left-0 bg-white group-hover:bg-blue-50/95 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                      {parcel.id}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Gat/Khasra: {parcel.khasraNo}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800 border-r border-slate-100">
                      {parcel.stage}
                    </td>
                    <td className="py-2.5 px-3.5 text-center border-r border-slate-100">
                      <div className="flex flex-col items-center">
                        <span className="font-mono font-bold text-slate-800 tabular-nums">
                          {parcel.riskScore}/100
                        </span>
                        <RiskBadge level={parcel.riskLevel} size="sm" showDot={false} />
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-slate-900 border-r border-slate-100 tabular-nums">
                      <span
                        className={
                          parcel.predictedDelayDays >= 35
                            ? 'text-rose-600'
                            : parcel.predictedDelayDays >= 20
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }
                      >
                        +{parcel.predictedDelayDays}d
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 font-sans border-r border-slate-100 text-xs">
                      <span className="line-clamp-1">{parcel.primaryRiskFactor}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectParcel(parcel.id);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded-xs transition-colors cursor-pointer"
                      >
                        <span>Inspect Parcel</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
