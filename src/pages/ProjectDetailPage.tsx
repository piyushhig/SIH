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
import { ScrollReveal } from '../components/common/ScrollReveal';

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
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-300 hover:text-white bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> [ ESC ] BACK TO PROJECTS
        </button>

        <span className="text-[11px] text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-800 font-mono shadow-xs font-semibold">
          PROJECT INTELLIGENCE
        </span>
      </div>

      {/* Header Card: PROJECT SUMMARY */}
      <ScrollReveal delayMs={0}>
        <div className="bg-slate-900/90 rounded-lg border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="border-b border-slate-800/80 pb-2 flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            PROJECT SUMMARY
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            ID: {project.code}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold bg-slate-950 text-blue-400 px-2 py-0.5 rounded border border-slate-800">
                {project.code}
              </span>
              <span className="text-xs font-mono bg-blue-950/60 text-blue-300 px-2 py-0.5 rounded border border-blue-800/70 font-medium">
                {project.type}
              </span>
              <StatusBadge status={project.status} size="sm" />
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight font-sans">
              {project.name}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono text-[11px] bg-slate-950/70 p-3 rounded border border-slate-800/80">
              <div>
                <span className="text-slate-500 uppercase block text-[10px]">Corridor Type</span>
                <strong className="text-slate-200 font-sans text-xs">{project.type}</strong>
              </div>
              <div>
                <span className="text-slate-500 uppercase block text-[10px]">Total Parcels</span>
                <strong className="text-slate-200 font-mono text-xs tabular-nums">{project.totalParcels}</strong>
              </div>
              <div>
                <span className="text-slate-500 uppercase block text-[10px]">Target Completion</span>
                <strong className="text-slate-200 font-sans text-xs">{project.targetCompletion}</strong>
              </div>
              <div>
                <span className="text-slate-500 uppercase block text-[10px]">Agency & District</span>
                <strong className="text-slate-200 font-sans text-xs truncate block">{project.implementingAgency} ({project.district})</strong>
              </div>
            </div>
          </div>

          {/* Prominent Risk & Delay Box */}
          <div className="w-full lg:w-72 bg-rose-950/30 rounded-lg border border-rose-800/70 p-4 font-mono space-y-2 flex-shrink-0">
            <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block">
              PROJECT DELAY RISK
            </span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Project Risk</span>
                <span className={`text-base font-extrabold uppercase ${project.overallRisk === 'High' ? 'text-rose-400' : project.overallRisk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {project.overallRisk} RISK
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Estimated Project Delay</span>
                <span className="text-base font-extrabold text-rose-400 tabular-nums">
                  +{project.predictedDelayDays} days
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-rose-900/60 flex items-center justify-between text-[11px] text-slate-300">
              <span>Acquisition Clearance:</span>
              <strong className="text-white">{project.progressPercent}%</strong>
            </div>
          </div>
        </div>

        {/* 4-Step Executive Hierarchy: RISK -> WHY -> PREDICTED DELAY -> WHAT TO DO */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            {/* 1. RISK */}
            <div className="p-3 bg-rose-950/20 rounded-lg border border-rose-900/50">
              <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                1. RISK
              </span>
              <div className="flex items-center gap-2 mt-1">
                <RiskBadge level={project.overallRisk} size="sm" />
                <span className="text-xs font-bold text-white font-mono">
                  {project.avgRiskScore}/100
                </span>
              </div>
              <span className="text-[10px] text-rose-300/80 font-mono block mt-1">
                {project.highRiskParcels} high-risk parcels ({Math.round((project.highRiskParcels / project.totalParcels) * 100)}%)
              </span>
            </div>

            {/* 2. WHY */}
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                2. WHY AT RISK
              </span>
              <p className="text-xs font-medium text-slate-200 leading-snug mt-1">
                {project.overallRisk === 'High'
                  ? 'Compensation apportionment disputes & pending revenue court mutations across villages'
                  : project.overallRisk === 'Medium'
                  ? 'Joint measurement survey discrepancies & slow treasury disbursement'
                  : 'Statutory notices proceeding on schedule with minimal dispute resistance'}
              </p>
            </div>

            {/* 3. PREDICTED DELAY */}
            <div className="p-3 bg-amber-950/20 rounded-lg border border-amber-900/50">
              <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                3. PREDICTED DELAY
              </span>
              <span className="text-xs font-bold font-mono text-amber-300 block mt-1">
                +{project.predictedDelayDays} Days Beyond Schedule
              </span>
              <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                Target: {project.targetCompletion}
              </span>
            </div>

            {/* 4. WHAT TO DO */}
            <div className="p-3 bg-blue-950/20 rounded-lg border border-blue-900/50">
              <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
                4. WHAT TO DO
              </span>
              <p className="text-xs font-medium text-slate-200 leading-snug mt-1">
                {project.overallRisk === 'High'
                  ? 'Convene District Collector compensation camp and expedite Lok Adalat dispute settlement'
                  : project.overallRisk === 'Medium'
                  ? 'Direct SLAO to conduct joint re-survey and expedite award declarations'
                  : 'Maintain standard periodic fortnightly revenue monitoring'}
              </p>
            </div>
          </div>
        </div>
      </div>
      </ScrollReveal>

      {/* Top Summary Cards (5 Cards) */}
      <ScrollReveal delayMs={60}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Total Parcels */}
          <div className="bg-slate-900/90 rounded-lg border border-slate-800 p-3.5 shadow-md border-t-2 border-t-slate-500">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Total Parcels
          </span>
          <p className="text-xl font-bold font-mono text-white mt-0.5 tabular-nums">
            <CountUpNumber value={project.totalParcels} durationMs={250} />
          </p>
          <span className="text-[10px] font-mono text-slate-500">Total earmarked stretch</span>
        </div>

        {/* Acquired */}
        <div className="bg-slate-900/80 rounded-lg border border-slate-800 p-3.5 shadow-md border-t-2 border-t-emerald-500">
          <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
            Acquired
          </span>
          <p className="text-xl font-bold font-mono text-emerald-300 mt-0.5 tabular-nums">
            <CountUpNumber value={project.acquiredParcels} durationMs={250} />
          </p>
          <span className="text-[10px] font-mono text-slate-500">Possession handed over</span>
        </div>

        {/* Pending */}
        <div className="bg-slate-900/80 rounded-lg border border-slate-800 p-3.5 shadow-md border-t-2 border-t-amber-500">
          <span className="text-[10px] font-mono font-semibold text-amber-400 uppercase tracking-wider">
            Pending
          </span>
          <p className="text-xl font-bold font-mono text-amber-300 mt-0.5 tabular-nums">
            <CountUpNumber value={project.pendingParcels} durationMs={250} />
          </p>
          <span className="text-[10px] font-mono text-slate-500">In various stages</span>
        </div>

        {/* High Risk */}
        <div className="bg-slate-900/80 rounded-lg border border-slate-800 p-3.5 shadow-md border-t-2 border-t-rose-500">
          <span className="text-[10px] font-mono font-semibold text-rose-400 uppercase tracking-wider">
            High Risk
          </span>
          <p className="text-xl font-bold font-mono text-rose-300 mt-0.5 tabular-nums">
            <CountUpNumber value={project.highRiskParcels} durationMs={250} />
          </p>
          <span className="text-[10px] font-mono text-rose-400 font-medium">Delay likely &gt; 30d</span>
        </div>

        {/* Average Risk Score */}
        <div className="bg-slate-900/90 rounded-lg border border-slate-800 p-3.5 shadow-md sm:col-span-2 lg:col-span-1 border-t-2 border-t-blue-500">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Avg Risk Score
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              <CountUpNumber value={project.avgRiskScore} durationMs={250} />
            </span>
            <span className="text-[10px] font-mono text-slate-500">/ 100</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Predicted +{project.predictedDelayDays}d delay</span>
        </div>
      </div>
      </ScrollReveal>

      {/* Main Visual: Large Acquisition Progress Visualization */}
      <ScrollReveal delayMs={120}>
        <div className="bg-slate-900/90 rounded-lg border border-slate-800 p-4 shadow-md space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div>
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <span>Statutory Acquisition Progress Breakdown</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Cumulative progress against project baseline statutory targets
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-sm font-bold text-white tabular-nums">
              {project.acquiredParcels} / {project.totalParcels}
            </span>
            <span className="text-[10px] text-slate-400 block uppercase">Parcels Cleared</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full h-4 bg-slate-950 rounded overflow-hidden flex border border-slate-800 p-0.5">
            <div
              className="h-full bg-emerald-600 transition-all duration-500 rounded-l"
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
              className="h-full bg-rose-600 transition-all duration-500 rounded-r"
              style={{
                width: `${Math.round((project.highRiskParcels / project.totalParcels) * 100)}%`,
              }}
              title="High Risk bottlenecks"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 pt-1 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded bg-emerald-500" />
              <span>
                Acquired / Handed Over: <strong className="text-white">{project.acquiredParcels}</strong> ({project.progressPercent}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded bg-amber-500" />
              <span>
                Medium Risk: <strong className="text-white">{project.mediumRiskParcels}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded bg-rose-500" />
              <span>
                Critical Bottlenecks: <strong className="text-white">{project.highRiskParcels}</strong>
              </span>
            </div>
          </div>
        </div>
        </div>
      </ScrollReveal>

      {/* Two Columns: Risk Distribution & Acquisition Stage Breakdown */}
      <ScrollReveal delayMs={180}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Risk Distribution */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-lg border border-slate-800 p-4 shadow-md space-y-3">
          <div className="border-b border-slate-800/80 pb-2.5">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Risk Distribution
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Classification of active pending parcels
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Low */}
            <div className="p-2.5 bg-emerald-950/20 rounded border border-emerald-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 font-mono">Low Risk</span>
                <p className="text-[10px] text-slate-400 font-mono">Statutory timelines intact</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-base font-bold text-emerald-300 tabular-nums">
                  {project.lowRiskParcels}
                </span>
                <span className="text-[10px] text-slate-500 block uppercase">parcels</span>
              </div>
            </div>

            {/* Medium */}
            <div className="p-2.5 bg-amber-950/20 rounded border border-amber-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-400 font-mono">Medium Risk</span>
                <p className="text-[10px] text-slate-400 font-mono">Stage variance 10-30 days</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-base font-bold text-amber-300 tabular-nums">
                  {project.mediumRiskParcels}
                </span>
                <span className="text-[10px] text-slate-500 block uppercase">parcels</span>
              </div>
            </div>

            {/* High */}
            <div className="p-2.5 bg-rose-950/20 rounded border border-rose-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-400 font-mono">High Risk</span>
                <p className="text-[10px] text-slate-400 font-mono">Disputes or procedural stall</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-base font-bold text-rose-300 tabular-nums">
                  {project.highRiskParcels}
                </span>
                <span className="text-[10px] text-slate-500 block uppercase">parcels</span>
              </div>
            </div>
          </div>
        </div>

        {/* STAGE BREAKDOWN */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-lg border border-slate-800 p-4 shadow-md space-y-3">
          <div className="border-b border-slate-800/80 pb-2.5">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              STAGE BREAKDOWN
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
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
                <div key={stage} className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 font-sans text-xs">{stage}</span>
                    <span className="text-[11px] text-slate-400">
                      Stage Delay Probability: <strong className="text-rose-400 font-bold">{stageDelayProb}%</strong>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/70">
                    <span>Total Parcels: <strong className="text-slate-200">{count}</strong></span>
                    <span>
                      At-Risk Parcels:{' '}
                      <strong className={atRisk > 0 ? 'text-rose-400 font-bold' : 'text-slate-300 font-semibold'}>
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
      </ScrollReveal>

      {/* PRIORITY PARCELS Table */}
      <ScrollReveal delayMs={240}>
        <div className="bg-slate-900/90 rounded-lg border border-slate-800 shadow-md overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <span>PRIORITY PARCELS</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
              Highest-risk parcels in this corridor requiring administrative intervention and clearance
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {priorityParcels.length} TRACKED RECORDS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950/90 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] font-mono tracking-wider sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3.5 border-r border-slate-800 sticky left-0 bg-slate-950 z-20">
                  Parcel ID
                </th>
                <th className="py-2.5 px-3.5 border-r border-slate-800">Stage</th>
                <th className="py-2.5 px-3.5 text-center border-r border-slate-800">Risk</th>
                <th className="py-2.5 px-3.5 text-right border-r border-slate-800">Predicted Delay</th>
                <th className="py-2.5 px-3.5 min-w-[240px] border-r border-slate-800">Top Issue</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {priorityParcels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No detailed parcels loaded for this project in demo dataset.
                  </td>
                </tr>
              ) : (
                priorityParcels.map((parcel) => (
                  <tr
                    key={parcel.id}
                    onClick={() => onSelectParcel(parcel.id)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3.5 font-bold text-white group-hover:text-blue-400 border-r border-slate-800 sticky left-0 bg-slate-900 group-hover:bg-slate-800 z-10">
                      {parcel.id}
                      <span className="text-[10px] text-slate-500 block font-normal">
                        Gat/Khasra: {parcel.khasraNo}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 font-medium text-slate-300 border-r border-slate-800/70">
                      {parcel.stage}
                    </td>
                    <td className="py-2.5 px-3.5 text-center border-r border-slate-800/70">
                      <div className="flex flex-col items-center">
                        <span className="font-mono font-bold text-slate-200 tabular-nums">
                          {parcel.riskScore}/100
                        </span>
                        <RiskBadge level={parcel.riskLevel} size="sm" showDot={false} />
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-slate-200 border-r border-slate-800/70 tabular-nums">
                      <span
                        className={
                          parcel.predictedDelayDays >= 35
                            ? 'text-rose-400'
                            : parcel.predictedDelayDays >= 20
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        +{parcel.predictedDelayDays}d
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-sans border-r border-slate-800/70 text-xs">
                      <span className="line-clamp-1">{parcel.primaryRiskFactor}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectParcel(parcel.id);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800/80 px-2.5 py-1 rounded transition-colors cursor-pointer"
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
      </ScrollReveal>
    </div>
  );
};
