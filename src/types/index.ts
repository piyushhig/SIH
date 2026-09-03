export type RiskLevel = 'Low' | 'Medium' | 'High';

export type AcquisitionStage =
  | 'Notification'
  | 'Survey'
  | 'Valuation'
  | 'Compensation'
  | 'Possession';

export type ProjectStatus = 'Active' | 'Critical Review' | 'On Track' | 'Delayed';

export interface RiskDriver {
  factor: string;
  contribution: number; // percentage (0 - 100)
  description?: string;
  status?: string;
}

export interface RecommendedAction {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  action: string;
  expectedImpact: string;
  category?: string;
}

export interface StageTimelineItem {
  stage: AcquisitionStage;
  label: string;
  legalClause: string;
  daysSpent: number;
  expectedDays: number;
  status: 'Completed' | 'Current' | 'Pending';
  completedDate?: string;
  varianceDays?: number;
}

export interface LandParcel {
  id: string; // e.g. LA-2048
  khasraNo: string; // Survey/Gat number e.g. 142/2A
  village: string;
  taluka: string;
  district: string;
  state: string;
  projectId: string;
  projectName: string;
  areaHa: number; // in Hectares
  ownerCount: number;
  stage: AcquisitionStage;
  daysInStage: number;
  expectedDaysInStage: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  delayProbability: number; // percentage
  predictedDelayDays: number; // days
  status: 'In Progress' | 'Disputed' | 'Pending Approval' | 'Acquired' | 'Stay Order';
  primaryRiskFactor: string;
  timeline: StageTimelineItem[];
  riskDrivers: RiskDriver[];
  riskExplanation: string;
  recommendedActions: RecommendedAction[];
  notes?: string;
  lastUpdated: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  state: string;
  district: string;
  implementingAgency: string; // e.g., NHAI, DFC, MMRDA, K-RIDE
  totalParcels: number;
  acquiredParcels: number;
  pendingParcels: number;
  highRiskParcels: number;
  mediumRiskParcels: number;
  lowRiskParcels: number;
  progressPercent: number;
  avgRiskScore: number;
  overallRisk: RiskLevel;
  predictedDelayDays: number;
  status: ProjectStatus;
  targetCompletion: string;
  stageBreakdown: Record<AcquisitionStage, number>;
  description: string;
}

export interface EarlyWarning {
  id: string;
  severity: 'High' | 'Medium' | 'Low';
  parcelId: string;
  projectId: string;
  projectName: string;
  district: string;
  issue: string;
  stage: AcquisitionStage;
  riskScore: number;
  predictedDelayDays: number;
  recommendedAction: string;
  detectedAt: string;
  actionTaken?: boolean;
}

export type ScreenId =
  | 'overview'
  | 'projects'
  | 'project-intelligence'
  | 'compare-projects'
  | 'parcels'
  | 'parcel-intelligence'
  | 'risk-analytics'
  | 'early-warnings'
  | 'reports';
