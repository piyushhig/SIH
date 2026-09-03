import { LandParcel, Project, AcquisitionStage, RiskLevel, StageTimelineItem } from '../types';

const VILLAGES_BY_PROJECT: Record<string, { villages: string[]; taluka: string }> = {
  'PRJ-NHAI-04': {
    villages: ['Palej', 'Nabipur', 'Varedia', 'Tralsa', 'Dharoli', 'Mandva', 'Jhanor', 'Shuklatirth', 'Bhadbhut', 'Dahej'],
    taluka: 'Bharuch',
  },
  'PRJ-DFCCIL-07': {
    villages: ['Gholvad', 'Dahanu', 'Kasa', 'Manor', 'Vikramgad', 'Saphale', 'Palghar', 'Boisar', 'Vangaon', 'Virar'],
    taluka: 'Palghar',
  },
  'PRJ-MSRDC-01': {
    villages: ['Wadgaon Shinde', 'Lonikand', 'Wagholi', 'Uruli Kanchan', 'Saswad', 'Khed Shivapur', 'Marunji', 'Maan', 'Hinjawadi', 'Chakan'],
    taluka: 'Haveli',
  },
  'PRJ-KRIDE-02': {
    villages: ['Baiyappanahalli', 'Channasandra', 'Yelahanka', 'Chikkabanavara', 'Yeshwanthpur', 'Hebbal', 'Kodigehalli', 'Thanisandra', 'Banaswadi', 'Jalahalli'],
    taluka: 'Bengaluru North',
  },
  'PRJ-TIDCO-09': {
    villages: ['Sriperumbudur', 'Mambakkam', 'Irungattukottai', 'Vallam', 'Vadagal', 'Pillaippakkam', 'Nemili', 'Sunguvarchatram', 'Echoor', 'Pennalur'],
    taluka: 'Sriperumbudur',
  },
};

const STAGES: AcquisitionStage[] = ['Notification', 'Survey', 'Valuation', 'Compensation', 'Possession'];

function createTimeline(stage: AcquisitionStage, isAcquired: boolean): StageTimelineItem[] {
  const stageOrder: AcquisitionStage[] = ['Notification', 'Survey', 'Valuation', 'Compensation', 'Possession'];
  const currentIdx = isAcquired ? 5 : stageOrder.indexOf(stage);

  return [
    {
      stage: 'Notification',
      label: 'Preliminary Notification (Sec 3A / 4(1))',
      legalClause: 'Section 3A Gazette Notification',
      daysSpent: 26,
      expectedDays: 25,
      status: currentIdx > 0 ? 'Completed' : 'Current',
      completedDate: currentIdx > 0 ? '12 Nov 2024' : undefined,
      varianceDays: 1,
    },
    {
      stage: 'Survey',
      label: 'Joint Measurement Survey (Sec 3B / 6)',
      legalClause: 'Section 3B Revenue Boundary Delineation',
      daysSpent: currentIdx > 1 ? 38 : currentIdx === 1 ? 28 : 0,
      expectedDays: 35,
      status: currentIdx > 1 ? 'Completed' : currentIdx === 1 ? 'Current' : 'Pending',
      completedDate: currentIdx > 1 ? '18 Jan 2025' : undefined,
      varianceDays: currentIdx > 1 ? 3 : 0,
    },
    {
      stage: 'Valuation',
      label: 'Award Determination (Sec 3C / 7)',
      legalClause: 'Ready Reckoner + Multiplier Factor (RFCTLARR 2013)',
      daysSpent: currentIdx > 2 ? 34 : currentIdx === 2 ? 32 : 0,
      expectedDays: 30,
      status: currentIdx > 2 ? 'Completed' : currentIdx === 2 ? 'Current' : 'Pending',
      completedDate: currentIdx > 2 ? '24 Feb 2025' : undefined,
      varianceDays: currentIdx > 2 ? 4 : 0,
    },
    {
      stage: 'Compensation',
      label: 'Disbursement & Award Approval (Sec 3G / 8)',
      legalClause: 'Section 3G Deposit & Disbursement',
      daysSpent: currentIdx > 3 ? 36 : currentIdx === 3 ? 42 : 0,
      expectedDays: 30,
      status: currentIdx > 3 ? 'Completed' : currentIdx === 3 ? 'Current' : 'Pending',
      completedDate: currentIdx > 3 ? '28 Mar 2025' : undefined,
      varianceDays: currentIdx > 3 ? 6 : 0,
    },
    {
      stage: 'Possession',
      label: 'Physical Handover (Sec 3E / 9)',
      legalClause: 'Section 3E Summary Eviction / Possession Certificate',
      daysSpent: isAcquired ? 18 : currentIdx === 4 ? 22 : 0,
      expectedDays: 20,
      status: isAcquired ? 'Completed' : currentIdx === 4 ? 'Current' : 'Pending',
      completedDate: isAcquired ? '10 Apr 2025' : undefined,
      varianceDays: 0,
    },
  ];
}

export function generateAllParcels(seedParcels: LandParcel[], projects: Project[]): LandParcel[] {
  const allParcels: LandParcel[] = [...seedParcels];
  let idCounter = 2065;

  projects.forEach((proj) => {
    const existingInSeed = seedParcels.filter((p) => p.projectId === proj.id);
    const neededTotal = proj.totalParcels - existingInSeed.length;
    if (neededTotal <= 0) return;

    const existingAcquired = existingInSeed.filter((p) => p.status === 'Acquired' || p.stage === 'Possession').length;
    const existingHigh = existingInSeed.filter((p) => p.riskLevel === 'High').length;
    const existingMedium = existingInSeed.filter((p) => p.riskLevel === 'Medium').length;
    const existingLow = existingInSeed.filter((p) => p.riskLevel === 'Low').length;

    let remainingAcquired = Math.max(0, proj.acquiredParcels - existingAcquired);
    let remainingHigh = Math.max(0, proj.highRiskParcels - existingHigh);
    let remainingMedium = Math.max(0, proj.mediumRiskParcels - existingMedium);
    let remainingLow = Math.max(0, proj.lowRiskParcels - existingLow);

    const geo = VILLAGES_BY_PROJECT[proj.id] || {
      villages: ['Central Corridor Zone', 'Sub-division East', 'Sub-division West'],
      taluka: proj.district,
    };

    const stageList: AcquisitionStage[] = ['Notification', 'Survey', 'Valuation', 'Compensation'];

    for (let i = 0; i < neededTotal; i++) {
      const isAcquired = remainingAcquired > 0 && i < remainingAcquired;
      let riskLevel: RiskLevel = 'Low';

      if (remainingHigh > 0) {
        riskLevel = 'High';
        remainingHigh--;
      } else if (remainingMedium > 0) {
        riskLevel = 'Medium';
        remainingMedium--;
      } else if (remainingLow > 0) {
        riskLevel = 'Low';
        remainingLow--;
      } else {
        riskLevel = isAcquired ? 'Low' : 'Medium';
      }

      const stage: AcquisitionStage = isAcquired ? 'Possession' : stageList[i % stageList.length];
      const village = geo.villages[i % geo.villages.length];
      const khasraNum = `${100 + ((i * 7) % 890)}/${((i % 4) + 1)}${i % 2 === 0 ? 'A' : 'B'}`;
      const areaHa = Math.round((0.45 + ((i * 13) % 350) / 100) * 100) / 100;
      const ownerCount = (i % 6) + 1;

      let riskScore = 20;
      let predictedDelayDays = 0;
      let delayProbability = 10;
      let status: LandParcel['status'] = 'In Progress';

      if (isAcquired) {
        status = 'Acquired';
        riskScore = 10 + (i % 15);
        predictedDelayDays = 0;
        delayProbability = 5;
      } else if (riskLevel === 'High') {
        riskScore = 72 + (i % 22);
        predictedDelayDays = 35 + (i % 45);
        delayProbability = 72 + (i % 20);
        status = i % 3 === 0 ? 'Disputed' : i % 3 === 1 ? 'Stay Order' : 'Pending Approval';
      } else if (riskLevel === 'Medium') {
        riskScore = 44 + (i % 22);
        predictedDelayDays = 15 + (i % 20);
        delayProbability = 45 + (i % 20);
        status = i % 2 === 0 ? 'In Progress' : 'Pending Approval';
      } else {
        riskScore = 18 + (i % 18);
        predictedDelayDays = 2 + (i % 8);
        delayProbability = 15 + (i % 15);
        status = 'In Progress';
      }

      const parcel: LandParcel = {
        id: `LA-${idCounter++}`,
        khasraNo: khasraNum,
        village,
        taluka: geo.taluka,
        district: proj.district,
        state: proj.state,
        projectId: proj.id,
        projectName: proj.name,
        areaHa,
        ownerCount,
        stage,
        daysInStage: isAcquired ? 0 : 25 + (i % 40),
        expectedDaysInStage: 30,
        riskScore,
        riskLevel,
        delayProbability,
        predictedDelayDays,
        status,
        primaryRiskFactor:
          riskLevel === 'High'
            ? i % 2 === 0
              ? 'Legal Title Dispute & Apportionment Objection'
              : 'Valuation Hearing Objection (Sec 3G)'
            : riskLevel === 'Medium'
            ? 'Joint Measurement Survey (JMS) Boundary Verification'
            : 'Standard Statutory Pipeline Processing',
        timeline: createTimeline(stage, isAcquired),
        riskDrivers: [
          {
            factor: riskLevel === 'High' ? 'Legal Dispute' : 'Documentation Gap',
            contribution: riskLevel === 'High' ? 42 : 24,
            description: `Statutory milestone variance observed in ${village} records.`,
          },
          {
            factor: 'Valuation & Award',
            contribution: 28,
            description: 'Rate analysis aligned with Ready Reckoner benchmarks.',
          },
        ],
        riskExplanation:
          riskLevel === 'High'
            ? `High delay hazard detected in ${stage} stage for Gat ${khasraNum} due to unresolved legal/valuation caveats.`
            : `Parcel progress is within operational tolerances for ${proj.name}.`,
        recommendedActions: [
          {
            id: `ACT-${idCounter}-1`,
            priority: riskLevel,
            action:
              riskLevel === 'High'
                ? 'Convene Revenue Sub-Divisional Officer special sitting for rapid settlement'
                : 'Expedite verification of title documents with Talathi registry',
            expectedImpact: riskLevel === 'High' ? 'Reduces projected delay by 25+ days' : 'Ensures SLA compliance',
          },
        ],
        notes: `Simulated corridor parcel dossier for ${proj.code}.`,
        lastUpdated: `${(i % 5) + 1} days ago`,
      };

      allParcels.push(parcel);
    }
  });

  return allParcels;
}
