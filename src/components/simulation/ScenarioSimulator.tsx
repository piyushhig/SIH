import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { LandParcel } from '../../types';

interface ScenarioSimulatorProps {
  parcel: LandParcel;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ parcel }) => {
  // Configurable simulation variables
  const [daysInStage, setDaysInStage] = useState<number>(parcel.daysInStage || 45);
  const [docCompleteness, setDocCompleteness] = useState<number>(55); // 0-100%
  const [compensationStatus, setCompensationStatus] = useState<string>('Pending Award');
  const [legalDispute, setLegalDispute] = useState<string>('Active Suit');
  const [surveyCompletion, setSurveyCompletion] = useState<number>(80); // 0-100%
  const [negotiationAttempts, setNegotiationAttempts] = useState<number>(2);
  const [prevStageDelay, setPrevStageDelay] = useState<number>(14);

  // Prediction output state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState<{
    riskScore: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    delayProbability: number;
    estimatedDelay: number;
    drivers: { factor: string; contribution: number }[];
    intervention: string;
    hasRun: boolean;
  }>({
    riskScore: parcel.riskScore,
    riskLevel: parcel.riskLevel,
    delayProbability: parcel.delayProbability,
    estimatedDelay: parcel.predictedDelayDays,
    drivers: parcel.riskDrivers.map((d) => ({ factor: d.factor, contribution: d.contribution })),
    intervention: parcel.recommendedActions[0]?.action || 'Review compensation approval',
    hasRun: false,
  });

  const runPrediction = () => {
    setIsSimulating(true);

    setTimeout(() => {
      // Deterministic illustrative simulation logic for SIH demo
      let score = 20; // baseline

      // 1. Days in Stage impact
      if (daysInStage > 60) score += 25;
      else if (daysInStage > 30) score += 12;
      else score -= 5;

      // 2. Documentation completeness impact
      if (docCompleteness < 50) score += 22;
      else if (docCompleteness < 80) score += 8;
      else score -= 15;

      // 3. Compensation status impact
      if (compensationStatus === 'Disputed in Court') score += 28;
      else if (compensationStatus === 'Pending Award') score += 15;
      else if (compensationStatus === 'Consent Award Deposited') score -= 10;
      else if (compensationStatus === 'Disbursed') score -= 25;

      // 4. Legal dispute impact
      if (legalDispute === 'Active Suit') score += 25;
      else if (legalDispute === 'Minor Inquiry') score += 10;
      else score -= 12;

      // 5. Survey completion impact
      if (surveyCompletion < 60) score += 12;
      else if (surveyCompletion >= 95) score -= 8;

      // 6. Negotiation attempts impact
      if (negotiationAttempts >= 4) score += 10; // stalled negotiation
      else if (negotiationAttempts >= 1 && docCompleteness > 70) score -= 5;

      // 7. Previous stage delay
      if (prevStageDelay > 30) score += 15;
      else if (prevStageDelay > 10) score += 6;

      // Clamp score between 8 and 96
      const finalScore = Math.min(96, Math.max(8, score));
      const finalLevel: 'Low' | 'Medium' | 'High' =
        finalScore >= 61 ? 'High' : finalScore >= 31 ? 'Medium' : 'Low';
      const delayProb = Math.min(98, Math.max(12, Math.round(finalScore * 0.94)));
      const delayDays = Math.max(4, Math.round((finalScore / 100) * 60));

      // Dynamic drivers based on inputs
      const newDrivers: { factor: string; contribution: number }[] = [];
      if (legalDispute === 'Active Suit') {
        newDrivers.push({ factor: 'Active Court Litigation / Injunction Risk', contribution: 32 });
      }
      if (compensationStatus === 'Disputed in Court' || compensationStatus === 'Pending Award') {
        newDrivers.push({ factor: 'Compensation Disbursement Pipeline Bottleneck', contribution: 26 });
      }
      if (daysInStage > 40) {
        newDrivers.push({ factor: 'Extended Stage Dwell Time Variance', contribution: 21 });
      }
      if (docCompleteness < 70) {
        newDrivers.push({ factor: 'Revenue Record / Mutation Title Gaps', contribution: 14 });
      }
      if (prevStageDelay > 15) {
        newDrivers.push({ factor: 'Compounded Upstream Milestone Delay', contribution: 12 });
      }
      if (newDrivers.length < 3) {
        newDrivers.push({ factor: 'Cadastral Verification Dwell Factor', contribution: 8 });
      }

      // Dynamic intervention based on top input
      let nextIntervention = 'Schedule physical possession verification with Tahsildar';
      if (legalDispute === 'Active Suit') {
        nextIntervention = 'File urgent Section 3H escrow application for dispute bifurcation';
      } else if (compensationStatus === 'Pending Award') {
        nextIntervention = 'Direct Special Land Acquisition Officer to clear award treasury release';
      } else if (docCompleteness < 60) {
        nextIntervention = 'Convene joint village mutation camp for legal heir documentation';
      } else if (daysInStage > 60) {
        nextIntervention = 'Issue executive statutory timeline warning to sub-divisional magistrate';
      }

      setSimulatedResult({
        riskScore: finalScore,
        riskLevel: finalLevel,
        delayProbability: delayProb,
        estimatedDelay: delayDays,
        drivers: newDrivers.slice(0, 4),
        intervention: nextIntervention,
        hasRun: true,
      });

      setIsSimulating(false);
    }, 450);
  };

  const handleReset = () => {
    setDaysInStage(parcel.daysInStage || 45);
    setDocCompleteness(55);
    setCompensationStatus('Pending Award');
    setLegalDispute('Active Suit');
    setSurveyCompletion(80);
    setNegotiationAttempts(2);
    setPrevStageDelay(14);
    setSimulatedResult({
      riskScore: parcel.riskScore,
      riskLevel: parcel.riskLevel,
      delayProbability: parcel.delayProbability,
      estimatedDelay: parcel.predictedDelayDays,
      drivers: parcel.riskDrivers.map((d) => ({ factor: d.factor, contribution: d.contribution })),
      intervention: parcel.recommendedActions[0]?.action || 'Review compensation approval',
      hasRun: false,
    });
  };

  return (
    <div className="bg-slate-900/80 rounded-lg border border-slate-800 p-4 shadow-lg space-y-4 font-sans backdrop-blur-md">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              What-If Risk Simulation Sandbox
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
            Adjust telemetry variables to evaluate impact on predicted delay horizon
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
            SIMULATION ENGINE • SIH DEMO
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-950 border border-slate-800 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset to parcel baseline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Inputs (7 Parameters) & Right Predictive Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Input Variables */}
        <div className="lg:col-span-7 space-y-3.5 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Days in Current Stage */}
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-300 font-bold uppercase">
                  Days in Current Stage
                </label>
                <span className="font-bold text-white tabular-nums">{daysInStage}d</span>
              </div>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={daysInStage}
                onChange={(e) => setDaysInStage(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>5d (On Track)</span>
                <span>180d (Stalled)</span>
              </div>
            </div>

            {/* 2. Documentation Completeness */}
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-300 font-bold uppercase">
                  Documentation Completeness
                </label>
                <span className="font-bold text-white tabular-nums">{docCompleteness}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={docCompleteness}
                onChange={(e) => setDocCompleteness(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>10% (Gaps)</span>
                <span>100% (Certified)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 3. Compensation Status */}
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
              <label className="text-[11px] text-slate-300 font-bold uppercase block">
                Compensation Status
              </label>
              <select
                value={compensationStatus}
                onChange={(e) => setCompensationStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              >
                <option value="Disputed in Court">Disputed in Court</option>
                <option value="Pending Award">Pending Award Approval</option>
                <option value="Consent Award Deposited">Consent Award Deposited</option>
                <option value="Disbursed">Disbursed to Co-Sharers</option>
              </select>
            </div>

            {/* 4. Legal Dispute */}
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
              <label className="text-[11px] text-slate-300 font-bold uppercase block">
                Legal Dispute
              </label>
              <select
                value={legalDispute}
                onChange={(e) => setLegalDispute(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              >
                <option value="Active Suit">Active Suit / Stay Notice</option>
                <option value="Minor Inquiry">Minor Heirship Inquiry</option>
                <option value="None">None / Clear Title</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 5. Survey Completion */}
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-slate-300 font-bold uppercase">
                  Survey Completion
                </label>
                <span className="font-bold text-white tabular-nums">{surveyCompletion}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="10"
                value={surveyCompletion}
                onChange={(e) => setSurveyCompletion(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            {/* 6. Negotiation Attempts */}
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-slate-300 font-bold uppercase">
                  Negotiation Attempts
                </label>
                <span className="font-bold text-white tabular-nums">{negotiationAttempts}</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={negotiationAttempts}
                onChange={(e) => setNegotiationAttempts(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            {/* 7. Previous Stage Delay */}
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-slate-300 font-bold uppercase">
                  Prev Stage Lag
                </label>
                <span className="font-bold text-white tabular-nums">+{prevStageDelay}d</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={prevStageDelay}
                onChange={(e) => setPrevStageDelay(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={runPrediction}
            disabled={isSimulating}
            className="w-full py-2.5 px-4 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>RECALCULATING HAZARD SURFACE...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>RUN PREDICTION WITH CURRENT PARAMETERS</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Real-time Updated Result Output */}
        <div className="lg:col-span-5 bg-slate-950/60 rounded border border-slate-800 p-4 flex flex-col justify-between space-y-3 font-mono">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Simulated Output
              </span>
              <RiskBadge level={simulatedResult.riskLevel} size="sm" />
            </div>

            {/* Primary Score Comparison */}
            <div className="bg-slate-900 p-3 rounded border border-slate-800 space-y-2 text-center shadow-md">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                  {simulatedResult.riskScore}
                </span>
                <span className="text-xs text-slate-400 font-bold">/ 100</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Delay Probability</span>
                  <strong className="text-white font-bold">{simulatedResult.delayProbability}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Estimated Delay</span>
                  <strong className="text-rose-400 font-bold">+{simulatedResult.estimatedDelay} days</strong>
                </div>
              </div>
            </div>

            {/* Simulated Top Drivers */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Attributed Drivers:
              </span>
              {simulatedResult.drivers.map((d) => (
                <div key={d.factor} className="space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-300 truncate max-w-[200px]">{d.factor}</span>
                    <span className="text-white font-bold">{d.contribution}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded transition-all duration-300"
                      style={{ width: `${d.contribution * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Updated Recommended Intervention */}
            <div className="p-2.5 bg-blue-950/40 rounded border border-blue-900/60 space-y-1">
              <span className="text-[10px] font-bold text-blue-300 uppercase flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-blue-400" />
                Updated Recommended Intervention:
              </span>
              <p className="text-xs font-sans font-medium text-slate-200 leading-snug">
                "{simulatedResult.intervention}"
              </p>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono text-center pt-1 border-t border-slate-800/80">
            Illustrative prediction • Demo parameter sandbox
          </p>
        </div>
      </div>
    </div>
  );
};
