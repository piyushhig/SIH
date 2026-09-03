import React from 'react';
import {
  FolderKanban,
  MapPin,
  AlertOctagon,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Project, LandParcel } from '../types';
import { MOCK_EARLY_WARNINGS } from '../data/mockData';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { CountUpNumber } from '../components/common/CountUpNumber';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { LineTrendChart } from '../components/charts/LineTrendChart';
import { GISRiskHotspots } from '../components/gis/GISRiskHotspots';

interface OverviewPageProps {
  projects: Project[];
  parcels: LandParcel[];
  onSelectProject: (projectId: string) => void;
  onSelectParcel: (parcelId: string) => void;
  onNavigateToProjects: () => void;
  onNavigateToParcels: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  projects,
  parcels,
  onSelectProject,
  onSelectParcel,
  onNavigateToProjects,
  onNavigateToParcels,
}) => {
  // Centralized Aggregate Metrics derived strictly from current dataset
  const totalActiveProjects = projects.length;
  const totalParcelsCount = parcels.length;
  const acquiredParcelsCount = parcels.filter(
    (p) => p.status === 'Acquired' || p.stage === 'Possession'
  ).length;
  const pendingParcelsCount = parcels.filter(
    (p) => p.status !== 'Acquired' && p.stage !== 'Possession'
  ).length;
  const highRiskParcelsCount = parcels.filter((p) => p.riskLevel === 'High').length;
  const mediumRiskParcelsCount = parcels.filter((p) => p.riskLevel === 'Medium').length;
  const lowRiskParcelsCount = parcels.filter((p) => p.riskLevel === 'Low').length;
  const avgPredictedDelay =
    totalActiveProjects > 0
      ? (projects.reduce((acc, p) => acc + p.predictedDelayDays, 0) / totalActiveProjects).toFixed(1)
      : '0.0';
  const clearancePct = totalParcelsCount > 0 ? Math.round((acquiredParcelsCount / totalParcelsCount) * 100) : 68;
  const highRiskPct = totalParcelsCount > 0 ? ((highRiskParcelsCount / totalParcelsCount) * 100).toFixed(1) : '11.5';

  // High priority intervention cases: sorted by risk score descending
  const priorityCases = [...parcels]
    .filter((p) => p.riskLevel === 'High')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);

  return (
    <div id="screen-overview" className="p-5 space-y-5 max-w-7xl mx-auto font-sans">
      {/* Welcome & Overview Header */}
      <div className="bg-white border border-slate-200 rounded-xs px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xs bg-slate-900 text-blue-400 flex items-center justify-center font-mono text-sm font-bold border border-slate-700 flex-shrink-0">
            LG
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 tracking-tight">
              Land Acquisition Early Warning System
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Forecast delays, identify root causes, and take preventative action across active infrastructure corridors.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-300 font-medium flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Live Corridor Monitoring
          </span>
        </div>
      </div>

      {/* Operational Workflow: INGEST -> PREDICT -> EXPLAIN -> ACT */}
      <div
        id="operational-workflow-strip"
        className="bg-white rounded-xs border border-slate-200 p-3.5 shadow-2xs space-y-2.5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-xs border border-blue-200">
              HOW IT WORKS
            </span>
            <span className="text-xs font-semibold text-slate-700">
              See Risk Early → Understand Why → Act Before Delays Occur
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            4-Step Intelligence Workflow
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs relative">
          {/* 01. INGEST */}
          <div className="p-3 bg-slate-50 rounded-xs border border-slate-200 relative group hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1 font-mono">
              <span className="text-[10px] font-bold uppercase text-slate-700">1. INGEST</span>
              <span className="text-[9px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-xs border border-blue-200 font-semibold">DATA</span>
            </div>
            <span className="font-bold text-slate-900 block text-xs font-sans">Acquisition Records</span>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-snug">
              Connects revenue surveys, notifications, and ownership records.
            </p>
            <div className="hidden lg:flex items-center justify-center absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border border-slate-300 z-10 text-slate-400 text-xs shadow-2xs font-mono">
              →
            </div>
          </div>

          {/* 02. PREDICT */}
          <div className="p-3 bg-slate-50 rounded-xs border border-slate-200 relative group hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1 font-mono">
              <span className="text-[10px] font-bold uppercase text-slate-700">2. PREDICT</span>
              <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-xs border border-amber-200 font-semibold">RISK</span>
            </div>
            <span className="font-bold text-slate-900 block text-xs font-sans">Forecast Delay Risk</span>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-snug">
              Estimates delay probability and days beyond statutory schedules.
            </p>
            <div className="hidden lg:flex items-center justify-center absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border border-slate-300 z-10 text-slate-400 text-xs shadow-2xs font-mono">
              →
            </div>
          </div>

          {/* 03. EXPLAIN */}
          <div className="p-3 bg-slate-50 rounded-xs border border-slate-200 relative group hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1 font-mono">
              <span className="text-[10px] font-bold uppercase text-slate-700">3. EXPLAIN</span>
              <span className="text-[9px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-xs border border-indigo-200 font-semibold">REASONS</span>
            </div>
            <span className="font-bold text-slate-900 block text-xs font-sans">Identify Root Causes</span>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-snug">
              Pinpoints exact reasons—like title disputes or valuation reviews.
            </p>
            <div className="hidden lg:flex items-center justify-center absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border border-slate-300 z-10 text-slate-400 text-xs shadow-2xs font-mono">
              →
            </div>
          </div>

          {/* 04. ACT */}
          <div className="p-3 bg-slate-50 rounded-xs border border-slate-200 group hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1 font-mono">
              <span className="text-[10px] font-bold uppercase text-slate-700">4. ACT</span>
              <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-xs border border-emerald-200 font-semibold">ACTION</span>
            </div>
            <span className="font-bold text-slate-900 block text-xs font-sans">Recommended Steps</span>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-snug">
              Suggests practical solutions before major milestones breach.
            </p>
          </div>
        </div>
      </div>

      {/* Top KPI Cards (5 cards) - Stack vertically on mobile, grid on sm/lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Active Projects */}
        <div
          id="kpi-active-projects"
          className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-colors border-t-2 border-t-blue-600"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600">Active Projects</span>
            <FolderKanban className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              <CountUpNumber value={totalActiveProjects} durationMs={250} />
            </span>
            <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-xs border border-emerald-200">
              Active Corridors
            </span>
          </div>
          <p className="text-[11px] font-sans text-slate-500 mt-2">
            State & national infrastructure
          </p>
        </div>

        {/* 2. Total Parcels */}
        <div
          id="kpi-parcels-acquisition"
          className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-colors border-t-2 border-t-slate-700"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600">Total Parcels Monitored</span>
            <MapPin className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              <CountUpNumber value={totalParcelsCount} durationMs={250} formatWithCommas={true} />
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-xs border border-slate-200">
              {pendingParcelsCount} Pending
            </span>
          </div>
          <p className="text-[11px] font-sans text-slate-500 mt-2">
            <CountUpNumber value={clearancePct} durationMs={250} suffix="%" /> possession cleared
          </p>
        </div>

        {/* 3. High-Risk Parcels */}
        <div
          id="kpi-high-risk-parcels"
          className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-colors border-t-2 border-t-rose-600"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-rose-800">High-Risk Parcels</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-700 tabular-nums">
              <CountUpNumber value={highRiskParcelsCount} durationMs={250} />
            </span>
            <span className="text-[10px] font-mono font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded-xs border border-rose-200">
              <CountUpNumber value={parseFloat(highRiskPct)} decimals={1} durationMs={250} suffix="%" /> of total
            </span>
          </div>
          <p className="text-[11px] font-sans text-slate-500 mt-2">
            Over 60% delay probability
          </p>
        </div>

        {/* 4. Predicted / Mean Delay */}
        <div
          id="kpi-predicted-delays"
          className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-colors border-t-2 border-t-amber-500"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600">Average Projected Delay</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              <CountUpNumber value={parseFloat(avgPredictedDelay)} decimals={1} durationMs={250} />
            </span>
            <span className="text-[11px] font-mono text-slate-600">Days</span>
            <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded-xs border border-amber-200">
              Avg Variance
            </span>
          </div>
          <p className="text-[11px] font-sans text-slate-500 mt-2">
            Average buffer beyond planned schedule
          </p>
        </div>

        {/* 5. Critical Alerts */}
        <div
          id="kpi-critical-alerts"
          className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-colors border-t-2 border-t-rose-500"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-rose-800">High-Priority Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-700 tabular-nums">
              <CountUpNumber value={MOCK_EARLY_WARNINGS.filter((w) => w.severity === 'High').length} durationMs={250} />
            </span>
            <span className="text-[10px] font-mono font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded-xs border border-rose-200">
              Action Req.
            </span>
          </div>
          <p className="text-[11px] font-sans text-slate-500 mt-2">
            Parcels needing immediate intervention
          </p>
        </div>
      </div>

      {/* Main Section: Acquisition Risk Overview (LEFT) and Priority Intervention Queue (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: Acquisition Risk Overview */}
        <div
          id="acquisition-risk-overview"
          className="lg:col-span-5 bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3.5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h2 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <span>Risk Overview</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                "How much acquisition is currently at risk?"
              </p>
            </div>
            <button
              onClick={onNavigateToParcels}
              className="text-xs font-mono font-medium text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
            >
              Registry <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <RiskDistributionChart
            lowCount={lowRiskParcelsCount}
            mediumCount={mediumRiskParcelsCount}
            highCount={highRiskParcelsCount}
            total={totalParcelsCount}
          />

          <div className="p-2.5 bg-slate-50 rounded-xs border border-slate-200 text-xs text-slate-600 leading-relaxed font-mono text-[11px]">
            <strong className="text-slate-900 uppercase">POLICY INSIGHT: </strong>
            High-risk concentration is greatest in Compensation (Section 19) and Valuation stages where titleholder co-sharer disputes stall treasury disbursement.
          </div>
        </div>

        {/* RIGHT: Priority Intervention Queue */}
        <div
          id="priority-attention-cases"
          className="lg:col-span-7 bg-white rounded-xs border border-slate-200 p-4 shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
            <div>
              <h2 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
                <span>Priority Intervention Cases</span>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-xs border border-rose-300 font-mono">
                  ACTION REQUIRED
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Immediate attention needed: Risk → Why → Predicted Delay → What To Do
              </p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
              TOP 4 CRITICAL CASES
            </span>
          </div>

          {/* Structured Priority Cases: RISK -> WHY -> PREDICTED DELAY -> WHAT TO DO */}
          <div className="space-y-3">
            {priorityCases.map((parcel) => (
              <div
                key={parcel.id}
                onClick={() => onSelectParcel(parcel.id)}
                className="p-3.5 rounded-xs border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50/40 cursor-pointer transition-all shadow-2xs space-y-2.5 group relative"
              >
                {/* Header: Parcel, Project & District */}
                <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-100 pb-1.5 font-mono text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {parcel.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-700 font-sans font-medium">
                      {parcel.district}, {parcel.state}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-sans text-slate-500">
                      {parcel.projectName}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded-xs border border-slate-200">
                    Stage: {parcel.stage}
                  </span>
                </div>

                {/* 4-Step Clarity Flow: Risk -> Why -> Predicted Delay -> What To Do */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  {/* 1. RISK */}
                  <div className="bg-rose-50/60 p-2 rounded-xs border border-rose-200">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-rose-900 block">
                      1. RISK
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <RiskBadge level={parcel.riskLevel} size="sm" />
                      <span className="font-mono font-bold text-rose-800 text-xs">
                        {parcel.riskScore}/100
                      </span>
                    </div>
                    <span className="text-[10px] text-rose-700 font-mono block mt-0.5">
                      {parcel.delayProbability}% delay chance
                    </span>
                  </div>

                  {/* 2. WHY */}
                  <div className="bg-slate-50 p-2 rounded-xs border border-slate-200">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-700 block">
                      2. WHY (PRIMARY CAUSE)
                    </span>
                    <p className="text-[11px] text-slate-800 font-sans font-medium leading-snug line-clamp-2 mt-1">
                      {parcel.riskDrivers[0]?.factor || 'Titleholder dispute & disbursement backlog'}
                    </p>
                  </div>

                  {/* 3. PREDICTED DELAY */}
                  <div className="bg-amber-50/70 p-2 rounded-xs border border-amber-200">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-900 block">
                      3. PREDICTED DELAY
                    </span>
                    <span className="font-mono font-bold text-amber-900 text-xs block mt-1">
                      +{parcel.predictedDelayDays} Days
                    </span>
                    <span className="text-[10px] text-amber-800 font-sans block mt-0.5">
                      beyond target schedule
                    </span>
                  </div>

                  {/* 4. WHAT TO DO */}
                  <div className="bg-blue-50/60 p-2 rounded-xs border border-blue-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-900 block">
                        4. WHAT TO DO
                      </span>
                      <p className="text-[11px] text-slate-900 font-sans font-medium leading-snug line-clamp-2 mt-1">
                        {parcel.recommendedActions[0]?.action || 'Convene joint collectorate resolution review'}
                      </p>
                    </div>
                    <div className="pt-1.5 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 group-hover:text-blue-900 font-mono">
                        Inspect Case →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2.5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Showing top 4 critical delays requiring proactive resolution
            </span>
            <button
              onClick={onNavigateToParcels}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xs text-xs font-semibold shadow-2xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>View All {highRiskParcelsCount} High-Risk Parcels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* GIS RISK HOTSPOTS: "WHERE IS THE RISK?" */}
      <GISRiskHotspots
        onSelectParcel={onSelectParcel}
        onSelectProject={onSelectProject}
      />

      {/* Middle Section: Project Progress Table */}
      <div
        id="project-progress-section"
        className="bg-white rounded-xs border border-slate-200 shadow-2xs overflow-hidden"
      >
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50">
          <div>
            <h2 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
              <span>Project Progress & Delay Risk</span>
              <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.2 rounded-xs border border-slate-200 font-normal">
                {projects.length} ACTIVE PROJECTS
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
              Track acquisition progress, land possession clearance, and forecast delays across all project corridors.
            </p>
          </div>
          <button
            onClick={onNavigateToProjects}
            className="text-xs font-mono font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            Open Projects Grid ({projects.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] font-mono tracking-wider sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3.5 border-r-2 border-slate-200 sticky left-0 bg-slate-100 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                  Code
                </th>
                <th className="py-2.5 px-3.5 min-w-[220px] border-r border-slate-200/80">Project & Agency</th>
                <th className="py-2.5 px-3.5 border-r border-slate-200/80">District / State</th>
                <th className="py-2.5 px-3.5 text-right border-r border-slate-200/80">Total</th>
                <th className="py-2.5 px-3.5 text-right border-r border-slate-200/80">Acquired</th>
                <th className="py-2.5 px-3.5 text-right border-r border-slate-200/80">Pending</th>
                <th className="py-2.5 px-3.5 min-w-[150px] border-r border-slate-200/80">Progress</th>
                <th className="py-2.5 px-3.5 text-center border-r border-slate-200/80">Risk Level</th>
                <th className="py-2.5 px-3.5 text-right">Predicted Delay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                >
                  <td className="py-2.5 px-3.5 font-bold text-slate-900 group-hover:text-blue-600 border-r-2 border-slate-200 sticky left-0 bg-white group-hover:bg-blue-50/95 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                    {project.code}
                  </td>
                  <td className="py-2.5 px-3.5 font-sans border-r border-slate-100">
                    <span className="font-semibold text-slate-900 block group-hover:text-blue-600 text-xs">
                      {project.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      AGENCY: {project.implementingAgency}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-600 border-r border-slate-100 font-sans text-xs">
                    {project.district}, {project.state}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-medium text-slate-800 border-r border-slate-100 tabular-nums">
                    {project.totalParcels}
                  </td>
                  <td className="py-2.5 px-3.5 text-right text-emerald-700 font-medium border-r border-slate-100 tabular-nums">
                    {project.acquiredParcels}
                  </td>
                  <td className="py-2.5 px-3.5 text-right text-amber-700 font-medium border-r border-slate-100 tabular-nums">
                    {project.pendingParcels}
                  </td>
                  <td className="py-2.5 px-3.5 border-r border-slate-100">
                    <ProgressBar
                      value={project.progressPercent}
                      size="sm"
                      showLabel={true}
                      color={
                        project.progressPercent >= 75
                          ? 'emerald'
                          : project.progressPercent >= 60
                          ? 'blue'
                          : 'amber'
                      }
                    />
                  </td>
                  <td className="py-2.5 px-3.5 text-center border-r border-slate-100">
                    <RiskBadge level={project.overallRisk} size="sm" />
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-bold tabular-nums">
                    <span
                      className={
                        project.predictedDelayDays > 40
                          ? 'text-rose-600'
                          : project.predictedDelayDays > 20
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }
                    >
                      +{project.predictedDelayDays}d
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Delay Risk Trend */}
      <div
        id="delay-risk-trend-section"
        className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div>
            <h2 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
              <span>Portfolio Delay Risk Trend & Projection</span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-xs border border-slate-200 font-normal">
                PROJECTED HORIZON
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
              Historical 6-month delay trend with 60-day predictive forecast across active corridors.
            </p>
          </div>
        </div>

        <LineTrendChart />
      </div>
    </div>
  );
};

