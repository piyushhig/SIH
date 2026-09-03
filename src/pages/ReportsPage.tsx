import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Building,
  AlertCircle,
  FileCheck,
  Share2,
  Filter,
} from 'lucide-react';
import { Project, LandParcel } from '../types';

interface ReportsPageProps {
  projects: Project[];
  parcels: LandParcel[];
}

type ReportType =
  | 'project-risk'
  | 'high-risk-parcel'
  | 'acquisition-progress'
  | 'district-summary';

export const ReportsPage: React.FC<ReportsPageProps> = ({ projects, parcels }) => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('project-risk');
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDate, setGeneratedDate] = useState<string>('03 Sep 2026');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const reportTypes = [
    {
      id: 'project-risk' as ReportType,
      title: 'Project Risk Report',
      description: 'Comprehensive risk and predicted delay assessment across active infrastructure projects.',
    },
    {
      id: 'high-risk-parcel' as ReportType,
      title: 'High-Risk Parcel Report',
      description: 'Granular audit of parcels with delay probability >70% and critical bottlenecks.',
    },
    {
      id: 'acquisition-progress' as ReportType,
      title: 'Acquisition Progress Report',
      description: 'Statutory stage milestones, compensation disbursements, and possession handovers.',
    },
    {
      id: 'district-summary' as ReportType,
      title: 'District Summary',
      description: 'Aggregated revenue administration overview by district collector jurisdiction.',
    },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const now = new Date();
      setGeneratedDate(
        `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('default', {
          month: 'short',
        })} 2026`
      );
      setDownloadNotice('Report generated successfully. Ready for preview or export.');
      setTimeout(() => setDownloadNotice(null), 4000);
    }, 600);
  };

  const handleDownloadPDF = () => {
    setDownloadNotice('Simulated Action: Downloading Executive PDF Briefing...');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const highRiskParcels = parcels.filter((p) => p.riskLevel === 'High');
  const totalProjectsCount = projects.length;
  const totalParcelsCount = parcels.length;
  const acquiredParcelsCount = parcels.filter(
    (p) => p.status === 'Acquired' || p.stage === 'Possession'
  ).length;
  const clearancePercent =
    totalParcelsCount > 0 ? Math.round((acquiredParcelsCount / totalParcelsCount) * 100) : 68;
  const highRiskCount = parcels.filter((p) => p.riskLevel === 'High').length;
  const mediumRiskCount = parcels.filter((p) => p.riskLevel === 'Medium').length;
  const lowRiskCount = parcels.filter((p) => p.riskLevel === 'Low').length;
  const avgPipelineDelay =
    totalProjectsCount > 0
      ? (projects.reduce((acc, p) => acc + p.predictedDelayDays, 0) / totalProjectsCount).toFixed(1)
      : '38.4';

  const lowRiskPct =
    totalParcelsCount > 0 ? ((lowRiskCount / totalParcelsCount) * 100).toFixed(1) : '50.7';
  const mediumRiskPct =
    totalParcelsCount > 0 ? ((mediumRiskCount / totalParcelsCount) * 100).toFixed(1) : '37.8';
  const highRiskPct =
    totalParcelsCount > 0 ? ((highRiskCount / totalParcelsCount) * 100).toFixed(1) : '11.5';

  return (
    <div id="screen-reports" className="p-5 space-y-5 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-sans">Executive Reports & Briefings</h2>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-xs">
              COMPLIANCE_ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate executive briefings, statutory progress summaries, and risk audits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-xs font-mono shadow-2xs">
            STATUS: SIMULATED BRIEFING • DEMO FEED
          </span>
        </div>
      </div>

      {downloadNotice && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-3.5 py-2 rounded-xs text-xs font-mono flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Report Configuration & Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Report Type Selection & Parameters */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xs border border-slate-200 p-3.5 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
              01. Select Report Type
            </h3>

            <div className="space-y-1.5">
              {reportTypes.map((rt) => {
                const isSelected = selectedReportType === rt.id;
                return (
                  <div
                    key={rt.id}
                    onClick={() => setSelectedReportType(rt.id)}
                    className={`p-2.5 rounded-xs border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                        {rt.title}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-xs bg-blue-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug font-sans">
                      {rt.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters & Options */}
          <div className="bg-white rounded-xs border border-slate-200 p-3.5 shadow-2xs space-y-2.5 font-mono">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              02. Scope & Jurisdiction
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold block mb-1 uppercase tracking-wider">
                  Project Filter:
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xs p-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600 font-mono"
                >
                  <option value="All">All Active Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-semibold block mb-1 uppercase tracking-wider">
                  District Collectorate:
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xs p-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600 font-mono"
                >
                  <option value="All">All Districts</option>
                  <option value="Bharuch">Bharuch (Gujarat)</option>
                  <option value="Palghar">Palghar (Maharashtra)</option>
                  <option value="Pune">Pune (Maharashtra)</option>
                  <option value="Bengaluru Urban">Bengaluru Urban (Karnataka)</option>
                  <option value="Kanchipuram">Kanchipuram (Tamil Nadu)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                id="btn-generate-report"
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full py-1.5 px-3 rounded-xs bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs font-mono shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'COMPILING DATA...' : '[ GENERATE REPORT ]'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Report Preview Area */}
        <div className="lg:col-span-8 bg-white rounded-xs border border-slate-200 shadow-2xs p-5 space-y-5 text-slate-800">
          {/* Executive Header of Report */}
          <div className="border-b-2 border-slate-900 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-blue-900 font-mono block">
                  EXECUTIVE BRIEFING • LAND ACQUISITION DECISION ENGINE
                </span>
                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight mt-0.5 font-sans">
                  {selectedReportType === 'project-risk'
                    ? 'Project Risk & Delay Horizon Audit'
                    : selectedReportType === 'high-risk-parcel'
                    ? 'High-Risk Critical Path Parcels Registry'
                    : selectedReportType === 'acquisition-progress'
                    ? 'Statutory Acquisition Milestone & Possession Audit'
                    : 'District Revenue Administration Summary'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors font-mono cursor-pointer shadow-2xs"
                >
                  <Download className="w-3 h-3 text-slate-500" /> [ EXPORT PDF ]
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[10px] text-slate-600 bg-slate-50 p-2 rounded-xs border border-slate-200 font-mono">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">DATE:</span>
                <strong className="text-slate-800">{generatedDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">DOC ID:</span>
                <strong className="text-slate-800">LW-REP-2026-0903</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">SCOPE:</span>
                <strong className="text-slate-800">{selectedDistrict} / {selectedProject}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">SECURITY:</span>
                <strong className="text-slate-800">DEMO DATASET / PROTOTYPE FEED</strong>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              01. Executive Summary Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 bg-slate-50 rounded-xs border border-slate-200 font-mono">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                  Monitored Projects
                </span>
                <span className="text-lg font-bold font-mono text-slate-900 block mt-0.5 tabular-nums">
                  {totalProjectsCount} Active Projects
                </span>
                <span className="text-[10px] text-slate-400">18 packages</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xs border border-slate-200 font-mono">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                  Active Parcels
                </span>
                <span className="text-lg font-bold font-mono text-slate-900 block mt-0.5 tabular-nums">
                  {totalParcelsCount.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-700">{clearancePercent}% acquired</span>
              </div>
              <div className="p-2.5 bg-rose-50/50 rounded-xs border border-rose-200 font-mono">
                <span className="text-[10px] text-rose-800 uppercase block font-semibold">
                  High-Risk Flagged
                </span>
                <span className="text-lg font-bold font-mono text-rose-700 block mt-0.5 tabular-nums">
                  {highRiskCount} Cases
                </span>
                <span className="text-[10px] text-rose-600">Delay prob &gt; 70%</span>
              </div>
              <div className="p-2.5 bg-amber-50/50 rounded-xs border border-amber-200 font-mono">
                <span className="text-[10px] text-amber-800 uppercase block font-semibold">
                  Avg Pipeline Delay
                </span>
                <span className="text-lg font-bold font-mono text-amber-800 block mt-0.5 tabular-nums">
                  +{avgPipelineDelay} Days
                </span>
                <span className="text-[10px] text-amber-700">Projected variance</span>
              </div>
            </div>
          </div>

          {/* Risk Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              02. Risk Breakdown & Bottleneck Distribution
            </h4>
            <div className="p-2.5 bg-slate-50 rounded-xs border border-slate-200 space-y-1.5 text-xs font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-sans">Low Risk (On Track within statutory window):</span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  {lowRiskCount.toLocaleString()} Parcels ({lowRiskPct}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-sans">Medium Risk (Frictional delay 15–30 days):</span>
                <span className="font-mono font-bold text-amber-700 tabular-nums">
                  {mediumRiskCount.toLocaleString()} Parcels ({mediumRiskPct}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-sans">High Risk (Civil litigation, court stays, valuation dispute):</span>
                <span className="font-mono font-bold text-rose-700 tabular-nums">
                  {highRiskCount.toLocaleString()} Parcels ({highRiskPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              03. Key Operational Findings
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1.5 leading-relaxed font-sans">
              <li>
                <strong>Compensation Disbursement Bottlenecks:</strong> 64% of total predicted delay days originate in the Section 3G/8 Compensation stage, where unmutated co-heir disputes hold up treasury payouts.
              </li>
              <li>
                <strong>Critical Priority Alignment:</strong> The Pune Ring Road (Phase 1) and Western Freight Corridor (Vaitarna-JNPT) show the highest cluster of delayed parcels due to peri-urban land valuation disputes and tribal consent protocols.
              </li>
              <li>
                <strong>Early Intervention Dividend:</strong> Depositing disputed co-parcener compensation shares into competent District Court accounts under RFCTLARR Section 3H(4) frees physical possession transfer while allowing inheritance claims to be settled independently.
              </li>
            </ul>
          </div>

          {/* Recommended Actions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              04. Immediate Action Directives
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-xs border border-slate-200 font-sans">
                <span className="font-bold text-slate-900 block text-xs">
                  Directive A: Special Collector Reconciliation Hearings (Pune & Palghar)
                </span>
                <p className="text-slate-600 mt-0.5 text-xs">
                  Convene targeted Sub-Divisional Conciliation meetings for 28 top priority parcels before 15th of the month.
                </p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xs border border-slate-200 font-sans">
                <span className="font-bold text-slate-900 block text-xs">
                  Directive B: Inter-Departmental Forest & Defense Clearance Taskforce
                </span>
                <p className="text-slate-600 mt-0.5 text-xs">
                  Issue unified clearance orders for railway right-of-way sections overlapping military and forest authority buffers.
                </p>
              </div>
            </div>
          </div>

          {/* Signoff / Verification Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>AUTHORED_BY: LANDGUARD AI • ACQUISITION INTELLIGENCE</span>
            <span>VERIFIED_FOR: PORTFOLIO PLANNING DEMO</span>
          </div>
        </div>
      </div>
    </div>
  );
};
