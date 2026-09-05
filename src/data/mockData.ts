import { Project, LandParcel, EarlyWarning } from '../types';
import {
  RAW_PARCELS,
  computeProjectsFromParcels,
  computeEarlyWarningsFromParcels,
  ALL_STATES,
  DISTRICTS_BY_STATE,
  STATE_GEO_CONFIG,
  DISTRICT_GEO_CONFIG,
  getFilteredCentralData,
  MOCK_GIS_HOTSPOTS,
  GISHotspot,
} from './centralizedData';

// Re-export centralized sources
export {
  RAW_PARCELS,
  ALL_STATES,
  DISTRICTS_BY_STATE,
  STATE_GEO_CONFIG,
  DISTRICT_GEO_CONFIG,
  getFilteredCentralData,
  MOCK_GIS_HOTSPOTS,
};
export type { GISHotspot };

// Base centralized collections
export const MOCK_PARCELS: LandParcel[] = RAW_PARCELS;
export const MOCK_PROJECTS: Project[] = computeProjectsFromParcels(RAW_PARCELS);
export const MOCK_EARLY_WARNINGS: EarlyWarning[] = computeEarlyWarningsFromParcels(RAW_PARCELS);

export const PORTFOLIO_METRICS = {
  totalProjects: MOCK_PROJECTS.length,
  totalParcels: MOCK_PARCELS.length,
  acquiredParcels: MOCK_PARCELS.filter((p) => p.status === 'Acquired' || p.stage === 'Possession').length,
  pendingParcels: MOCK_PARCELS.filter((p) => p.status !== 'Acquired' && p.stage !== 'Possession').length,
  highRiskParcels: MOCK_PARCELS.filter((p) => p.riskLevel === 'High').length,
  mediumRiskParcels: MOCK_PARCELS.filter((p) => p.riskLevel === 'Medium').length,
  lowRiskParcels: MOCK_PARCELS.filter((p) => p.riskLevel === 'Low').length,
  overallAvgRisk: Math.round(MOCK_PROJECTS.reduce((acc, p) => acc + p.avgRiskScore, 0) / MOCK_PROJECTS.length),
  avgPredictedDelay: (MOCK_PROJECTS.reduce((acc, p) => acc + p.predictedDelayDays, 0) / MOCK_PROJECTS.length).toFixed(1),
};

export const MOCK_TREND_DATA = [
  { month: 'Nov 2024', avgRiskIndex: 42, highRiskParcels: 8, avgDelayDays: 22 },
  { month: 'Dec 2024', avgRiskIndex: 46, highRiskParcels: 10, avgDelayDays: 26 },
  { month: 'Jan 2025', avgRiskIndex: 51, highRiskParcels: 12, avgDelayDays: 31 },
  { month: 'Feb 2025', avgRiskIndex: 55, highRiskParcels: 14, avgDelayDays: 35 },
  { month: 'Mar 2025', avgRiskIndex: 58, highRiskParcels: 15, avgDelayDays: 37 },
  { month: 'Apr 2025 (Current)', avgRiskIndex: 61, highRiskParcels: 16, avgDelayDays: 38.4 },
  { month: 'May 2025 (Projected)', avgRiskIndex: 64, highRiskParcels: 18, avgDelayDays: 42.1, projected: true },
  { month: 'Jun 2025 (Projected)', avgRiskIndex: 66, highRiskParcels: 19, avgDelayDays: 45.0, projected: true },
];

export const MOCK_DELAY_DISTRIBUTION = [
  { range: '0–15 Days', count: 18, percent: 42.8, label: 'Minor / Normal Variance' },
  { range: '16–30 Days', count: 12, percent: 28.5, label: 'Manageable Delay' },
  { range: '31–60 Days', count: 9, percent: 21.4, label: 'Critical Escalation Required' },
  { range: '60+ Days', count: 3, percent: 7.3, label: 'Severe Project Bottleneck' },
];

export const MOCK_STAGE_RISK = [
  { stage: 'Notification', parcels: 3, avgRisk: 48, highRiskCount: 1, avgDaysSpent: 30 },
  { stage: 'Survey', parcels: 5, avgRisk: 34, highRiskCount: 0, avgDaysSpent: 26 },
  { stage: 'Valuation', parcels: 14, avgRisk: 62, highRiskCount: 6, avgDaysSpent: 42 },
  { stage: 'Compensation', parcels: 12, avgRisk: 74, highRiskCount: 8, avgDaysSpent: 62 },
  { stage: 'Possession', parcels: 8, avgRisk: 19, highRiskCount: 0, avgDaysSpent: 14 },
];

export const MOCK_TOP_DELAY_FACTORS = [
  { factor: 'Legal Dispute / High Court Writs', prevalence: 38.5, avgDelayImpactDays: 48, severity: 'High' },
  { factor: 'Compensation & Award Apportionment Dispute', prevalence: 32.1, avgDelayImpactDays: 41, severity: 'High' },
  { factor: 'Title Chain Gaps / Unmutated Legal Heirs', prevalence: 26.4, avgDelayImpactDays: 28, severity: 'Medium' },
  { factor: 'Inter-Agency / Defense / Forest Clearances', prevalence: 21.8, avgDelayImpactDays: 52, severity: 'High' },
  { factor: 'Joint Measurement Survey (JMS) Objections', prevalence: 18.2, avgDelayImpactDays: 24, severity: 'Medium' },
  { factor: 'Utility Relocation Bottlenecks (Power/Water)', prevalence: 14.7, avgDelayImpactDays: 21, severity: 'Medium' },
  { factor: 'Standing Crop / Tree Valuation Resistance', prevalence: 11.3, avgDelayImpactDays: 16, severity: 'Low' },
];

export const MOCK_PREDICTION_FACTORS = [
  { factor: 'Days in current stage', weight: '22%', correlation: 'Strong Positive', impactDescription: 'Dwell time beyond 1.5x statutory benchmark exponentially compounds risk.' },
  { factor: 'Compensation status & disbursement rate', weight: '18%', correlation: 'Strong Positive', impactDescription: 'Held treasury disbursements correlate with owner resistance.' },
  { factor: 'Documentation completeness score', weight: '15%', correlation: 'Strong Negative', impactDescription: 'Missing 7/12 mutations and power-of-attorneys create late-stage title stays.' },
  { factor: 'Legal dispute / caveat registry', weight: '16%', correlation: 'Critical Positive', impactDescription: 'Civil court partition suits and High Court writ petitions cause major work stoppages.' },
  { factor: 'Joint measurement survey (JMS) status', weight: '11%', correlation: 'Moderate Positive', impactDescription: 'Boundary disagreements delay award publication.' },
  { factor: 'Landowner negotiation & objection rounds', weight: '8%', correlation: 'Moderate Positive', impactDescription: 'More than 2 failed Price Advisory Committee sittings indicate escalation.' },
  { factor: 'Previous stage accumulated delay', weight: '6%', correlation: 'Moderate Positive', impactDescription: 'Delays in preliminary notification cascade into valuation.' },
  { factor: 'Stakeholder / co-owner count', weight: '4%', correlation: 'Low-Moderate Positive', impactDescription: 'Parcels with >5 co-owners have 3x higher legal dispute probability.' },
];
