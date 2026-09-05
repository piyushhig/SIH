import { LandParcel, Project, EarlyWarning, AcquisitionStage, RiskLevel, StageTimelineItem, RiskDriver, RecommendedAction } from '../types';

/**
 * LANDGUARD AI — CENTRALIZED SINGLE SOURCE OF TRUTH DATASET
 * DEMO ENVIRONMENT • SIMULATED DATA • ILLUSTRATIVE PREDICTION
 *
 * All dashboard numbers, map markers, project lists, parcel tables,
 * risk charts, and early warnings derive strictly from this dataset.
 */

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

// -------------------------------------------------------------
// CENTRALIZED RAW PARCELS (42 Detailed Realistic Records)
// -------------------------------------------------------------
export const RAW_PARCELS: LandParcel[] = [
  // ==========================================
  // 1. UTTAR PRADESH — LUCKNOW
  // Project: PRJ-UP-01 Lucknow Outer Ring Road (Kisan Path Expansion)
  // ==========================================
  {
    id: 'LA-1011',
    khasraNo: '312/1 & 312/2',
    village: 'Bani',
    taluka: 'Sarojini Nagar',
    city: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    latitude: 26.8521,
    longitude: 80.9512,
    projectId: 'PRJ-UP-01',
    projectName: 'Lucknow Outer Ring Road (Kisan Path Expansion)',
    areaHa: 3.42,
    ownerCount: 8,
    stage: 'Compensation',
    daysInStage: 68,
    expectedDaysInStage: 30,
    riskScore: 84,
    riskLevel: 'High',
    delayProbability: 82,
    predictedDelayDays: 45,
    status: 'Disputed',
    primaryRiskFactor: 'Title & Succession Dispute among Co-Heirs',
    timeline: createTimeline('Compensation', false),
    riskDrivers: [
      { factor: 'Inheritance Dispute', contribution: 40, description: 'Succession certificate contested in Additional District Judge court.' },
      { factor: 'Disbursement Hold', contribution: 30, description: 'Treasury voucher paused due to objection notice.' },
      { factor: 'Valuation Gap', contribution: 20, description: 'Demand for commercial land rates near highway interchange.' },
      { factor: 'Boundary Alignment', contribution: 10, description: 'Overlap with village irrigation canal.' },
    ],
    riskExplanation: 'High risk of schedule slippage due to contested legal succession and blocked compensation disbursement in Sarojini Nagar sub-division.',
    recommendedActions: [
      { id: 'ACT-UP-101', priority: 'High', action: 'Deposit 40% disputed share into District Court under Section 77(2) RFCTLARR to clear physical possession.', expectedImpact: 'Reduces projected delay by 28 days' },
      { id: 'ACT-UP-102', priority: 'Medium', action: 'Convene Special Lok Adalat with Sub-Divisional Magistrate for negotiated settlement.', expectedImpact: 'Expedites title verification within 10 days' },
    ],
    notes: 'Critical land parcel for cloverleaf interchange ramp at Ch. 18+200.',
    lastUpdated: '1 day ago',
  },
  {
    id: 'LA-1012',
    khasraNo: '184/3',
    village: 'Bakshi Ka Talab',
    taluka: 'Bakshi Ka Talab',
    city: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    latitude: 26.9842,
    longitude: 80.9125,
    projectId: 'PRJ-UP-01',
    projectName: 'Lucknow Outer Ring Road (Kisan Path Expansion)',
    areaHa: 2.15,
    ownerCount: 4,
    stage: 'Valuation',
    daysInStage: 42,
    expectedDaysInStage: 30,
    riskScore: 58,
    riskLevel: 'Medium',
    delayProbability: 55,
    predictedDelayDays: 20,
    status: 'Pending Approval',
    primaryRiskFactor: 'Circle Rate vs Market Rate Disparity',
    timeline: createTimeline('Valuation', false),
    riskDrivers: [
      { factor: 'Valuation Resistance', contribution: 45, description: 'Owners filed objection citing recent commercial circle rate revisions.' },
      { factor: 'Documentation Verification', contribution: 35, description: 'Khasra Jamabandi copy missing updated revenue endorsement.' },
      { factor: 'Survey Verification', contribution: 20, description: 'Minor offset on western frontage boundary.' },
    ],
    riskExplanation: 'Valuation objections filed under Section 15 requires District Level Committee review to prevent further timeline slippage.',
    recommendedActions: [
      { id: 'ACT-UP-103', priority: 'Medium', action: 'Refer to District Level Valuation Committee for fast-track circle rate harmonization.', expectedImpact: 'Saves 14 days of procedural delay' },
    ],
    notes: 'Connecting spur for Sitapur Road junction.',
    lastUpdated: '2 days ago',
  },
  {
    id: 'LA-1013',
    khasraNo: '95/4A',
    village: 'Mohanlalganj',
    taluka: 'Mohanlalganj',
    city: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    latitude: 26.6812,
    longitude: 80.9984,
    projectId: 'PRJ-UP-01',
    projectName: 'Lucknow Outer Ring Road (Kisan Path Expansion)',
    areaHa: 1.85,
    ownerCount: 3,
    stage: 'Survey',
    daysInStage: 22,
    expectedDaysInStage: 35,
    riskScore: 28,
    riskLevel: 'Low',
    delayProbability: 25,
    predictedDelayDays: 6,
    status: 'In Progress',
    primaryRiskFactor: 'Standard Cadastral Delineation',
    timeline: createTimeline('Survey', false),
    riskDrivers: [
      { factor: 'Survey Verification', contribution: 50, description: 'Drone survey completed, ground truthing underway.' },
      { factor: 'Documentation', contribution: 30, description: 'All title documents verified by Tahsil office.' },
      { factor: 'Public Notice', contribution: 20, description: 'Objection window closes in 5 days.' },
    ],
    riskExplanation: 'Land acquisition proceeding on schedule with minimal friction.',
    recommendedActions: [
      { id: 'ACT-UP-104', priority: 'Low', action: 'Publish joint measurement signature sheet upon conclusion of boundary walk.', expectedImpact: 'Maintains schedule on track' },
    ],
    notes: 'Straight alignment stretch across flat agricultural ground.',
    lastUpdated: '3 days ago',
  },
  {
    id: 'LA-1014',
    khasraNo: '410/2',
    village: 'Chinhat Peri-Urban',
    taluka: 'Lucknow East',
    city: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    latitude: 26.8791,
    longitude: 81.0423,
    projectId: 'PRJ-UP-01',
    projectName: 'Lucknow Outer Ring Road (Kisan Path Expansion)',
    areaHa: 1.20,
    ownerCount: 2,
    stage: 'Possession',
    daysInStage: 12,
    expectedDaysInStage: 20,
    riskScore: 18,
    riskLevel: 'Low',
    delayProbability: 12,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Award Disbursed',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Disbursement Completed', contribution: 60, description: 'Full compensation credited to verified escrow accounts.' },
      { factor: 'Physical Handover', contribution: 40, description: 'Clearance certificate issued by CALA.' },
    ],
    riskExplanation: 'Acquisition completed successfully; possession certificate handed to NHAI.',
    recommendedActions: [
      { id: 'ACT-UP-105', priority: 'Low', action: 'Complete revenue mutation into NHAI ownership register.', expectedImpact: 'Final administrative sign-off' },
    ],
    notes: 'Civil construction contractor mobilization approved.',
    lastUpdated: '5 days ago',
  },

  // ==========================================
  // 2. UTTAR PRADESH — VARANASI
  // Project: PRJ-UP-02 Varanasi-Kolkata Economic Expressway
  // ==========================================
  {
    id: 'LA-1021',
    khasraNo: '78/2B',
    village: 'Chandauli Border',
    taluka: 'Mughalsarai',
    city: 'Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.3176,
    longitude: 82.9739,
    projectId: 'PRJ-UP-02',
    projectName: 'Varanasi-Kolkata Economic Expressway (Chandauli Section)',
    areaHa: 4.80,
    ownerCount: 11,
    stage: 'Compensation',
    daysInStage: 76,
    expectedDaysInStage: 30,
    riskScore: 88,
    riskLevel: 'High',
    delayProbability: 86,
    predictedDelayDays: 52,
    status: 'Stay Order',
    primaryRiskFactor: 'High Court Interim Stay on Land Use Classification',
    timeline: createTimeline('Compensation', false),
    riskDrivers: [
      { factor: 'High Court Writ', contribution: 45, description: 'Writ Petition filed challenging notification clause under Section 3D.' },
      { factor: 'Multi-party Litigation', contribution: 30, description: 'Over 11 co-sharers disputing individual compensation shares.' },
      { factor: 'Commercial Reclassification', contribution: 25, description: 'Demand for commercial classification for highway frontage land.' },
    ],
    riskExplanation: 'Severe legal freeze due to High Court interim injunction; requires urgent state counsel counter-affidavit filing.',
    recommendedActions: [
      { id: 'ACT-UP-201', priority: 'High', action: 'File urgent application for vacation of stay before Allahabad High Court with NHAI Solicitor General.', expectedImpact: 'Resolves legal roadblock within 21 days' },
      { id: 'ACT-UP-202', priority: 'High', action: 'Offer structured settlement through CALA special hearing tribunal.', expectedImpact: 'Prevents protracted litigation' },
    ],
    notes: 'Key corridor section impacting bridge foundation over Karamnasa river.',
    lastUpdated: 'Today, 08:30 AM',
  },
  {
    id: 'LA-1022',
    khasraNo: '144/1',
    village: 'Rohaniya',
    taluka: 'Varanasi Sadar',
    city: 'Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.2654,
    longitude: 82.9123,
    projectId: 'PRJ-UP-02',
    projectName: 'Varanasi-Kolkata Economic Expressway (Chandauli Section)',
    areaHa: 2.65,
    ownerCount: 5,
    stage: 'Valuation',
    daysInStage: 38,
    expectedDaysInStage: 30,
    riskScore: 62,
    riskLevel: 'High',
    delayProbability: 64,
    predictedDelayDays: 32,
    status: 'Pending Approval',
    primaryRiskFactor: 'Objections to Solatium Computation',
    timeline: createTimeline('Valuation', false),
    riskDrivers: [
      { factor: 'Solatium Dispute', contribution: 40, description: 'Owners contesting 100% solatium application under 1st Schedule RFCTLARR.' },
      { factor: 'Structure Assessment', contribution: 35, description: 'Unregistered tube-well and boundary wall valuation pending PWD inspection.' },
      { factor: 'Tree Valuation', contribution: 25, description: 'Horticulture department report delayed.' },
    ],
    riskExplanation: 'Delayed award determination due to pending joint PWD structural assessment.',
    recommendedActions: [
      { id: 'ACT-UP-203', priority: 'Medium', action: 'Direct PWD Executive Engineer to submit asset valuation report within 7 days.', expectedImpact: 'Reduces valuation lag by 15 days' },
    ],
    notes: 'Toll plaza approach sector.',
    lastUpdated: '1 day ago',
  },
  {
    id: 'LA-1023',
    khasraNo: '202/3',
    village: 'Shivpur Sector',
    taluka: 'Varanasi Sadar',
    city: 'Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.3562,
    longitude: 82.9845,
    projectId: 'PRJ-UP-02',
    projectName: 'Varanasi-Kolkata Economic Expressway (Chandauli Section)',
    areaHa: 1.95,
    ownerCount: 3,
    stage: 'Possession',
    daysInStage: 16,
    expectedDaysInStage: 20,
    riskScore: 22,
    riskLevel: 'Low',
    delayProbability: 18,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Award Settled',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Settled Award', contribution: 70, description: 'Consensus award achieved through bilateral agreement.' },
      { factor: 'Handover Completed', contribution: 30, description: 'Boundary stone markers installed.' },
    ],
    riskExplanation: 'Fully cleared land package ready for civil contractor access.',
    recommendedActions: [
      { id: 'ACT-UP-204', priority: 'Low', action: 'Issue formal Right of Way (ROW) certificate to civil concessionaire.', expectedImpact: 'Enables immediate earthworks' },
    ],
    notes: 'Greenfield roadbed segment.',
    lastUpdated: '4 days ago',
  },

  // ==========================================
  // 3. UTTAR PRADESH — GAUTAM BUDDHA NAGAR (NOIDA)
  // Project: PRJ-UP-03 Yamuna Expressway Aerocity Link
  // ==========================================
  {
    id: 'LA-1031',
    khasraNo: '512/3 & 512/4',
    village: 'Jewar Khurd',
    taluka: 'Jewar',
    city: 'Greater Noida',
    district: 'Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
    latitude: 28.3588,
    longitude: 77.5516,
    projectId: 'PRJ-UP-03',
    projectName: 'Yamuna Expressway Aerocity Link',
    areaHa: 5.60,
    ownerCount: 14,
    stage: 'Compensation',
    daysInStage: 65,
    expectedDaysInStage: 30,
    riskScore: 76,
    riskLevel: 'High',
    delayProbability: 74,
    predictedDelayDays: 38,
    status: 'Disputed',
    primaryRiskFactor: 'Gram Sabha Common Land Encroachment',
    timeline: createTimeline('Compensation', false),
    riskDrivers: [
      { factor: 'Common Land Rights', contribution: 45, description: 'Local farmer committee claims customary grazing rights over Gram Sabha portion.' },
      { factor: 'Rehabilitation Package', contribution: 35, description: 'Demands for job allocation quotas in airport logistics park.' },
      { factor: 'Family Division', contribution: 20, description: 'Pending partition deed across 3 branches of original title-holder.' },
    ],
    riskExplanation: 'Prolonged negotiations with village community over rehabilitation entitlements and common land rights.',
    recommendedActions: [
      { id: 'ACT-UP-301', priority: 'High', action: 'Hold Joint Collector settlement council with village elders and offer alternative grazing parcel.', expectedImpact: 'Secures community consent in 14 days' },
    ],
    notes: 'Critical western runway boundary clearance.',
    lastUpdated: '1 day ago',
  },
  {
    id: 'LA-1032',
    khasraNo: '240/1',
    village: 'Dankaur',
    taluka: 'Dankaur',
    city: 'Greater Noida',
    district: 'Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
    latitude: 28.4215,
    longitude: 77.5123,
    projectId: 'PRJ-UP-03',
    projectName: 'Yamuna Expressway Aerocity Link',
    areaHa: 3.10,
    ownerCount: 6,
    stage: 'Survey',
    daysInStage: 28,
    expectedDaysInStage: 35,
    riskScore: 36,
    riskLevel: 'Medium',
    delayProbability: 34,
    predictedDelayDays: 10,
    status: 'In Progress',
    primaryRiskFactor: 'High-Tension Power Transmission Line Relocation',
    timeline: createTimeline('Survey', false),
    riskDrivers: [
      { factor: 'Utility Relocation', contribution: 50, description: 'UPPCL 400kV tower corridor intersects proposed interchange boundary.' },
      { factor: 'Joint Survey', contribution: 30, description: 'Survey team mapping revised tower placement coordinates.' },
      { factor: 'Statutory Clearance', contribution: 20, description: 'Power grid safety clearance awaited.' },
    ],
    riskExplanation: 'Technical alignment adjustments required to accommodate high-voltage power transmission pylon.',
    recommendedActions: [
      { id: 'ACT-UP-302', priority: 'Medium', action: 'Expedite joint site walk with UPPCL transmission engineers for tower shifting estimate.', expectedImpact: 'Prevents 20-day construction delay' },
    ],
    notes: 'Power corridor clearance agreement drafted.',
    lastUpdated: '2 days ago',
  },
  {
    id: 'LA-1033',
    khasraNo: '118/2',
    village: 'Rabupura',
    taluka: 'Jewar',
    city: 'Greater Noida',
    district: 'Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
    latitude: 28.3120,
    longitude: 77.5840,
    projectId: 'PRJ-UP-03',
    projectName: 'Yamuna Expressway Aerocity Link',
    areaHa: 2.45,
    ownerCount: 4,
    stage: 'Possession',
    daysInStage: 15,
    expectedDaysInStage: 20,
    riskScore: 20,
    riskLevel: 'Low',
    delayProbability: 15,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Transferred',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Acquired', contribution: 80, description: 'Direct consent purchase under UP Industrial Area Development Act.' },
      { factor: 'Clear Title', contribution: 20, description: 'Complete revenue record mutation verified.' },
    ],
    riskExplanation: 'Fully settled parcel, immediate civil execution authorized.',
    recommendedActions: [
      { id: 'ACT-UP-303', priority: 'Low', action: 'Issue contractor access milestone notice.', expectedImpact: 'Mobilizes machinery' },
    ],
    notes: 'Southern expressway ramp connection.',
    lastUpdated: '3 days ago',
  },

  // ==========================================
  // 4. MAHARASHTRA — PUNE
  // Project: PRJ-MSRDC-01 Pune Ring Road (Eastern Alignment Phase 1)
  // ==========================================
  {
    id: 'LA-2048',
    khasraNo: '142/2A & 142/3',
    village: 'Wadgaon Shinde',
    taluka: 'Haveli',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5721,
    longitude: 73.8962,
    projectId: 'PRJ-MSRDC-01',
    projectName: 'Pune Ring Road (Eastern Alignment Phase 1)',
    areaHa: 2.85,
    ownerCount: 7,
    stage: 'Compensation',
    daysInStage: 74,
    expectedDaysInStage: 30,
    riskScore: 78,
    riskLevel: 'High',
    delayProbability: 78,
    predictedDelayDays: 42,
    status: 'Disputed',
    primaryRiskFactor: 'Title & Compensation Apportionment Dispute',
    timeline: createTimeline('Compensation', false),
    riskDrivers: [
      { factor: 'Legal Dispute', contribution: 34, description: 'Civil partition suit filed by secondary heirs at District Civil Court, Haveli.' },
      { factor: 'Compensation Pending', contribution: 28, description: 'Disbursement stalled pending verification of registered indemnity bonds.' },
      { factor: 'Documentation Gap', contribution: 18, description: 'Updated 7/12 extract missing mutation entry for 2 co-parceners.' },
      { factor: 'Owner Negotiation', contribution: 12, description: 'Demand for commercial rehabilitation multiplier instead of semi-urban rate.' },
      { factor: 'Survey Delay', contribution: 8, description: 'Minor road widening boundary overlapping irrigation pipeline easement.' },
    ],
    riskExplanation: 'Extended time in compensation stage combined with unresolved documentation and an active legal issue is increasing the likelihood of acquisition delay.',
    recommendedActions: [
      { id: 'ACT-101', priority: 'High', action: 'Deposit disputed 40% share in District Court under Sec 3H(4) to permit possession transfer', expectedImpact: 'Prevents stalling of physical handover while civil inheritance suit proceeds independently' },
      { id: 'ACT-102', priority: 'High', action: 'Schedule Tahsildar summary mutation camp for verified co-sharers', expectedImpact: 'Clears title chain defect within 7 working days' },
      { id: 'ACT-103', priority: 'Medium', action: 'Formalize structured rehabilitation assistance package as per RFCTLARR 2nd Schedule', expectedImpact: 'Secures consensus agreement from remaining 5 active title-holders' },
    ],
    notes: 'Land parcel critical for interchange ramp connectivity at Ch. 34+800. Delay impacts adjacent bridge pier erection.',
    lastUpdated: 'Today, 09:15 AM',
  },
  {
    id: 'LA-2051',
    khasraNo: '64/3 & 64/4',
    village: 'Lonikand Industrial Belt',
    taluka: 'Haveli',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5840,
    longitude: 73.9850,
    projectId: 'PRJ-MSRDC-01',
    projectName: 'Pune Ring Road (Eastern Alignment Phase 1)',
    areaHa: 3.20,
    ownerCount: 9,
    stage: 'Compensation',
    daysInStage: 61,
    expectedDaysInStage: 30,
    riskScore: 74,
    riskLevel: 'High',
    delayProbability: 71,
    predictedDelayDays: 36,
    status: 'Disputed',
    primaryRiskFactor: 'Non-Agricultural (NA) Land Premium Dispute',
    timeline: createTimeline('Compensation', false),
    riskDrivers: [
      { factor: 'Valuation Formula', contribution: 45, description: 'Dispute regarding Ready Reckoner industrial classification rate vs agricultural rate.' },
      { factor: 'Mortgage Encumbrance', contribution: 35, description: 'Commercial bank mortgage registered on 7/12 extract; NOC awaited.' },
      { factor: 'Disbursement Protocol', contribution: 20, description: 'Tripartite escrow release pending with lending consortium.' },
    ],
    riskExplanation: 'Unresolved commercial bank mortgage lien stalls direct compensation disbursement to landowners.',
    recommendedActions: [
      { id: 'ACT-MH-101', priority: 'High', action: 'Convene tri-party meeting with State Level Bankers Committee (SLBC) for priority debt apportionment.', expectedImpact: 'Resolves lender objection in 12 days' },
    ],
    notes: 'Interchange cloverleaf connecting Ahmednagar Highway (SH-27).',
    lastUpdated: '1 day ago',
  },
  {
    id: 'LA-2052',
    khasraNo: '210/1',
    village: 'Wagholi',
    taluka: 'Haveli',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5780,
    longitude: 73.9780,
    projectId: 'PRJ-MSRDC-01',
    projectName: 'Pune Ring Road (Eastern Alignment Phase 1)',
    areaHa: 1.75,
    ownerCount: 4,
    stage: 'Notification',
    daysInStage: 34,
    expectedDaysInStage: 25,
    riskScore: 62,
    riskLevel: 'High',
    delayProbability: 58,
    predictedDelayDays: 24,
    status: 'Pending Approval',
    primaryRiskFactor: 'Out-of-state Co-owners Missing Power of Attorney',
    timeline: createTimeline('Notification', false),
    riskDrivers: [
      { factor: 'NRI Co-owners', contribution: 55, description: 'Three primary co-sharers residing overseas without consular legalized PoA.' },
      { factor: 'Notice Delivery', contribution: 30, description: 'Section 3A statutory objection notice delivery confirmation pending.' },
      { factor: 'Survey Verification', contribution: 15, description: 'Boundary pillar verification completed.' },
    ],
    riskExplanation: 'International notice service delay threatens statutory lapse under Section 3D limitation clock.',
    recommendedActions: [
      { id: 'ACT-MH-102', priority: 'High', action: 'Issue e-consent authenticated notification through Indian Consulate diplomatic pouch.', expectedImpact: 'Prevents Section 3D statutory lapse' },
    ],
    notes: 'Urban bypass feeder route.',
    lastUpdated: '3 days ago',
  },
  {
    id: 'LA-2053',
    khasraNo: '88/2',
    village: 'Uruli Kanchan',
    taluka: 'Haveli',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.4890,
    longitude: 74.1350,
    projectId: 'PRJ-MSRDC-01',
    projectName: 'Pune Ring Road (Eastern Alignment Phase 1)',
    areaHa: 2.10,
    ownerCount: 3,
    stage: 'Possession',
    daysInStage: 18,
    expectedDaysInStage: 20,
    riskScore: 24,
    riskLevel: 'Low',
    delayProbability: 15,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Possession Handed Over',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Award Paid', contribution: 80, description: 'Direct bank transfer credited without deduction.' },
      { factor: 'Clear Handover', contribution: 20, description: 'Possession certificate granted under Section 3E.' },
    ],
    riskExplanation: 'Fully cleared parcel; contractor earthworks in progress.',
    recommendedActions: [
      { id: 'ACT-MH-103', priority: 'Low', action: 'Complete revenue record mutation into MSRDC land bank.', expectedImpact: 'Final ledger entry' },
    ],
    notes: 'Solapur railway flyover pier location.',
    lastUpdated: '4 days ago',
  },

  // ==========================================
  // 5. MAHARASHTRA — PALGHAR
  // Project: PRJ-DFCCIL-07 Western Dedicated Freight Corridor (Vaitarna–JNPT)
  // ==========================================
  {
    id: 'LA-2049',
    khasraNo: '88/1B',
    village: 'Vaitarna Forest Buffer',
    taluka: 'Dahanu',
    city: 'Palghar',
    district: 'Palghar',
    state: 'Maharashtra',
    latitude: 19.6967,
    longitude: 72.7699,
    projectId: 'PRJ-DFCCIL-07',
    projectName: 'Western Dedicated Freight Corridor (Vaitarna–JNPT)',
    areaHa: 4.12,
    ownerCount: 12,
    stage: 'Valuation',
    daysInStage: 58,
    expectedDaysInStage: 30,
    riskScore: 82,
    riskLevel: 'High',
    delayProbability: 80,
    predictedDelayDays: 48,
    status: 'Stay Order',
    primaryRiskFactor: 'Tribal Land Transfer Restriction (Sec 36A)',
    timeline: createTimeline('Valuation', false),
    riskDrivers: [
      { factor: 'Tribal Land Restrictions', contribution: 45, description: 'Maharashtra Land Revenue Code Sec 36A sanction required from Divisional Commissioner.' },
      { factor: 'Valuation Objections', contribution: 30, description: 'Orchard tree enumeration under dispute with Forest Range Officer.' },
      { factor: 'Joint Measurement', contribution: 25, description: 'Forest boundary pillar overlap of 14 meters.' },
    ],
    riskExplanation: 'Tribal welfare sanction under Section 36A delayed; physical handover prohibited without Collector concurrence.',
    recommendedActions: [
      { id: 'ACT-201', priority: 'High', action: 'Submit expedited Section 36A file to Divisional Commissioner Konkan Division with special rehab package', expectedImpact: 'Reduces statutory dwell time by 30 days' },
      { id: 'ACT-202', priority: 'High', action: 'Joint site inspection with Assistant Conservator of Forests to reconcile forest boundary pillars', expectedImpact: 'Resolves boundary overlap within 10 days' },
    ],
    notes: 'Key segment for double-stack freight container line. Heavy civil contractor penalties if handover delayed.',
    lastUpdated: '1 day ago',
  },
  {
    id: 'LA-2054',
    khasraNo: '112/4',
    village: 'Manor',
    taluka: 'Palghar',
    city: 'Palghar',
    district: 'Palghar',
    state: 'Maharashtra',
    latitude: 19.7420,
    longitude: 72.9120,
    projectId: 'PRJ-DFCCIL-07',
    projectName: 'Western Dedicated Freight Corridor (Vaitarna–JNPT)',
    areaHa: 3.50,
    ownerCount: 8,
    stage: 'Compensation',
    daysInStage: 52,
    expectedDaysInStage: 30,
    riskScore: 68,
    riskLevel: 'High',
    delayProbability: 66,
    predictedDelayDays: 32,
    status: 'Disputed',
    primaryRiskFactor: 'Objections to Solatium & Multiplier Factor',
    timeline: createTimeline('Compensation', false),
    riskDrivers: [
      { factor: 'Multiplier Dispute', contribution: 40, description: 'Owners demanding 2.0x rural multiplier instead of 1.5x semi-urban rate.' },
      { factor: 'Succession Dispute', contribution: 35, description: 'Two title holders deceased without legal heir certificates.' },
      { factor: 'Revenue Correction', contribution: 25, description: 'Gat boundary demarcation revision pending.' },
    ],
    riskExplanation: 'Compensation award rejected by landholders over application of rural multiplier factor.',
    recommendedActions: [
      { id: 'ACT-MH-201', priority: 'High', action: 'Refer multiplier dispute to Land Acquisition, Rehabilitation & Resettlement Authority (LARRA).', expectedImpact: 'Prevents civil court stay order' },
    ],
    notes: 'Dedicated electric feeder sub-station tract.',
    lastUpdated: '2 days ago',
  },
  {
    id: 'LA-2055',
    khasraNo: '45/1',
    village: 'Boisar Industrial Corridor',
    taluka: 'Palghar',
    city: 'Palghar',
    district: 'Palghar',
    state: 'Maharashtra',
    latitude: 19.7980,
    longitude: 72.7540,
    projectId: 'PRJ-DFCCIL-07',
    projectName: 'Western Dedicated Freight Corridor (Vaitarna–JNPT)',
    areaHa: 2.20,
    ownerCount: 3,
    stage: 'Possession',
    daysInStage: 14,
    expectedDaysInStage: 20,
    riskScore: 22,
    riskLevel: 'Low',
    delayProbability: 14,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Cleared',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Cleared', contribution: 90, description: 'Full possession taken by DFCCIL civil engineering wing.' },
    ],
    riskExplanation: 'Track ballast laying active on site.',
    recommendedActions: [
      { id: 'ACT-MH-202', priority: 'Low', action: 'Close administrative acquisition file.', expectedImpact: 'SLA completed' },
    ],
    notes: 'Grade-separated freight track bed.',
    lastUpdated: '5 days ago',
  },

  // ==========================================
  // 6. MAHARASHTRA — NAGPUR
  // Project: PRJ-MH-03 Samruddhi Expressway Logistics Interchange
  // ==========================================
  {
    id: 'LA-2061',
    khasraNo: '312/5',
    village: 'Hingna Industrial Area',
    taluka: 'Hingna',
    city: 'Nagpur',
    district: 'Nagpur',
    state: 'Maharashtra',
    latitude: 21.1458,
    longitude: 79.0882,
    projectId: 'PRJ-MH-03',
    projectName: 'Samruddhi Expressway Logistics Interchange',
    areaHa: 4.80,
    ownerCount: 9,
    stage: 'Valuation',
    daysInStage: 35,
    expectedDaysInStage: 30,
    riskScore: 54,
    riskLevel: 'Medium',
    delayProbability: 50,
    predictedDelayDays: 18,
    status: 'Pending Approval',
    primaryRiskFactor: 'Commercial Warehouse Structure Compensation',
    timeline: createTimeline('Valuation', false),
    riskDrivers: [
      { factor: 'Structural Valuation', contribution: 45, description: 'Dispute over depreciation formula applied to prefabricated cold storage warehouse.' },
      { factor: 'Tenant Relocation', contribution: 35, description: 'Commercial tenants demanding business interruption solatium.' },
      { factor: 'Survey Verification', contribution: 20, description: 'Site boundary aligned.' },
    ],
    riskExplanation: 'Private warehouse owner contesting structural valuation depreciation rates applied by PWD valuer.',
    recommendedActions: [
      { id: 'ACT-MH-301', priority: 'Medium', action: 'Appoint certified chartered quantity surveyor for independent asset re-appraisal.', expectedImpact: 'Saves 25 days of formal court proceedings' },
    ],
    notes: 'Logistics cargo terminal entry hub.',
    lastUpdated: '1 day ago',
  },
  {
    id: 'LA-2062',
    khasraNo: '180/2',
    village: 'Butibori',
    taluka: 'Nagpur Rural',
    city: 'Nagpur',
    district: 'Nagpur',
    state: 'Maharashtra',
    latitude: 20.9180,
    longitude: 78.9950,
    projectId: 'PRJ-MH-03',
    projectName: 'Samruddhi Expressway Logistics Interchange',
    areaHa: 3.10,
    ownerCount: 4,
    stage: 'Possession',
    daysInStage: 16,
    expectedDaysInStage: 20,
    riskScore: 18,
    riskLevel: 'Low',
    delayProbability: 10,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Transferred',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Completed', contribution: 85, description: 'All compensation disbursed through direct Aadhaar-linked transfer.' },
    ],
    riskExplanation: 'Clear possession granted; interchange asphalt paving in progress.',
    recommendedActions: [
      { id: 'ACT-MH-302', priority: 'Low', action: 'File revenue mutation statement with Tahsil registry.', expectedImpact: 'Standard procedure' },
    ],
    notes: 'Interchange cloverleaf ramp.',
    lastUpdated: '4 days ago',
  },

  // ==========================================
  // 7. GUJARAT — BHARUCH
  // Project: PRJ-NHAI-04 Delhi-Mumbai Expressway (Vadodara–Kim Section)
  // ==========================================
  {
    id: 'LA-3011',
    khasraNo: '214/1 & 214/2',
    village: 'Palej Industrial Reach',
    taluka: 'Bharuch',
    city: 'Bharuch',
    district: 'Bharuch',
    state: 'Gujarat',
    latitude: 21.7051,
    longitude: 72.9959,
    projectId: 'PRJ-NHAI-04',
    projectName: 'Delhi-Mumbai Expressway (Vadodara–Kim Section)',
    areaHa: 3.15,
    ownerCount: 6,
    stage: 'Valuation',
    daysInStage: 48,
    expectedDaysInStage: 30,
    riskScore: 72,
    riskLevel: 'High',
    delayProbability: 70,
    predictedDelayDays: 34,
    status: 'Disputed',
    primaryRiskFactor: 'Chemical Pipeline Corridor Right-of-Way Clash',
    timeline: createTimeline('Valuation', false),
    riskDrivers: [
      { factor: 'Utility Relocation', contribution: 40, description: 'Underground GIDC chemical effluent line requires relocation before award finalization.' },
      { factor: 'Jantar Rate Dispute', contribution: 35, description: 'Owners challenging circle rate classifications for peri-urban Palej plots.' },
      { factor: 'Encroachment', contribution: 25, description: 'Temporary truck transit dhabas occupying road shoulder.' },
    ],
    riskExplanation: 'Underground chemical pipeline clash and pending Jantar rate objection require inter-agency coordination with GIDC.',
    recommendedActions: [
      { id: 'ACT-GJ-101', priority: 'High', action: 'Coordinate single-window utility shifting approval with GIDC Chief Engineer', expectedImpact: 'Saves 21 days on civil site release' },
      { id: 'ACT-GJ-102', priority: 'Medium', action: 'Issue revenue notices for voluntary relocation of temporary highway encroachments', expectedImpact: 'Clears right-of-way without police intervention' },
    ],
    notes: 'Expressway interchange connecting Dahej Petroleum Chemical Investment Region (PCPIR).',
    lastUpdated: '2 days ago',
  },
  {
    id: 'LA-3012',
    khasraNo: '98/3',
    village: 'Nabipur',
    taluka: 'Bharuch',
    city: 'Bharuch',
    district: 'Bharuch',
    state: 'Gujarat',
    latitude: 21.7580,
    longitude: 73.0240,
    projectId: 'PRJ-NHAI-04',
    projectName: 'Delhi-Mumbai Expressway (Vadodara–Kim Section)',
    areaHa: 2.40,
    ownerCount: 4,
    stage: 'Compensation',
    daysInStage: 36,
    expectedDaysInStage: 30,
    riskScore: 48,
    riskLevel: 'Medium',
    delayProbability: 45,
    predictedDelayDays: 14,
    status: 'Pending Approval',
    primaryRiskFactor: 'Indemnity Bond Submission Pending',
    timeline: createTimeline('Compensation', false),
    riskDrivers: [
      { factor: 'Documentation', contribution: 50, description: 'Indemnity bond pending signature from 2 out-of-district co-owners.' },
      { factor: 'Disbursement Queue', contribution: 30, description: 'Bank RTGS schedule prepared by CALA treasury.' },
      { factor: 'Verification', contribution: 20, description: 'Revenue passbook verified.' },
    ],
    riskExplanation: 'Compensation disbursement queued; pending physical indemnity bond submission by co-owners.',
    recommendedActions: [
      { id: 'ACT-GJ-103', priority: 'Medium', action: 'Dispatch revenue inspector for doorstep indemnity bond collection.', expectedImpact: 'Releases funds within 5 days' },
    ],
    notes: 'Toll plaza bypass approach.',
    lastUpdated: '3 days ago',
  },
  {
    id: 'LA-3013',
    khasraNo: '150/1',
    village: 'Ankleshwar Outskirts',
    taluka: 'Ankleshwar',
    city: 'Bharuch',
    district: 'Bharuch',
    state: 'Gujarat',
    latitude: 21.6280,
    longitude: 73.0010,
    projectId: 'PRJ-NHAI-04',
    projectName: 'Delhi-Mumbai Expressway (Vadodara–Kim Section)',
    areaHa: 1.90,
    ownerCount: 2,
    stage: 'Possession',
    daysInStage: 12,
    expectedDaysInStage: 20,
    riskScore: 16,
    riskLevel: 'Low',
    delayProbability: 10,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Award Settled',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Settled', contribution: 90, description: 'Full possession certificate issued to NHAI PIU Bharuch.' },
    ],
    riskExplanation: 'Paving and flyover pier construction proceeding on schedule.',
    recommendedActions: [
      { id: 'ACT-GJ-104', priority: 'Low', action: 'Ensure permanent boundary fencing installation.', expectedImpact: 'Prevents re-encroachment' },
    ],
    notes: 'Main eight-lane expressway carriage-way.',
    lastUpdated: '5 days ago',
  },

  // ==========================================
  // 8. GUJARAT — AHMEDABAD
  // Project: PRJ-GJ-02 Ahmedabad-Dholera Express Highway (SIR Node)
  // ==========================================
  {
    id: 'LA-3021',
    khasraNo: '412/1B',
    village: 'Bavla Sub-zone',
    taluka: 'Bavla',
    city: 'Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 22.8340,
    longitude: 72.3680,
    projectId: 'PRJ-GJ-02',
    projectName: 'Ahmedabad-Dholera Express Highway (SIR Node)',
    areaHa: 4.20,
    ownerCount: 8,
    stage: 'Compensation',
    daysInStage: 62,
    expectedDaysInStage: 30,
    riskScore: 75,
    riskLevel: 'High',
    delayProbability: 72,
    predictedDelayDays: 38,
    status: 'Disputed',
    primaryRiskFactor: 'Dholera SIR Master Plan Alignment Friction',
    timeline: createTimeline('Compensation', false),
    riskDrivers: [
      { factor: 'Zoning Revision', contribution: 45, description: 'Land parcel re-designated from agricultural to town planning scheme TP-2.' },
      { factor: 'Compensation Rate', contribution: 35, description: 'Landowners demand compensation based on final TP plot valuation.' },
      { factor: 'Survey Validation', contribution: 20, description: 'DGPS survey requires verification against Dholera Development Authority cadastral maps.' },
    ],
    riskExplanation: 'Town planning scheme alignment friction causes delays in compensation award publication.',
    recommendedActions: [
      { id: 'ACT-GJ-201', priority: 'High', action: 'Convene joint reconciliation sitting between CALA and Dholera Special Investment Regional Development Authority.', expectedImpact: 'Resolves zoning dispute within 15 days' },
    ],
    notes: 'Direct expressway access spine into Dholera Semiconductor cluster.',
    lastUpdated: '1 day ago',
  },
  {
    id: 'LA-3022',
    khasraNo: '280/4',
    village: 'Dholera Central',
    taluka: 'Dholera',
    city: 'Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 22.2587,
    longitude: 72.1949,
    projectId: 'PRJ-GJ-02',
    projectName: 'Ahmedabad-Dholera Express Highway (SIR Node)',
    areaHa: 2.80,
    ownerCount: 3,
    stage: 'Possession',
    daysInStage: 15,
    expectedDaysInStage: 20,
    riskScore: 20,
    riskLevel: 'Low',
    delayProbability: 12,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Transferred',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Acquired', contribution: 85, description: 'Fast-track acquisition completed under Gujarat Special Investment Region Act.' },
    ],
    riskExplanation: 'Land handed over to NHAI; asphalt base course active.',
    recommendedActions: [
      { id: 'ACT-GJ-202', priority: 'Low', action: 'Finalize revenue registry documentation.', expectedImpact: 'Closes dossier' },
    ],
    notes: 'Solar corridor buffer stretch.',
    lastUpdated: '3 days ago',
  },

  // ==========================================
  // 9. RAJASTHAN — JAIPUR
  // Project: PRJ-RJ-01 Jaipur Ring Road Expressway (North Package)
  // ==========================================
  {
    id: 'LA-4011',
    khasraNo: '542/3',
    village: 'Chomu Bypass Area',
    taluka: 'Chomu',
    city: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    latitude: 26.9124,
    longitude: 75.7873,
    projectId: 'PRJ-RJ-01',
    projectName: 'Jaipur Ring Road Expressway (North Package)',
    areaHa: 3.80,
    ownerCount: 10,
    stage: 'Compensation',
    daysInStage: 66,
    expectedDaysInStage: 30,
    riskScore: 80,
    riskLevel: 'High',
    delayProbability: 78,
    predictedDelayDays: 44,
    status: 'Disputed',
    primaryRiskFactor: 'Mandatory Commercial Land Allotment Demand (25% Scheme)',
    timeline: createTimeline('Compensation', false),
    riskDrivers: [
      { factor: 'Allotment Dispute', contribution: 45, description: 'Farmers demanding developed commercial land return under Rajasthan 25% Developed Land Policy.' },
      { factor: 'Location Allocation', contribution: 30, description: 'Dispute over physical sector location of proposed commercial return plots.' },
      { factor: 'Survey Discrepancy', contribution: 25, description: 'Old colonial revenue map boundary variation of 1.2 meters.' },
    ],
    riskExplanation: 'Landholders refusing cash compensation, demanding immediate allotment of commercial plots under Jaipur Development Authority scheme.',
    recommendedActions: [
      { id: 'ACT-RJ-101', priority: 'High', action: 'Jaipur Development Authority (JDA) Land Allotment Committee to conduct public lottery for commercial plot numbers.', expectedImpact: 'Secures owner consensus in 14 days' },
      { id: 'ACT-RJ-102', priority: 'Medium', action: 'Sign pre-possession memorandum granting temporary civil construction access.', expectedImpact: 'Allows bridge pier works to continue' },
    ],
    notes: 'Major interchange connecting Delhi-Jaipur Highway (NH-48).',
    lastUpdated: 'Today, 10:00 AM',
  },
  {
    id: 'LA-4012',
    khasraNo: '310/1A',
    village: 'Amer Foothills',
    taluka: 'Amer',
    city: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    latitude: 27.0120,
    longitude: 75.8540,
    projectId: 'PRJ-RJ-01',
    projectName: 'Jaipur Ring Road Expressway (North Package)',
    areaHa: 2.60,
    ownerCount: 5,
    stage: 'Valuation',
    daysInStage: 40,
    expectedDaysInStage: 30,
    riskScore: 56,
    riskLevel: 'Medium',
    delayProbability: 52,
    predictedDelayDays: 18,
    status: 'Pending Approval',
    primaryRiskFactor: 'Heritage Zone Buffer Clearance',
    timeline: createTimeline('Valuation', false),
    riskDrivers: [
      { factor: 'Archaeological Clearance', contribution: 45, description: 'ASI clearance required for road cut within 300 meters of protected historic watchtower.' },
      { factor: 'Valuation Review', contribution: 35, description: 'Rocky terrain excavation multiplier valuation.' },
      { factor: 'Forest Clearance', contribution: 20, description: 'State forest department tree felling transit pass.' },
    ],
    riskExplanation: 'Pending Archaeological Survey of India (ASI) NOC creates mild procedural delay in final award approval.',
    recommendedActions: [
      { id: 'ACT-RJ-103', priority: 'Medium', action: 'Follow up ASI Circle Superintending Archaeologist for final site inspection report.', expectedImpact: 'Secures heritage NOC within 10 days' },
    ],
    notes: 'Hill cut section requiring controlled rock blasting.',
    lastUpdated: '2 days ago',
  },
  {
    id: 'LA-4013',
    khasraNo: '188/2',
    village: 'Sanganer South',
    taluka: 'Sanganer',
    city: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    latitude: 26.8120,
    longitude: 75.7680,
    projectId: 'PRJ-RJ-01',
    projectName: 'Jaipur Ring Road Expressway (North Package)',
    areaHa: 2.10,
    ownerCount: 2,
    stage: 'Possession',
    daysInStage: 11,
    expectedDaysInStage: 20,
    riskScore: 18,
    riskLevel: 'Low',
    delayProbability: 10,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Award Finalized',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Acquired', contribution: 90, description: 'Developed plot deeds registered with sub-registrar.' },
    ],
    riskExplanation: 'Possession handed over; culvert construction completed.',
    recommendedActions: [
      { id: 'ACT-RJ-104', priority: 'Low', action: 'Close acquisition registry tracking ticket.', expectedImpact: 'Completed record' },
    ],
    notes: 'Southern loop connection.',
    lastUpdated: '4 days ago',
  },

  // ==========================================
  // 10. RAJASTHAN — KOTA
  // Project: PRJ-RJ-02 Chambal River Industrial Link Highway
  // ==========================================
  {
    id: 'LA-4021',
    khasraNo: '620/1 & 620/2',
    village: 'Ranpur Industrial Cluster',
    taluka: 'Ladpura',
    city: 'Kota',
    district: 'Kota',
    state: 'Rajasthan',
    latitude: 25.2138,
    longitude: 75.8648,
    projectId: 'PRJ-RJ-02',
    projectName: 'Chambal River Industrial Link Highway',
    areaHa: 4.50,
    ownerCount: 9,
    stage: 'Valuation',
    daysInStage: 55,
    expectedDaysInStage: 30,
    riskScore: 70,
    riskLevel: 'High',
    delayProbability: 68,
    predictedDelayDays: 32,
    status: 'Disputed',
    primaryRiskFactor: 'Canal Irrigation Sub-division Severance Compensation',
    timeline: createTimeline('Valuation', false),
    riskDrivers: [
      { factor: 'Severance Damage', contribution: 45, description: 'Landowners demand severance damage multiplier under Section 28 RFCTLARR due to splitting of irrigated farm plots.' },
      { factor: 'Irrigation Siphon Relocation', contribution: 35, description: 'State irrigation canal division demands cost deposit for underpass conduit.' },
      { factor: 'Cadastral Verification', contribution: 20, description: 'Watercourse boundary demarcation.' },
    ],
    riskExplanation: 'Dispute over severance compensation and irrigation watercourse restructuring stalls valuation award determination.',
    recommendedActions: [
      { id: 'ACT-RJ-201', priority: 'High', action: 'Commission CAD Kota for integrated culvert siphon design to resolve farmland water access.', expectedImpact: 'Eliminates severance objection within 14 days' },
    ],
    notes: 'Major bridge approach section over Chambal canal branch.',
    lastUpdated: '1 day ago',
  },
  {
    id: 'LA-4022',
    khasraNo: '315/2',
    village: 'Mandana',
    taluka: 'Ladpura',
    city: 'Kota',
    district: 'Kota',
    state: 'Rajasthan',
    latitude: 24.9850,
    longitude: 75.9120,
    projectId: 'PRJ-RJ-02',
    projectName: 'Chambal River Industrial Link Highway',
    areaHa: 2.30,
    ownerCount: 3,
    stage: 'Possession',
    daysInStage: 14,
    expectedDaysInStage: 20,
    riskScore: 22,
    riskLevel: 'Low',
    delayProbability: 15,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Transferred',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Completed', contribution: 85, description: 'Mutual agreement compensation accepted.' },
    ],
    riskExplanation: 'Full possession taken by Rajasthan PWD Highway wing.',
    recommendedActions: [
      { id: 'ACT-RJ-202', priority: 'Low', action: 'Transfer land revenue record to PWD.', expectedImpact: 'Final ledger entry' },
    ],
    notes: 'Quarry transport bypass route.',
    lastUpdated: '3 days ago',
  },

  // ==========================================
  // 11. KARNATAKA — BENGALURU URBAN
  // Project: PRJ-KRIDE-02 Bengaluru Suburban Rail Project (Corridor 2 – Kanaka Line)
  // ==========================================
  {
    id: 'LA-5011',
    khasraNo: '84/1 & 84/2',
    village: 'Baiyappanahalli Railway Border',
    taluka: 'Bengaluru East',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    projectId: 'PRJ-KRIDE-02',
    projectName: 'Bengaluru Suburban Rail Project (Corridor 2 – Kanaka Line)',
    areaHa: 1.85,
    ownerCount: 6,
    stage: 'Valuation',
    daysInStage: 46,
    expectedDaysInStage: 30,
    riskScore: 72,
    riskLevel: 'High',
    delayProbability: 70,
    predictedDelayDays: 30,
    status: 'Disputed',
    primaryRiskFactor: 'Defense Land Inter-Ministerial Transfer Protocol',
    timeline: createTimeline('Valuation', false),
    riskDrivers: [
      { factor: 'Defense Land Clearance', contribution: 45, description: 'Ministry of Defence (MoD) in-principle approval requires equal value land exchange.' },
      { factor: 'BBMP Boundary Wall', contribution: 30, description: 'Civic municipal road widening overlap.' },
      { factor: 'Encroachment', contribution: 25, description: 'Railway boundary informal commercial kiosks.' },
    ],
    riskExplanation: 'Inter-ministerial land exchange with Ministry of Defence pending Cabinet Committee on Security clearance.',
    recommendedActions: [
      { id: 'ACT-KA-101', priority: 'High', action: 'Offer alternative state revenue parcel in Yelahanka to Defence Estate Officer Bangalore Circle.', expectedImpact: 'Accelerates defense NOC by 25 days' },
    ],
    notes: 'Elevated viaduct pier locations Ch. 4+200 to 4+600.',
    lastUpdated: '1 day ago',
  },
  {
    id: 'LA-5012',
    khasraNo: '142/3',
    village: 'Yelahanka Satellite Town',
    taluka: 'Bengaluru North',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    latitude: 13.1008,
    longitude: 77.5963,
    projectId: 'PRJ-KRIDE-02',
    projectName: 'Bengaluru Suburban Rail Project (Corridor 2 – Kanaka Line)',
    areaHa: 2.10,
    ownerCount: 5,
    stage: 'Compensation',
    daysInStage: 38,
    expectedDaysInStage: 30,
    riskScore: 46,
    riskLevel: 'Medium',
    delayProbability: 42,
    predictedDelayDays: 14,
    status: 'Pending Approval',
    primaryRiskFactor: 'BBMP Guidance Value vs KIADB Award Rate',
    timeline: createTimeline('Compensation', false),
    riskDrivers: [
      { factor: 'Guidance Value Dispute', contribution: 50, description: 'Commercial property owners contesting KIADB statutory award rate.' },
      { factor: 'Building Depreciation', contribution: 30, description: 'Valuation of 3 commercial multi-story structures.' },
      { factor: 'Utility Shifting', contribution: 20, description: 'BESCOM underground 11kV cables.' },
    ],
    riskExplanation: 'Guidance value disparity requires KIADB advisory committee settlement.',
    recommendedActions: [
      { id: 'ACT-KA-102', priority: 'Medium', action: 'Convene KIADB Price Advisory Committee sitting with commercial building owners.', expectedImpact: 'Resolves compensation dispute in 10 days' },
    ],
    notes: 'Suburban rail station entry concourse.',
    lastUpdated: '2 days ago',
  },
  {
    id: 'LA-5013',
    khasraNo: '210/1',
    village: 'Chikkabanavara Junction',
    taluka: 'Bengaluru North',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    latitude: 13.0780,
    longitude: 77.5120,
    projectId: 'PRJ-KRIDE-02',
    projectName: 'Bengaluru Suburban Rail Project (Corridor 2 – Kanaka Line)',
    areaHa: 1.40,
    ownerCount: 2,
    stage: 'Possession',
    daysInStage: 12,
    expectedDaysInStage: 20,
    riskScore: 18,
    riskLevel: 'Low',
    delayProbability: 10,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Handed Over',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Completed', contribution: 85, description: 'Direct acquisition under Karnataka Industrial Areas Development Act.' },
    ],
    riskExplanation: 'Piers and track bed construction active on site.',
    recommendedActions: [
      { id: 'ACT-KA-103', priority: 'Low', action: 'Finalize KIADB transfer certification.', expectedImpact: 'Routine record' },
    ],
    notes: 'Terminus stabling line connection.',
    lastUpdated: '4 days ago',
  },

  // ==========================================
  // 12. KARNATAKA — MYSURU
  // Project: PRJ-KA-02 Mysuru-Kushalnagar Highway Expansion
  // ==========================================
  {
    id: 'LA-5021',
    khasraNo: '185/2',
    village: 'Hunsur Bypass Reach',
    taluka: 'Hunsur',
    city: 'Mysuru',
    district: 'Mysuru',
    state: 'Karnataka',
    latitude: 12.2958,
    longitude: 76.6394,
    projectId: 'PRJ-KA-02',
    projectName: 'Mysuru-Kushalnagar Expressway Corridor',
    areaHa: 3.60,
    ownerCount: 7,
    stage: 'Valuation',
    daysInStage: 44,
    expectedDaysInStage: 30,
    riskScore: 66,
    riskLevel: 'High',
    delayProbability: 64,
    predictedDelayDays: 26,
    status: 'Pending Approval',
    primaryRiskFactor: 'Commercial Tobacco & Coffee Plantation Valuation',
    timeline: createTimeline('Valuation', false),
    riskDrivers: [
      { factor: 'Horticulture Valuation', contribution: 45, description: 'Dispute over standing coffee bushes and licensed tobacco barn valuation.' },
      { factor: 'Forest Corridor', contribution: 30, description: 'Elephant transit corridor buffer mitigation conditions.' },
      { factor: 'Revenue Mutation', contribution: 25, description: 'Pending RTC mutation of hereditary title.' },
    ],
    riskExplanation: 'Specialized plantation crop and tobacco barn valuation formulas contested by growers.',
    recommendedActions: [
      { id: 'ACT-KA-201', priority: 'High', action: 'Engage Tobacco Board and Central Coffee Research Institute for verified yield valuation.', expectedImpact: 'Settles grower resistance in 12 days' },
    ],
    notes: 'Key highway widening alignment through plantation tracts.',
    lastUpdated: '2 days ago',
  },
  {
    id: 'LA-5022',
    khasraNo: '92/1',
    village: 'Biligere',
    taluka: 'Mysuru Rural',
    city: 'Mysuru',
    district: 'Mysuru',
    state: 'Karnataka',
    latitude: 12.2450,
    longitude: 76.7120,
    projectId: 'PRJ-KA-02',
    projectName: 'Mysuru-Kushalnagar Expressway Corridor',
    areaHa: 1.95,
    ownerCount: 2,
    stage: 'Possession',
    daysInStage: 10,
    expectedDaysInStage: 20,
    riskScore: 16,
    riskLevel: 'Low',
    delayProbability: 10,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Award Settled',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Award Paid', contribution: 90, description: 'Direct compensation payment completed.' },
    ],
    riskExplanation: 'Possession granted to NHAI PIU Mysuru.',
    recommendedActions: [
      { id: 'ACT-KA-202', priority: 'Low', action: 'Civil contractor right-of-way handover sign-off.', expectedImpact: 'Construction clearance' },
    ],
    notes: 'Straight bypass alignment.',
    lastUpdated: '4 days ago',
  },

  // ==========================================
  // 13. TAMIL NADU — KANCHIPURAM
  // Project: PRJ-TIDCO-09 Chennai–Bengaluru Industrial Corridor (Sriperumbudur Node)
  // ==========================================
  {
    id: 'LA-6011',
    khasraNo: '312/1 & 312/3',
    village: 'Mambakkam',
    taluka: 'Sriperumbudur',
    city: 'Sriperumbudur',
    district: 'Kanchipuram',
    state: 'Tamil Nadu',
    latitude: 12.8342,
    longitude: 79.7036,
    projectId: 'PRJ-TIDCO-09',
    projectName: 'Chennai–Bengaluru Industrial Corridor (Sriperumbudur Node)',
    areaHa: 3.20,
    ownerCount: 8,
    stage: 'Compensation',
    daysInStage: 62,
    expectedDaysInStage: 30,
    riskScore: 76,
    riskLevel: 'High',
    delayProbability: 74,
    predictedDelayDays: 36,
    status: 'Disputed',
    primaryRiskFactor: 'Temple Inam Land Sanction (HR&CE Department)',
    timeline: createTimeline('Compensation', false),
    riskDrivers: [
      { factor: 'Temple Inam Land', contribution: 45, description: 'Hindu Religious and Charitable Endowments (HR&CE) department sanction pending under Section 34.' },
      { factor: 'Leaseholder Compensation', contribution: 35, description: 'Tenant agriculturalists claiming 50% compensation share.' },
      { factor: 'Boundary Survey', contribution: 20, description: 'Temple tank feeder channel preservation stipulation.' },
    ],
    riskExplanation: 'Statutory approval for Temple Inam endowment land delayed with HR&CE Commissionerate Chennai.',
    recommendedActions: [
      { id: 'ACT-TN-101', priority: 'High', action: 'Deposit compensation into dedicated HR&CE Temple fixed deposit account to secure immediate possession.', expectedImpact: 'Unlocks land in 14 days' },
    ],
    notes: 'Electronics hardware manufacturing cluster corridor.',
    lastUpdated: '1 day ago',
  },
  {
    id: 'LA-6012',
    khasraNo: '145/2',
    village: 'Irungattukottai',
    taluka: 'Sriperumbudur',
    city: 'Sriperumbudur',
    district: 'Kanchipuram',
    state: 'Tamil Nadu',
    latitude: 12.9810,
    longitude: 79.9850,
    projectId: 'PRJ-TIDCO-09',
    projectName: 'Chennai–Bengaluru Industrial Corridor (Sriperumbudur Node)',
    areaHa: 2.10,
    ownerCount: 4,
    stage: 'Valuation',
    daysInStage: 32,
    expectedDaysInStage: 30,
    riskScore: 42,
    riskLevel: 'Medium',
    delayProbability: 40,
    predictedDelayDays: 12,
    status: 'Pending Approval',
    primaryRiskFactor: 'Industrial Park Access Road Alignment',
    timeline: createTimeline('Valuation', false),
    riskDrivers: [
      { factor: 'Access Alignment', contribution: 50, description: 'Private industrial estate entrance gate requires setback adjustment.' },
      { factor: 'Valuation', contribution: 30, description: 'Guideline value parity review.' },
      { factor: 'Documentation', contribution: 20, description: 'SIPCOT title confirmation.' },
    ],
    riskExplanation: 'Minor negotiation over setback adjustment with adjacent automotive supplier plant.',
    recommendedActions: [
      { id: 'ACT-TN-102', priority: 'Medium', action: 'Approve customized access gate realignment to maintain plant logistics access.', expectedImpact: 'Secures owner agreement within 7 days' },
    ],
    notes: 'Four-lane industrial arterial link.',
    lastUpdated: '3 days ago',
  },
  {
    id: 'LA-6013',
    khasraNo: '88/1',
    village: 'Vadagal',
    taluka: 'Sriperumbudur',
    city: 'Sriperumbudur',
    district: 'Kanchipuram',
    state: 'Tamil Nadu',
    latitude: 12.9240,
    longitude: 79.9120,
    projectId: 'PRJ-TIDCO-09',
    projectName: 'Chennai–Bengaluru Industrial Corridor (Sriperumbudur Node)',
    areaHa: 1.80,
    ownerCount: 2,
    stage: 'Possession',
    daysInStage: 14,
    expectedDaysInStage: 20,
    riskScore: 18,
    riskLevel: 'Low',
    delayProbability: 10,
    predictedDelayDays: 0,
    status: 'Acquired',
    primaryRiskFactor: 'None - Transferred',
    timeline: createTimeline('Possession', true),
    riskDrivers: [
      { factor: 'Acquired', contribution: 90, description: 'SIPCOT land bank transfer certified.' },
    ],
    riskExplanation: 'Site prepared for industrial infrastructure construction.',
    recommendedActions: [
      { id: 'ACT-TN-103', priority: 'Low', action: 'Issue site handover note to TIDCO.', expectedImpact: 'Project milestone reached' },
    ],
    notes: 'Power substation development tract.',
    lastUpdated: '4 days ago',
  },
];

// -------------------------------------------------------------
// CENTRALIZED RAW PROJECTS (12 Projects)
// Aggregates will be computed dynamically from RAW_PARCELS
// -------------------------------------------------------------
export const RAW_PROJECT_METADATA: Array<Omit<Project, 'totalParcels' | 'acquiredParcels' | 'pendingParcels' | 'highRiskParcels' | 'mediumRiskParcels' | 'lowRiskParcels' | 'progressPercent' | 'avgRiskScore' | 'overallRisk' | 'predictedDelayDays' | 'stageBreakdown'>> = [
  {
    id: 'PRJ-UP-01',
    code: 'LK-ORR-P1',
    name: 'Lucknow Outer Ring Road (Kisan Path Expansion)',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    city: 'Lucknow',
    latitude: 26.8467,
    longitude: 80.9462,
    implementingAgency: 'NHAI / UP PWD',
    status: 'Delayed',
    targetCompletion: 'Q3 2027',
    description: 'Eight-lane peripheral ring road circling Lucknow capital region connecting Kanpur Road, Sitapur Road, and Sultanpur Road.',
  },
  {
    id: 'PRJ-UP-02',
    code: 'VKE-SEC1',
    name: 'Varanasi-Kolkata Economic Expressway (Chandauli Section)',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    city: 'Varanasi',
    latitude: 25.3176,
    longitude: 82.9739,
    implementingAgency: 'NHAI',
    status: 'Critical Review',
    targetCompletion: 'Q4 2027',
    description: 'Six-lane greenfield access-controlled economic corridor linking eastern UP spiritual and industrial hub to Bengal ports.',
  },
  {
    id: 'PRJ-UP-03',
    code: 'YEIDA-AERO',
    name: 'Yamuna Expressway Aerocity Link',
    state: 'Uttar Pradesh',
    district: 'Gautam Buddha Nagar',
    city: 'Greater Noida',
    latitude: 28.3588,
    longitude: 77.5516,
    implementingAgency: 'YEIDA / NICDC',
    status: 'Active',
    targetCompletion: 'Q2 2027',
    description: 'Dedicated multi-modal logistics and rapid transit expressway corridor feeding Noida International Airport at Jewar.',
  },
  {
    id: 'PRJ-MSRDC-01',
    code: 'PRR-PH1',
    name: 'Pune Ring Road (Eastern Alignment Phase 1)',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Pune',
    latitude: 18.5204,
    longitude: 73.8567,
    implementingAgency: 'MSRDC',
    status: 'Delayed',
    targetCompletion: 'Q3 2027',
    description: 'Outer peripheral circular expressway bypass around Pune metropolitan area passing through high-value agricultural and peri-urban land.',
  },
  {
    id: 'PRJ-DFCCIL-07',
    code: 'WDFC-SEC7',
    name: 'Western Dedicated Freight Corridor (Vaitarna–JNPT)',
    state: 'Maharashtra',
    district: 'Palghar',
    city: 'Palghar',
    latitude: 19.6967,
    longitude: 72.7699,
    implementingAgency: 'DFCCIL',
    status: 'Critical Review',
    targetCompletion: 'Q2 2027',
    description: 'Heavy haul freight railway corridor through tribal land pockets requiring extensive joint measurement and compensation revisions.',
  },
  {
    id: 'PRJ-MH-03',
    code: 'SAM-LOG-NAG',
    name: 'Samruddhi Expressway Logistics Interchange',
    state: 'Maharashtra',
    district: 'Nagpur',
    city: 'Nagpur',
    latitude: 21.1458,
    longitude: 79.0882,
    implementingAgency: 'MSRDC / CONCOR',
    status: 'On Track',
    targetCompletion: 'Q1 2027',
    description: 'Dry port and multimodal logistics freight hub integrating Central India manufacturing units to Mumbai port.',
  },
  {
    id: 'PRJ-NHAI-04',
    code: 'DME-PKG4',
    name: 'Delhi-Mumbai Expressway (Vadodara–Kim Section)',
    state: 'Gujarat',
    district: 'Bharuch',
    city: 'Bharuch',
    latitude: 21.7051,
    longitude: 72.9959,
    implementingAgency: 'NHAI',
    status: 'Active',
    targetCompletion: 'Q4 2026',
    description: 'Eight-lane access-controlled greenfield expressway connecting central Gujarat industrial clusters to JNPT corridor.',
  },
  {
    id: 'PRJ-GJ-02',
    code: 'DHOL-EXP-01',
    name: 'Ahmedabad-Dholera Express Highway (SIR Node)',
    state: 'Gujarat',
    district: 'Ahmedabad',
    city: 'Ahmedabad',
    latitude: 22.8340,
    longitude: 72.3680,
    implementingAgency: 'NHAI / Dholera SIRDA',
    status: 'Delayed',
    targetCompletion: 'Q3 2027',
    description: 'High-speed 109 km expressway providing dedicated connection between Ahmedabad commercial hub and Dholera Smart City.',
  },
  {
    id: 'PRJ-RJ-01',
    code: 'JDA-RR-N',
    name: 'Jaipur Ring Road Expressway (North Package)',
    state: 'Rajasthan',
    district: 'Jaipur',
    city: 'Jaipur',
    latitude: 26.9124,
    longitude: 75.7873,
    implementingAgency: 'JDA / NHAI',
    status: 'Delayed',
    targetCompletion: 'Q3 2027',
    description: 'Six-lane northern orbital bypass connecting Ajmer Road, Sikar Road, and Delhi Highway with developed land return scheme.',
  },
  {
    id: 'PRJ-RJ-02',
    code: 'KOT-CHAM-02',
    name: 'Chambal River Industrial Link Highway',
    state: 'Rajasthan',
    district: 'Kota',
    city: 'Kota',
    latitude: 25.2138,
    longitude: 75.8648,
    implementingAgency: 'Rajasthan PWD',
    status: 'Active',
    targetCompletion: 'Q1 2027',
    description: 'Four-lane elevated riverfront freight bypass easing stone and chemical industrial transit away from Kota city center.',
  },
  {
    id: 'PRJ-KRIDE-02',
    code: 'BSRP-COR2',
    name: 'Bengaluru Suburban Rail Project (Corridor 2 – Kanaka Line)',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    implementingAgency: 'K-RIDE',
    status: 'On Track',
    targetCompletion: 'Q1 2027',
    description: 'Elevated and grade suburban commuter rail alignment linking Baiyappanahalli to Chikkabanavara passing through defense and civic boundaries.',
  },
  {
    id: 'PRJ-KA-02',
    code: 'NH-275-MYS',
    name: 'Mysuru-Kushalnagar Expressway Corridor',
    state: 'Karnataka',
    district: 'Mysuru',
    city: 'Mysuru',
    latitude: 12.2958,
    longitude: 76.6394,
    implementingAgency: 'NHAI',
    status: 'Active',
    targetCompletion: 'Q4 2027',
    description: 'Greenfield 4-lane bypass providing high-speed tourist and coffee plantation cargo transit across Western Ghats foothills.',
  },
  {
    id: 'PRJ-TIDCO-09',
    code: 'CBIC-SRI',
    name: 'Chennai–Bengaluru Industrial Corridor (Sriperumbudur Node)',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    city: 'Sriperumbudur',
    latitude: 12.8342,
    longitude: 79.7036,
    implementingAgency: 'TIDCO / NICDC',
    status: 'On Track',
    targetCompletion: 'Q4 2026',
    description: 'Industrial manufacturing mega-cluster expansion along National Highway 48 with consolidated village land consolidation schemes.',
  },
];

// -------------------------------------------------------------
// GEOGRAPHIC BOUNDS & CENTER LOOKUP
// Real geographic centers and optimal zoom levels
// -------------------------------------------------------------
export interface GeoCenterConfig {
  lat: number;
  lng: number;
  zoom: number;
}

export const STATE_GEO_CONFIG: Record<string, GeoCenterConfig> = {
  'All States': { lat: 22.5937, lng: 78.9629, zoom: 5 },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462, zoom: 7 },
  'Maharashtra': { lat: 19.5000, lng: 75.5000, zoom: 7 },
  'Gujarat': { lat: 22.2587, lng: 71.1924, zoom: 7 },
  'Rajasthan': { lat: 26.8000, lng: 74.5000, zoom: 7 },
  'Karnataka': { lat: 14.8000, lng: 75.8000, zoom: 7 },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569, zoom: 7 },
};

export const DISTRICT_GEO_CONFIG: Record<string, GeoCenterConfig> = {
  'Lucknow': { lat: 26.8467, lng: 80.9462, zoom: 11 },
  'Varanasi': { lat: 25.3176, lng: 82.9739, zoom: 11 },
  'Gautam Buddha Nagar': { lat: 28.3588, lng: 77.5516, zoom: 11 },
  'Pune': { lat: 18.5204, lng: 73.8567, zoom: 11 },
  'Palghar': { lat: 19.6967, lng: 72.7699, zoom: 11 },
  'Thane': { lat: 19.2183, lng: 72.9781, zoom: 11 },
  'Raigad': { lat: 18.5158, lng: 73.1812, zoom: 11 },
  'Nagpur': { lat: 21.1458, lng: 79.0882, zoom: 11 },
  'Bharuch': { lat: 21.7051, lng: 72.9959, zoom: 11 },
  'Ahmedabad': { lat: 22.8340, lng: 72.3680, zoom: 10 },
  'Jaipur': { lat: 26.9124, lng: 75.7873, zoom: 11 },
  'Kota': { lat: 25.2138, lng: 75.8648, zoom: 11 },
  'Bengaluru Urban': { lat: 12.9716, lng: 77.5946, zoom: 11 },
  'Mysuru': { lat: 12.2958, lng: 76.6394, zoom: 11 },
  'Kanchipuram': { lat: 12.8342, lng: 79.7036, zoom: 11 },
  'Sriperumbudur': { lat: 12.9702, lng: 79.9448, zoom: 12 },
};

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  'All States': [
    'All Districts',
    'Lucknow',
    'Varanasi',
    'Gautam Buddha Nagar',
    'Pune',
    'Palghar',
    'Thane',
    'Raigad',
    'Nagpur',
    'Bharuch',
    'Ahmedabad',
    'Jaipur',
    'Kota',
    'Bengaluru Urban',
    'Mysuru',
    'Kanchipuram',
    'Sriperumbudur',
  ],
  'Uttar Pradesh': ['All Districts', 'Lucknow', 'Varanasi', 'Gautam Buddha Nagar'],
  'Maharashtra': ['All Districts', 'Pune', 'Palghar', 'Thane', 'Raigad', 'Nagpur'],
  'Gujarat': ['All Districts', 'Bharuch', 'Ahmedabad'],
  'Rajasthan': ['All Districts', 'Jaipur', 'Kota'],
  'Karnataka': ['All Districts', 'Bengaluru Urban', 'Mysuru'],
  'Tamil Nadu': ['All Districts', 'Kanchipuram', 'Sriperumbudur'],
};

export const ALL_STATES = [
  'All States',
  'Uttar Pradesh',
  'Maharashtra',
  'Gujarat',
  'Rajasthan',
  'Karnataka',
  'Tamil Nadu',
];

// -------------------------------------------------------------
// DYNAMIC COMPUTATION & FILTERING ENGINE
// Single source of truth guaranteeing 100% data consistency
// -------------------------------------------------------------

export function computeProjectsFromParcels(parcels: LandParcel[]): Project[] {
  return RAW_PROJECT_METADATA.map((meta) => {
    const projParcels = parcels.filter((p) => p.projectId === meta.id);
    const totalParcels = projParcels.length;
    const acquiredParcels = projParcels.filter((p) => p.status === 'Acquired' || p.stage === 'Possession').length;
    const pendingParcels = totalParcels - acquiredParcels;
    const highRiskParcels = projParcels.filter((p) => p.riskLevel === 'High').length;
    const mediumRiskParcels = projParcels.filter((p) => p.riskLevel === 'Medium').length;
    const lowRiskParcels = projParcels.filter((p) => p.riskLevel === 'Low').length;

    const avgRiskScore =
      totalParcels > 0
        ? Math.round(projParcels.reduce((acc, p) => acc + p.riskScore, 0) / totalParcels)
        : 0;

    const predictedDelayDays =
      totalParcels > 0
        ? Math.round(projParcels.reduce((acc, p) => acc + p.predictedDelayDays, 0) / totalParcels)
        : 0;

    const progressPercent =
      totalParcels > 0 ? Math.round((acquiredParcels / totalParcels) * 100) : 0;

    const overallRisk: RiskLevel =
      avgRiskScore > 60 ? 'High' : avgRiskScore > 30 ? 'Medium' : 'Low';

    const stageBreakdown: Record<AcquisitionStage, number> = {
      Notification: projParcels.filter((p) => p.stage === 'Notification').length,
      Survey: projParcels.filter((p) => p.stage === 'Survey').length,
      Valuation: projParcels.filter((p) => p.stage === 'Valuation').length,
      Compensation: projParcels.filter((p) => p.stage === 'Compensation').length,
      Possession: projParcels.filter((p) => p.stage === 'Possession').length,
    };

    return {
      ...meta,
      totalParcels,
      acquiredParcels,
      pendingParcels,
      highRiskParcels,
      mediumRiskParcels,
      lowRiskParcels,
      progressPercent,
      avgRiskScore,
      overallRisk,
      predictedDelayDays,
      stageBreakdown,
    };
  });
}

export function computeEarlyWarningsFromParcels(parcels: LandParcel[]): EarlyWarning[] {
  const highAndMedParcels = parcels
    .filter((p) => p.riskLevel === 'High' || (p.riskLevel === 'Medium' && p.predictedDelayDays > 10))
    .sort((a, b) => b.riskScore - a.riskScore);

  return highAndMedParcels.map((p, idx) => ({
    id: `WARN-${String(idx + 1).padStart(2, '0')}`,
    severity: p.riskLevel,
    parcelId: p.id,
    projectId: p.projectId,
    projectName: p.projectName,
    district: p.district,
    issue: p.primaryRiskFactor,
    stage: p.stage,
    riskScore: p.riskScore,
    predictedDelayDays: p.predictedDelayDays,
    recommendedAction: p.recommendedActions[0]?.action || 'Review statutory timeline records',
    detectedAt: p.lastUpdated,
    actionTaken: false,
  }));
}

/**
 * Filter the centralized dataset by State, District, and Search Query.
 * All dashboard numbers, maps, and lists receive the exact return value of this function.
 */
export function getFilteredCentralData(
  selectedState: string,
  selectedDistrict: string,
  searchQuery: string = ''
) {
  const q = searchQuery.toLowerCase().trim();

  // 1. Filter Parcels
  const filteredParcels = RAW_PARCELS.filter((p) => {
    // State Filter
    if (selectedState !== 'All States' && p.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }

    // District Filter
    if (selectedDistrict !== 'All Districts' && p.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }

    // Search Query: Parcel ID, Project name, City, District, State, Village, Khasra
    if (q) {
      const match =
        p.id.toLowerCase().includes(q) ||
        p.khasraNo.toLowerCase().includes(q) ||
        p.projectName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.taluka.toLowerCase().includes(q);

      if (!match) return false;
    }

    return true;
  });

  // 2. Filter Projects (projects that contain parcels matching the criteria, or match the state/district/search)
  const allComputedProjects = computeProjectsFromParcels(filteredParcels);
  const activeMatchingProjectIds = new Set(filteredParcels.map((p) => p.projectId));

  const filteredProjects = allComputedProjects.filter((proj) => {
    // Must have at least 1 matching parcel in this filtered slice
    if (activeMatchingProjectIds.has(proj.id)) {
      return true;
    }

    // If search or state/district matches project directly even if 0 parcels
    if (selectedState !== 'All States' && proj.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (selectedDistrict !== 'All Districts' && proj.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    if (q) {
      const projMatch =
        proj.name.toLowerCase().includes(q) ||
        proj.code.toLowerCase().includes(q) ||
        proj.district.toLowerCase().includes(q) ||
        proj.state.toLowerCase().includes(q);
      return projMatch;
    }

    return false;
  });

  // 3. Filter Early Warnings derived from filtered parcels
  const filteredEarlyWarnings = computeEarlyWarningsFromParcels(filteredParcels);

  // 4. Compute Aggregate Portfolio Statistics
  const totalParcelsCount = filteredParcels.length;
  const acquiredParcelsCount = filteredParcels.filter(
    (p) => p.status === 'Acquired' || p.stage === 'Possession'
  ).length;
  const pendingParcelsCount = totalParcelsCount - acquiredParcelsCount;
  const highRiskParcelsCount = filteredParcels.filter((p) => p.riskLevel === 'High').length;
  const mediumRiskParcelsCount = filteredParcels.filter((p) => p.riskLevel === 'Medium').length;
  const lowRiskParcelsCount = filteredParcels.filter((p) => p.riskLevel === 'Low').length;

  const totalProjectsCount = filteredProjects.length;

  const avgRiskScore =
    totalParcelsCount > 0
      ? Math.round(filteredParcels.reduce((acc, p) => acc + p.riskScore, 0) / totalParcelsCount)
      : 0;

  const avgPredictedDelay =
    totalParcelsCount > 0
      ? (filteredParcels.reduce((acc, p) => acc + p.predictedDelayDays, 0) / totalParcelsCount).toFixed(1)
      : '0.0';

  const clearancePct =
    totalParcelsCount > 0 ? Math.round((acquiredParcelsCount / totalParcelsCount) * 100) : 0;

  const highRiskPct =
    totalParcelsCount > 0 ? ((highRiskParcelsCount / totalParcelsCount) * 100).toFixed(1) : '0.0';

  // 5. Geographic target center for map zoom
  let mapTarget: GeoCenterConfig = STATE_GEO_CONFIG['All States'];
  if (selectedDistrict !== 'All Districts' && DISTRICT_GEO_CONFIG[selectedDistrict]) {
    mapTarget = DISTRICT_GEO_CONFIG[selectedDistrict];
  } else if (selectedState !== 'All States' && STATE_GEO_CONFIG[selectedState]) {
    mapTarget = STATE_GEO_CONFIG[selectedState];
  } else if (q && filteredParcels.length > 0) {
    // If searching specific parcel, focus directly on first matching parcel
    mapTarget = {
      lat: filteredParcels[0].latitude,
      lng: filteredParcels[0].longitude,
      zoom: 13,
    };
  }

  return {
    parcels: filteredParcels,
    projects: filteredProjects,
    earlyWarnings: filteredEarlyWarnings,
    metrics: {
      totalProjects: totalProjectsCount,
      totalParcels: totalParcelsCount,
      acquiredParcels: acquiredParcelsCount,
      pendingParcels: pendingParcelsCount,
      highRiskParcels: highRiskParcelsCount,
      mediumRiskParcels: mediumRiskParcelsCount,
      lowRiskParcels: lowRiskParcelsCount,
      avgRiskScore,
      avgPredictedDelay,
      clearancePct,
      highRiskPct,
    },
    mapTarget,
  };
}

// Initial full datasets for backward compatibility
export const MOCK_PARCELS_CENTRAL = RAW_PARCELS;
export const MOCK_PROJECTS_CENTRAL = computeProjectsFromParcels(RAW_PARCELS);
export const MOCK_EARLY_WARNINGS_CENTRAL = computeEarlyWarningsFromParcels(RAW_PARCELS);

export interface GISHotspot {
  id: string;
  name: string;
  projectName: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  riskScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  delayProbability: number;
  predictedDelayDays: number;
  stage: string;
  primaryRiskFactor: string;
  recommendedAction: string;
  parcelCount: number;
}

export const MOCK_GIS_HOTSPOTS: GISHotspot[] = [
  {
    id: 'HS-THANE-01',
    name: 'Thane North Rail Link Node',
    projectName: 'Mumbai–Ahmedabad High Speed Rail (MAHSR C-3)',
    district: 'Thane',
    state: 'Maharashtra',
    latitude: 19.2183,
    longitude: 72.9781,
    riskScore: 86,
    riskLevel: 'High',
    delayProbability: 84,
    predictedDelayDays: 52,
    stage: 'Valuation',
    primaryRiskFactor: 'Coastal Regulation Zone (CRZ-I) Clearance & Mangrove Buffer Injunction',
    recommendedAction: 'Expedite MCZMA review for revised viaduct pier alignment',
    parcelCount: 18,
  },
  {
    id: 'HS-RAIGAD-01',
    name: 'Raigad Multi-Modal Transit Belt',
    projectName: 'Virar–Alibaug Multi-Modal Corridor (Phase 1)',
    district: 'Raigad',
    state: 'Maharashtra',
    latitude: 18.5158,
    longitude: 73.1812,
    riskScore: 78,
    riskLevel: 'High',
    delayProbability: 76,
    predictedDelayDays: 44,
    stage: 'Compensation',
    primaryRiskFactor: 'Apportionment Objections by Co-Sharers under Sec 3H',
    recommendedAction: 'Convene Special Land Acquisition Officer (SLAO) joint hearings',
    parcelCount: 24,
  },
  {
    id: 'HS-BHARUCH-01',
    name: 'Bharuch Chemical Corridor Crossing',
    projectName: 'Delhi–Mumbai Industrial Corridor (PCPIR Link)',
    district: 'Bharuch',
    state: 'Gujarat',
    latitude: 21.7051,
    longitude: 72.9959,
    riskScore: 82,
    riskLevel: 'High',
    delayProbability: 81,
    predictedDelayDays: 48,
    stage: 'Survey',
    primaryRiskFactor: 'High-Tension Power Transmission Tower Footprint Overlap',
    recommendedAction: 'Engage GETCO for transmission tower stringing height waiver',
    parcelCount: 14,
  },
  {
    id: 'HS-PALGHAR-01',
    name: 'Palghar Tribal Revenue Tract',
    projectName: 'Western Dedicated Freight Corridor (Vaitarna–JNPT)',
    district: 'Palghar',
    state: 'Maharashtra',
    latitude: 19.6967,
    longitude: 72.7699,
    riskScore: 88,
    riskLevel: 'High',
    delayProbability: 85,
    predictedDelayDays: 54,
    stage: 'Valuation',
    primaryRiskFactor: 'Tribal Land Transfer Restriction (MLRC Sec 36A Sanction Pending)',
    recommendedAction: 'Divisional Commissioner Konkan review for Section 36A expedited clearance',
    parcelCount: 32,
  },
  {
    id: 'HS-PUNE-01',
    name: 'Pune Ring Road West Valley Segment',
    projectName: 'Pune Ring Road (West Package IV)',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    riskScore: 68,
    riskLevel: 'High',
    delayProbability: 66,
    predictedDelayDays: 34,
    stage: 'Compensation',
    primaryRiskFactor: 'Demand for 4x Urban Multiplier Equivalent to Municipal Fringe',
    recommendedAction: 'Refer tariff dispute to District Land Valuation Committee',
    parcelCount: 22,
  },
  {
    id: 'HS-BLR-01',
    name: 'Bengaluru Peripheral Ring Road Corridor',
    projectName: 'Bengaluru Peripheral Ring Road (PRR Section 2)',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    riskScore: 74,
    riskLevel: 'High',
    delayProbability: 72,
    predictedDelayDays: 42,
    stage: 'Notification',
    primaryRiskFactor: 'Lapsed 2007 Preliminary Notification Renewal Challenges',
    recommendedAction: 'Gazette re-notification with updated 2013 RFCTLARR schedule',
    parcelCount: 29,
  },
  {
    id: 'HS-SRIPERUMBUDUR-01',
    name: 'Sriperumbudur Auto Cluster Spur',
    projectName: 'Chennai–Bengaluru Expressway (NE-7 Package II)',
    district: 'Kanchipuram',
    state: 'Tamil Nadu',
    latitude: 12.9702,
    longitude: 79.9448,
    riskScore: 56,
    riskLevel: 'Medium',
    delayProbability: 52,
    predictedDelayDays: 24,
    stage: 'Valuation',
    primaryRiskFactor: 'Industrial vs Agricultural Land Category Discrepancy',
    recommendedAction: 'Reconcile Patta revenue category with DTCP master plan zoning',
    parcelCount: 16,
  },
  {
    id: 'HS-LUCKNOW-01',
    name: 'Lucknow Outer Ring Kisan Path',
    projectName: 'Lucknow Outer Ring Road (Kisan Path Expansion)',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    latitude: 26.8521,
    longitude: 80.9512,
    riskScore: 84,
    riskLevel: 'High',
    delayProbability: 82,
    predictedDelayDays: 45,
    stage: 'Compensation',
    primaryRiskFactor: 'Title & Succession Dispute among Co-Heirs',
    recommendedAction: 'Revenue Lok Adalat mediation camp at Sarojini Nagar Tehsil',
    parcelCount: 26,
  },
  {
    id: 'HS-VARANASI-01',
    name: 'Varanasi Ring Road Phase II',
    projectName: 'Varanasi Ring Road Phase II',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.3176,
    longitude: 82.9739,
    riskScore: 48,
    riskLevel: 'Medium',
    delayProbability: 44,
    predictedDelayDays: 18,
    stage: 'Survey',
    primaryRiskFactor: 'Religious Structure Relocation Alignment Challenge',
    recommendedAction: 'Community consensus meeting with district administration',
    parcelCount: 12,
  },
  {
    id: 'HS-JEWAR-01',
    name: 'Jewar Airport Dedicated Metro Link',
    projectName: 'Noida International Airport Metro Link',
    district: 'Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
    latitude: 28.3588,
    longitude: 77.5516,
    riskScore: 52,
    riskLevel: 'Medium',
    delayProbability: 49,
    predictedDelayDays: 22,
    stage: 'Possession',
    primaryRiskFactor: 'Demolition of Unauthorized Encroached Commercial Sheds',
    recommendedAction: 'Section 3E administrative eviction enforcement with local police',
    parcelCount: 15,
  },
  {
    id: 'HS-AHMEDABAD-01',
    name: 'Dholera Industrial Expressway Interchange',
    projectName: 'Ahmedabad–Dholera Expressway (Package I)',
    district: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 22.8340,
    longitude: 72.3680,
    riskScore: 28,
    riskLevel: 'Low',
    delayProbability: 18,
    predictedDelayDays: 0,
    stage: 'Possession',
    primaryRiskFactor: 'Routine SLA Handover Clearance',
    recommendedAction: 'Verify physical perimeter fencing',
    parcelCount: 38,
  },
  {
    id: 'HS-JAIPUR-01',
    name: 'Jaipur Northern Ring Road Link',
    projectName: 'Jaipur Northern Ring Road (NH-52 Spur)',
    district: 'Jaipur',
    state: 'Rajasthan',
    latitude: 26.9124,
    longitude: 75.7873,
    riskScore: 32,
    riskLevel: 'Medium',
    delayProbability: 30,
    predictedDelayDays: 12,
    stage: 'Valuation',
    primaryRiskFactor: 'Well & Pump House Assessment Depreciation Objections',
    recommendedAction: 'PWD joint valuation inspection with local patwari',
    parcelCount: 11,
  },
  {
    id: 'HS-NAGPUR-01',
    name: 'Nagpur Logistics Multi-Modal Junction',
    projectName: 'Samruddhi Expressway Logistics Interchange',
    district: 'Nagpur',
    state: 'Maharashtra',
    latitude: 21.1458,
    longitude: 79.0882,
    riskScore: 22,
    riskLevel: 'Low',
    delayProbability: 12,
    predictedDelayDays: 0,
    stage: 'Possession',
    primaryRiskFactor: 'Cleared for Civil Construction',
    recommendedAction: 'Close land acquisition records',
    parcelCount: 20,
  },
];
