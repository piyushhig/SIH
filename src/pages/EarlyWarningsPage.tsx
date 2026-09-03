import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { EarlyWarning } from '../types';

interface EarlyWarningsPageProps {
  warnings: EarlyWarning[];
  onSelectParcel: (parcelId: string) => void;
}

export const EarlyWarningsPage: React.FC<EarlyWarningsPageProps> = ({
  warnings,
  onSelectParcel,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [acknowledgedIds, setAcknowledgedIds] = useState<Record<string, boolean>>({});

  const toggleAcknowledge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcknowledgedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredWarnings = warnings.filter((w) => {
    const matchesSeverity = severityFilter === 'All' || w.severity === severityFilter;
    const matchesSearch =
      w.parcelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.district.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSeverity && matchesSearch;
  });

  const highCount = warnings.filter((w) => w.severity === 'High').length;
  const medCount = warnings.filter((w) => w.severity === 'Medium').length;
  const lowCount = warnings.filter((w) => w.severity === 'Low').length;

  return (
    <div id="screen-early-warnings" className="p-5 space-y-5 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-sans">Early Warning Center</h2>
            {highCount > 0 && (
              <span className="text-[10px] bg-rose-100 text-rose-800 font-mono font-bold px-2 py-0.5 rounded-xs border border-rose-300">
                {highCount} HIGH PRIORITY ALERTS
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cases requiring attention before delays become critical.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-xs shadow-2xs flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Live Monitoring
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-xs border border-slate-200 p-3 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Severity Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xs font-mono text-xs">
            <button
              onClick={() => setSeverityFilter('All')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-xs transition-colors cursor-pointer ${
                severityFilter === 'All'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ALL ({warnings.length})
            </button>
            <button
              onClick={() => setSeverityFilter('High')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                severityFilter === 'High'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-xs bg-rose-400" />
              HIGH ({highCount})
            </button>
            <button
              onClick={() => setSeverityFilter('Medium')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                severityFilter === 'Medium'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-xs bg-amber-300" />
              MEDIUM ({medCount})
            </button>
            <button
              onClick={() => setSeverityFilter('Low')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                severityFilter === 'Low'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-xs bg-emerald-300" />
              LOW ({lowCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search warnings, parcel ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-xs focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Warning Cards List */}
      <div className="space-y-2.5">
        {filteredWarnings.length === 0 ? (
          <div className="bg-white rounded-xs border border-slate-200 p-10 text-center text-slate-400 text-xs font-sans">
            No early warnings found matching the selected filter.
          </div>
        ) : (
          filteredWarnings.map((warning) => {
            const isHigh = warning.severity === 'High';
            const isMed = warning.severity === 'Medium';
            const isAcknowledged = acknowledgedIds[warning.id];

            let borderStyle = 'border-slate-200 hover:border-slate-300';
            let badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
            let stripeColor = 'bg-emerald-500';

            if (isHigh) {
              borderStyle = 'border-rose-200 hover:border-rose-300 bg-rose-50/20';
              badgeStyle = 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
              stripeColor = 'bg-rose-600';
            } else if (isMed) {
              borderStyle = 'border-amber-200 hover:border-amber-300 bg-amber-50/20';
              badgeStyle = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
              stripeColor = 'bg-amber-500';
            }

            return (
              <div
                key={warning.id}
                onClick={() => onSelectParcel(warning.parcelId)}
                className={`bg-white rounded-xs border ${borderStyle} p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer relative overflow-hidden group ${
                  isAcknowledged ? 'opacity-70 bg-slate-50' : ''
                }`}
              >
                {/* Left severity indicator stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${stripeColor}`} />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pl-2">
                  {/* Left content block: WHAT CASE, WHERE, WHAT IS WRONG, WHAT SHOULD BE DONE */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-xs uppercase border ${badgeStyle}`}>
                        {warning.severity} PRIORITY
                      </span>
                      <span className="text-slate-400 font-mono text-[10px] uppercase">Parcel:</span>
                      <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        {warning.parcelId}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 font-mono text-[10px] uppercase">Project:</span>
                      <span className="text-xs text-slate-800 font-semibold font-sans">
                        {warning.projectName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 font-mono text-[10px] uppercase">Stage:</span>
                      <span className="text-xs text-slate-700 font-medium font-mono">
                        {warning.stage} ({warning.district})
                      </span>
                      {isAcknowledged && (
                        <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-xs font-semibold uppercase">
                          ACKNOWLEDGED
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1.5 font-sans">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
                          ISSUE:
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">
                          {warning.issue}
                        </h3>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[10px] font-bold text-blue-900 uppercase font-mono tracking-wider flex-shrink-0">
                        RECOMMENDED ACTION:
                      </span>
                      <span className="text-slate-900 font-medium bg-blue-50/60 px-2 py-0.5 rounded-xs border border-blue-200 font-sans text-xs">
                        {warning.recommendedAction}
                      </span>
                    </div>
                  </div>

                  {/* Right metrics and action controls: HOW SERIOUS */}
                  <div className="flex sm:flex-row lg:flex-col items-end justify-between lg:justify-center gap-2.5 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 font-mono">
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                          Risk
                        </span>
                        <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                          {warning.riskScore} / 100
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                          Predicted Delay
                        </span>
                        <span className={`text-sm font-bold font-mono tabular-nums ${isHigh ? 'text-rose-600' : 'text-amber-600'}`}>
                          +{warning.predictedDelayDays} days
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleAcknowledge(warning.id, e)}
                        className={`text-xs px-2.5 py-1 rounded-xs border transition-colors cursor-pointer font-medium ${
                          isAcknowledged
                            ? 'bg-slate-100 text-slate-600 border-slate-300'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-2xs'
                        }`}
                      >
                        {isAcknowledged ? 'Mark Unresolved' : 'Acknowledge'}
                      </button>

                      <span className="text-xs font-semibold text-blue-700 group-hover:text-blue-900 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-xs border border-blue-200">
                        Inspect Case <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
