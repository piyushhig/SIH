import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  Clock,
  TrendingUp,
  ShieldAlert,
  Compass,
} from 'lucide-react';
import { LandParcel } from '../../types';
import {
  STATE_GEO_CONFIG,
  DISTRICT_GEO_CONFIG,
  MOCK_GIS_HOTSPOTS,
  GISHotspot,
} from '../../data/centralizedData';
import { RiskBadge } from '../common/RiskBadge';

interface GISRiskHotspotsProps {
  parcels?: LandParcel[];
  selectedState?: string;
  selectedDistrict?: string;
  searchQuery?: string;
  onSelectParcel: (parcelId: string) => void;
  onSelectProject?: (projectId: string) => void;
}

export const GISRiskHotspots: React.FC<GISRiskHotspotsProps> = ({
  parcels = [],
  selectedState = 'All States',
  selectedDistrict = 'All Districts',
  searchQuery = '',
  onSelectParcel,
  onSelectProject,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const regionHighlightRef = useRef<L.Circle | null>(null);

  // Basemap style: dark (CartoDB Dark Matter) or voyager (CartoDB Voyager)
  const [basemapType, setBasemapType] = useState<'dark' | 'voyager'>('dark');
  const [isWheelZoomActive, setIsWheelZoomActive] = useState<boolean>(false);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Severity filter: All / High / Medium / Low
  const [severityFilter, setSeverityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  // View mode: 'hotspots' (Regional Corridors) vs 'parcels' (Cadastral Parcels)
  const [viewMode, setViewMode] = useState<'hotspots' | 'parcels'>('hotspots');

  // Currently selected item for drawer / detail inspection
  const [selectedHotspot, setSelectedHotspot] = useState<GISHotspot | null>(MOCK_GIS_HOTSPOTS[0]);
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);

  // Filtered hotspots based on state, district, search, and severity
  const displayedHotspots = MOCK_GIS_HOTSPOTS.filter((h) => {
    if (selectedState !== 'All States' && h.state !== selectedState) return false;
    if (selectedDistrict !== 'All Districts' && h.district !== selectedDistrict) return false;
    if (severityFilter !== 'All' && h.riskLevel !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        h.name.toLowerCase().includes(q) ||
        h.district.toLowerCase().includes(q) ||
        h.projectName.toLowerCase().includes(q) ||
        h.primaryRiskFactor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered parcels based on state, district, search, and severity
  const displayedParcels = parcels.filter((p) => {
    if (severityFilter !== 'All' && p.riskLevel !== severityFilter) return false;
    return true;
  });

  // Set default selection when dataset changes
  useEffect(() => {
    if (viewMode === 'hotspots') {
      if (displayedHotspots.length > 0) {
        // Pick highest risk one
        const top = [...displayedHotspots].sort((a, b) => b.riskScore - a.riskScore)[0];
        setSelectedHotspot(top);
      } else {
        setSelectedHotspot(null);
      }
    } else {
      if (displayedParcels.length > 0) {
        const top = [...displayedParcels].sort((a, b) => b.riskScore - a.riskScore)[0];
        setSelectedParcel(top);
      } else {
        setSelectedParcel(null);
      }
    }
  }, [viewMode, selectedState, selectedDistrict, severityFilter, searchQuery]);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered on India with scrollWheelZoom: false to avoid hijacking page scrolling
    const map = L.map(mapContainerRef.current, {
      center: [21.5, 78.9],
      zoom: 5,
      zoomControl: false,
      minZoom: 4,
      maxZoom: 18,
      scrollWheelZoom: false, // Prevents accidental page scroll hijacking
    });

    // Deliberate click enables wheel zoom for precision GIS inspection
    map.on('click', () => {
      map.scrollWheelZoom.enable();
      setIsWheelZoomActive(true);
    });

    // Default CartoDB Dark Matter tile layer
    const darkTileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    tileLayerRef.current = darkTileLayer;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Responsive container resize observer
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Basemap Switcher
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (basemapType === 'voyager') {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);
    }
  }, [basemapType]);

  // 3. Render Markers (Hotspots or Parcels)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (viewMode === 'hotspots') {
      displayedHotspots.forEach((h) => {
        const isSelected = selectedHotspot?.id === h.id;

        // Risk-colored markers matching RiskBadge
        const color =
          h.riskLevel === 'High' ? '#f43f5e' : h.riskLevel === 'Medium' ? '#f59e0b' : '#10b981';
        const ringColor =
          h.riskLevel === 'High' ? 'rgba(244,63,94,0.4)' : h.riskLevel === 'Medium' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)';

        // Size dynamically scaled by riskScore (e.g. 24px - 36px)
        const diameter = Math.round(24 + (h.riskScore / 100) * 12);
        const radius = Math.round(diameter / 2);

        const pulseEffect =
          h.riskLevel === 'High'
            ? `<span style="background-color: ${color}; opacity: 0.45;" class="absolute -inset-2 rounded-full animate-ping pointer-events-none"></span>`
            : '';

        const selectedRing = isSelected
          ? 'ring-3 ring-blue-400 ring-offset-2 ring-offset-slate-950 scale-115 z-20 shadow-[0_0_20px_rgba(59,130,246,0.8)]'
          : 'shadow-lg border-slate-950';

        const customIcon = L.divIcon({
          className: 'landguard-hotspot-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200">
              ${pulseEffect}
              <div
                style="background-color: ${color}; width: ${diameter}px; height: ${diameter}px; box-shadow: 0 0 12px ${ringColor};"
                class="relative rounded-full flex flex-col items-center justify-center font-mono font-bold text-white border-2 ${selectedRing} transition-all duration-200"
              >
                <span class="text-[11px] leading-none">${h.riskScore}</span>
              </div>
            </div>
          `,
          iconSize: [diameter, diameter],
          iconAnchor: [radius, radius],
          popupAnchor: [0, -radius - 4],
        });

        const marker = L.marker([h.latitude, h.longitude], { icon: customIcon });

        // Popup Content
        const badgeClass =
          h.riskLevel === 'High'
            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
            : h.riskLevel === 'Medium'
            ? 'bg-amber-950/80 text-amber-300 border-amber-800'
            : 'bg-emerald-950/80 text-emerald-300 border-emerald-800';

        const popupContent = document.createElement('div');
        popupContent.className =
          'p-3.5 font-sans text-xs min-w-[260px] max-w-[290px] text-slate-100 bg-slate-900 rounded-md border border-slate-700 shadow-2xl';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div class="flex items-center gap-1.5 font-mono">
              <span class="w-2 h-2 rounded-full" style="background-color: ${color};"></span>
              <span class="font-bold text-white text-xs">${h.district} Hotspot</span>
            </div>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono ${badgeClass}">
              ${h.riskLevel.toUpperCase()} RISK
            </span>
          </div>

          <div class="font-semibold text-slate-100 text-xs mb-0.5 leading-tight">${h.name}</div>
          <div class="text-[11px] text-slate-400 mb-2 font-mono">${h.projectName}</div>

          <div class="grid grid-cols-2 gap-2 bg-slate-950/80 p-2.5 rounded border border-slate-800/80 mb-2.5 font-mono text-[11px]">
            <div>
              <span class="text-[9px] text-slate-400 block uppercase">Risk Score</span>
              <span class="font-bold text-slate-200">${h.riskScore} / 100</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-400 block uppercase">Predicted Delay</span>
              <span class="font-bold text-rose-400">+${h.predictedDelayDays} days</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-400 block uppercase">Delay Prob</span>
              <span class="font-medium text-slate-300">${h.delayProbability}%</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-400 block uppercase">Stage</span>
              <span class="font-medium text-slate-300 truncate">${h.stage}</span>
            </div>
          </div>

          <div class="mb-3 text-[11px] bg-slate-950/40 p-2 rounded border border-slate-800/50">
            <span class="text-[9px] text-slate-400 block uppercase font-mono mb-0.5">Primary Driver:</span>
            <span class="text-slate-200 line-clamp-2 leading-relaxed">${h.primaryRiskFactor}</span>
          </div>

          <button
            id="btn-hotspot-${h.id}"
            class="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Focus Hotspot & Corridors</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        `;

        const btn = popupContent.querySelector(`#btn-hotspot-${h.id}`);
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            setSelectedHotspot(h);
            map.flyTo([h.latitude, h.longitude], 12, { duration: 1 });
          });
        }

        marker.bindPopup(popupContent, {
          closeButton: true,
          className: 'landguard-custom-popup',
        });

        marker.on('click', () => {
          setSelectedHotspot(h);
        });

        markersLayer.addLayer(marker);
      });
    } else {
      // Cadastral parcels mode
      displayedParcels.forEach((p) => {
        const isSelected = selectedParcel?.id === p.id;
        const color =
          p.riskLevel === 'High' ? '#f43f5e' : p.riskLevel === 'Medium' ? '#f59e0b' : '#10b981';

        const diameter = Math.round(20 + (p.riskScore / 100) * 10);
        const radius = Math.round(diameter / 2);

        const customIcon = L.divIcon({
          className: 'landguard-parcel-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              <div
                style="background-color: ${color}; width: ${diameter}px; height: ${diameter}px;"
                class="rounded-full flex items-center justify-center font-mono font-bold text-white text-[10px] border border-slate-950 ${
                  isSelected ? 'ring-2 ring-blue-400 scale-120' : 'shadow-md'
                }"
              >
                ${p.riskScore}
              </div>
            </div>
          `,
          iconSize: [diameter, diameter],
          iconAnchor: [radius, radius],
          popupAnchor: [0, -radius - 2],
        });

        const lat = p.latitude ?? 20.5937;
        const lng = p.longitude ?? 78.9629;
        const marker = L.marker([lat, lng], { icon: customIcon });

        const popupContent = document.createElement('div');
        popupContent.className =
          'p-3 font-sans text-xs min-w-[240px] text-slate-100 bg-slate-900 rounded-md border border-slate-700 shadow-xl';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5 font-mono">
            <span class="font-bold text-white text-xs">${p.id}</span>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded border ${
              p.riskLevel === 'High'
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : p.riskLevel === 'Medium'
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }">
              ${p.riskLevel.toUpperCase()}
            </span>
          </div>
          <div class="font-semibold text-slate-100 text-xs mb-0.5">${p.projectName}</div>
          <div class="text-[11px] text-slate-400 mb-2 font-mono">${p.city}, ${p.district}</div>
          <div class="flex justify-between text-[11px] font-mono bg-slate-950 p-2 rounded mb-2">
            <span>Delay: <strong class="text-rose-400">+${p.predictedDelayDays}d</strong></span>
            <span>Prob: <strong class="text-slate-300">${p.delayProbability}%</strong></span>
          </div>
          <button id="btn-parcel-${p.id}" class="w-full py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold cursor-pointer">
            View Parcel Details
          </button>
        `;

        const btn = popupContent.querySelector(`#btn-parcel-${p.id}`);
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            onSelectParcel(p.id);
          });
        }

        marker.bindPopup(popupContent, {
          closeButton: true,
          className: 'landguard-custom-popup',
        });

        marker.on('click', () => {
          setSelectedParcel(p);
        });

        markersLayer.addLayer(marker);
      });
    }
  }, [viewMode, displayedHotspots, displayedParcels, selectedHotspot, selectedParcel, onSelectParcel]);

  // 4. Smooth Fly-To / Zoom when State or District changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedDistrict !== 'All Districts' && DISTRICT_GEO_CONFIG[selectedDistrict]) {
      const cfg = DISTRICT_GEO_CONFIG[selectedDistrict];
      map.flyTo([cfg.lat, cfg.lng], cfg.zoom, { duration: 1.2 });

      if (regionHighlightRef.current) {
        map.removeLayer(regionHighlightRef.current);
      }
      regionHighlightRef.current = L.circle([cfg.lat, cfg.lng], {
        radius: 16000,
        color: '#3b82f6',
        fillColor: '#60a5fa',
        fillOpacity: 0.1,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(map);
    } else if (selectedState !== 'All States' && STATE_GEO_CONFIG[selectedState]) {
      const cfg = STATE_GEO_CONFIG[selectedState];
      map.flyTo([cfg.lat, cfg.lng], cfg.zoom, { duration: 1.2 });

      if (regionHighlightRef.current) {
        map.removeLayer(regionHighlightRef.current);
      }
      regionHighlightRef.current = L.circle([cfg.lat, cfg.lng], {
        radius: 110000,
        color: '#3b82f6',
        fillColor: '#60a5fa',
        fillOpacity: 0.06,
        weight: 1.5,
        dashArray: '6, 6',
      }).addTo(map);
    } else {
      if (regionHighlightRef.current) {
        map.removeLayer(regionHighlightRef.current);
        regionHighlightRef.current = null;
      }
      map.flyTo([21.5, 78.9], 5, { duration: 1 });
    }
  }, [selectedState, selectedDistrict]);

  // Zoom control helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetToIndia = () => {
    mapInstanceRef.current?.flyTo([21.5, 78.9], 5, { duration: 1 });
  };

  const highCount = displayedHotspots.filter((h) => h.riskLevel === 'High').length;
  const medCount = displayedHotspots.filter((h) => h.riskLevel === 'Medium').length;
  const lowCount = displayedHotspots.filter((h) => h.riskLevel === 'Low').length;

  return (
    <div
      id="gis-risk-hotspots-panel"
      className="bg-slate-900/90 rounded-lg border border-slate-800 shadow-xl overflow-hidden"
    >
      {/* Map Header & Toolbar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>GIS Risk Hotspots — Interactive Corridor Map</span>
            </h3>
            <span className="text-[10px] text-blue-300 bg-blue-950/60 border border-blue-800/80 px-2 py-0.5 rounded font-mono font-semibold">
              LIVE CARTO TILES
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-sans">
            Real geographic coordinates across high-impact infrastructure corridors (Thane, Raigad, Bharuch, Palghar, Pune, Bengaluru, Sriperumbudur).
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* Mode Switcher: Hotspots vs Parcels */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => setViewMode('hotspots')}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-colors cursor-pointer ${
                viewMode === 'hotspots' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Corridor Hotspots ({displayedHotspots.length})
            </button>
            <button
              onClick={() => setViewMode('parcels')}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-colors cursor-pointer ${
                viewMode === 'parcels' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cadastral Parcels ({displayedParcels.length})
            </button>
          </div>

          {/* Severity filter buttons */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => setSeverityFilter('All')}
              className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors cursor-pointer ${
                severityFilter === 'All' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setSeverityFilter('High')}
              className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1 ${
                severityFilter === 'High'
                  ? 'bg-rose-900/90 text-rose-200 border border-rose-700/80'
                  : 'text-rose-400 hover:bg-rose-950/50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              HIGH ({highCount})
            </button>
            <button
              onClick={() => setSeverityFilter('Medium')}
              className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1 ${
                severityFilter === 'Medium'
                  ? 'bg-amber-900/90 text-amber-200 border border-amber-700/80'
                  : 'text-amber-400 hover:bg-amber-950/50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              MED ({medCount})
            </button>
            <button
              onClick={() => setSeverityFilter('Low')}
              className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1 ${
                severityFilter === 'Low'
                  ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-700/80'
                  : 'text-emerald-400 hover:bg-emerald-950/50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              LOW ({lowCount})
            </button>
          </div>

          {/* Basemap toggle: Dark vs Voyager */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => setBasemapType('dark')}
              className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors cursor-pointer ${
                basemapType === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setBasemapType('voyager')}
              className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors cursor-pointer ${
                basemapType === 'voyager' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Voyager
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div
        className="relative w-full h-[440px] sm:h-[490px] bg-slate-950 overflow-hidden group"
        onMouseLeave={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.scrollWheelZoom.disable();
            setIsWheelZoomActive(false);
          }
        }}
      >
        {/* Leaflet DOM container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" style={{ background: '#090d16' }} />

        {/* Wheel Zoom Interaction Indicator */}
        <div className="absolute top-12 left-3 z-10 hidden sm:flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-xs border border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono select-none">
          <span className={`w-1.5 h-1.5 rounded-full ${isWheelZoomActive ? 'bg-blue-400 animate-ping' : 'bg-slate-500'}`} />
          <span className={isWheelZoomActive ? 'text-blue-300 font-semibold' : 'text-slate-400'}>
            {isWheelZoomActive ? 'Map Zoom Active • Move cursor off map to scroll page' : 'Page Scroll Active • Click map for wheel zoom'}
          </span>
        </div>

        {/* Floating Custom Controls */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 shadow-lg">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded text-slate-100 font-bold text-base flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded text-slate-100 font-bold text-base flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs"
            title="Zoom out"
          >
            −
          </button>
          <button
            onClick={handleResetToIndia}
            className="h-8 px-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded text-slate-200 font-mono text-[10px] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors backdrop-blur-xs"
            title="Reset to India view"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>India</span>
          </button>
        </div>

        {/* Active Region & Hotspot Count Badge */}
        <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded px-3 py-1.5 shadow-md text-xs font-mono flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-slate-200 font-semibold">
            {selectedState === 'All States' ? 'National Corridor Overview' : selectedState}
            {selectedDistrict !== 'All Districts' ? ` • ${selectedDistrict}` : ''}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            {viewMode === 'hotspots' ? `${displayedHotspots.length} Corridors` : `${displayedParcels.length} Parcels`}
          </span>
        </div>

        {/* Quick Corridor Jump Pills */}
        <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded p-1 text-[10px] font-mono">
          <span className="text-slate-400 px-1.5 flex items-center gap-1">
            <Compass className="w-3 h-3 text-blue-400" /> Jump:
          </span>
          {[
            { label: 'Thane', lat: 19.2183, lng: 72.9781 },
            { label: 'Raigad', lat: 18.5158, lng: 73.1812 },
            { label: 'Palghar', lat: 19.6967, lng: 72.7699 },
            { label: 'Bharuch', lat: 21.7051, lng: 72.9959 },
            { label: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
            { label: 'Sriperumbudur', lat: 12.9702, lng: 79.9448 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => mapInstanceRef.current?.flyTo([item.lat, item.lng], 11, { duration: 1.2 })}
              className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded px-3 py-1.5 shadow-md flex items-center gap-3.5 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
            <span className="text-slate-300 font-medium">High Risk (60+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            <span className="text-slate-300 font-medium">Medium (30-59)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            <span className="text-slate-300 font-medium">Low (&lt;30)</span>
          </div>
        </div>
      </div>

      {/* Selected Hotspot Intelligence Drawer */}
      {viewMode === 'hotspots' && selectedHotspot && (
        <div className="p-4 bg-slate-950/70 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                {selectedHotspot.id}
              </span>
              <RiskBadge level={selectedHotspot.riskLevel} size="sm" />
              <span className="text-xs text-slate-200 font-semibold">
                {selectedHotspot.name}
              </span>
              <span className="text-xs text-slate-600 font-mono">•</span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedHotspot.district}, {selectedHotspot.state}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              <strong className="text-slate-100">Primary Bottleneck:</strong> {selectedHotspot.primaryRiskFactor}
            </p>
            <p className="text-[11px] text-blue-400 font-mono">
              <strong>SLA Action:</strong> {selectedHotspot.recommendedAction}
            </p>
          </div>

          <div className="flex items-center gap-4 self-start md:self-auto flex-shrink-0">
            <div className="flex items-center gap-3 text-right font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Risk Score</span>
                <span className="font-bold text-white text-sm">{selectedHotspot.riskScore}/100</span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-[10px] text-slate-400 block uppercase">Delay Est.</span>
                <span className="font-bold text-rose-400 text-sm">+{selectedHotspot.predictedDelayDays}d</span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-[10px] text-slate-400 block uppercase">Parcels</span>
                <span className="font-bold text-slate-300 text-sm">{selectedHotspot.parcelCount}</span>
              </div>
            </div>

            <button
              onClick={() => {
                // Find a matching parcel in this district if available
                const matching = parcels.find((p) => p.district === selectedHotspot.district);
                if (matching) {
                  onSelectParcel(matching.id);
                } else if (parcels.length > 0) {
                  onSelectParcel(parcels[0].id);
                }
              }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Inspect Corridors</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Selected Parcel Intelligence Drawer (when in parcels mode) */}
      {viewMode === 'parcels' && selectedParcel && (
        <div className="p-4 bg-slate-950/70 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-white">
                {selectedParcel.id} ({selectedParcel.khasraNo})
              </span>
              <RiskBadge level={selectedParcel.riskLevel} size="sm" />
              <span className="text-xs text-slate-300 font-medium">
                {selectedParcel.projectName}
              </span>
              <span className="text-xs text-slate-600 font-mono">•</span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedParcel.city}, {selectedParcel.district}, {selectedParcel.state}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans line-clamp-1">
              <strong className="text-slate-300">Primary Risk:</strong> {selectedParcel.primaryRiskFactor}
            </p>
          </div>

          <div className="flex items-center gap-4 self-start md:self-auto flex-shrink-0">
            <div className="flex items-center gap-3 text-right font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Risk Score</span>
                <span className="font-bold text-white">{selectedParcel.riskScore}/100</span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-[10px] text-slate-400 block uppercase">Predicted Delay</span>
                <span className="font-bold text-rose-400">+{selectedParcel.predictedDelayDays}d</span>
              </div>
            </div>

            <button
              onClick={() => onSelectParcel(selectedParcel.id)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
