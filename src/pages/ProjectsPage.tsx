import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Info,
  Download,
  ArrowRightLeft,
  CheckSquare,
  Square,
  X,
} from 'lucide-react';
import { Project, RiskLevel } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { ColumnToggleMenu, ColumnDefinition } from '../components/common/ColumnToggleMenu';
import { exportToCsv } from '../utils/csvExport';
import { DistrictRiskChart } from '../components/charts/DistrictRiskChart';

interface ProjectsPageProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  onNavigateToCompare?: (projectAId?: string, projectBId?: string) => void;
}

const DEFAULT_PROJECT_COLUMNS: ColumnDefinition[] = [
  { id: 'compare', label: 'Select (Compare)', visible: true, required: true },
  { id: 'code', label: 'Project Code', visible: true, required: true },
  { id: 'name', label: 'Project / Agency', visible: true },
  { id: 'location', label: 'District / State', visible: true },
  { id: 'total', label: 'Total Parcels', visible: true },
  { id: 'acquired', label: 'Acquired', visible: true },
  { id: 'pending', label: 'Pending', visible: true },
  { id: 'progress', label: 'Progress (%)', visible: true },
  { id: 'riskScore', label: 'Risk Score', visible: true },
  { id: 'predictedDelay', label: 'Predicted Delay', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'action', label: 'Inspect Action', visible: true },
];

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onSelectProject,
  selectedState,
  onStateChange,
  selectedDistrict,
  onDistrictChange,
  onNavigateToCompare,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'risk' | 'progress' | 'delay'>('risk');
  const [columns, setColumns] = useState<ColumnDefinition[]>(DEFAULT_PROJECT_COLUMNS);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Column visibility lookup
  const isColVisible = (id: string) => columns.find((c) => c.id === id)?.visible ?? true;

  const handleToggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id && !col.required ? { ...col, visible: !col.visible } : col))
    );
  };

  const handleResetColumns = () => {
    setColumns(DEFAULT_PROJECT_COLUMNS);
  };

  const handleSelectAllColumns = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, visible: true })));
  };

  // Compare selection toggle
  const handleToggleCompare = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForCompare((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      }
      if (prev.length >= 2) {
        // Replace second project if already 2 selected
        return [prev[0], projectId];
      }
      return [...prev, projectId];
    });
  };

  // Export Projects to CSV
  const handleExportCsv = () => {
    exportToCsv(
      sortedProjects,
      [
        { header: 'Project Code', accessor: 'code' },
        { header: 'Project Name', accessor: 'name' },
        { header: 'Implementing Agency', accessor: 'implementingAgency' },
        { header: 'State', accessor: 'state' },
        { header: 'District', accessor: 'district' },
        { header: 'Total Parcels', accessor: 'totalParcels' },
        { header: 'Acquired Parcels', accessor: 'acquiredParcels' },
        { header: 'Pending Parcels', accessor: 'pendingParcels' },
        { header: 'High Risk Parcels', accessor: 'highRiskParcels' },
        { header: 'Medium Risk Parcels', accessor: 'mediumRiskParcels' },
        { header: 'Low Risk Parcels', accessor: 'lowRiskParcels' },
        { header: 'Progress (%)', accessor: 'progressPercent' },
        { header: 'Average Risk Score', accessor: 'avgRiskScore' },
        { header: 'Overall Risk Level', accessor: 'overallRisk' },
        { header: 'Predicted Delay (Days)', accessor: 'predictedDelayDays' },
        { header: 'Status', accessor: 'status' },
        { header: 'Target Completion', accessor: 'targetCompletion' },
      ],
      'landguard_ai_projects_registry'
    );
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState =
      selectedState === 'All States' || p.state.toLowerCase() === selectedState.toLowerCase();

    const matchesDistrict =
      selectedDistrict === 'All Districts' ||
      p.district.toLowerCase() === selectedDistrict.toLowerCase();

    const matchesRisk =
      selectedRisk === 'All' || p.overallRisk.toLowerCase() === selectedRisk.toLowerCase();

    return matchesSearch && matchesState && matchesDistrict && matchesRisk;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'risk') return b.avgRiskScore - a.avgRiskScore;
    if (sortBy === 'progress') return b.progressPercent - a.progressPercent;
    if (sortBy === 'delay') return b.predictedDelayDays - a.predictedDelayDays;
    return 0;
  });

  return (
    <div id="screen-projects" className="p-5 space-y-5 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-sans">Projects Registry</h2>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-xs">
              PROJECTS_REGISTRY
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track statutory land acquisition progress, parcel clearance, and early delay indices.
          </p>
        </div>

        {/* Top Actions: Compare Projects, Column Toggle, Download CSV */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Compare Projects Trigger Button */}
          <button
            type="button"
            onClick={() => onNavigateToCompare?.(selectedForCompare[0], selectedForCompare[1])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Launch dual-project comparison view"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Compare Projects</span>
            {selectedForCompare.length > 0 && (
              <span className="px-1.5 py-0.2 bg-blue-800 text-blue-100 rounded-xs text-[10px]">
                {selectedForCompare.length}/2
              </span>
            )}
          </button>

          {/* Download CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs font-mono text-xs transition-colors cursor-pointer"
            title="Download full project registry as CSV for offline analysis"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download CSV</span>
          </button>

          {/* Column Toggle Menu */}
          <ColumnToggleMenu
            columns={columns}
            onToggle={handleToggleColumn}
            onReset={handleResetColumns}
            onSelectAll={handleSelectAllColumns}
          />
        </div>
      </div>

      {/* Top Controls & Filter Bar */}
      <div className="bg-white rounded-xs border border-slate-200 p-3.5 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or codes... [ / ]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800"
            />
          </div>

          {/* State Filter */}
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => {
                onStateChange(e.target.value);
                onDistrictChange('All Districts');
              }}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="All States">All States</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>

          {/* District Filter */}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="All Districts">All Districts</option>
              <option value="Bharuch">Bharuch</option>
              <option value="Palghar">Palghar</option>
              <option value="Pune">Pune</option>
              <option value="Bengaluru Urban">Bengaluru Urban</option>
              <option value="Kanchipuram">Kanchipuram</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div className="relative">
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk Only</option>
              <option value="Medium">Medium Risk Only</option>
              <option value="Low">Low Risk Only</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Sort */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="font-mono text-[11px]">
            SHOWING <strong className="text-slate-900 font-bold">{sortedProjects.length}</strong> OF{' '}
            <strong className="text-slate-900 font-bold">{projects.length}</strong> ACTIVE PROJECTS
          </span>

          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span className="text-slate-500 uppercase text-[10px]">Sort:</span>
            <button
              onClick={() => setSortBy('risk')}
              className={`px-2 py-0.5 rounded-xs font-medium border transition-colors ${
                sortBy === 'risk' ? 'bg-slate-900 text-white border-slate-900 font-bold' : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              RISK
            </button>
            <button
              onClick={() => setSortBy('delay')}
              className={`px-2 py-0.5 rounded-xs font-medium border transition-colors ${
                sortBy === 'delay' ? 'bg-slate-900 text-white border-slate-900 font-bold' : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              DELAY
            </button>
            <button
              onClick={() => setSortBy('progress')}
              className={`px-2 py-0.5 rounded-xs font-medium border transition-colors ${
                sortBy === 'progress'
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              PROGRESS
            </button>
          </div>
        </div>
      </div>

      {/* Floating Compare Action Tray if projects selected */}
      {selectedForCompare.length > 0 && (
        <div className="bg-slate-900 text-white p-3 rounded-xs border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3 font-mono text-xs animate-in fade-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">
              COMPARE PROJECTS ({selectedForCompare.length}/2 Selected):
            </span>
            <div className="flex items-center gap-1.5">
              {selectedForCompare.map((id) => {
                const prj = projects.find((p) => p.id === id);
                return (
                  <span
                    key={id}
                    className="bg-slate-800 border border-slate-700 text-blue-300 px-2 py-0.5 rounded-xs text-[11px] font-bold"
                  >
                    {prj?.code || id}
                  </span>
                );
              })}
              {selectedForCompare.length === 1 && (
                <span className="text-slate-400 text-[11px] italic">
                  (Select 1 more project below or click Launch)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToCompare?.(selectedForCompare[0], selectedForCompare[1])}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xs font-bold transition-colors cursor-pointer text-xs"
            >
              Launch Side-by-Side Comparison →
            </button>
            <button
              type="button"
              onClick={() => setSelectedForCompare([])}
              className="p-1 hover:bg-slate-800 rounded-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* District Risk & Delay Exposure Comparison */}
      <DistrictRiskChart />

      {/* Main Table with Dynamic Columns */}
      <div className="bg-white rounded-xs border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] font-mono tracking-wider sticky top-0 z-10">
              <tr>
                {isColVisible('compare') && (
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center w-12 sticky left-0 bg-slate-100 z-20">
                    Compare
                  </th>
                )}
                {isColVisible('code') && (
                  <th className={`py-2.5 px-3.5 border-r-2 border-slate-200 sticky ${isColVisible('compare') ? 'left-12' : 'left-0'} bg-slate-100 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]`}>
                    Code
                  </th>
                )}
                {isColVisible('name') && (
                  <th className="py-2.5 px-3.5 min-w-[240px] border-r border-slate-200">Project / Agency</th>
                )}
                {isColVisible('location') && (
                  <th className="py-2.5 px-3.5 border-r border-slate-200">District / State</th>
                )}
                {isColVisible('total') && (
                  <th className="py-2.5 px-3.5 text-right border-r border-slate-200">Total</th>
                )}
                {isColVisible('acquired') && (
                  <th className="py-2.5 px-3.5 text-right border-r border-slate-200">Acquired</th>
                )}
                {isColVisible('pending') && (
                  <th className="py-2.5 px-3.5 text-right border-r border-slate-200">Pending</th>
                )}
                {isColVisible('progress') && (
                  <th className="py-2.5 px-3.5 min-w-[140px] border-r border-slate-200">Progress</th>
                )}
                {isColVisible('riskScore') && (
                  <th className="py-2.5 px-3.5 text-center border-r border-slate-200">Risk Score</th>
                )}
                {isColVisible('predictedDelay') && (
                  <th className="py-2.5 px-3.5 text-right border-r border-slate-200">Predicted Delay</th>
                )}
                {isColVisible('status') && (
                  <th className="py-2.5 px-3.5 text-center border-r border-slate-200">Status</th>
                )}
                {isColVisible('action') && (
                  <th className="py-2.5 px-3.5 text-center">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {sortedProjects.map((project) => {
                const isSelected = selectedForCompare.includes(project.id);
                return (
                  <tr
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className={`hover:bg-blue-50/50 cursor-pointer transition-colors group ${
                      isSelected ? 'bg-blue-50/70' : ''
                    }`}
                  >
                    {/* Compare Checkbox */}
                    {isColVisible('compare') && (
                      <td
                        className="py-2.5 px-3 text-center border-r border-slate-100 sticky left-0 bg-white group-hover:bg-blue-50/95 z-10 w-12"
                        onClick={(e) => handleToggleCompare(project.id, e)}
                      >
                        <button
                          type="button"
                          className="text-slate-400 hover:text-blue-600 cursor-pointer"
                          title={isSelected ? 'Deselect from comparison' : 'Select for side-by-side comparison'}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    )}

                    {/* Code */}
                    {isColVisible('code') && (
                      <td className={`py-2.5 px-3.5 font-bold text-slate-900 group-hover:text-blue-600 border-r-2 border-slate-200 sticky ${isColVisible('compare') ? 'left-12' : 'left-0'} bg-white group-hover:bg-blue-50/95 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]`}>
                        {project.code}
                      </td>
                    )}

                    {/* Name / Agency */}
                    {isColVisible('name') && (
                      <td className="py-2.5 px-3.5 font-sans border-r border-slate-100">
                        <span className="font-semibold text-slate-900 block group-hover:text-blue-600 text-xs">
                          {project.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          TARGET: {project.targetCompletion} • {project.implementingAgency}
                        </span>
                      </td>
                    )}

                    {/* Location */}
                    {isColVisible('location') && (
                      <td className="py-2.5 px-3.5 text-slate-600 border-r border-slate-100 font-sans text-xs">
                        <span className="font-medium text-slate-800">{project.district}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{project.state}</span>
                      </td>
                    )}

                    {/* Total */}
                    {isColVisible('total') && (
                      <td className="py-2.5 px-3.5 text-right font-bold text-slate-800 border-r border-slate-100 tabular-nums">
                        {project.totalParcels}
                      </td>
                    )}

                    {/* Acquired */}
                    {isColVisible('acquired') && (
                      <td className="py-2.5 px-3.5 text-right text-emerald-700 font-medium border-r border-slate-100 tabular-nums">
                        {project.acquiredParcels}
                      </td>
                    )}

                    {/* Pending */}
                    {isColVisible('pending') && (
                      <td className="py-2.5 px-3.5 text-right text-amber-700 font-medium border-r border-slate-100 tabular-nums">
                        {project.pendingParcels}
                      </td>
                    )}

                    {/* Progress */}
                    {isColVisible('progress') && (
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
                    )}

                    {/* Risk Score */}
                    {isColVisible('riskScore') && (
                      <td className="py-2.5 px-3.5 text-center border-r border-slate-100">
                        <div className="flex flex-col items-center">
                          <span className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                            {project.avgRiskScore}/100
                          </span>
                          <RiskBadge level={project.overallRisk} size="sm" showDot={false} />
                        </div>
                      </td>
                    )}

                    {/* Predicted Delay */}
                    {isColVisible('predictedDelay') && (
                      <td className="py-2.5 px-3.5 text-right font-bold border-r border-slate-100 tabular-nums">
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
                    )}

                    {/* Status */}
                    {isColVisible('status') && (
                      <td className="py-2.5 px-3.5 text-center border-r border-slate-100">
                        <StatusBadge status={project.status} size="sm" />
                      </td>
                    )}

                    {/* Action */}
                    {isColVisible('action') && (
                      <td className="py-2.5 px-3.5 text-center text-blue-600 group-hover:text-blue-800 font-mono">
                        <span className="inline-flex items-center text-[11px] font-semibold">
                          INSPECT <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Note */}
      <div className="p-3 bg-slate-50 rounded-xs border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 font-mono text-[11px]">
        <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 uppercase">Decision Support Guidance: </strong>
          Check the compare box next to any two projects to evaluate risk vectors side-by-side, or select any
          row to open <strong>Project Intelligence</strong> with parcel dwell-time diagnostics.
        </p>
      </div>
    </div>
  );
};
