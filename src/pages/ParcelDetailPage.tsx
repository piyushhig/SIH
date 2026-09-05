import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  FileText,
  AlertOctagon,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Download,
  Share2,
  Calendar,
  Layers,
  Building,
  UserCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { LandParcel, AcquisitionStage } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ScenarioSimulator } from '../components/simulation/ScenarioSimulator';

interface ParcelDetailPageProps {
  parcel: LandParcel;
  onBack: () => void;
  onNavigateToProject?: (projectId: string) => void;
}

export const ParcelDetailPage: React.FC<ParcelDetailPageProps> = ({
  parcel,
  onBack,
  onNavigateToProject,
}) => {
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleExecuteAction = (actionTitle: string) => {
    setActionSuccessMsg(`Directive Dispatched: "${actionTitle}". Collectorate record & task order generated (Simulated).`);
    setTimeout(() => {
      setActionSuccessMsg(null);
    }, 4500);
  };

  const stages: AcquisitionStage[] = ['Notification', 'Survey', 'Valuation', 'Compensation', 'Possession'];

  return (
    <div id="screen-parcel-intelligence" className="p-5 space-y-5 max-w-7xl mx-auto font-sans">
      {/* Navigation Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          id="btn-back-from-parcel"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-300 hover:text-white bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded hover:bg-slate-800 transition-colors self-start shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> [ ESC ] BACK TO REGISTRY
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-800 font-mono shadow-xs">
            PARCEL_DOSSIER • RECORD_INTEGRITY_VERIFIED
          </span>
          <span className="text-[10px] bg-slate-950 text-blue-400 px-2.5 py-1 rounded font-mono font-bold border border-slate-800">
            DEMO ENVIRONMENT • SIMULATED DATA
          </span>
        </div>
      </div>

      {/* Success Notification Alert if user dispatched an action directive */}
      {actionSuccessMsg && (
        <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-200 px-3.5 py-2.5 rounded text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header + Large Delay Risk Card Section */}
      <div className="bg-slate-900/80 rounded-lg border border-slate-800 p-5 shadow-lg space-y-4 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Left Header Details */}
          <div className="space-y-2.5 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono">
                PARCEL RECORD
              </span>
              <span className="text-slate-600">•</span>
              <StatusBadge status={parcel.status} size="sm" />
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-slate-400 font-mono">
                Last updated: {parcel.lastUpdated}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
                {parcel.id}
              </h2>
              <span className="text-xs font-mono bg-slate-950 text-blue-300 px-2.5 py-0.5 rounded border border-slate-800 font-medium">
                Gat / Khasra No: {parcel.khasraNo}
              </span>
            </div>

            {/* Project & Location links */}
            <div className="space-y-1.5 pt-1">
              <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-500 font-mono text-[11px]">PROJECT:</span>
                {onNavigateToProject ? (
                  <button
                    onClick={() => onNavigateToProject(parcel.projectId)}
                    className="text-blue-400 hover:text-blue-300 hover:underline font-semibold text-left font-sans text-xs cursor-pointer"
                  >
                    {parcel.projectName}
                  </button>
                ) : (
                  <span className="font-sans text-xs text-slate-300">{parcel.projectName}</span>
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  District: <strong className="text-slate-200">{parcel.district}, {parcel.state}</strong>
                </span>
                <span className="text-slate-700">•</span>
                <span>
                  Area: <strong className="font-mono text-slate-200 tabular-nums">{parcel.areaHa} Ha</strong>
                </span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  Owners: <strong className="font-mono text-slate-200 tabular-nums">{parcel.ownerCount} Titleholders</strong>
                </span>
              </div>
            </div>

            {/* Current Stage Highlight Strip */}
            <div className="pt-1.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Current Stage:</span>
              <span className="text-xs font-bold text-white bg-slate-950 border border-slate-800 px-2 py-0.5 rounded font-mono">
                {parcel.stage}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                ({parcel.daysInStage} days in current stage vs {parcel.expectedDaysInStage}d standard baseline)
              </span>
            </div>
          </div>

          {/* RIGHT: Visually Dominant Delay Risk Card */}
          <div
            id="large-delay-risk-card"
            className="w-full lg:w-84 rounded-lg border border-rose-800/80 bg-rose-950/30 p-4 flex-shrink-0 shadow-lg relative overflow-hidden backdrop-blur-md"
          >
            {/* Top Risk Indicator Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 font-mono">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                DELAY RISK
              </span>
              <RiskBadge level={parcel.riskLevel} size="md" />
            </div>

            {/* Risk Score Display */}
            <div className="my-2.5 text-center py-2.5 bg-rose-950/40 rounded border border-rose-900/60">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-4xl font-extrabold font-mono text-rose-400 tracking-tight tabular-nums">
                  {parcel.riskScore}
                </span>
                <span className="text-sm font-bold font-mono text-slate-400">/ 100</span>
              </div>
              <span className="block text-xs font-bold text-rose-300 uppercase tracking-wider mt-1 font-mono">
                {parcel.riskLevel === 'High' ? 'HIGH RISK' : parcel.riskLevel === 'Medium' ? 'MEDIUM RISK' : 'LOW RISK'}
              </span>
            </div>

            {/* Supporting Core Metrics */}
            <div className="space-y-1.5 text-xs border-t border-rose-900/60 pt-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Delay Probability:</span>
                <span className="font-mono font-bold text-white tabular-nums">{parcel.delayProbability}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estimated Delay:</span>
                <span className="font-mono font-bold text-rose-400 tabular-nums">+{parcel.predictedDelayDays} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Model Confidence:</span>
                <span className="font-mono font-bold text-slate-200 tabular-nums">84%</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-rose-900/40">
              <p className="text-[11px] text-slate-300 leading-snug">
                {parcel.riskLevel === 'High'
                  ? 'Strong probability of exceeding schedule due to active disputes or procedural bottlenecks.'
                  : parcel.riskLevel === 'Medium'
                  ? 'Moderate delay exposure requiring monitoring before statutory milestone dates.'
                  : 'Proceeding within expected statutory timelines.'}
              </p>
            </div>
          </div>
        </div>

        {/* 4-Step Executive Summary Strip: Risk -> Why -> Predicted Delay -> What To Do */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            {/* 1. Risk */}
            <div className="p-2.5 bg-rose-950/20 rounded border border-rose-900/50">
              <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                1. RISK LEVEL
              </span>
              <div className="flex items-center gap-2 mt-1">
                <RiskBadge level={parcel.riskLevel} size="sm" />
                <span className="text-xs font-bold text-white font-mono">
                  {parcel.riskScore}/100
                </span>
              </div>
              <span className="text-[10px] text-rose-300/80 block mt-0.5 font-mono">
                {parcel.delayProbability}% probability of delay
              </span>
            </div>

            {/* 2. Why */}
            <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                2. WHY (PRIMARY DRIVER)
              </span>
              <p className="text-xs font-medium text-slate-200 leading-snug mt-1 line-clamp-2">
                {parcel.riskDrivers[0]?.factor || 'Titleholder dispute & procedural backlog'}
              </p>
            </div>

            {/* 3. Predicted Delay */}
            <div className="p-2.5 bg-amber-950/20 rounded border border-amber-900/50">
              <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                3. PREDICTED DELAY
              </span>
              <span className="text-xs font-bold font-mono text-amber-300 block mt-1">
                +{parcel.predictedDelayDays} Days Beyond Schedule
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Current stage: {parcel.stage}
              </span>
            </div>

            {/* 4. What To Do */}
            <div className="p-2.5 bg-blue-950/20 rounded border border-blue-900/50 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
                  4. WHAT TO DO
                </span>
                <p className="text-xs font-medium text-slate-200 leading-snug mt-1 line-clamp-2">
                  {parcel.recommendedActions[0]?.action || 'Convene joint collectorate resolution review'}
                </p>
              </div>
              <div className="pt-1 text-right">
                <a
                  href="#recommended-actions-panel"
                  className="text-[11px] font-bold text-blue-400 hover:text-blue-300 font-mono"
                >
                  View Actions ↓
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: LEFT (Acquisition Timeline) & RIGHT (XAI / SHAP section) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Acquisition Timeline */}
        <div
          id="acquisition-timeline-panel"
          className="lg:col-span-6 bg-slate-900/80 rounded-lg border border-slate-800 p-4 shadow-md space-y-3.5 backdrop-blur-md"
        >
          <div className="border-b border-slate-800/80 pb-2.5 flex items-center justify-between font-mono">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>STAGE TIMELINE</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                Notification → Survey → Valuation → Compensation → Possession
              </p>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              5 MANDATED STAGES
            </span>
          </div>

          {/* Current Stage Metrics Bar */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded border border-slate-800 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Days in Current Stage
                </span>
                <span className="text-base font-bold text-white mt-0.5 block tabular-nums">
                  {parcel.daysInStage}d
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Expected Duration
                </span>
                <span className="text-base font-bold text-slate-300 mt-0.5 block tabular-nums">
                  {parcel.expectedDaysInStage}d
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Variance
                </span>
                <span className={`text-base font-bold mt-0.5 block tabular-nums ${parcel.daysInStage > parcel.expectedDaysInStage ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {parcel.daysInStage >= parcel.expectedDaysInStage ? `+${parcel.daysInStage - parcel.expectedDaysInStage}d` : `${parcel.daysInStage - parcel.expectedDaysInStage}d`}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-sans px-1">
              Current stage performance is one of the inputs used to estimate future delay risk.
            </p>
          </div>

          {/* Vertical Stepper Timeline with Explicit States */}
          <div className="space-y-3 pt-1">
            {parcel.timeline.map((step, idx) => {
              const isCurrent = step.status === 'Current';
              const isCompleted = step.status === 'Completed';
              const isPending = step.status === 'Pending';
              const isAtRisk = isCurrent && parcel.riskLevel === 'High';

              let stateBadge = 'PENDING';
              let badgeColor = 'bg-slate-950 text-slate-500 border-slate-800';
              let nodeColor = 'bg-slate-950 text-slate-500 border border-slate-800';
              let containerStyle = 'bg-slate-950/40 border-slate-800/60 opacity-60';

              if (isCompleted) {
                stateBadge = 'COMPLETED';
                badgeColor = 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
                nodeColor = 'bg-emerald-600 text-white';
                containerStyle = 'bg-slate-950/60 border-slate-800';
              } else if (isAtRisk) {
                stateBadge = 'AT RISK';
                badgeColor = 'bg-rose-950/80 text-rose-300 border-rose-800 font-bold animate-pulse';
                nodeColor = 'bg-rose-600 text-white ring-2 ring-rose-500/50';
                containerStyle = 'bg-rose-950/20 border-rose-800/80 shadow-sm';
              } else if (isCurrent) {
                stateBadge = 'CURRENT';
                badgeColor = 'bg-blue-950/80 text-blue-300 border-blue-800 font-bold';
                nodeColor = 'bg-blue-600 text-white ring-2 ring-blue-500/50';
                containerStyle = 'bg-blue-950/20 border-blue-800/80 shadow-sm';
              }

              return (
                <div key={step.stage} className="relative flex items-start gap-3 group">
                  {/* Connecting Line */}
                  {idx < parcel.timeline.length - 1 && (
                    <div
                      className={`absolute left-3 top-6 bottom-0 w-px ${
                        isCompleted ? 'bg-emerald-500/60' : 'bg-slate-800'
                      }`}
                    />
                  )}

                  {/* Stage Icon Node */}
                  <div
                    className={`relative z-10 w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 ${nodeColor}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 p-2.5 rounded border transition-colors ${containerStyle}`}>
                    <div className="flex flex-wrap items-center justify-between gap-1 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{step.stage}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase border ${badgeColor}`}>
                          {stateBadge}
                        </span>
                      </div>
                      <div className="text-right text-[10px]">
                        {isCompleted && (
                          <span className="text-emerald-400 font-semibold tabular-nums">
                            {step.daysSpent}d spent
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-rose-400 font-bold tabular-nums">
                            {step.daysSpent}d in stage (+{step.daysSpent - step.expectedDays}d lag)
                          </span>
                        )}
                        {isPending && <span className="text-slate-500">Scheduled</span>}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 font-medium font-sans">{step.label}</p>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                      Statutory Clause: {step.legalClause}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: XAI / SHAP Section */}
        <div
          id="risk-drivers-panel"
          className="lg:col-span-6 bg-slate-900/80 rounded-lg border border-slate-800 p-4 shadow-md space-y-3.5 flex flex-col justify-between backdrop-blur-md"
        >
          <div className="space-y-3">
            <div className="border-b border-slate-800/80 pb-2.5 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>WHY IS THIS CASE AT RISK?</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Factors contributing to the predicted delay
                </p>
              </div>
              <span className="text-[10px] text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono font-medium">
                KEY DRIVERS
              </span>
            </div>

            {/* Plain language attribution summary */}
            <div className="p-3 bg-rose-950/20 rounded border border-rose-900/50 space-y-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase font-mono tracking-wider block">
                Root Cause Summary:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                "Extended time in the compensation stage combined with unresolved documentation and an active legal issue is increasing the likelihood of acquisition delay."
              </p>
            </div>

            {/* Clean Contribution Bars with Normalized Impact */}
            <div className="space-y-3 pt-1">
              {parcel.riskDrivers.map((driver) => {
                let barColor = 'bg-slate-500';
                let textColor = 'text-slate-300';

                if (driver.contribution >= 25) {
                  barColor = 'bg-rose-500';
                  textColor = 'text-rose-400';
                } else if (driver.contribution >= 15) {
                  barColor = 'bg-amber-500';
                  textColor = 'text-amber-400';
                } else {
                  barColor = 'bg-blue-500';
                  textColor = 'text-blue-400';
                }

                return (
                  <div key={driver.factor} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-slate-200 text-[11px] font-sans">{driver.factor}</span>
                      <span className={`font-bold tabular-nums font-mono ${textColor}`}>
                        +{driver.contribution}% impact
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-950 rounded overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.min(100, driver.contribution * 2.5)}%` }}
                      />
                    </div>

                    {driver.description && (
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        {driver.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Small Info Label */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-sans italic block">
                Factors ordered by their relative contribution to delay risk.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded border border-slate-800 text-xs text-slate-300 text-[11px] mt-2">
            <span className="text-white font-bold block font-sans text-xs">Recommended Strategy:</span>
            <p className="leading-relaxed font-sans text-slate-400 mt-0.5">
              The model identifies title dispute resolution and revenue compensation clearing as the two highest-leverage interventions to prevent total milestone breach.
            </p>
          </div>
        </div>
      </div>

      {/* RECOMMENDED INTERVENTIONS: Explicitly connected to Risk Drivers (WHY -> WHAT NEXT) */}
      <div
        id="recommended-actions-panel"
        className="bg-slate-900/80 rounded-lg border border-slate-800 p-4 shadow-md space-y-4 backdrop-blur-md"
      >
        <div className="border-b border-slate-800/80 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>RECOMMENDED ACTIONS</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Practical interventions mapped directly from key delay risk drivers
            </p>
          </div>
          <span className="text-[10px] font-bold text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/70">
            RISK DRIVER → RECOMMENDED ACTION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {parcel.recommendedActions.map((rec, idx) => {
            const isHigh = rec.priority === 'High';
            // Explicitly link root cause driver
            const matchedDriver = parcel.riskDrivers[idx] ? parcel.riskDrivers[idx].factor : 'Procedural Milestone Lag';

            return (
              <div
                key={rec.id}
                className={`rounded-lg border p-3.5 flex flex-col justify-between space-y-3.5 transition-all ${
                  isHigh
                    ? 'border-rose-900/60 bg-rose-950/20 hover:border-rose-800'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        isHigh
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {rec.priority} PRIORITY
                    </span>
                    <span className="text-[10px] text-slate-500">{rec.id}</span>
                  </div>

                  {/* Visual RISK DRIVER -> RECOMMENDED ACTION Mapping */}
                  <div className="space-y-1.5">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[10px]">
                      <span className="text-slate-500 uppercase block font-semibold text-[9px]">RISK DRIVER:</span>
                      <strong className="text-slate-200 block truncate mt-0.5">{matchedDriver}</strong>
                    </div>

                    <div className="flex justify-center text-slate-500 font-bold text-xs py-0.5">
                      ↓
                    </div>

                    <div className="p-2.5 rounded bg-blue-950/40 border border-blue-900/60 text-xs">
                      <span className="text-[9px] font-bold text-blue-300 uppercase font-mono tracking-wider block">
                        RECOMMENDED ACTION:
                      </span>
                      <h4 className="text-xs font-bold text-white leading-snug font-sans mt-0.5">
                        {rec.action}
                      </h4>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase font-mono tracking-wider block">
                      Projected Outcome:
                    </span>
                    <p className="text-slate-300 text-xs mt-0.5 leading-relaxed font-sans">
                      {rec.expectedImpact}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleExecuteAction(rec.action)}
                  className={`w-full py-2.5 px-3 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                    isHigh
                      ? 'bg-rose-700 hover:bg-rose-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <span>Take Action on Recommendation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 17: Interactive What-If Scenario Sandbox */}
      <ScenarioSimulator parcel={parcel} />
    </div>
  );
};

