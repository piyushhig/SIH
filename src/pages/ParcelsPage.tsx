import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Download,
} from 'lucide-react';
import { LandParcel, AcquisitionStage, RiskLevel } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ColumnToggleMenu, ColumnDefinition } from '../components/common/ColumnToggleMenu';
import { exportToCsv } from '../utils/csvExport';

interface ParcelsPageProps {
  parcels: LandParcel[];
  onSelectParcel: (parcelId: string) => void;
  selectedState: string;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
}

const DEFAULT_PARCEL_COLUMNS: ColumnDefinition[] = [
  { id: 'id', label: 'Parcel ID / Gat', visible: true, required: true },
  { id: 'project', label: 'Project / Village', visible: true },
  { id: 'district', label: 'District', visible: true },
  { id: 'area', label: 'Area (Ha)', visible: true },
  { id: 'stage', label: 'Acquisition Stage', visible: true },
  { id: 'daysInStage', label: 'Days in Stage', visible: true },
  { id: 'riskScore', label: 'Risk Score', visible: true },
  { id: 'predictedDelay', label: 'Predicted Delay', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'action', label: 'Inspect Action', visible: true },
];

export const ParcelsPage: React.FC<ParcelsPageProps> = ({
  parcels,
  onSelectParcel,
  selectedState,
  selectedDistrict,
  onDistrictChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'risk' | 'delay' | 'days' | 'area'>('risk');
  const [columns, setColumns] = useState<ColumnDefinition[]>(DEFAULT_PARCEL_COLUMNS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 50;

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedProject, selectedStage, selectedRisk, selectedStatus, selectedDistrict, sortBy]);

  const isColVisible = (id: string) => columns.find((c) => c.id === id)?.visible ?? true;

  const handleToggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id && !col.required ? { ...col, visible: !col.visible } : col))
    );
  };

  const handleResetColumns = () => {
    setColumns(DEFAULT_PARCEL_COLUMNS);
  };

  const handleSelectAllColumns = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, visible: true })));
  };

  // Export Parcels to CSV
  const handleExportCsv = () => {
    exportToCsv(
      sortedParcels,
      [
        { header: 'Parcel ID', accessor: 'id' },
        { header: 'Gat / Khasra No', accessor: 'khasraNo' },
        { header: 'Project Name', accessor: 'projectName' },
        { header: 'Village', accessor: 'village' },
        { header: 'Taluka', accessor: 'taluka' },
        { header: 'District', accessor: 'district' },
        { header: 'State', accessor: 'state' },
        { header: 'Area (Hectares)', accessor: 'areaHa' },
        { header: 'Owner Count', accessor: 'ownerCount' },
        { header: 'Acquisition Stage', accessor: 'stage' },
        { header: 'Days in Current Stage', accessor: 'daysInStage' },
        { header: 'Target Days in Stage', accessor: 'expectedDaysInStage' },
        { header: 'Risk Score (0-100)', accessor: 'riskScore' },
        { header: 'Risk Level', accessor: 'riskLevel' },
        { header: 'Delay Probability (%)', accessor: 'delayProbability' },
        { header: 'Predicted Delay (Days)', accessor: 'predictedDelayDays' },
        { header: 'Status', accessor: 'status' },
        { header: 'Primary Risk Factor', accessor: 'primaryRiskFactor' },
        { header: 'Last Updated', accessor: 'lastUpdated' },
      ],
      'landguard_ai_parcels_registry'
    );
  };

  const projects = Array.from(new Set(parcels.map((p) => p.projectName)));
  const stages: AcquisitionStage[] = ['Notification', 'Survey', 'Valuation', 'Compensation', 'Possession'];

  // Filter parcels
  const filteredParcels = parcels.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.khasraNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject = selectedProject === 'All' || p.projectName === selectedProject;
    const matchesDistrict =
      selectedDistrict === 'All Districts' ||
      p.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesStage = selectedStage === 'All' || p.stage === selectedStage;
    const matchesRisk = selectedRisk === 'All' || p.riskLevel.toLowerCase() === selectedRisk.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || p.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesProject && matchesDistrict && matchesStage && matchesRisk && matchesStatus;
  });

  // Sort
  const sortedParcels = [...filteredParcels].sort((a, b) => {
    if (sortBy === 'risk') return b.riskScore - a.riskScore;
    if (sortBy === 'delay') return b.predictedDelayDays - a.predictedDelayDays;
    if (sortBy === 'days') return b.daysInStage - a.daysInStage;
    if (sortBy === 'area') return b.areaHa - a.areaHa;
    return 0;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedParcels.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedParcels = sortedParcels.slice(startIndex, startIndex + pageSize);

  return (
    <div id="screen-parcels" className="p-5 space-y-5 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-sans">Land Parcels Master Registry</h2>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-xs">
              REVENUE_SURVEY_GRID
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Searchable and filterable parcel survey registry with ML dwell-time and statutory delay diagnostics.
          </p>
        </div>

        {/* Top Actions: Download CSV, Column Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download CSV */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs font-mono text-xs transition-colors cursor-pointer"
            title="Download filtered land parcels list as CSV for offline analysis"
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

      {/* Filter Matrix */}
      <div className="bg-white rounded-xs border border-slate-200 p-3.5 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {/* Search Query */}
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, Gat/Khasra, Village... [ / ]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800"
            />
          </div>

          {/* Project Filter */}
          <div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1.5 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-600 truncate cursor-pointer"
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Acquisition Stage Filter */}
          <div>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1.5 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="All">All Stages</option>
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1.5 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="All">All Risks</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1.5 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Disputed">Disputed</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Acquired">Acquired</option>
            </select>
          </div>
        </div>

        {/* Counter & Sorter */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono text-[11px]">
          <span>
            SHOWING <strong className="text-slate-900 font-bold">{sortedParcels.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, sortedParcels.length)}</strong> OF{' '}
            <strong className="text-slate-900 font-bold">{sortedParcels.length}</strong> MATCHING (FROM <strong className="text-slate-900 font-bold">{parcels.length.toLocaleString()}</strong> TOTAL)
          </span>

          <div className="flex items-center gap-1.5">
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
              onClick={() => setSortBy('days')}
              className={`px-2 py-0.5 rounded-xs font-medium border transition-colors ${
                sortBy === 'days' ? 'bg-slate-900 text-white border-slate-900 font-bold' : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              DAYS IN STAGE
            </button>
            <button
              onClick={() => setSortBy('area')}
              className={`px-2 py-0.5 rounded-xs font-medium border transition-colors ${
                sortBy === 'area' ? 'bg-slate-900 text-white border-slate-900 font-bold' : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              AREA
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xs border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] font-mono tracking-wider sticky top-0 z-10">
              <tr>
                {isColVisible('id') && (
                  <th className="py-2.5 px-3.5 border-r-2 border-slate-200 sticky left-0 bg-slate-100 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                    Parcel ID
                  </th>
                )}
                {isColVisible('project') && (
                  <th className="py-2.5 px-3.5 min-w-[200px] border-r border-slate-200">Project / Village</th>
                )}
                {isColVisible('district') && (
                  <th className="py-2.5 px-3.5 border-r border-slate-200">District</th>
                )}
                {isColVisible('area') && (
                  <th className="py-2.5 px-3.5 text-right border-r border-slate-200">Area</th>
                )}
                {isColVisible('stage') && (
                  <th className="py-2.5 px-3.5 border-r border-slate-200">Stage</th>
                )}
                {isColVisible('daysInStage') && (
                  <th className="py-2.5 px-3.5 text-right border-r border-slate-200">Days in Stage</th>
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
              {sortedParcels.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.filter((c) => c.visible).length}
                    className="py-12 text-center text-slate-400 font-mono"
                  >
                    No land parcels matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedParcels.map((parcel) => (
                  <tr
                    key={parcel.id}
                    onClick={() => onSelectParcel(parcel.id)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  >
                    {isColVisible('id') && (
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 group-hover:text-blue-600 border-r-2 border-slate-200 sticky left-0 bg-white group-hover:bg-blue-50/95 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                        {parcel.id}
                        <span className="text-[10px] text-slate-400 block font-normal">
                          Gat {parcel.khasraNo}
                        </span>
                      </td>
                    )}

                    {isColVisible('project') && (
                      <td className="py-2.5 px-3.5 font-sans border-r border-slate-100">
                        <span className="font-semibold text-slate-900 block group-hover:text-blue-600 line-clamp-1 text-xs">
                          {parcel.projectName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          VILLAGE: {parcel.village}
                        </span>
                      </td>
                    )}

                    {isColVisible('district') && (
                      <td className="py-2.5 px-3.5 text-slate-600 border-r border-slate-100 font-sans text-xs">
                        {parcel.district}
                      </td>
                    )}

                    {isColVisible('area') && (
                      <td className="py-2.5 px-3.5 text-right font-medium text-slate-800 border-r border-slate-100 tabular-nums">
                        {parcel.areaHa} Ha
                      </td>
                    )}

                    {isColVisible('stage') && (
                      <td className="py-2.5 px-3.5 font-medium text-slate-800 border-r border-slate-100">
                        {parcel.stage}
                      </td>
                    )}

                    {isColVisible('daysInStage') && (
                      <td className="py-2.5 px-3.5 text-right border-r border-slate-100 tabular-nums">
                        <span
                          className={
                            parcel.daysInStage > parcel.expectedDaysInStage * 1.5
                              ? 'text-rose-600 font-bold'
                              : 'text-slate-800 font-medium'
                          }
                        >
                          {parcel.daysInStage}d
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          target: {parcel.expectedDaysInStage}d
                        </span>
                      </td>
                    )}

                    {isColVisible('riskScore') && (
                      <td className="py-2.5 px-3.5 text-center border-r border-slate-100">
                        <div className="flex flex-col items-center">
                          <span className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                            {parcel.riskScore}/100
                          </span>
                          <RiskBadge level={parcel.riskLevel} size="sm" showDot={false} />
                        </div>
                      </td>
                    )}

                    {isColVisible('predictedDelay') && (
                      <td className="py-2.5 px-3.5 text-right font-bold border-r border-slate-100 tabular-nums">
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
                    )}

                    {isColVisible('status') && (
                      <td className="py-2.5 px-3.5 text-center border-r border-slate-100">
                        <StatusBadge status={parcel.status} size="sm" />
                      </td>
                    )}

                    {isColVisible('action') && (
                      <td className="py-2.5 px-3.5 text-center text-blue-600 group-hover:text-blue-800 font-mono">
                        <span className="inline-flex items-center text-[11px] font-semibold">
                          INSPECT <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {sortedParcels.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200 px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-[11px]">
                Page <strong className="text-slate-900 font-bold">{safeCurrentPage}</strong> of{' '}
                <strong className="text-slate-900 font-bold">{totalPages}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] text-slate-500">
                {pageSize} parcels per page
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={safeCurrentPage <= 1}
                className="p-1 rounded-xs border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                className="flex items-center gap-1 px-2 py-1 rounded-xs border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[11px]"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = idx + 1;
                  } else if (safeCurrentPage <= 3) {
                    pageNum = idx + 1;
                  } else if (safeCurrentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx;
                  } else {
                    pageNum = safeCurrentPage - 2 + idx;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[24px] h-6 px-1.5 rounded-xs text-[11px] font-bold border transition-colors ${
                        safeCurrentPage === pageNum
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                className="flex items-center gap-1 px-2 py-1 rounded-xs border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[11px]"
                title="Next Page"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={safeCurrentPage >= totalPages}
                className="p-1 rounded-xs border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
