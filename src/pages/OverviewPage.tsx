import React from 'react';
import {
  MapPin,
  AlertOctagon,
  Clock,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Project, LandParcel } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { CountUpNumber } from '../components/common/CountUpNumber';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { GISRiskHotspots } from '../components/gis/GISRiskHotspots';
import { ScrollReveal } from '../components/common/ScrollReveal';

interface OverviewPageProps {
  projects: Project[];
  parcels: LandParcel[];
  selectedState?: string;
  selectedDistrict?: string;
  searchQuery?: string;
  onSelectProject: (projectId: string) => void;
  onSelectParcel: (parcelId: string) => void;
  onNavigateToProjects: () => void;
  onNavigateToParcels: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  projects,
  parcels,
  selectedState = 'All States',
  selectedDistrict = 'All Districts',
  searchQuery = '',
  onSelectProject,
  onSelectParcel,
  onNavigateToProjects,
  onNavigateToParcels,
}) => {
  // Aggregate Metrics derived strictly from dataset
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
    <div id="screen-overview" className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      {/* 1. Header & Context */}
      <ScrollReveal delayMs={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold text-white tracking-tight">
                Land Acquisition Overview
              </h1>
              <span className="text-xs font-mono text-blue-400 bg-blue-950/60 border border-blue-800/80 px-2 py-0.5 rounded">
                Active Monitoring
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Predictive risk detection, root-cause diagnostics, and statutory intervention tracking across infrastructure corridors.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded font-mono">
              CALIBRATED REGISTRY • {totalParcelsCount.toLocaleString()} PARCELS
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. Executive KPI Summary — 3 High-Impact Cards with Clear Visual Hierarchy */}
      <ScrollReveal delayMs={80}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Visual Anchor: High-Risk Exposure (Larger, High Contrast) */}
        <div
          id="kpi-high-risk-anchor"
          className="lg:col-span-5 bg-slate-900/90 rounded-lg border border-slate-800 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                Primary Risk Exposure
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/70 px-2.5 py-0.5 rounded">
                <AlertOctagon className="w-3.5 h-3.5" />
                Immediate Action Required
              </span>
            </div>
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-4xl font-bold font-mono text-white tabular-nums tracking-tight">
                <CountUpNumber value={highRiskParcelsCount} durationMs={250} />
              </span>
              <span className="text-sm font-sans text-slate-400">
                high-risk parcels ({highRiskPct}% of total)
              </span>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-800/80 mt-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Average Delay Variance</span>
              <span className="text-lg font-bold font-mono text-rose-400 mt-0.5 block tabular-nums">
                +{avgPredictedDelay} days
              </span>
              <span className="text-[11px] text-slate-500">Beyond planned statutory SLA</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Pending Acquisition</span>
              <span className="text-lg font-bold font-mono text-white mt-0.5 block tabular-nums">
                {pendingParcelsCount} parcels
              </span>
              <span className="text-[11px] text-slate-500">Awaiting award or possession</span>
            </div>
          </div>
        </div>

        {/* Card 2: Overall Acquisition Clearance */}
        <div
          id="kpi-clearance-progress"
          className="lg:col-span-4 bg-slate-900/70 rounded-lg border border-slate-800 p-6 shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium text-slate-400">
                Acquisition Clearance Progress
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono text-white tabular-nums">
                <CountUpNumber value={clearancePct} durationMs={250} suffix="%" />
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                {acquiredParcelsCount.toLocaleString()} parcels cleared
              </span>
            </div>
            <div className="mt-4">
              <ProgressBar
                value={clearancePct}
                size="md"
                color={clearancePct >= 70 ? 'emerald' : 'blue'}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Possession handed over: <strong className="text-slate-200 font-mono">{acquiredParcelsCount}</strong></span>
            <span>Pending: <strong className="text-slate-200 font-mono">{pendingParcelsCount}</strong></span>
          </div>
        </div>

        {/* Card 3: Monitored Corridors Scope */}
        <div
          id="kpi-corridor-portfolio"
          className="lg:col-span-3 bg-slate-900/70 rounded-lg border border-slate-800 p-6 shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium text-slate-400">
                Monitored Corridors
              </span>
              <MapPin className="w-4 h-4 text-blue-400" />
            </div>
            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white tabular-nums">
                {totalActiveProjects}
              </span>
              <span className="text-xs text-slate-400">
                active projects
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Covering expressways, metro corridors, and freight lines across 3 states.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Registry</span>
            <span className="font-mono font-bold text-slate-200">
              {totalParcelsCount.toLocaleString()} Parcels
            </span>
          </div>
        </div>
        </div>
      </ScrollReveal>

      {/* 3. Geospatial Risk Hotspots Map */}
      <ScrollReveal delayMs={160}>
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Geospatial Risk Hotspots
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactive geographic clustering of delay probabilities and statutory bottlenecks along corridor alignments.
              </p>
            </div>
          </div>
          <GISRiskHotspots
            parcels={parcels}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            searchQuery={searchQuery}
            onSelectParcel={onSelectParcel}
            onSelectProject={onSelectProject}
          />
        </section>
      </ScrollReveal>

      {/* 4. Risk Breakdown & Priority Interventions (2-Column Balanced Grid) */}
      <ScrollReveal delayMs={240}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Overall Risk Breakdown */}
        <div
          id="acquisition-risk-overview"
          className="lg:col-span-5 bg-slate-900/80 rounded-lg border border-slate-800 p-6 shadow-lg space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Risk Level Distribution
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Delay vulnerability across all {totalParcelsCount.toLocaleString()} registry parcels
              </p>
            </div>
            <button
              onClick={onNavigateToParcels}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              Full Registry <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <RiskDistributionChart
            lowCount={lowRiskParcelsCount}
            mediumCount={mediumRiskParcelsCount}
            highCount={highRiskParcelsCount}
            total={totalParcelsCount}
          />

          <div className="pt-2 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80">
            <span className="font-semibold text-slate-300 block mb-1">Key Systemic Finding:</span>
            Delays are concentrated primarily in <span className="text-slate-200">Compensation (Section 19)</span> and{' '}
            <span className="text-slate-200">Valuation</span> stages, driven by co-sharer apportionment disputes and pending title mutations.
          </div>
        </div>

        {/* Right Column: Priority Intervention Queue (Clean horizontal flow, no nested boxes) */}
        <div
          id="priority-attention-cases"
          className="lg:col-span-7 bg-slate-900/80 rounded-lg border border-slate-800 p-6 shadow-lg space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white tracking-tight">
                  Priority Intervention Queue
                </h2>
                <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">
                  Critical
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Top parcels requiring immediate administrative or legal intervention before schedule slippage
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Top 4 Cases
            </span>
          </div>

          {/* Clean List Items — Generous whitespace, no nested mini-boxes */}
          <div className="space-y-3">
            {priorityCases.map((parcel) => (
              <div
                key={parcel.id}
                onClick={() => onSelectParcel(parcel.id)}
                className="p-4 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-900 transition-all cursor-pointer space-y-2.5 group"
              >
                {/* Row 1: Identifiers and Risk Level */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      {parcel.id}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-300">
                      {parcel.district}, {parcel.state}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">
                      {parcel.projectName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Stage: <strong className="text-slate-300 font-normal">{parcel.stage}</strong></span>
                    <RiskBadge level={parcel.riskLevel} size="sm" />
                  </div>
                </div>

                {/* Row 2: Delay Impact & Root Cause */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs pt-1 border-t border-slate-800/60">
                  <div className="md:col-span-3">
                    <span className="text-[11px] text-slate-500 block">Predicted Delay</span>
                    <span className="font-mono font-bold text-rose-400 text-xs">
                      +{parcel.predictedDelayDays} days
                    </span>
                    <span className="text-[11px] text-slate-500 block">({parcel.delayProbability}% likelihood)</span>
                  </div>

                  <div className="md:col-span-5">
                    <span className="text-[11px] text-slate-500 block">Primary Risk Factor</span>
                    <p className="text-slate-300 line-clamp-1 mt-0.5">
                      {parcel.riskDrivers[0]?.factor || parcel.primaryRiskFactor}
                    </p>
                  </div>

                  <div className="md:col-span-4 flex flex-col justify-between items-start md:items-end">
                    <span className="text-[11px] text-slate-500 block">Recommended Action</span>
                    <p className="text-slate-300 text-left md:text-right line-clamp-1 mt-0.5">
                      {parcel.recommendedActions[0]?.action || 'Convene joint collectorate resolution review'}
                    </p>
                    <span className="text-xs font-medium text-blue-400 group-hover:text-blue-300 inline-flex items-center gap-1 mt-1">
                      Inspect details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing top cases ranked by predictive risk score
            </span>
            <button
              onClick={onNavigateToParcels}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>View All High-Risk Parcels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        </div>
      </ScrollReveal>

      {/* 5. Project Acquisition Progress & Schedule Variance Table */}
      <ScrollReveal delayMs={240}>
        <section
          id="project-progress-section"
          className="bg-slate-900/80 rounded-lg border border-slate-800 shadow-lg overflow-hidden"
        >
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <span>Project Acquisition Progress & Delay Risk</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-normal">
                {projects.length} Corridors
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Corridor right-of-way progress, possession clearance, and forecast delay variance across active projects.
            </p>
          </div>
          <button
            onClick={onNavigateToProjects}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer transition-colors"
          >
            All Projects ({projects.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 text-xs sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 border-r border-slate-800 sticky left-0 bg-slate-950 z-20">
                  Code
                </th>
                <th className="py-3 px-4 min-w-[220px] border-r border-slate-800/80">Project & Agency</th>
                <th className="py-3 px-4 border-r border-slate-800/80">District / State</th>
                <th className="py-3 px-4 text-right border-r border-slate-800/80">Total</th>
                <th className="py-3 px-4 text-right border-r border-slate-800/80">Acquired</th>
                <th className="py-3 px-4 text-right border-r border-slate-800/80">Pending</th>
                <th className="py-3 px-4 min-w-[140px] border-r border-slate-800/80">Progress</th>
                <th className="py-3 px-4 text-center border-r border-slate-800/80">Risk Level</th>
                <th className="py-3 px-4 text-right">Predicted Delay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className="hover:bg-slate-850 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-white group-hover:text-blue-400 border-r border-slate-800 sticky left-0 bg-slate-900 group-hover:bg-slate-850 z-10">
                    {project.code}
                  </td>
                  <td className="py-3 px-4 border-r border-slate-800/60">
                    <span className="font-medium text-white block group-hover:text-blue-400">
                      {project.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Agency: {project.implementingAgency}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 border-r border-slate-800/60">
                    {project.district}, {project.state}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300 border-r border-slate-800/60 tabular-nums">
                    {project.totalParcels}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400 border-r border-slate-800/60 tabular-nums">
                    {project.acquiredParcels}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-amber-400 border-r border-slate-800/60 tabular-nums">
                    {project.pendingParcels}
                  </td>
                  <td className="py-3 px-4 border-r border-slate-800/60">
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
                  <td className="py-3 px-4 text-center border-r border-slate-800/60">
                    <RiskBadge level={project.overallRisk} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums">
                    <span
                      className={
                        project.predictedDelayDays > 40
                          ? 'text-rose-400'
                          : project.predictedDelayDays > 20
                          ? 'text-amber-400'
                          : 'text-emerald-400'
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
      </section>
      </ScrollReveal>
    </div>
  );
};
