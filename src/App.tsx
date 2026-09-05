/**
 * LANDGUARD AI — Predictive Analytics for Early Detection of Land Acquisition Delays
 * SEE RISK EARLY → KNOW WHY → ACT BEFORE SLIPPAGE
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, Project, LandParcel, EarlyWarning } from './types';
import { MOCK_PROJECTS, MOCK_PARCELS, MOCK_EARLY_WARNINGS } from './data/mockData';
import { getFilteredCentralData } from './data/centralizedData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SettingsModal } from './components/SettingsModal';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ParcelsPage } from './pages/ParcelsPage';
import { ParcelDetailPage } from './pages/ParcelDetailPage';
import { RiskAnalyticsPage } from './pages/RiskAnalyticsPage';
import { EarlyWarningsPage } from './pages/EarlyWarningsPage';
import { ReportsPage } from './pages/ReportsPage';
import { CompareProjectsPage } from './pages/CompareProjectsPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { GlobalMetricsBar } from './components/layout/GlobalMetricsBar';

const SCREEN_ORDER: Record<ScreenId, number> = {
  overview: 0,
  projects: 1,
  'compare-projects': 1.5,
  'project-intelligence': 1.8,
  parcels: 2,
  'parcel-intelligence': 2.5,
  'risk-analytics': 3,
  'early-warnings': 4,
  reports: 5,
  about: 6,
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('landguard_auth') === 'true';
    }
    return false;
  });
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('overview');
  const [previousScreen, setPreviousScreen] = useState<ScreenId>('overview');
  const [transitionDirection, setTransitionDirection] = useState<number>(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-MSRDC-01');
  const [selectedParcelId, setSelectedParcelId] = useState<string>('LA-2048');
  const [compareProjectIds, setCompareProjectIds] = useState<{ idA: string; idB: string }>({
    idA: 'PRJ-MSRDC-01',
    idB: 'PRJ-NHAI-04',
  });

  // Global filters
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Centralized filtered dataset — single source of truth across all components
  const filteredData = useMemo(() => {
    return getFilteredCentralData(selectedState, selectedDistrict, globalSearch);
  }, [selectedState, selectedDistrict, globalSearch]);

  const { parcels, projects, earlyWarnings } = filteredData;

  // Selected project object (fallback to first available or baseline)
  const activeProject = useMemo(() => {
    return (
      projects.find((p) => p.id === selectedProjectId) ||
      MOCK_PROJECTS.find((p) => p.id === selectedProjectId) ||
      projects[0] ||
      MOCK_PROJECTS[0]
    );
  }, [projects, selectedProjectId]);

  // Selected parcel object (fallback to first available or baseline)
  const activeParcel = useMemo(() => {
    return (
      parcels.find((p) => p.id === selectedParcelId) ||
      MOCK_PARCELS.find((p) => p.id === selectedParcelId) ||
      parcels[0] ||
      MOCK_PARCELS[0]
    );
  }, [parcels, selectedParcelId]);

  const scrollToTop = () => {
    const container = document.getElementById('main-scroll-container');
    if (container) {
      // Instant reset prevents transition collision and jerky layout shifts
      container.scrollTop = 0;
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [currentScreen]);

  const closeSidebarOnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarExpanded(false);
    }
  };

  // Navigation handlers
  const handleNavigate = (screen: ScreenId) => {
    const dir = (SCREEN_ORDER[screen] ?? 0) >= (SCREEN_ORDER[currentScreen] ?? 0) ? 1 : -1;
    setTransitionDirection(dir);
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    closeSidebarOnMobile();
    scrollToTop();
  };

  const handleSelectProject = (projectId: string) => {
    setTransitionDirection(1);
    setSelectedProjectId(projectId);
    setPreviousScreen(currentScreen);
    setCurrentScreen('project-intelligence');
    closeSidebarOnMobile();
    scrollToTop();
  };

  const handleSelectParcel = (parcelId: string) => {
    setTransitionDirection(1);
    setSelectedParcelId(parcelId);
    setPreviousScreen(currentScreen);
    setCurrentScreen('parcel-intelligence');
    closeSidebarOnMobile();
    scrollToTop();
  };

  const handleNavigateToCompare = (projectAId?: string, projectBId?: string) => {
    if (projectAId && projectBId) {
      setCompareProjectIds({ idA: projectAId, idB: projectBId });
    } else if (projectAId) {
      const other = projects.find((p) => p.id !== projectAId)?.id || projects[1]?.id;
      setCompareProjectIds({ idA: projectAId, idB: other });
    }
    setTransitionDirection(1);
    setPreviousScreen(currentScreen);
    setCurrentScreen('compare-projects');
    closeSidebarOnMobile();
    scrollToTop();
  };

  const handleResetFilters = () => {
    setSelectedState('All States');
    setSelectedDistrict('All Districts');
    setGlobalSearch('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('landguard_auth');
    }
    setCurrentScreen('overview');
  };

  // Header Title and Subtitle resolution
  const getHeaderInfo = () => {
    switch (currentScreen) {
      case 'overview':
        return {
          title: 'Command Center',
          subtitle:
            'Monitor acquisition progress and identify potential delays before they become critical.',
        };
      case 'projects':
        return {
          title: 'Projects',
          subtitle: 'Track land acquisition progress across active infrastructure projects.',
        };
      case 'compare-projects':
        return {
          title: 'Compare Infrastructure Projects',
          subtitle:
            'Side-by-side comparative diagnostics of land acquisition milestones and delay risk factors.',
        };
      case 'project-intelligence':
        return {
          title: `Project Intelligence: ${activeProject.code}`,
          subtitle: `${activeProject.name} (${activeProject.district}, ${activeProject.state})`,
        };
      case 'parcels':
        return {
          title: 'Land Parcels',
          subtitle: 'Searchable and filterable parcel management registry.',
        };
      case 'parcel-intelligence':
        return {
          title: `Parcel Intelligence: ${activeParcel.id}`,
          subtitle: `Gat/Khasra ${activeParcel.khasraNo} • ${activeParcel.village}, ${activeParcel.district} • ${activeParcel.projectName}`,
        };
      case 'risk-analytics':
        return {
          title: 'Risk Analytics',
          subtitle: 'Macro predictive risk landscape and factor attribution metrics.',
        };
      case 'early-warnings':
        return {
          title: 'Early Warnings',
          subtitle: 'Cases requiring attention before delays become critical.',
        };
      case 'reports':
        return {
          title: 'Reports',
          subtitle: 'Generate executive briefings and statutory risk audit reports.',
        };
      case 'about':
        return {
          title: 'About LANDGUARD AI',
          subtitle: 'Predictive analytics system for early detection of land acquisition delays.',
        };
      default:
        return {
          title: 'Command Center',
          subtitle: 'Monitor acquisition progress and identify potential delays before they become critical.',
        };
    }
  };

  const headerInfo = getHeaderInfo();

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={() => {
          setIsAuthenticated(true);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('landguard_auth', 'true');
          }
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="h-screen w-screen overflow-hidden bg-[#0B0F17] text-slate-100 flex font-sans antialiased"
    >
      {/* Persistent Non-scrolling Left Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        earlyWarningCount={earlyWarnings.filter((w) => w.severity === 'High').length}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded((prev) => !prev)}
      />

      {/* Main Column: Fixed Header + Independently Scrollable Page Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#0B0F17]">
        {/* Top Header */}
        <Header
          pageTitle={headerInfo.title}
          pageSubtitle={headerInfo.subtitle}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          selectedState={selectedState}
          onStateChange={setSelectedState}
          selectedDistrict={selectedDistrict}
          onDistrictChange={setSelectedDistrict}
          earlyWarnings={earlyWarnings}
          onNavigateToParcel={handleSelectParcel}
          onNavigate={handleNavigate}
          isSidebarExpanded={isSidebarExpanded}
          onToggleSidebar={() => setIsSidebarExpanded((prev) => !prev)}
        />

        {/* Global Metrics Mini-bar persisting across all pages */}
        <GlobalMetricsBar
          projects={projects}
          parcels={parcels}
          earlyWarnings={earlyWarnings}
          onNavigate={handleNavigate}
        />

        {/* Independently Scrollable Page Content across every navigation option */}
        <main
          id="main-scroll-container"
          className="flex-1 overflow-y-auto overflow-x-hidden p-0 focus:outline-none bg-[#0B0F17] overscroll-y-contain overscroll-x-none"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: transitionDirection * 14 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
              }}
              exit={{
                opacity: 0,
                x: -transitionDirection * 14,
                transition: { duration: 0.14, ease: 'easeIn' },
              }}
              className="min-h-full pb-16"
            >
              {currentScreen === 'overview' && (
                <OverviewPage
                  projects={projects}
                  parcels={parcels}
                  selectedState={selectedState}
                  selectedDistrict={selectedDistrict}
                  searchQuery={globalSearch}
                  onSelectProject={handleSelectProject}
                  onSelectParcel={handleSelectParcel}
                  onNavigateToProjects={() => handleNavigate('projects')}
                  onNavigateToParcels={() => handleNavigate('parcels')}
                />
              )}

              {currentScreen === 'projects' && (
                <ProjectsPage
                  projects={projects}
                  onSelectProject={handleSelectProject}
                  selectedState={selectedState}
                  onStateChange={setSelectedState}
                  selectedDistrict={selectedDistrict}
                  onDistrictChange={setSelectedDistrict}
                  onNavigateToCompare={handleNavigateToCompare}
                />
              )}

              {currentScreen === 'compare-projects' && (
                <CompareProjectsPage
                  projects={projects}
                  parcels={parcels}
                  initialProjectAId={compareProjectIds.idA}
                  initialProjectBId={compareProjectIds.idB}
                  onBack={() => handleNavigate('projects')}
                  onSelectProject={handleSelectProject}
                  onSelectParcel={handleSelectParcel}
                />
              )}

              {currentScreen === 'project-intelligence' && (
                <ProjectDetailPage
                  project={activeProject}
                  parcels={parcels}
                  onBack={() => handleNavigate('projects')}
                  onSelectParcel={handleSelectParcel}
                />
              )}

              {currentScreen === 'parcels' && (
                <ParcelsPage
                  parcels={parcels}
                  onSelectParcel={handleSelectParcel}
                  selectedState={selectedState}
                  selectedDistrict={selectedDistrict}
                  onDistrictChange={setSelectedDistrict}
                />
              )}

              {currentScreen === 'parcel-intelligence' && (
                <ParcelDetailPage
                  parcel={activeParcel}
                  onBack={() => {
                    if (previousScreen === 'project-intelligence') {
                      handleNavigate('project-intelligence');
                    } else {
                      handleNavigate('parcels');
                    }
                  }}
                  onNavigateToProject={(projId) => handleSelectProject(projId)}
                />
              )}

              {currentScreen === 'risk-analytics' && (
                <RiskAnalyticsPage projects={projects} parcels={parcels} />
              )}

              {currentScreen === 'early-warnings' && (
                <EarlyWarningsPage
                  warnings={earlyWarnings}
                  onSelectParcel={handleSelectParcel}
                />
              )}

              {currentScreen === 'reports' && (
                <ReportsPage projects={projects} parcels={parcels} />
              )}

              {currentScreen === 'about' && (
                <AboutPage onNavigate={handleNavigate} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetFilters={handleResetFilters}
      />
    </motion.div>
  );
}
