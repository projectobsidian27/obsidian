// Mock HubSpot data for testing and demos
// Toggle between mock and real data with useMockData flag

export interface Deal {
  id: string;
  name: string;
  amount: number;
  stage: string;
  owner: string;
  ownerId: string;
  createDate: string;
  lastActivityDate: string;
  closeDate: string | null;
  dealAge: number; // days since creation
  daysSinceLastActivity: number;
  contactCount: number;
  companyName: string;
  healthScore: number; // 0-100
  status: 'healthy' | 'at-risk' | 'zombie';
  signals: {
    noRecentActivity: boolean;
    missingNextSteps: boolean;
    stuckInStage: boolean;
    lowEngagement: boolean;
    ownershipGap: boolean;
  };
}

export interface Owner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  activeDeals: number;
  zombieDeals: number;
}

export interface PipelineMetrics {
  totalDeals: number;
  totalValue: number;
  healthyDeals: number;
  healthyValue: number;
  atRiskDeals: number;
  atRiskValue: number;
  zombieDeals: number;
  zombieValue: number;
  avgDealAge: number;
  avgHealthScore: number;
  dealsClosedThisMonth: number;
  revenueAtRisk: number;
}

// Mock Owners
export const mockOwners: Owner[] = [
  {
    id: 'owner_1',
    email: 'sarah.chen@company.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    activeDeals: 8,
    zombieDeals: 2,
  },
  {
    id: 'owner_2',
    email: 'michael.torres@company.com',
    firstName: 'Michael',
    lastName: 'Torres',
    activeDeals: 12,
    zombieDeals: 1,
  },
  {
    id: 'owner_3',
    email: 'jessica.park@company.com',
    firstName: 'Jessica',
    lastName: 'Park',
    activeDeals: 15,
    zombieDeals: 0,
  },
  {
    id: 'owner_4',
    email: 'david.kim@company.com',
    firstName: 'David',
    lastName: 'Kim',
    activeDeals: 6,
    zombieDeals: 3,
  },
  {
    id: 'owner_5',
    email: 'alex.rivera@company.com',
    firstName: 'Alex',
    lastName: 'Rivera',
    activeDeals: 10,
    zombieDeals: 1,
  },
];

// Mock Deals - Realistic pipeline scenarios
export const mockDeals: Deal[] = [
  // ZOMBIE DEALS (High Value, No Activity)
  {
    id: 'deal_001',
    name: 'Enterprise License Renewal - Acme Corp',
    amount: 125000,
    stage: 'Negotiation',
    owner: 'Sarah Chen',
    ownerId: 'owner_1',
    createDate: '2024-07-15',
    lastActivityDate: '2024-10-20',
    closeDate: '2024-11-30',
    dealAge: 132,
    daysSinceLastActivity: 65,
    contactCount: 3,
    companyName: 'Acme Corporation',
    healthScore: 34,
    status: 'zombie',
    signals: {
      noRecentActivity: true,
      missingNextSteps: true,
      stuckInStage: true,
      lowEngagement: true,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_002',
    name: 'New Implementation - CloudNet Solutions',
    amount: 78000,
    stage: 'Proposal Sent',
    owner: 'David Kim',
    ownerId: 'owner_4',
    createDate: '2024-08-10',
    lastActivityDate: '2024-11-15',
    closeDate: '2024-12-15',
    dealAge: 106,
    daysSinceLastActivity: 39,
    contactCount: 2,
    companyName: 'CloudNet Solutions',
    healthScore: 41,
    status: 'zombie',
    signals: {
      noRecentActivity: true,
      missingNextSteps: true,
      stuckInStage: true,
      lowEngagement: false,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_003',
    name: 'Platform Migration - DataFlow Systems',
    amount: 210000,
    stage: 'Discovery',
    owner: 'Sarah Chen',
    ownerId: 'owner_1',
    createDate: '2024-06-20',
    lastActivityDate: '2024-09-28',
    closeDate: null,
    dealAge: 157,
    daysSinceLastActivity: 87,
    contactCount: 4,
    companyName: 'DataFlow Systems',
    healthScore: 28,
    status: 'zombie',
    signals: {
      noRecentActivity: true,
      missingNextSteps: true,
      stuckInStage: true,
      lowEngagement: true,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_004',
    name: 'Annual Contract - TechStart Inc',
    amount: 95000,
    stage: 'Negotiation',
    owner: 'David Kim',
    ownerId: 'owner_4',
    createDate: '2024-08-25',
    lastActivityDate: '2024-11-01',
    closeDate: '2025-01-15',
    dealAge: 91,
    daysSinceLastActivity: 53,
    contactCount: 2,
    companyName: 'TechStart Inc',
    healthScore: 38,
    status: 'zombie',
    signals: {
      noRecentActivity: true,
      missingNextSteps: true,
      stuckInStage: false,
      lowEngagement: true,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_005',
    name: 'Multi-Year Agreement - Global Industries',
    amount: 450000,
    stage: 'Contract Review',
    owner: 'David Kim',
    ownerId: 'owner_4',
    createDate: '2024-05-10',
    lastActivityDate: '2024-10-05',
    closeDate: '2024-12-31',
    dealAge: 198,
    daysSinceLastActivity: 80,
    contactCount: 5,
    companyName: 'Global Industries LLC',
    healthScore: 31,
    status: 'zombie',
    signals: {
      noRecentActivity: true,
      missingNextSteps: true,
      stuckInStage: true,
      lowEngagement: true,
      ownershipGap: false,
    },
  },

  // AT-RISK DEALS (Some Activity but Concerning)
  {
    id: 'deal_006',
    name: 'Q4 Platform Upgrade - TechVision Co',
    amount: 95000,
    stage: 'Proposal Sent',
    owner: 'Michael Torres',
    ownerId: 'owner_2',
    createDate: '2024-10-01',
    lastActivityDate: '2024-12-12',
    closeDate: '2025-01-15',
    dealAge: 84,
    daysSinceLastActivity: 12,
    contactCount: 3,
    companyName: 'TechVision Co',
    healthScore: 58,
    status: 'at-risk',
    signals: {
      noRecentActivity: false,
      missingNextSteps: true,
      stuckInStage: true,
      lowEngagement: false,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_007',
    name: 'Expansion Deal - InnovateTech',
    amount: 67000,
    stage: 'Qualified Lead',
    owner: 'Alex Rivera',
    ownerId: 'owner_5',
    createDate: '2024-09-15',
    lastActivityDate: '2024-12-10',
    closeDate: '2025-02-01',
    dealAge: 100,
    daysSinceLastActivity: 14,
    contactCount: 2,
    companyName: 'InnovateTech Solutions',
    healthScore: 62,
    status: 'at-risk',
    signals: {
      noRecentActivity: false,
      missingNextSteps: false,
      stuckInStage: true,
      lowEngagement: true,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_008',
    name: 'Product Suite - MediaFlow Corp',
    amount: 142000,
    stage: 'Discovery',
    owner: 'Michael Torres',
    ownerId: 'owner_2',
    createDate: '2024-10-20',
    lastActivityDate: '2024-12-18',
    closeDate: '2025-03-01',
    dealAge: 65,
    daysSinceLastActivity: 6,
    contactCount: 4,
    companyName: 'MediaFlow Corporation',
    healthScore: 64,
    status: 'at-risk',
    signals: {
      noRecentActivity: false,
      missingNextSteps: true,
      stuckInStage: false,
      lowEngagement: false,
      ownershipGap: false,
    },
  },

  // HEALTHY DEALS (Active Pipeline)
  {
    id: 'deal_009',
    name: 'Annual Contract - DataFlow Systems',
    amount: 210000,
    stage: 'Contract Sent',
    owner: 'Jessica Park',
    ownerId: 'owner_3',
    createDate: '2024-11-25',
    lastActivityDate: '2024-12-23',
    closeDate: '2025-01-10',
    dealAge: 29,
    daysSinceLastActivity: 1,
    contactCount: 6,
    companyName: 'DataFlow Systems',
    healthScore: 92,
    status: 'healthy',
    signals: {
      noRecentActivity: false,
      missingNextSteps: false,
      stuckInStage: false,
      lowEngagement: false,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_010',
    name: 'Expansion Deal - FinTech Solutions',
    amount: 156000,
    stage: 'Negotiation',
    owner: 'Sarah Chen',
    ownerId: 'owner_1',
    createDate: '2024-12-01',
    lastActivityDate: '2024-12-23',
    closeDate: '2025-01-20',
    dealAge: 23,
    daysSinceLastActivity: 1,
    contactCount: 5,
    companyName: 'FinTech Solutions Inc',
    healthScore: 88,
    status: 'healthy',
    signals: {
      noRecentActivity: false,
      missingNextSteps: false,
      stuckInStage: false,
      lowEngagement: false,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_011',
    name: 'New Customer - Velocity Analytics',
    amount: 89000,
    stage: 'Proposal Sent',
    owner: 'Jessica Park',
    ownerId: 'owner_3',
    createDate: '2024-11-15',
    lastActivityDate: '2024-12-22',
    closeDate: '2025-01-30',
    dealAge: 39,
    daysSinceLastActivity: 2,
    contactCount: 4,
    companyName: 'Velocity Analytics',
    healthScore: 85,
    status: 'healthy',
    signals: {
      noRecentActivity: false,
      missingNextSteps: false,
      stuckInStage: false,
      lowEngagement: false,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_012',
    name: 'Renewal - StreamTech Media',
    amount: 125000,
    stage: 'Closed Won',
    owner: 'Jessica Park',
    ownerId: 'owner_3',
    createDate: '2024-10-10',
    lastActivityDate: '2024-12-20',
    closeDate: '2024-12-20',
    dealAge: 75,
    daysSinceLastActivity: 4,
    contactCount: 8,
    companyName: 'StreamTech Media',
    healthScore: 95,
    status: 'healthy',
    signals: {
      noRecentActivity: false,
      missingNextSteps: false,
      stuckInStage: false,
      lowEngagement: false,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_013',
    name: 'Enterprise Deal - CoreLogic Systems',
    amount: 340000,
    stage: 'Discovery',
    owner: 'Michael Torres',
    ownerId: 'owner_2',
    createDate: '2024-12-05',
    lastActivityDate: '2024-12-23',
    closeDate: '2025-03-15',
    dealAge: 19,
    daysSinceLastActivity: 1,
    contactCount: 7,
    companyName: 'CoreLogic Systems',
    healthScore: 91,
    status: 'healthy',
    signals: {
      noRecentActivity: false,
      missingNextSteps: false,
      stuckInStage: false,
      lowEngagement: false,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_014',
    name: 'Product Launch - InnoHub',
    amount: 78000,
    stage: 'Qualified Lead',
    owner: 'Alex Rivera',
    ownerId: 'owner_5',
    createDate: '2024-12-10',
    lastActivityDate: '2024-12-24',
    closeDate: '2025-02-28',
    dealAge: 14,
    daysSinceLastActivity: 0,
    contactCount: 3,
    companyName: 'InnoHub Technologies',
    healthScore: 87,
    status: 'healthy',
    signals: {
      noRecentActivity: false,
      missingNextSteps: false,
      stuckInStage: false,
      lowEngagement: false,
      ownershipGap: false,
    },
  },
  {
    id: 'deal_015',
    name: 'Multi-Product Bundle - SaaS Dynamics',
    amount: 195000,
    stage: 'Negotiation',
    owner: 'Jessica Park',
    ownerId: 'owner_3',
    createDate: '2024-11-20',
    lastActivityDate: '2024-12-24',
    closeDate: '2025-01-25',
    dealAge: 34,
    daysSinceLastActivity: 0,
    contactCount: 6,
    companyName: 'SaaS Dynamics',
    healthScore: 90,
    status: 'healthy',
    signals: {
      noRecentActivity: false,
      missingNextSteps: false,
      stuckInStage: false,
      lowEngagement: false,
      ownershipGap: false,
    },
  },
];

// Calculate Pipeline Metrics from Mock Data
export function calculateMockMetrics(): PipelineMetrics {
  const totalDeals = mockDeals.length;
  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.amount, 0);

  const healthyDeals = mockDeals.filter(d => d.status === 'healthy');
  const atRiskDeals = mockDeals.filter(d => d.status === 'at-risk');
  const zombieDeals = mockDeals.filter(d => d.status === 'zombie');

  const healthyValue = healthyDeals.reduce((sum, deal) => sum + deal.amount, 0);
  const atRiskValue = atRiskDeals.reduce((sum, deal) => sum + deal.amount, 0);
  const zombieValue = zombieDeals.reduce((sum, deal) => sum + deal.amount, 0);

  const avgDealAge = Math.round(
    mockDeals.reduce((sum, deal) => sum + deal.dealAge, 0) / totalDeals
  );

  const avgHealthScore = Math.round(
    mockDeals.reduce((sum, deal) => sum + deal.healthScore, 0) / totalDeals
  );

  const closedDeals = mockDeals.filter(d => d.stage === 'Closed Won');

  return {
    totalDeals,
    totalValue,
    healthyDeals: healthyDeals.length,
    healthyValue,
    atRiskDeals: atRiskDeals.length,
    atRiskValue,
    zombieDeals: zombieDeals.length,
    zombieValue,
    avgDealAge,
    avgHealthScore,
    dealsClosedThisMonth: closedDeals.length,
    revenueAtRisk: atRiskValue + zombieValue,
  };
}

// Get deals by status
export function getDealsByStatus(status: 'healthy' | 'at-risk' | 'zombie'): Deal[] {
  return mockDeals.filter(deal => deal.status === status);
}

// Get deals by owner
export function getDealsByOwner(ownerId: string): Deal[] {
  return mockDeals.filter(deal => deal.ownerId === ownerId);
}

// Get owner stats
export function getOwnerStats(ownerId: string) {
  const deals = getDealsByOwner(ownerId);
  const zombies = deals.filter(d => d.status === 'zombie');
  const atRisk = deals.filter(d => d.status === 'at-risk');
  const healthy = deals.filter(d => d.status === 'healthy');

  return {
    totalDeals: deals.length,
    totalValue: deals.reduce((sum, d) => sum + d.amount, 0),
    zombieDeals: zombies.length,
    zombieValue: zombies.reduce((sum, d) => sum + d.amount, 0),
    atRiskDeals: atRisk.length,
    atRiskValue: atRisk.reduce((sum, d) => sum + d.amount, 0),
    healthyDeals: healthy.length,
    healthyValue: healthy.reduce((sum, d) => sum + d.amount, 0),
  };
}
