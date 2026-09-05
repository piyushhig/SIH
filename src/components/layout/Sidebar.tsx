import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
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
  Info,
  LogOut,
  User,
} from 'lucide-react';
import { ScreenId } from '../../types';
import { PORTFOLIO_METRICS } from '../../data/mockData';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenSettings: () => void;
  onLogout?: () => void;
  earlyWarningCount: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  onOpenSettings,
  onLogout,
  earlyWarningCount,
  isExpanded = true,
  onToggleExpand,
}) => {
  // Respect system accessibility prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // Keyboard accessibility: Escape key closes the mobile drawer
  useEffect(() => {
    if (!isExpanded || !onToggleExpand) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
          onToggleExpand();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, onToggleExpand]);

  // Prevent background scroll/interaction when mobile drawer is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobileScreen = window.innerWidth < 1024;
    if (isExpanded && isMobileScreen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isExpanded]);

  // Primary navigation strictly limited to the 7 requested core areas
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
    {
      id: 'about' as ScreenId,
      label: 'About',
      icon: Info,
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
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="sidebar-mobile-backdrop"
            id="sidebar-mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.08 : 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={onToggleExpand}
            className="fixed inset-0 bg-slate-950/55 backdrop-blur-[2px] z-40 lg:hidden cursor-pointer"
            aria-label="Close navigation drawer"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        id="sidebar-navigation"
        aria-label="Sidebar Navigation"
        className={`fixed inset-y-0 left-0 lg:static ${
          isExpanded
            ? 'w-72 sm:w-64 translate-x-0 shadow-[12px_0_36px_-8px_rgba(0,0,0,0.7),4px_0_12px_rgba(0,0,0,0.5)] lg:shadow-none'
            : '-translate-x-full lg:translate-x-0 lg:w-16 shadow-none'
        } bg-slate-950 text-slate-200 flex flex-col flex-shrink-0 border-r border-slate-800 select-none h-screen font-sans z-50 lg:z-40 ${
          prefersReducedMotion
            ? 'transition-none'
            : 'transition-[transform,width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,width]'
        }`}
      >
        {/* Brand Header */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-900/40 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                onClick={onToggleExpand}
                className="w-8 h-8 rounded-xs bg-blue-600 flex items-center justify-center text-white font-bold font-mono text-sm tracking-wider border border-blue-400/40 shadow-xs cursor-pointer flex-shrink-0 hover:bg-blue-500 active:scale-95 transition-all"
                title={isExpanded ? 'Collapse Menu' : 'Expand Menu'}
              >
                LG
              </div>
              <div
                className={`min-w-0 flex-1 overflow-hidden transition-all duration-200 ${
                  isExpanded
                    ? 'opacity-100 max-w-[180px] translate-x-0'
                    : 'opacity-0 max-w-0 -translate-x-2 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between whitespace-nowrap">
                  <span className="text-sm font-bold tracking-tight text-white font-mono leading-none">
                    LANDGUARD AI
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded-xs ml-2">
                    DEMO FEED
                  </span>
                </div>
                <span className="text-[10px] tracking-wider text-slate-400 font-medium font-mono mt-1 block uppercase truncate whitespace-nowrap">
                  ACQUISITION INTELLIGENCE
                </span>
              </div>
            </div>

            {/* Toggle button: displays X on mobile drawer, Menu on desktop */}
            {onToggleExpand && (
              <button
                id="sidebar-collapse-toggle"
                onClick={onToggleExpand}
                className={`p-1.5 rounded-xs text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-all cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center flex-shrink-0 ${
                  isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none lg:hidden'
                }`}
                title="Close drawer"
                aria-label="Close navigation drawer"
              >
                <X className="w-4 h-4 lg:hidden text-slate-300" />
                <Menu className="w-4 h-4 hidden lg:block" />
              </button>
            )}
          </div>

          <div
            className={`overflow-hidden transition-all duration-200 ${
              isExpanded ? 'max-h-12 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
            }`}
          >
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80 pt-2 whitespace-nowrap">
              <span className="text-slate-400 font-medium">SIMULATED DATA</span>
              <span className="text-slate-500 font-mono">PROTOTYPE</span>
            </div>
          </div>
        </div>

        {/* Main Navigation with Choreographed Stagger & Spring Active Indicator */}
        <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto overflow-x-hidden">
          <LayoutGroup id="sidebar-navigation-items">
            {navItems.map((item, index) => {
              const isActive =
                currentScreen === item.id ||
                (item.matchScreens && item.matchScreens.includes(currentScreen));
              const Icon = item.icon;

              // Subtle choreography: 20ms, 35ms, 50ms, 65ms...
              const staggerDelay = prefersReducedMotion ? 0 : 20 + index * 15;

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  title={!isExpanded ? item.label : undefined}
                  style={{
                    transitionDelay: isExpanded ? `${staggerDelay}ms` : '0ms',
                  }}
                  className={`w-full relative flex items-center ${
                    isExpanded ? 'justify-between px-3 py-2.5' : 'justify-center p-2.5'
                  } rounded-md text-xs font-medium group cursor-pointer select-none transition-[padding,background-color,color,opacity,transform] duration-200 ease-out ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  {/* Smooth Animated Active Pill Background & Gliding Morph */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveIndicator"
                      className="absolute inset-0 bg-blue-600/15 border border-blue-500/30 rounded-md shadow-[0_0_12px_rgba(59,130,246,0.15)] z-0"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 32,
                        mass: 0.8,
                      }}
                    >
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    </motion.div>
                  )}

                  <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <Icon
                        className={`w-4 h-4 transition-colors duration-200 ${
                          isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      />
                    </div>
                    <span
                      className={`tracking-tight font-medium whitespace-nowrap overflow-hidden transition-all duration-200 ${
                        isActive ? 'font-semibold text-slate-100' : ''
                      } ${
                        isExpanded
                          ? 'max-w-[150px] opacity-100 translate-x-0'
                          : 'max-w-0 opacity-0 -translate-x-2 pointer-events-none'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {item.badge !== undefined && (
                    <div
                      className={`relative z-10 transition-all duration-200 ${
                        isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
                      }`}
                    >
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-xs font-mono font-bold border transition-colors duration-200 ${
                          isActive
                            ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                            : 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Compact badge indicator when collapsed */}
                  {!isExpanded && item.badge !== undefined && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 border border-slate-950 shadow-[0_0_6px_rgba(244,63,94,0.7)] z-10" />
                  )}
                </button>
              );
            })}
          </LayoutGroup>
        </nav>

        {/* Lower Sidebar Area: Profile, Settings, Logout */}
        <div className="p-2.5 border-t border-slate-800 bg-slate-900/40 space-y-2 flex-shrink-0">
          {/* Profile snippet */}
          <div className="p-2 bg-slate-900/80 border border-slate-800/90 rounded-xs flex items-center justify-between overflow-hidden">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-6 h-6 rounded-xs bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0"
                title="Project Administrator"
              >
                <User className="w-3.5 h-3.5" />
              </div>
              <div
                className={`min-w-0 transition-all duration-200 ${
                  isExpanded
                    ? 'opacity-100 max-w-[160px] translate-x-0'
                    : 'opacity-0 max-w-0 -translate-x-2 pointer-events-none'
                }`}
              >
                <span className="text-[11px] font-semibold text-slate-200 block truncate leading-tight whitespace-nowrap">
                  Project Administrator
                </span>
                <span className="text-[10px] text-slate-400 block truncate font-mono whitespace-nowrap">
                  Monitoring Unit
                </span>
              </div>
            </div>
          </div>

          {/* Action Row: Settings and Logout */}
          <div className={`grid transition-all duration-200 ${isExpanded ? 'grid-cols-2 gap-1.5' : 'grid-cols-1 gap-1'}`}>
            <button
              id="btn-settings"
              onClick={onOpenSettings}
              title={!isExpanded ? 'Settings' : undefined}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xs text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95 transition-all border border-slate-800 bg-slate-900/50 cursor-pointer overflow-hidden"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span
                className={`font-mono truncate whitespace-nowrap transition-all duration-200 ${
                  isExpanded ? 'opacity-100 max-w-[60px] ml-0' : 'opacity-0 max-w-0 -ml-1 pointer-events-none'
                }`}
              >
                Settings
              </span>
            </button>

            <button
              id="btn-logout"
              onClick={onLogout}
              title={!isExpanded ? 'Logout' : undefined}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xs text-[11px] font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 active:scale-95 transition-all border border-slate-800 bg-slate-900/50 cursor-pointer overflow-hidden"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span
                className={`font-mono truncate whitespace-nowrap transition-all duration-200 ${
                  isExpanded ? 'opacity-100 max-w-[60px] ml-0' : 'opacity-0 max-w-0 -ml-1 pointer-events-none'
                }`}
              >
                Logout
              </span>
            </button>
          </div>

          {/* Environment Status Tag */}
          <div
            id="demo-mode-indicator"
            className={`bg-slate-900/90 rounded-xs border border-slate-800 text-[10px] font-mono text-slate-400 overflow-hidden transition-all duration-200 ${
              isExpanded ? 'p-2 max-h-20 opacity-100' : 'py-1.5 px-0 max-h-8 flex justify-center text-slate-600'
            }`}
          >
            {isExpanded ? (
              <div className="space-y-0.5 whitespace-nowrap">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    DEMO ENVIRONMENT
                  </span>
                  <span className="text-[9px] text-slate-500">SIMULATED</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  {PORTFOLIO_METRICS.totalProjects} Projects • {PORTFOLIO_METRICS.totalParcels.toLocaleString()} Parcels
                </p>
              </div>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Demo Environment" />
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
