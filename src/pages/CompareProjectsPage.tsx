import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRightLeft,
  Layers,
  TrendingUp,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Download,
  Info,
} from 'lucide-react';
import { Project, LandParcel, AcquisitionStage } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { exportToCsv } from '../utils/csvExport';

interface CompareProjectsPageProps {
  projects: Project[];
  parcels?: LandParcel[];
  initialProjectAId?: string;
  initialProjectBId?: string;
  onBack: () => void;
  onSelectProject: (projectId: string) => void;
  onSelectParcel?: (parcelId: string) => void;
}

export const CompareProjectsPage: React.FC<CompareProjectsPageProps> = ({
  projects,
  parcels = [],
  initialProjectAId,
  initialProjectBId,
  onBack,
  onSelectProject,
  onSelectParcel,
}) => {
  // Default to first two projects if not specified
  const [projectAId, setProjectAId] = useState<string>(
    initialProjectAId || projects[0]?.id || ''
  );
  const [projectBId, setProjectBId] = useState<string>(
    initialProjectBId || (projects[1]?.id ? projects[1].id : projects[0]?.id || '')
  );

  const projectA = projects.find((p) => p.id === projectAId) || projects[0];
  const projectB = projects.find((p) => p.id === projectBId) || projects[1] || projects[0];

  // Swap Left & Right projects
  const handleSwap = () => {
    const temp = projectAId;
    setProjectAId(projectBId);
    setProjectBId(temp);
  };

  // Get parcels associated with each project
  const parcelsA = parcels.filter((p) => p.projectId === projectA.id);
  const parcelsB = parcels.filter((p) => p.projectId === projectB.id);

  const highRiskParcelsA = parcelsA.filter((p) => p.riskLevel === 'High').slice(0, 4);
  const highRiskParcelsB = parcelsB.filter((p) => p.riskLevel === 'High').slice(0, 4);

  // Stages
  const stages: { stage: AcquisitionStage; label: string; statutoryRef: string }[] = [
    { stage: 'Notification', label: 'Sec 3A Preliminary', statutoryRef: '3A' },
    { stage: 'Survey', label: 'Cadastral & Drone Survey', statutoryRef: '3A(2)' },
    { stage: 'Valuation', label: 'Sec 3G Award Valuation', statutoryRef: '3G' },
    { stage: 'Compensation', label: 'Sec 3H Account Credit', statutoryRef: '3H' },
    { stage: 'Possession', label: 'Sec 3E ROW Handover', statutoryRef: '3E' },
  ];

  // Calculate deltas
  const riskDelta = projectA.avgRiskScore - projectB.avgRiskScore;
  const delayDelta = projectA.predictedDelayDays - projectB.predictedDelayDays;
  const progressDelta = projectA.progressPercent - projectB.progressPercent;

  // Export comparison to CSV
  const handleExportComparison = () => {
    const comparisonRows = [
      {
        metric: 'Project Code',
        projectA: projectA.code,
        projectB: projectB.code,
      },
      {
        metric: 'Project Name',
        projectA: projectA.name,
        projectB: projectB.name,
      },
      {
        metric: 'Implementing Agency',
        projectA: projectA.implementingAgency,
        projectB: projectB.implementingAgency,
      },
      {
        metric: 'Location (District, State)',
        projectA: `${projectA.district}, ${projectA.state}`,
        projectB: `${projectB.district}, ${projectB.state}`,
      },
      {
        metric: 'Total Surveyed Parcels',
        projectA: projectA.totalParcels,
        projectB: projectB.totalParcels,
      },
      {
        metric: 'Acquired Parcels',
        projectA: projectA.acquiredParcels,
        projectB: projectB.acquiredParcels,
      },
      {
        metric: 'Pending Parcels',
        projectA: projectA.pendingParcels,
        projectB: projectB.pendingParcels,
      },
      {
        metric: 'Acquisition Progress (%)',
        projectA: `${projectA.progressPercent}%`,
        projectB: `${projectB.progressPercent}%`,
      },
      {
        metric: 'Average Risk Score (0-100)',
        projectA: projectA.avgRiskScore,
        projectB: projectB.avgRiskScore,
      },
      {
        metric: 'Predicted Statutory Delay (Days)',
        projectA: `+${projectA.predictedDelayDays}d`,
        projectB: `+${projectB.predictedDelayDays}d`,
      },
      {
        metric: 'Operational Status',
        projectA: projectA.status,
        projectB: projectB.status,
      },
      {
        metric: 'Target Completion Date',
        projectA: projectA.targetCompletion,
        projectB: projectB.targetCompletion,
      },
    ];

    exportToCsv(
      comparisonRows,
      [
        { header: 'Metric', accessor: 'metric' },
        { header: `${projectA.code} - ${projectA.name}`, accessor: 'projectA' },
        { header: `${projectB.code} - ${projectB.name}`, accessor: 'projectB' },
      ],
      `landguard_ai_compare_${projectA.code}_vs_${projectB.code}`
    );
  };

  return (
    <div id="screen-compare-projects" className="p-5 space-y-5 max-w-7xl mx-auto font-sans">
      {/* Top Header & Project Selection Bar */}
      <div className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-mono font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK TO PROJECTS
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Dual-Project Comparison
                </h2>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-xs font-bold">
                  SIDE_BY_SIDE_EVALUATION
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Contrast statutory risk exposure, milestone latency, and cadastral clearance metrics across projects.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportComparison}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs font-mono text-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Comparison CSV
            </button>
          </div>
        </div>

        {/* Project Selector Dual Bar */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          {/* Project A Selector */}
          <div className="md:col-span-5 bg-blue-50/50 border border-blue-200 rounded-xs p-3">
            <label className="text-[10px] font-mono font-bold text-blue-800 uppercase block mb-1">
              PRIMARY PROJECT (A)
            </label>
            <select
              value={projectAId}
              onChange={(e) => setProjectAId(e.target.value)}
              className="w-full text-xs font-mono bg-white border border-blue-300 rounded px-2.5 py-2 font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer shadow-2xs"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === projectBId}>
                  [{p.code}] {p.name} ({p.state})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-colors cursor-pointer shadow-2xs"
              title="Swap Left and Right projects"
            >
              <ArrowRightLeft className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          {/* Project B Selector */}
          <div className="md:col-span-5 bg-indigo-50/50 border border-indigo-200 rounded-xs p-3">
            <label className="text-[10px] font-mono font-bold text-indigo-800 uppercase block mb-1">
              BENCHMARK PROJECT (B)
            </label>
            <select
              value={projectBId}
              onChange={(e) => setProjectBId(e.target.value)}
              className="w-full text-xs font-mono bg-white border border-indigo-300 rounded px-2.5 py-2 font-bold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer shadow-2xs"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === projectAId}>
                  [{p.code}] {p.name} ({p.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Delta Diagnostic Summary Strip */}
        <div className="bg-slate-50 rounded-xs border border-slate-200 p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold">VARIANCE DELTAS:</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-xs border font-bold ${
                riskDelta > 0
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : riskDelta < 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Risk Diff: {riskDelta > 0 ? `+${riskDelta}` : riskDelta} pts (
              {riskDelta > 0 ? `${projectA.code} riskier` : `${projectB.code} riskier`})
            </span>

            <span
              className={`text-[11px] px-2 py-0.5 rounded-xs border font-bold ${
                delayDelta > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : delayDelta < 0
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Delay Delta: {delayDelta > 0 ? `+${delayDelta}d` : `${delayDelta}d`}
            </span>

            <span
              className={`text-[11px] px-2 py-0.5 rounded-xs border font-bold ${
                progressDelta > 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Progress Spread: {progressDelta > 0 ? `+${progressDelta}%` : `${progressDelta}%`}
            </span>
          </div>

          <span className="text-[10px] text-slate-400">
            AUDIT_REFERENCE: NHAI/RFCTLARR 2013 COMPARATIVE
          </span>
        </div>
      </div>

      {/* Dual Column Side-by-Side Comparison Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ================= COLUMN A ================= */}
        <div className="space-y-4">
          {/* Card Header */}
          <div className="bg-white rounded-xs border-2 border-blue-300 p-4 shadow-2xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white font-mono text-[10px] font-bold px-3 py-0.5 rounded-bl-xs">
              PROJECT A
            </div>

            <div>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-xs border border-blue-200">
                {projectA.code}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1.5">{projectA.name}</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">{projectA.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Agency</span>
                <span className="font-bold text-slate-800">{projectA.implementingAgency}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Location</span>
                <span className="font-bold text-slate-800">
                  {projectA.district}, {projectA.state}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Target Date</span>
                <span className="font-bold text-slate-800">{projectA.targetCompletion}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <StatusBadge status={projectA.status} size="sm" />
              <button
                type="button"
                onClick={() => onSelectProject(projectA.id)}
                className="text-xs font-mono text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold hover:underline cursor-pointer"
              >
                Inspect Project Intelligence <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Primary Metrics Card A */}
          <div className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Statutory Risk & Delay Metrics
            </h4>

            <div className="grid grid-cols-3 gap-2.5 font-mono">
              <div className="bg-slate-50 border border-slate-200 rounded-xs p-3 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Risk Score</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {projectA.avgRiskScore}/100
                </span>
                <div className="mt-1 flex justify-center">
                  <RiskBadge level={projectA.overallRisk} size="sm" />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xs p-3 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Projected Delay</span>
                <span
                  className={`text-xl font-bold tabular-nums ${
                    projectA.predictedDelayDays > 40
                      ? 'text-rose-600'
                      : projectA.predictedDelayDays > 20
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  +{projectA.predictedDelayDays}d
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Calendar Days</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xs p-3 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">High-Risk Share</span>
                <span className="text-xl font-bold text-rose-600 tabular-nums">
                  {projectA.highRiskParcels}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  of {projectA.totalParcels} parcels
                </span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 font-medium">Acquisition Clearance Progress:</span>
                <span className="font-bold text-slate-900">{projectA.progressPercent}%</span>
              </div>
              <ProgressBar
                value={projectA.progressPercent}
                size="md"
                color={
                  projectA.progressPercent >= 75
                    ? 'emerald'
                    : projectA.progressPercent >= 60
                    ? 'blue'
                    : 'amber'
                }
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                <span>{projectA.acquiredParcels} Acquired</span>
                <span>{projectA.pendingParcels} Pending Clearance</span>
                <span>{projectA.totalParcels} Total</span>
              </div>
            </div>
          </div>

          {/* Statutory Stage Breakdown Card A */}
          <div className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Statutory Stage Distribution
            </h4>

            <div className="space-y-2 font-mono text-xs">
              {stages.map((st) => {
                const count = projectA.stageBreakdown[st.stage] || 0;
                const pct = Math.round((count / projectA.totalParcels) * 100);
                return (
                  <div key={st.stage} className="bg-slate-50 p-2 rounded-xs border border-slate-200/80">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-800">{st.label}</span>
                      <span className="font-bold text-slate-900">
                        {count} parcels <span className="text-slate-500 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-xs overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-xs"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* High Risk Parcels Card A */}
          <div className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Critical Priority Parcels
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {parcelsA.length} TOTAL IN PROJECT
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {highRiskParcelsA.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-mono">
                  No high-risk parcels flagged in this project.
                </div>
              ) : (
                highRiskParcelsA.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectParcel(p.id)}
                    className="p-2.5 rounded-xs border border-rose-200 bg-rose-50/40 hover:bg-rose-50 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{p.id}</span>
                        <span className="text-[10px] text-slate-500 font-normal">Gat {p.khasraNo}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 font-sans mt-0.5 truncate max-w-[260px]">
                        {p.primaryRiskFactor}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-700">+{p.predictedDelayDays}d</span>
                      <span className="text-[10px] text-slate-500 block font-normal">{p.stage}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ================= COLUMN B ================= */}
        <div className="space-y-4">
          {/* Card Header B */}
          <div className="bg-white rounded-xs border-2 border-indigo-300 p-4 shadow-2xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white font-mono text-[10px] font-bold px-3 py-0.5 rounded-bl-xs">
              PROJECT B
            </div>

            <div>
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-xs border border-indigo-200">
                {projectB.code}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1.5">{projectB.name}</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">{projectB.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Agency</span>
                <span className="font-bold text-slate-800">{projectB.implementingAgency}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Location</span>
                <span className="font-bold text-slate-800">
                  {projectB.district}, {projectB.state}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Target Date</span>
                <span className="font-bold text-slate-800">{projectB.targetCompletion}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <StatusBadge status={projectB.status} size="sm" />
              <button
                type="button"
                onClick={() => onSelectProject(projectB.id)}
                className="text-xs font-mono text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold hover:underline cursor-pointer"
              >
                Inspect Project Intelligence <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Primary Metrics Card B */}
          <div className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              Statutory Risk & Delay Metrics
            </h4>

            <div className="grid grid-cols-3 gap-2.5 font-mono">
              <div className="bg-slate-50 border border-slate-200 rounded-xs p-3 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Risk Score</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {projectB.avgRiskScore}/100
                </span>
                <div className="mt-1 flex justify-center">
                  <RiskBadge level={projectB.overallRisk} size="sm" />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xs p-3 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Projected Delay</span>
                <span
                  className={`text-xl font-bold tabular-nums ${
                    projectB.predictedDelayDays > 40
                      ? 'text-rose-600'
                      : projectB.predictedDelayDays > 20
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  +{projectB.predictedDelayDays}d
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Calendar Days</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xs p-3 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">High-Risk Share</span>
                <span className="text-xl font-bold text-rose-600 tabular-nums">
                  {projectB.highRiskParcels}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  of {projectB.totalParcels} parcels
                </span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 font-medium">Acquisition Clearance Progress:</span>
                <span className="font-bold text-slate-900">{projectB.progressPercent}%</span>
              </div>
              <ProgressBar
                value={projectB.progressPercent}
                size="md"
                color={
                  projectB.progressPercent >= 75
                    ? 'emerald'
                    : projectB.progressPercent >= 60
                    ? 'blue'
                    : 'amber'
                }
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                <span>{projectB.acquiredParcels} Acquired</span>
                <span>{projectB.pendingParcels} Pending Clearance</span>
                <span>{projectB.totalParcels} Total</span>
              </div>
            </div>
          </div>

          {/* Statutory Stage Breakdown Card B */}
          <div className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Statutory Stage Distribution
            </h4>

            <div className="space-y-2 font-mono text-xs">
              {stages.map((st) => {
                const count = projectB.stageBreakdown[st.stage] || 0;
                const pct = Math.round((count / projectB.totalParcels) * 100);
                return (
                  <div key={st.stage} className="bg-slate-50 p-2 rounded-xs border border-slate-200/80">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-800">{st.label}</span>
                      <span className="font-bold text-slate-900">
                        {count} parcels <span className="text-slate-500 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-xs overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-xs"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* High Risk Parcels Card B */}
          <div className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Critical Priority Parcels
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {parcelsB.length} TOTAL IN PROJECT
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {highRiskParcelsB.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-mono">
                  No high-risk parcels flagged in this project.
                </div>
              ) : (
                highRiskParcelsB.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectParcel(p.id)}
                    className="p-2.5 rounded-xs border border-rose-200 bg-rose-50/40 hover:bg-rose-50 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{p.id}</span>
                        <span className="text-[10px] text-slate-500 font-normal">Gat {p.khasraNo}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 font-sans mt-0.5 truncate max-w-[260px]">
                        {p.primaryRiskFactor}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-700">+{p.predictedDelayDays}d</span>
                      <span className="text-[10px] text-slate-500 block font-normal">{p.stage}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decision Guidance Footer */}
      <div className="p-3.5 bg-slate-50 rounded-xs border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 font-mono text-[11px]">
        <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 uppercase">Statutory Variance Assessment: </strong>
          Project <strong className="text-slate-900">{riskDelta > 0 ? projectA.code : projectB.code}</strong> exhibits
          a higher propensity for dwell time expansion in Section 3G/3H milestones. Prioritize CALA district
          hearings and circle rate re-evaluations to compress predicted delay schedules.
        </p>
      </div>
    </div>
  );
};
