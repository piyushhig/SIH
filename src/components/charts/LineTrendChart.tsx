import React, { useState } from 'react';
import { MOCK_TREND_DATA } from '../../data/mockData';
import { TrendingUp, Activity, BarChart2, CheckCircle2 } from 'lucide-react';

type ProjectFilter = 'all' | 'expressway' | 'metro';

export const LineTrendChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [showConfidenceBands, setShowConfidenceBands] = useState<boolean>(true);

  // Filter multiplier to demonstrate dynamic simulation
  const getMultiplier = () => {
    if (projectFilter === 'expressway') return 1.08;
    if (projectFilter === 'metro') return 0.92;
    return 1.0;
  };

  const mult = getMultiplier();
  const rawData = MOCK_TREND_DATA;

  // Process data with scenario multiplier & confidence bounds
  const data = rawData.map((d, i) => {
    const risk = Math.min(95, Math.round(d.avgRiskIndex * mult));
    const delay = Math.round(d.avgDelayDays * mult);
    // P90 upper bound and P10 lower bound for ML projected points (indices 5, 6, 7)
    const p90 = d.projected ? Math.min(100, Math.round(risk * 1.15)) : risk;
    const p10 = d.projected ? Math.max(20, Math.round(risk * 0.90)) : risk;

    return {
      ...d,
      avgRiskIndex: risk,
      avgDelayDays: delay,
      p90,
      p10,
    };
  });

  const width = 840;
  const height = 260;
  const padding = { top: 25, right: 35, bottom: 45, left: 45 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minRisk = 20;
  const maxRisk = 85;

  const getY = (val: number) => {
    return padding.top + chartHeight - ((val - minRisk) / (maxRisk - minRisk)) * chartHeight;
  };

  // Calculate coordinates
  const points = data.map((d, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartWidth;
    const y = getY(d.avgRiskIndex);
    const yP90 = getY(d.p90);
    const yP10 = getY(d.p10);
    return { ...d, x, y, yP90, yP10, index };
  });

  // Split into actual (indices 0..5) and projected (indices 5..7)
  const actualPoints = points.slice(0, 6);
  const projectedPoints = points.slice(5);

  const createPathD = (pts: typeof points) => {
    return pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  };

  const actualD = createPathD(actualPoints);
  const projectedD = createPathD(projectedPoints);

  // Area under curve for actual historical
  const areaD = `${actualD} L ${actualPoints[actualPoints.length - 1].x} ${padding.top + chartHeight} L ${actualPoints[0].x} ${padding.top + chartHeight} Z`;

  // Shaded ML Confidence Band polygon (October & November)
  const confidenceBandD = `M ${projectedPoints[0].x} ${projectedPoints[0].y} ` +
    projectedPoints.map(p => `L ${p.x} ${p.yP90}`).join(' ') +
    ` ` +
    [...projectedPoints].reverse().map(p => `L ${p.x} ${p.yP10}`).join(' ') +
    ` Z`;

  const hoveredPoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div id="delay-risk-trend-component" className="w-full space-y-3">
      {/* Top Filter & Metric Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xs border border-slate-200 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setProjectFilter('all')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              projectFilter === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ALL PROJECTS
          </button>
          <button
            type="button"
            onClick={() => setProjectFilter('expressway')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              projectFilter === 'expressway'
                ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EXPRESSWAYS (NHAI)
          </button>
          <button
            type="button"
            onClick={() => setProjectFilter('metro')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              projectFilter === 'metro'
                ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            METRO RAIL / URBAN
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showConfidenceBands}
              onChange={(e) => setShowConfidenceBands(e.target.checked)}
              className="rounded-xs border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span>P50/P90 Confidence Fan</span>
          </label>
          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
            R² = 0.942 • ARIMA-X
          </span>
        </div>
      </div>

      {/* Mini Telemetry Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-blue-700 rounded-xs inline-block" />
            <span className="font-semibold text-slate-800">Historical Risk Index (0–100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-blue-500 inline-block" />
            <span className="text-blue-700 font-semibold">ML Projected Median (P50)</span>
          </div>
          {showConfidenceBands && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-blue-100 border border-blue-300 rounded-xs inline-block" />
              <span className="text-slate-500">P90 Adverse Risk Bound</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-500">
          Audit Cutoff: <strong className="text-slate-800">September 2026</strong>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="overflow-x-auto relative bg-slate-50/40 rounded-xs border border-slate-200/80 p-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ minWidth: '600px' }}
        >
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
            <pattern id="diagonalHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#93C5FD" strokeWidth="1" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Y Axis Grid lines */}
          {[20, 35, 50, 65, 80].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="2 2"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono font-medium"
                >
                  {level}
                </text>
              </g>
            );
          })}

          {/* Shaded Confidence Band (ML Forecast P10-P90) */}
          {showConfidenceBands && (
            <>
              <path d={confidenceBandD} fill="#DBEAFE" fillOpacity="0.6" />
              <path d={confidenceBandD} fill="url(#diagonalHatch)" />
            </>
          )}

          {/* Area under curve for Historical */}
          <path d={areaD} fill="url(#actualGradient)" />

          {/* Cutoff Vertical Divider Line */}
          <line
            x1={actualPoints[actualPoints.length - 1].x}
            y1={padding.top}
            x2={actualPoints[actualPoints.length - 1].x}
            y2={padding.top + chartHeight}
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text
            x={actualPoints[actualPoints.length - 1].x}
            y={padding.top - 8}
            textAnchor="middle"
            className="text-[9px] fill-slate-500 font-mono font-bold uppercase tracking-wider"
          >
            TODAY • AUDIT CUTOFF
          </text>

          {/* Historical Solid Line */}
          <path
            d={actualD}
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ML Projected Dashed Line */}
          <path
            d={projectedD}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* P90 Ceiling dashed indicator line */}
          {showConfidenceBands && (
            <path
              d={projectedPoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.yP90}` : `${acc} L ${p.x} ${p.yP90}`), '')}
              fill="none"
              stroke="#60A5FA"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          )}

          {/* Hover Crosshair Vertical Line */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={padding.top}
              x2={hoveredPoint.x}
              y2={padding.top + chartHeight}
              stroke="#3B82F6"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* Interactive Data Points */}
          {points.map((p) => {
            const isHovered = hoveredIdx === p.index;
            const isProjected = p.projected;

            return (
              <g
                key={p.month}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(p.index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Invisible larger hit target for easy hovering */}
                <rect
                  x={p.x - 25}
                  y={padding.top}
                  width={50}
                  height={chartHeight + padding.bottom}
                  fill="transparent"
                />

                {/* Point circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill={isProjected ? '#FFFFFF' : '#1D4ED8'}
                  stroke={isProjected ? '#2563EB' : '#FFFFFF'}
                  strokeWidth={2}
                  className="transition-all duration-150"
                />

                {/* X Axis Label */}
                <text
                  x={p.x}
                  y={padding.top + chartHeight + 18}
                  textAnchor="middle"
                  className={`text-[10px] font-mono ${
                    isHovered
                      ? 'fill-blue-700 font-bold'
                      : isProjected
                      ? 'fill-blue-600 font-medium'
                      : 'fill-slate-600 font-normal'
                  }`}
                >
                  {p.month.replace(' (Current)', '').replace(' (Projected)', '*')}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Interactive Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 text-white rounded-xs px-3.5 py-2.5 text-xs shadow-md border border-slate-700 font-mono"
            style={{
              left: `${Math.min(72, Math.max(10, (hoveredPoint.index / (data.length - 1)) * 82))}%`,
              top: '20px',
            }}
          >
            <div className="font-bold text-slate-100 mb-1.5 border-b border-slate-700 pb-1 flex items-center justify-between gap-4">
              <span>{hoveredPoint.month}</span>
              {hoveredPoint.projected ? (
                <span className="text-[10px] text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded-xs border border-amber-800">
                  ML FORECAST
                </span>
              ) : (
                <span className="text-[10px] text-blue-300 bg-blue-950/80 px-1.5 py-0.2 rounded-xs border border-blue-800">
                  AUDITED HISTORICAL
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <span className="text-slate-400">Risk Index:</span>
              <span className="font-bold text-blue-300 text-right tabular-nums">
                {hoveredPoint.avgRiskIndex} / 100
              </span>

              <span className="text-slate-400">Average Delay:</span>
              <span className="font-bold text-amber-300 text-right tabular-nums">
                +{hoveredPoint.avgDelayDays} days
              </span>

              <span className="text-slate-400">High-Risk Parcels:</span>
              <span className="font-bold text-rose-400 text-right tabular-nums">
                {hoveredPoint.highRiskParcels}
              </span>

              {hoveredPoint.projected && showConfidenceBands && (
                <>
                  <span className="text-slate-400">P90 Risk Ceiling:</span>
                  <span className="font-bold text-rose-300 text-right tabular-nums">
                    {hoveredPoint.p90} / 100
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* KPI Insight Strip below chart */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
        <div className="bg-slate-50 border border-slate-200 rounded-xs p-2">
          <span className="text-[10px] text-slate-500 block uppercase">6-Month Trend</span>
          <div className="flex items-center gap-1 mt-0.5 text-slate-900 font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            <span>+18.4% Acceleration</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xs p-2">
          <span className="text-[10px] text-slate-500 block uppercase">Current Index</span>
          <div className="text-slate-900 font-bold mt-0.5">
            {data[5]?.avgRiskIndex || 65} / 100 <span className="text-[10px] text-amber-700 font-normal">(Elevated)</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xs p-2">
          <span className="text-[10px] text-slate-500 block uppercase">P90 Peak Horizon</span>
          <div className="text-rose-700 font-bold mt-0.5">
            +52.4 Days <span className="text-[10px] text-slate-500 font-normal">(Nov 2026)</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xs p-2">
          <span className="text-[10px] text-slate-500 block uppercase">Critical Inflexion</span>
          <div className="text-slate-800 font-bold mt-0.5 truncate">
            Sec 3G Disbursement
          </div>
        </div>
      </div>
    </div>
  );
};
