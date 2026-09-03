import React, { useState } from 'react';
import { Search, Bell, ChevronDown, CheckCircle2, Menu } from 'lucide-react';
import { EarlyWarning, ScreenId } from '../../types';

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

  const states = ['All States', 'Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu'];
  const districtsByState: Record<string, string[]> = {
    'All States': ['All Districts', 'Bharuch', 'Palghar', 'Pune', 'Bengaluru Urban', 'Kanchipuram'],
    Gujarat: ['All Districts', 'Bharuch'],
    Maharashtra: ['All Districts', 'Palghar', 'Pune'],
    Karnataka: ['All Districts', 'Bengaluru Urban'],
    'Tamil Nadu': ['All Districts', 'Kanchipuram'],
  };

  const currentDistricts = districtsByState[selectedState] || ['All Districts'];

  const highWarnings = earlyWarnings.filter((w) => w.severity === 'High');

  return (
    <header
      id="top-header"
      className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3 shadow-2xs"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Page Title Section with Three-line Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              id="header-sidebar-toggle-btn"
              onClick={onToggleSidebar}
              className="min-w-[40px] min-h-[40px] sm:min-w-[36px] sm:min-h-[36px] p-2 rounded-xs text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 bg-white transition-colors cursor-pointer shadow-2xs flex items-center justify-center flex-shrink-0"
              title={isSidebarExpanded ? 'Close navigation drawer' : 'Open navigation drawer'}
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5 sm:w-4 sm:h-4 text-slate-800" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 font-sans">
                {pageTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                DEMO FEED
              </span>
            </div>
            {pageSubtitle && (
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl font-normal">{pageSubtitle}</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Global Search */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search parcel, project, village... [ / ]"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800 placeholder-slate-400 transition-colors"
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
              className="appearance-none text-xs font-mono bg-slate-50 border border-slate-200 rounded pl-2.5 pr-7 py-1.5 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* District Selector */}
          <div className="relative">
            <select
              id="district-selector"
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="appearance-none text-xs font-mono bg-slate-50 border border-slate-200 rounded pl-2.5 pr-7 py-1.5 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              {currentDistricts.map((dst) => (
                <option key={dst} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200 bg-slate-50"
              title="Early Warning Notifications"
            >
              <Bell className="w-4 h-4" />
              {highWarnings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                  {highWarnings.length}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg border border-slate-200 py-1.5 z-50 text-xs"
              >
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <span className="font-semibold text-slate-800 font-mono text-[11px] uppercase tracking-wider">Early Warnings</span>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('early-warnings');
                    }}
                    className="text-[11px] text-blue-600 hover:underline font-mono font-medium"
                  >
                    View All ({earlyWarnings.length})
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {highWarnings.slice(0, 4).map((w) => (
                    <div
                      key={w.id}
                      onClick={() => {
                        onNavigateToParcel(w.parcelId);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-rose-700 font-mono text-xs">{w.parcelId}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{w.detectedAt}</span>
                      </div>
                      <p className="text-slate-700 text-[11px] line-clamp-2 leading-relaxed">
                        {w.issue}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span>Risk: {w.riskScore}/100</span>
                        <span>•</span>
                        <span className="text-amber-700 font-semibold font-mono">+{w.predictedDelayDays}d delay</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-center bg-slate-50/50">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('early-warnings');
                    }}
                    className="text-xs text-blue-600 font-medium hover:text-blue-800 font-mono"
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
            className="flex items-center gap-2 pl-2 border-l border-slate-200"
          >
            <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-xs border border-slate-700">
              PA
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-slate-800 block leading-tight font-mono">
                Project Administrator
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
