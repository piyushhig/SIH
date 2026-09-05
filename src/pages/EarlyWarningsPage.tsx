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
import { ScrollReveal } from '../components/common/ScrollReveal';

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
      <ScrollReveal delayMs={0}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight font-sans">Early Warning Center</h2>
              {highCount > 0 && (
                <span className="text-[10px] bg-rose-950/60 text-rose-300 font-mono font-bold px-2 py-0.5 rounded border border-rose-800/80">
                  {highCount} HIGH PRIORITY ALERTS
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cases requiring attention before delays become critical.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-300 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded shadow-xs flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
              Live Monitoring
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* Filter Tabs & Search */}
      <ScrollReveal delayMs={80}>
        <div className="bg-slate-900/90 rounded-lg border border-slate-800/80 p-3.5 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Severity Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded border border-slate-800/90 font-mono text-xs">
            <button
              onClick={() => setSeverityFilter('All')}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                severityFilter === 'All'
                  ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ALL ({warnings.length})
            </button>
            <button
              onClick={() => setSeverityFilter('High')}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                severityFilter === 'High'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-rose-400 hover:bg-rose-950/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              HIGH ({highCount})
            </button>
            <button
              onClick={() => setSeverityFilter('Medium')}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                severityFilter === 'Medium'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-400 hover:bg-amber-950/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              MEDIUM ({medCount})
            </button>
            <button
              onClick={() => setSeverityFilter('Low')}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                severityFilter === 'Low'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-400 hover:bg-emerald-950/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              LOW ({lowCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search warnings, parcel ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded focus:bg-slate-900 focus:outline-none focus:border-blue-500 text-slate-200 font-mono placeholder-slate-500"
            />
          </div>
        </div>
        </div>
      </ScrollReveal>

      {/* Warning Cards List */}
      <ScrollReveal delayMs={160}>
        <div className="space-y-3">
        {filteredWarnings.length === 0 ? (
          <div className="bg-slate-900/80 rounded-lg border border-slate-800 p-10 text-center text-slate-400 text-xs font-sans">
            No early warnings found matching the selected filter.
          </div>
        ) : (
          filteredWarnings.map((warning) => {
            const isHigh = warning.severity === 'High';
            const isMed = warning.severity === 'Medium';
            const isAcknowledged = acknowledgedIds[warning.id];

            let cardStyle = 'border-slate-800 bg-slate-900/90 hover:border-slate-700';
            let badgeStyle = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80';
            let stripeColor = 'bg-emerald-500';

            if (isHigh) {
              cardStyle = 'border-rose-900/50 bg-[#160b12] hover:border-rose-700/60';
              badgeStyle = 'bg-rose-950/80 text-rose-300 border-rose-800/80 font-bold';
              stripeColor = 'bg-rose-500';
            } else if (isMed) {
              cardStyle = 'border-amber-900/50 bg-[#17120a] hover:border-amber-700/60';
              badgeStyle = 'bg-amber-950/80 text-amber-300 border-amber-800/80 font-bold';
              stripeColor = 'bg-amber-500';
            }

            return (
              <div
                key={warning.id}
                onClick={() => onSelectParcel(warning.parcelId)}
                className={`rounded-lg border ${cardStyle} p-4 shadow-md hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group ${
                  isAcknowledged ? 'opacity-65' : ''
                }`}
              >
                {/* Left severity indicator stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stripeColor}`} />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pl-2.5">
                  {/* Left content block */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                      <span className={`text-[9px] px-2 py-0.5 rounded uppercase border ${badgeStyle}`}>
                        {warning.severity} PRIORITY
                      </span>
                      <span className="text-slate-500 font-mono text-[10px] uppercase">Parcel:</span>
                      <span className="font-mono text-xs font-bold text-white group-hover:text-blue-400">
                        {warning.parcelId}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500 font-mono text-[10px] uppercase">Project:</span>
                      <span className="text-xs text-slate-200 font-semibold font-sans">
                        {warning.projectName}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500 font-mono text-[10px] uppercase">Stage:</span>
                      <span className="text-xs text-slate-300 font-medium font-mono">
                        {warning.stage} ({warning.district})
                      </span>
                      {isAcknowledged && (
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold uppercase border border-slate-700">
                          ACKNOWLEDGED
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1.5 font-sans">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                          ISSUE:
                        </span>
                        <h3 className="text-xs font-bold text-white leading-snug">
                          {warning.issue}
                        </h3>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[10px] font-bold text-blue-400 uppercase font-mono tracking-wider flex-shrink-0">
                        RECOMMENDED ACTION:
                      </span>
                      <span className="text-slate-200 font-medium bg-blue-950/40 px-2.5 py-1 rounded border border-blue-800/60 font-sans text-xs">
                        {warning.recommendedAction}
                      </span>
                    </div>
                  </div>

                  {/* Right metrics and action controls */}
                  <div className="flex sm:flex-row lg:flex-col items-end justify-between lg:justify-center gap-2.5 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80 font-mono">
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                          Risk
                        </span>
                        <span className="text-sm font-bold font-mono text-white tabular-nums">
                          {warning.riskScore} / 100
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                          Predicted Delay
                        </span>
                        <span className={`text-sm font-bold font-mono tabular-nums ${isHigh ? 'text-rose-400' : 'text-amber-400'}`}>
                          +{warning.predictedDelayDays} days
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleAcknowledge(warning.id, e)}
                        className={`text-xs px-2.5 py-1.5 rounded border transition-colors cursor-pointer font-medium ${
                          isAcknowledged
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        {isAcknowledged ? 'Mark Unresolved' : 'Acknowledge'}
                      </button>

                      <span className="text-xs font-semibold text-blue-300 group-hover:text-blue-200 flex items-center gap-1 bg-blue-950/60 px-2.5 py-1.5 rounded border border-blue-800/70">
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
      </ScrollReveal>
    </div>
  );
};
