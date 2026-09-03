import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  MapPin,
  TrendingUp,
  AlertTriangle,
  FileText,
  Settings,
  ShieldAlert,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
} from 'lucide-react';
import { ScreenId } from '../../types';
import { PORTFOLIO_METRICS } from '../../data/mockData';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenSettings: () => void;
  earlyWarningCount: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  onOpenSettings,
  earlyWarningCount,
  isExpanded = true,
  onToggleExpand,
}) => {
  const navItems = [
    {
      id: 'overview' as ScreenId,
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'projects' as ScreenId,
      label: 'Projects',
      icon: FolderKanban,
      matchScreens: ['projects', 'project-intelligence', 'compare-projects'],
    },
    {
      id: 'parcels' as ScreenId,
      label: 'Land Parcels',
      icon: MapPin,
      matchScreens: ['parcels', 'parcel-intelligence'],
    },
    {
      id: 'risk-analytics' as ScreenId,
      label: 'Risk Analytics',
      icon: TrendingUp,
    },
    {
      id: 'early-warnings' as ScreenId,
      label: 'Early Warnings',
      icon: AlertTriangle,
      badge: earlyWarningCount > 0 ? earlyWarningCount : undefined,
    },
    {
      id: 'reports' as ScreenId,
      label: 'Reports',
      icon: FileText,
    },
  ];

  const handleNavClick = (screenId: ScreenId) => {
    onNavigate(screenId);
    // On small & medium screens, close the drawer after selection
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onToggleExpand && isExpanded) {
      onToggleExpand();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isExpanded && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onToggleExpand}
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar-navigation"
        className={`fixed inset-y-0 left-0 lg:static ${
          isExpanded ? 'w-72 sm:w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-16'
        } bg-slate-950 text-slate-200 flex flex-col flex-shrink-0 border-r border-slate-800 select-none h-screen transition-all duration-200 ease-in-out font-sans z-50 lg:z-40 shadow-2xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-900/40 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                onClick={onToggleExpand}
                className="w-8 h-8 rounded-xs bg-blue-600 flex items-center justify-center text-white font-bold font-mono text-sm tracking-wider border border-blue-400/40 shadow-xs cursor-pointer flex-shrink-0 hover:bg-blue-500 transition-colors"
                title={isExpanded ? 'Collapse Menu' : 'Expand Menu'}
              >
                LG
              </div>
              {isExpanded && (
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-tight text-white font-mono leading-none">
                      LANDGUARD AI
                    </span>
                    <span className="text-[9px] font-mono font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded-xs">
                      DEMO FEED
                    </span>
                  </div>
                  <span className="text-[10px] tracking-wider text-slate-400 font-medium font-mono mt-1 block uppercase truncate">
                    ACQUISITION INTELLIGENCE
                  </span>
                </div>
              )}
            </div>

            {/* Toggle button: displays X on mobile drawer, Menu on desktop */}
            {onToggleExpand && isExpanded && (
              <button
                id="sidebar-collapse-toggle"
                onClick={onToggleExpand}
                className="p-1.5 rounded-xs text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                title="Close drawer"
                aria-label="Close navigation drawer"
              >
                <X className="w-4 h-4 lg:hidden text-slate-300" />
                <Menu className="w-4 h-4 hidden lg:block" />
              </button>
            )}
          </div>

          {isExpanded && (
            <div className="mt-2.5 text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80 pt-2">
              <span>GRID v2.4</span>
              <span className="text-slate-500">SIMULATED DATA</span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {isExpanded && (
            <div className="px-2 pb-1.5 pt-1 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest flex items-center justify-between">
              <span>NAVIGATION</span>
              <span className="text-[9px] text-slate-600">[HOTKEYS]</span>
            </div>
          )}

          {navItems.map((item, idx) => {
            const isActive =
              currentScreen === item.id ||
              (item.matchScreens && item.matchScreens.includes(currentScreen));
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                title={!isExpanded ? `${item.label} (0${idx + 1})` : undefined}
                className={`w-full flex items-center ${
                  isExpanded ? 'justify-between px-3 py-2' : 'justify-center p-2.5'
                } rounded-xs text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/90 text-white font-semibold shadow-xs border-l-2 border-blue-400'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isExpanded && (
                    <span
                      className={`font-mono text-[10px] ${
                        isActive ? 'text-blue-200' : 'text-slate-500 group-hover:text-slate-400'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                  )}
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  {isExpanded && <span className="tracking-tight truncate">{item.label}</span>}
                </div>

                {item.badge !== undefined && (
                  isExpanded ? (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-xs font-mono font-bold border ${
                        isActive
                          ? 'bg-white text-blue-900 border-white'
                          : 'bg-rose-950/80 text-rose-300 border-rose-700/80'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 border border-slate-950" />
                  )
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-2.5 border-t border-slate-800 bg-slate-900/30 space-y-2 flex-shrink-0">
          <button
            id="btn-settings"
            onClick={onOpenSettings}
            title={!isExpanded ? 'Settings (⌥S)' : undefined}
            className={`w-full flex items-center ${
              isExpanded ? 'justify-between px-3 py-2' : 'justify-center p-2'
            } rounded-xs text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border border-slate-800/80 bg-slate-900/50 cursor-pointer`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Settings className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              {isExpanded && <span className="font-mono text-[11px] truncate">Settings</span>}
            </div>
            {isExpanded && <span className="text-[10px] font-mono text-slate-500">⌥S</span>}
          </button>

          {isExpanded ? (
            <div
              id="demo-mode-indicator"
              className="bg-slate-900/90 rounded-xs p-2 border border-slate-800"
            >
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-1.5 min-w-0">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider truncate">
                    SIMULATED DATA
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-500">DEMO FEED</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug font-mono truncate">
                {PORTFOLIO_METRICS.totalProjects} Active Projects • {PORTFOLIO_METRICS.totalParcels.toLocaleString()} Parcels
              </p>
            </div>
          ) : (
            <div className="flex justify-center py-1 text-slate-600" title="Fixed Navigation Dock">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
