import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  AlertOctagon,
  ChevronRight,
  Filter,
  Eye,
  Info,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export interface GISHotspot {
  id: string;
  parcelId: string;
  projectId: string;
  projectName: string;
  district: string;
  state: string;
  stage: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  delayProbability: number;
  predictedDelayDays: number;
  primaryRiskDriver: string;
  coords: { x: number; y: number }; // percentage coordinates on map canvas 0-100
}

export const MOCK_GIS_HOTSPOTS: GISHotspot[] = [
  {
    id: 'HS-01',
    parcelId: 'MH-THN-0412',
    projectId: 'PRJ-001',
    projectName: 'Western Dedicated Freight Corridor (Package 1)',
    district: 'Thane',
    state: 'Maharashtra',
    stage: 'Compensation',
    riskScore: 88,
    riskLevel: 'High',
    delayProbability: 86,
    predictedDelayDays: 52,
    primaryRiskDriver: 'Civil partition suit & disputed co-sharer inheritance',
    coords: { x: 28, y: 58 },
  },
  {
    id: 'HS-02',
    parcelId: 'MH-RGD-0892',
    projectId: 'PRJ-001',
    projectName: 'Western Dedicated Freight Corridor (Package 1)',
    district: 'Raigad',
    state: 'Maharashtra',
    stage: 'Compensation',
    riskScore: 78,
    riskLevel: 'High',
    delayProbability: 78,
    predictedDelayDays: 42,
    primaryRiskDriver: 'Treasury award compensation disbursement backlog',
    coords: { x: 30, y: 64 },
  },
  {
    id: 'HS-03',
    parcelId: 'GJ-AMD-0115',
    projectId: 'PRJ-003',
    projectName: 'Ahmedabad-Dholera Express Highway',
    district: 'Ahmedabad',
    state: 'Gujarat',
    stage: 'Valuation',
    riskScore: 74,
    riskLevel: 'High',
    delayProbability: 72,
    predictedDelayDays: 38,
    primaryRiskDriver: 'Circle rate vs market valuation dispute in peri-urban stretch',
    coords: { x: 24, y: 46 },
  },
  {
    id: 'HS-04',
    parcelId: 'KA-BLR-0621',
    projectId: 'PRJ-002',
    projectName: 'Bengaluru-Chennai Expressway (Phase 2)',
    district: 'Bengaluru Rural',
    state: 'Karnataka',
    stage: 'Valuation',
    riskScore: 68,
    riskLevel: 'High',
    delayProbability: 66,
    predictedDelayDays: 34,
    primaryRiskDriver: 'Commercial horticultural land classification challenge',
    coords: { x: 42, y: 80 },
  },
  {
    id: 'HS-05',
    parcelId: 'TN-KPM-0344',
    projectId: 'PRJ-002',
    projectName: 'Bengaluru-Chennai Expressway (Phase 2)',
    district: 'Kanchipuram',
    state: 'Tamil Nadu',
    stage: 'Survey',
    riskScore: 54,
    riskLevel: 'Medium',
    delayProbability: 51,
    predictedDelayDays: 22,
    primaryRiskDriver: 'Encroachment boundary overlap with minor irrigation canal',
    coords: { x: 50, y: 82 },
  },
  {
    id: 'HS-06',
    parcelId: 'DL-SWD-0042',
    projectId: 'PRJ-001',
    projectName: 'Western Dedicated Freight Corridor (Package 1)',
    district: 'South West Delhi',
    state: 'Delhi NCR',
    stage: 'Possession',
    riskScore: 48,
    riskLevel: 'Medium',
    delayProbability: 44,
    predictedDelayDays: 18,
    primaryRiskDriver: 'Physical structure demolition & utility pole shifting',
    coords: { x: 36, y: 28 },
  },
  {
    id: 'HS-07',
    parcelId: 'UP-VRN-0210',
    projectId: 'PRJ-004',
    projectName: 'Varanasi-Kolkata Economic Corridor',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    stage: 'Notification',
    riskScore: 28,
    riskLevel: 'Low',
    delayProbability: 22,
    predictedDelayDays: 8,
    primaryRiskDriver: 'Preliminary 3A notification objections within normal limits',
    coords: { x: 60, y: 38 },
  },
  {
    id: 'HS-08',
    parcelId: 'JH-RNC-0108',
    projectId: 'PRJ-004',
    projectName: 'Varanasi-Kolkata Economic Corridor',
    district: 'Ranchi',
    state: 'Jharkhand',
    stage: 'Survey',
    riskScore: 62,
    riskLevel: 'High',
    delayProbability: 60,
    predictedDelayDays: 29,
    primaryRiskDriver: 'Scheduled tribal land (CNT Act) transfer permissions required',
    coords: { x: 68, y: 46 },
  },
  {
    id: 'HS-09',
    parcelId: 'MH-NGP-0551',
    projectId: 'PRJ-005',
    projectName: 'Mumbai-Nagpur Samruddhi Connector',
    district: 'Nagpur',
    state: 'Maharashtra',
    stage: 'Possession',
    riskScore: 22,
    riskLevel: 'Low',
    delayProbability: 18,
    predictedDelayDays: 6,
    primaryRiskDriver: 'Consent awards finalized; physical possession handover scheduled',
    coords: { x: 48, y: 56 },
  },
];

interface GISRiskHotspotsProps {
  onSelectParcel: (parcelId: string) => void;
  onSelectProject?: (projectId: string) => void;
}

export const GISRiskHotspots: React.FC<GISRiskHotspotsProps> = ({
  onSelectParcel,
  onSelectProject,
}) => {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>('HS-01');
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const selectedHotspot = MOCK_GIS_HOTSPOTS.find((h) => h.id === selectedHotspotId) || MOCK_GIS_HOTSPOTS[0];

  const filteredHotspots = MOCK_GIS_HOTSPOTS.filter((h) => {
    if (filterSeverity === 'All') return true;
    return h.riskLevel === filterSeverity;
  });

  return (
    <div id="gis-risk-hotspots-panel" className="bg-white rounded-xs border border-slate-200 shadow-2xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>GIS Risk Hotspots</span>
            </h3>
            <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-1.5 py-0.2 rounded-xs font-medium">
              Geographic Map
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Geographic view of high-delay-risk parcels along active infrastructure corridors
          </p>
        </div>

        {/* Filter controls & Demo Feed Label */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center bg-white border border-slate-200 rounded-xs p-0.5">
            <button
              onClick={() => setFilterSeverity('All')}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs transition-colors ${
                filterSeverity === 'All' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ALL ({MOCK_GIS_HOTSPOTS.length})
            </button>
            <button
              onClick={() => setFilterSeverity('High')}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs transition-colors flex items-center gap-1 ${
                filterSeverity === 'High' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              HIGH ({MOCK_GIS_HOTSPOTS.filter((h) => h.riskLevel === 'High').length})
            </button>
            <button
              onClick={() => setFilterSeverity('Medium')}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs transition-colors ${
                filterSeverity === 'Medium' ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              MED
            </button>
            <button
              onClick={() => setFilterSeverity('Low')}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs transition-colors ${
                filterSeverity === 'Low' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              LOW
            </button>
          </div>

          <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-xs font-medium">
            Interactive Hotspot Map
          </span>
        </div>
      </div>

      {/* Main Map + Inspection Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Map Canvas (Left 8 cols) */}
        <div className="lg:col-span-8 p-4 bg-slate-900/95 relative min-h-[360px] flex flex-col justify-between overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-slate-200">
          {/* Top Canvas Badges */}
          <div className="relative z-10 flex items-center justify-between text-slate-300 text-[11px]">
            <div className="flex items-center gap-2 font-medium">
              <span className="bg-slate-800/90 text-blue-300 border border-slate-700 px-2 py-0.5 rounded-xs">
                Active Corridor Alignment
              </span>
              <span className="hidden sm:inline text-slate-400 text-[10px]">
                National Infrastructure Network
              </span>
            </div>
            <span className="text-slate-300 text-[11px] font-medium">
              Click any circle to inspect parcel
            </span>
          </div>

          {/* SVG Map Display */}
          <div className="relative w-full h-[320px] my-2">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full text-slate-800"
            >
              {/* Subtle geospatial grid lines */}
              <defs>
                <pattern id="gis-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#gis-grid)" />

              {/* Simplified India Territorial Outline & Corridor Alignments */}
              {/* Stylized National Land Boundary */}
              <path
                d="M 28,15 L 42,12 L 48,18 L 44,26 L 62,30 L 74,32 L 80,44 L 72,52 L 68,64 L 56,86 L 46,92 L 36,80 L 26,62 L 20,48 L 22,34 Z"
                fill="rgba(15, 23, 42, 0.6)"
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="0.75"
                strokeDasharray="1.5 1.5"
              />

              {/* Major Freight & Highway Corridors */}
              {/* 1. Western Dedicated Freight Corridor: Delhi -> Ahmedabad -> Thane -> Raigad */}
              <path
                d="M 36,28 Q 28,40 24,46 T 28,58 T 30,64"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="2 1.5"
                opacity="0.85"
              />

              {/* 2. Bengaluru-Chennai Expressway: Bengaluru -> Kanchipuram */}
              <path
                d="M 42,80 L 50,82"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="2 1.5"
                opacity="0.85"
              />

              {/* 3. Varanasi-Kolkata Corridor: Varanasi -> Ranchi -> Kolkata */}
              <path
                d="M 60,38 L 68,46 L 76,54"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="2 1.5"
                opacity="0.85"
              />

              {/* 4. Mumbai-Nagpur Samruddhi Corridor */}
              <path
                d="M 28,58 L 48,56"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="2 1.5"
                opacity="0.85"
              />

              {/* Connection between Delhi and Varanasi */}
              <path
                d="M 36,28 L 60,38"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="0.8"
                strokeDasharray="1 2"
                opacity="0.4"
              />
            </svg>

            {/* Hotspot Markers Overlay */}
            {filteredHotspots.map((hotspot) => {
              const isSelected = hotspot.id === selectedHotspot.id;
              let markerColor = 'bg-emerald-500 ring-emerald-400/40 text-emerald-900';
              let ringColor = 'border-emerald-500';

              if (hotspot.riskLevel === 'High') {
                markerColor = 'bg-rose-600 ring-rose-500/50 text-rose-100 animate-pulse';
                ringColor = 'border-rose-500';
              } else if (hotspot.riskLevel === 'Medium') {
                markerColor = 'bg-amber-500 ring-amber-400/40 text-amber-900';
                ringColor = 'border-amber-500';
              }

              return (
                <div
                  key={hotspot.id}
                  style={{
                    left: `${hotspot.coords.x}%`,
                    top: `${hotspot.coords.y}%`,
                  }}
                  onClick={() => setSelectedHotspotId(hotspot.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  title={`${hotspot.parcelId} (${hotspot.district}) - ${hotspot.riskScore}/100`}
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <div className={`absolute -inset-2 rounded-full border-2 border-dashed ${ringColor} animate-spin-slow`} />
                  )}

                  {/* Marker Node */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shadow-lg transition-transform group-hover:scale-125 ${markerColor} ${
                      isSelected ? 'scale-125 ring-4' : 'ring-2'
                    }`}
                  >
                    {hotspot.riskLevel === 'High' ? '!' : hotspot.riskScore}
                  </div>

                  {/* Tooltip Tag */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-6 bg-slate-900/95 text-white text-[10px] font-mono px-2 py-0.5 rounded-xs border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-md">
                    <span className="font-bold">{hotspot.district}</span> • {hotspot.riskScore}/100
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Map Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                RED = High Delay Risk
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                AMBER = Medium Delay Risk
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                GREEN = Low Delay Risk
              </span>
            </div>

            <span className="text-slate-500">
              Showing {filteredHotspots.length} flagged corridor locations
            </span>
          </div>
        </div>

        {/* Concise Hotspot Inspector / Preview Card (Right 4 cols) */}
        <div className="lg:col-span-4 p-4 bg-white flex flex-col justify-between space-y-3 font-mono">
          <div className="space-y-3">
            {/* Inspector Title */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Parcel Preview
                </span>
              </div>
              <RiskBadge level={selectedHotspot.riskLevel} size="sm" />
            </div>

            {/* Selected Parcel Summary Card */}
            <div className="p-3 rounded-xs border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Parcel ID</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {selectedHotspot.parcelId}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Stage</span>
                  <span className="text-xs font-semibold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-xs">
                    {selectedHotspot.stage}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Project</span>
                <span className="text-xs font-sans font-semibold text-slate-800 leading-tight block">
                  {selectedHotspot.projectName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Risk Level</span>
                  <strong className={selectedHotspot.riskLevel === 'High' ? 'text-rose-700' : selectedHotspot.riskLevel === 'Medium' ? 'text-amber-700' : 'text-emerald-700'}>
                    {selectedHotspot.riskLevel} ({selectedHotspot.riskScore}/100)
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Delay Estimate</span>
                  <strong className="text-rose-700 font-bold">+{selectedHotspot.predictedDelayDays} days</strong>
                </div>
              </div>
            </div>

            {/* Top Risk Driver */}
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Top Risk Driver:
              </span>
              <p className="text-xs text-slate-700 font-sans leading-relaxed mt-0.5 bg-slate-50 p-2.5 rounded-xs border border-slate-200">
                "{selectedHotspot.primaryRiskDriver}"
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => onSelectParcel(selectedHotspot.parcelId)}
              className="w-full py-2 px-3 rounded-xs text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Inspect Parcel Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {onSelectProject && (
              <button
                onClick={() => onSelectProject(selectedHotspot.projectId)}
                className="w-full py-1.5 px-3 rounded-xs text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Project Overview</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
