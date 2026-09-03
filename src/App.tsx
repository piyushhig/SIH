/**
 * LANDGUARD AI — Predictive Analytics for Early Detection of Land Acquisition Delays
 * SEE RISK EARLY → KNOW WHY → ACT BEFORE SLIPPAGE
 */

import React, { useState, useMemo } from 'react';
import { ScreenId, Project, LandParcel, EarlyWarning } from './types';
import { MOCK_PROJECTS, MOCK_PARCELS, MOCK_EARLY_WARNINGS } from './data/mockData';
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
import { GlobalMetricsBar } from './components/layout/GlobalMetricsBar';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('overview');
  const [previousScreen, setPreviousScreen] = useState<ScreenId>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-MSRDC-01');
  const [selectedParcelId, setSelectedParcelId] = useState<string>('LA-2048');
  const [compareProjectIds, setCompareProjectIds] = useState<{ idA: string; idB: string }>({
    idA: 'PRJ-MSRDC-01',
    idB: 'PRJ-NHAI-02',
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

  // Projects and Parcels
  const projects = MOCK_PROJECTS;
  const parcels = MOCK_PARCELS;
  const earlyWarnings = MOCK_EARLY_WARNINGS;

  // Selected project object
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Selected parcel object
  const activeParcel = useMemo(() => {
    return parcels.find((p) => p.id === selectedParcelId) || parcels[0];
  }, [parcels, selectedParcelId]);

  const scrollToTop = () => {
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closeSidebarOnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarExpanded(false);
    }
  };

  // Navigation handlers
  const handleNavigate = (screen: ScreenId) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    closeSidebarOnMobile();
    scrollToTop();
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setPreviousScreen(currentScreen);
    setCurrentScreen('project-intelligence');
    closeSidebarOnMobile();
    scrollToTop();
  };

  const handleSelectParcel = (parcelId: string) => {
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
      default:
        return {
          title: 'Command Center',
          subtitle: 'Monitor acquisition progress and identify potential delays before they become critical.',
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 flex font-sans antialiased">
      {/* Persistent Non-scrolling Left Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        earlyWarningCount={earlyWarnings.filter((w) => w.severity === 'High').length}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded((prev) => !prev)}
      />

      {/* Main Column: Fixed Header + Independently Scrollable Page Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
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
          className="flex-1 overflow-y-auto overflow-x-hidden p-0 scroll-smooth focus:outline-none"
        >
          <div className="min-h-full pb-16">
            {currentScreen === 'overview' && (
              <OverviewPage
                projects={projects}
                parcels={parcels}
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
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
