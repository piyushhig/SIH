import React from 'react';
import { Project, LandParcel, EarlyWarning, ScreenId } from '../../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, TrendingUp, Layers, MapPin, ArrowRight } from 'lucide-react';

interface GlobalMetricsBarProps {
  projects?: Project[];
  parcels?: LandParcel[];
  earlyWarnings?: EarlyWarning[];
  onNavigate?: (screen: ScreenId) => void;
}

export const GlobalMetricsBar: React.FC<GlobalMetricsBarProps> = ({
  projects = [],
  parcels = [],
  earlyWarnings = [],
  onNavigate,
}) => {
  // Calculations
  const totalProjects = projects?.length ?? 0;
  const overallAvgRisk = totalProjects > 0
    ? Math.round((projects || []).reduce((acc, p) => acc + (p?.avgRiskScore || 0), 0) / totalProjects)
    : 0;

  const totalParcelsCount = parcels?.length ?? 0;
  const highRiskParcelsCount = (parcels || []).filter((p) => p?.riskLevel === 'High').length;
  const criticalWarningsCount = (earlyWarnings || []).filter((w) => w?.severity === 'High').length;
  const avgDelayDays = totalProjects > 0
    ? Math.round((projects || []).reduce((acc, p) => acc + (p?.predictedDelayDays || 0), 0) / totalProjects)
    : 0;

  // Overall risk tier classification according to standard (0-30 Low, 31-60 Medium, 61-100 High)
  let riskBadgeColor = 'text-emerald-400 bg-emerald-950/70 border-emerald-700/60';
  let riskLabel = 'LOW RISK';
  if (overallAvgRisk > 60) {
    riskBadgeColor = 'text-rose-400 bg-rose-950/70 border-rose-700/60';
    riskLabel = 'HIGH RISK';
  } else if (overallAvgRisk > 30) {
    riskBadgeColor = 'text-amber-400 bg-amber-950/70 border-amber-700/60';
    riskLabel = 'MEDIUM RISK';
  }

  return (
    <div
      id="global-metrics-mini-bar"
      className="bg-[#0b0f17]/90 backdrop-blur-sm border-b border-slate-800/80 text-slate-300 px-4 sm:px-6 py-2 z-20 shadow-xs select-none flex-shrink-0"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs font-mono">
        {/* Left Core Metrics: Total Projects & Overall Avg Risk */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Brand Tag */}
          <div className="hidden xl:flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest font-semibold border-r border-slate-800 pr-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            GLOBAL METRICS
          </div>

          {/* 1. Total Project Count */}
          <div
            onClick={() => onNavigate?.('projects')}
            className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors group"
            title="Click to view all active infrastructure projects"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-400 text-[11px]">PROJECTS:</span>
            <span className="text-white font-bold text-xs tracking-tight tabular-nums">
              {totalProjects}
            </span>
            <span className="text-[10px] text-slate-500 hidden md:inline">ACTIVE</span>
          </div>

          <div className="h-3 w-px bg-slate-800 hidden sm:block" />

          {/* 2. Overall Average Risk Score */}
          <div
            onClick={() => onNavigate?.('risk-analytics')}
            className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors group"
            title="Click to view full Risk Analytics diagnostics"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-400 text-[11px]">AVG RISK SCORE:</span>
            <span className="text-white font-bold text-xs tracking-tight tabular-nums">
              {overallAvgRisk}
              <span className="text-[10px] text-slate-500 font-normal">/100</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-xs border font-bold ${riskBadgeColor}`}>
              {riskLabel}
            </span>
          </div>

          <div className="h-3 w-px bg-slate-800 hidden md:block" />

          {/* 3. Total Surveyed Parcels */}
          <div
            onClick={() => onNavigate?.('parcels')}
            className="hidden md:flex items-center gap-2 cursor-pointer hover:text-white transition-colors group"
            title="Click to view all surveyed Land Parcels"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-400 text-[11px]">TOTAL PARCELS:</span>
            <span className="text-white font-bold text-xs tracking-tight tabular-nums">
              {totalParcelsCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right Telemetry & Warnings Strip */}
        <div className="flex items-center gap-3 sm:gap-5 text-[11px]">
          {/* High-Risk Parcels Count */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">HIGH-RISK:</span>
            <span className="text-rose-400 font-bold tabular-nums">
              {highRiskParcelsCount}
            </span>
          </div>

          {/* Mean Predicted Delay */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-slate-400">MEAN DELAY:</span>
            <span className="text-amber-400 font-bold tabular-nums">
              +{avgDelayDays}d
            </span>
          </div>

          {/* Critical Early Warnings */}
          {criticalWarningsCount > 0 && (
            <button
              type="button"
              onClick={() => onNavigate?.('early-warnings')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900/90 transition-colors cursor-pointer text-[10px] font-bold"
              title="Click to view critical alerts"
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>{criticalWarningsCount} CRITICAL ALERTS</span>
            </button>
          )}

          {/* Live Sync Status */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-500 text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>SLA ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
