import React, { useState } from 'react';
import { Search, Bell, ChevronDown, CheckCircle2, Menu } from 'lucide-react';
import { EarlyWarning, ScreenId } from '../../types';
import { ALL_STATES, DISTRICTS_BY_STATE } from '../../data/centralizedData';

interface HeaderProps {
  pageTitle: string;
  pageSubtitle?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  earlyWarnings: EarlyWarning[];
  onNavigateToParcel: (parcelId: string) => void;
  onNavigate: (screen: ScreenId) => void;
  isSidebarExpanded?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  pageSubtitle,
  searchQuery,
  onSearchChange,
  selectedState,
  onStateChange,
  selectedDistrict,
  onDistrictChange,
  earlyWarnings,
  onNavigateToParcel,
  onNavigate,
  isSidebarExpanded = true,
  onToggleSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const states = ALL_STATES;
  const currentDistricts = DISTRICTS_BY_STATE[selectedState] || ['All Districts'];

  const highWarnings = earlyWarnings.filter((w) => w.severity === 'High');

  return (
    <header
      id="top-header"
      className="bg-[#0b0f17]/85 backdrop-blur-md border-b border-slate-800/90 z-30 px-5 sm:px-6 py-3 shadow-sm transition-colors flex-shrink-0"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Page Title Section with Three-line Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              id="header-sidebar-toggle-btn"
              onClick={onToggleSidebar}
              className="min-w-[38px] min-h-[38px] p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 bg-slate-900/90 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center flex-shrink-0"
              title={isSidebarExpanded ? 'Close navigation drawer' : 'Open navigation drawer'}
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-4 h-4 text-slate-300" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2 font-sans">
                {pageTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
                DEMO FEED
              </span>
            </div>
            {pageSubtitle && (
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl font-normal">{pageSubtitle}</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Global Search */}
          <div className="relative min-w-[210px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search parcel, project, village... [ / ]"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-slate-900/90 border border-slate-800 rounded-md focus:bg-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-200 placeholder-slate-500 transition-all"
            />
          </div>

          {/* State Selector */}
          <div className="relative">
            <select
              id="state-selector"
              value={selectedState}
              onChange={(e) => {
                onStateChange(e.target.value);
                onDistrictChange('All Districts');
              }}
              className="appearance-none text-xs font-mono bg-slate-900/90 border border-slate-800 rounded-md pl-2.5 pr-7 py-1.5 font-medium text-slate-200 hover:bg-slate-850 hover:border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
            >
              {states.map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-slate-200">
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* District Selector */}
          <div className="relative">
            <select
              id="district-selector"
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="appearance-none text-xs font-mono bg-slate-900/90 border border-slate-800 rounded-md pl-2.5 pr-7 py-1.5 font-medium text-slate-200 hover:bg-slate-850 hover:border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
            >
              {currentDistricts.map((dst) => (
                <option key={dst} value={dst} className="bg-slate-900 text-slate-200">
                  {dst}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800 bg-slate-900/90 cursor-pointer"
              title="Early Warning Notifications"
            >
              <Bell className="w-4 h-4" />
              {highWarnings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-slate-950 shadow-[0_0_6px_rgba(244,63,94,0.6)]">
                  {highWarnings.length}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-md shadow-2xl border border-slate-800 py-1.5 z-50 text-xs"
              >
                <div className="px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <span className="font-semibold text-slate-200 font-mono text-[11px] uppercase tracking-wider">
                    Early Warnings
                  </span>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('early-warnings');
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline font-mono font-medium"
                  >
                    View All ({earlyWarnings.length})
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/70">
                  {highWarnings.slice(0, 4).map((w) => (
                    <div
                      key={w.id}
                      onClick={() => {
                        onNavigateToParcel(w.parcelId);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-rose-400 font-mono text-xs">{w.parcelId}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{w.detectedAt}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                        {w.issue}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>Risk: {w.riskScore}/100</span>
                        <span>•</span>
                        <span className="text-amber-400 font-semibold font-mono">+{w.predictedDelayDays}d delay</span>
                      </div>
                    </div>
                  ))}
                  {highWarnings.length === 0 && (
                    <div className="p-4 text-center text-slate-400 font-mono text-xs">
                      No active critical alerts
                    </div>
                  )}
                </div>
                <div className="px-3 pt-2 pb-1.5 border-t border-slate-800 text-center bg-slate-950/40">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('early-warnings');
                    }}
                    className="text-xs text-blue-400 font-medium hover:text-blue-300 font-mono"
                  >
                    Open Early Warning Center →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div
            id="user-profile-header"
            className="flex items-center gap-2 pl-2 border-l border-slate-800"
          >
            <div className="w-7 h-7 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold font-mono text-xs border border-blue-500/30">
              PA
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-slate-200 block leading-tight font-mono">
                Administrator
              </span>
              <span className="text-[10px] text-slate-500 block leading-none font-medium">
                Portfolio Planning • Demo Feed
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
