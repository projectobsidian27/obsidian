import { useState } from 'react';

// Mock client data - will come from database
interface Client {
  id: string;
  companyName: string;
  email: string;
  industry: string;
  companySize: string;
  tier: 'free-trial' | 'starter' | 'growth' | 'enterprise';
  mrr: number; // Monthly Recurring Revenue
  status: 'active' | 'churned' | 'at-risk';
  hubspotId: string;
  connectedAt: string;
  lastLoginAt: string;

  // Success signals
  signals: {
    loginFrequency: 'high' | 'medium' | 'low'; // Green/Yellow/Red
    scansPerMonth: number;
    dealsAnalyzed: number;
    tasksCreated: number;
    engagementScore: number; // 0-100
    healthStatus: 'healthy' | 'warning' | 'critical';
  };

  // Red flags
  redFlags: string[];

  // Green flags
  greenFlags: string[];
}

const mockClients: Client[] = [
  {
    id: 'client_1',
    companyName: 'TechCorp Solutions',
    email: 'admin@techcorp.com',
    industry: 'SaaS',
    companySize: '201-500',
    tier: 'enterprise',
    mrr: 2500,
    status: 'active',
    hubspotId: 'hub_123456',
    connectedAt: '2024-11-15',
    lastLoginAt: '2024-12-23',
    signals: {
      loginFrequency: 'high',
      scansPerMonth: 12,
      dealsAnalyzed: 450,
      tasksCreated: 89,
      engagementScore: 92,
      healthStatus: 'healthy',
    },
    redFlags: [],
    greenFlags: ['High engagement', 'Active scanning', 'Growing deal count', 'Champion user identified'],
  },
  {
    id: 'client_2',
    companyName: 'StartupFlow Inc',
    email: 'ceo@startupflow.io',
    industry: 'Technology',
    companySize: '11-50',
    tier: 'growth',
    mrr: 500,
    status: 'active',
    hubspotId: 'hub_789012',
    connectedAt: '2024-12-01',
    lastLoginAt: '2024-12-22',
    signals: {
      loginFrequency: 'medium',
      scansPerMonth: 6,
      dealsAnalyzed: 120,
      tasksCreated: 34,
      engagementScore: 78,
      healthStatus: 'healthy',
    },
    redFlags: ['Login frequency declining'],
    greenFlags: ['Consistent usage', 'Growing pipeline'],
  },
  {
    id: 'client_3',
    companyName: 'Legacy Systems LLC',
    email: 'ops@legacysys.com',
    industry: 'Professional Services',
    companySize: '51-200',
    tier: 'starter',
    mrr: 199,
    status: 'at-risk',
    hubspotId: 'hub_345678',
    connectedAt: '2024-10-20',
    lastLoginAt: '2024-12-10',
    signals: {
      loginFrequency: 'low',
      scansPerMonth: 2,
      dealsAnalyzed: 45,
      tasksCreated: 8,
      engagementScore: 34,
      healthStatus: 'critical',
    },
    redFlags: ['No logins in 13 days', 'Low scan frequency', 'Declining engagement', 'No tasks created this month'],
    greenFlags: [],
  },
  {
    id: 'client_4',
    companyName: 'FinTech Dynamics',
    email: 'trial@fintechdyn.com',
    industry: 'Financial Services',
    companySize: '1-10',
    tier: 'free-trial',
    mrr: 0,
    status: 'active',
    hubspotId: 'hub_901234',
    connectedAt: '2024-12-20',
    lastLoginAt: '2024-12-24',
    signals: {
      loginFrequency: 'high',
      scansPerMonth: 8,
      dealsAnalyzed: 67,
      tasksCreated: 15,
      engagementScore: 85,
      healthStatus: 'healthy',
    },
    redFlags: [],
    greenFlags: ['High trial engagement', 'Daily logins', 'Power user behavior', 'Expansion opportunity'],
  },
  {
    id: 'client_5',
    companyName: 'MediaPro Group',
    email: 'revops@mediapro.tv',
    industry: 'Media',
    companySize: '501-1000',
    tier: 'enterprise',
    mrr: 3500,
    status: 'active',
    hubspotId: 'hub_567890',
    connectedAt: '2024-09-10',
    lastLoginAt: '2024-12-24',
    signals: {
      loginFrequency: 'high',
      scansPerMonth: 18,
      dealsAnalyzed: 890,
      tasksCreated: 156,
      engagementScore: 95,
      healthStatus: 'healthy',
    },
    redFlags: [],
    greenFlags: ['Enterprise champion', 'Multi-user adoption', 'ROI proven', 'Expansion discussions'],
  },
  {
    id: 'client_6',
    companyName: 'QuickSales Demo',
    email: 'demo@quicksales.app',
    industry: 'SaaS',
    companySize: '1-10',
    tier: 'free-trial',
    mrr: 0,
    status: 'active',
    hubspotId: 'hub_111222',
    connectedAt: '2024-12-22',
    lastLoginAt: '2024-12-23',
    signals: {
      loginFrequency: 'medium',
      scansPerMonth: 3,
      dealsAnalyzed: 25,
      tasksCreated: 5,
      engagementScore: 62,
      healthStatus: 'warning',
    },
    redFlags: ['Low scan count for trial period'],
    greenFlags: ['Showing interest', 'Active in first 48h'],
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'free-trial' | 'starter' | 'growth' | 'enterprise'>('enterprise');

  // Segment clients by tier
  const clientsByTier = {
    'free-trial': mockClients.filter(c => c.tier === 'free-trial'),
    'starter': mockClients.filter(c => c.tier === 'starter'),
    'growth': mockClients.filter(c => c.tier === 'growth'),
    'enterprise': mockClients.filter(c => c.tier === 'enterprise'),
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'var(--color-success)';
      case 'warning': return 'var(--color-warning)';
      case 'critical': return 'var(--color-crimson-alert)';
      default: return 'var(--color-text-muted)';
    }
  };

  const getLoginFrequencyColor = (freq: string) => {
    switch (freq) {
      case 'high': return 'var(--color-success)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-crimson-alert)';
      default: return 'var(--color-text-muted)';
    }
  };

  const formatMRR = (mrr: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(mrr);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleLoginAsClient = (client: Client) => {
    // TODO: Implement admin impersonation
    console.log('Login as:', client.companyName);
    alert(`Logging in as ${client.companyName}...\n\nThis will redirect to their dashboard with their data.`);
  };

  const totalMRR = mockClients.reduce((sum, c) => sum + c.mrr, 0);
  const activeClients = mockClients.filter(c => c.status === 'active').length;
  const atRiskClients = mockClients.filter(c => c.status === 'at-risk').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Admin Header */}
      <header style={{
        background: 'var(--color-surface)',
        borderBottom: '2px solid var(--color-signal-amber)',
        padding: '16px 24px',
      }}>
        <div className="container" style={{ maxWidth: '1800px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.01em', marginBottom: '4px' }}>
              🔐 Obsidian Admin
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Internal Client Management Dashboard
            </p>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div className="metric" style={{ textAlign: 'center' }}>
              <div className="metric-label">TOTAL MRR</div>
              <div className="metric-value" style={{ fontSize: '24px', color: 'var(--color-signal-amber)' }}>
                {formatMRR(totalMRR)}
              </div>
            </div>
            <div className="metric" style={{ textAlign: 'center' }}>
              <div className="metric-label">ACTIVE CLIENTS</div>
              <div className="metric-value" style={{ fontSize: '24px', color: 'var(--color-deep-teal)' }}>
                {activeClients}
              </div>
            </div>
            <div className="metric" style={{ textAlign: 'center' }}>
              <div className="metric-label">AT RISK</div>
              <div className="metric-value" style={{ fontSize: '24px', color: 'var(--color-crimson-alert)' }}>
                {atRiskClients}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '1800px', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['free-trial', 'starter', 'growth', 'enterprise'] as const).map(tier => {
              const count = clientsByTier[tier].length;
              const isActive = activeTab === tier;

              return (
                <button
                  key={tier}
                  onClick={() => setActiveTab(tier)}
                  style={{
                    padding: '16px 24px',
                    background: isActive ? 'var(--color-bg)' : 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '2px solid var(--color-signal-amber)' : '2px solid transparent',
                    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                    fontWeight: isActive ? '600' : '400',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s',
                  }}
                >
                  {tier.replace('-', ' ')} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Client Cards Grid */}
      <main className="container" style={{ maxWidth: '1800px', padding: '32px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '24px',
        }}>
          {clientsByTier[activeTab].map(client => (
            <div
              key={client.id}
              className="card card-elevated interactive"
              style={{
                padding: '24px',
                borderLeft: `4px solid ${getHealthColor(client.signals.healthStatus)}`,
                position: 'relative',
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'var(--color-text)',
                  }}>
                    {client.companyName}
                  </h3>
                  <span className={`status-pill status-pill-${client.signals.healthStatus === 'healthy' ? 'success' : client.signals.healthStatus === 'warning' ? 'warning' : 'danger'}`}>
                    {client.signals.healthStatus.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  {client.industry} • {client.companySize} employees
                </div>
              </div>

              {/* Metrics Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '16px',
                padding: '12px',
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    MRR
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                    {formatMRR(client.mrr)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Engagement
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: getHealthColor(client.signals.healthStatus) }}>
                    {client.signals.engagementScore}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Logins
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: getLoginFrequencyColor(client.signals.loginFrequency), textTransform: 'capitalize' }}>
                    {client.signals.loginFrequency}
                  </div>
                </div>
              </div>

              {/* Activity Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginBottom: '16px',
                fontSize: '13px',
              }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Scans/mo:</span>{' '}
                  <span style={{ fontWeight: '600' }}>{client.signals.scansPerMonth}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Deals:</span>{' '}
                  <span style={{ fontWeight: '600' }}>{client.signals.dealsAnalyzed}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Tasks:</span>{' '}
                  <span style={{ fontWeight: '600' }}>{client.signals.tasksCreated}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Last login:</span>{' '}
                  <span style={{ fontWeight: '600' }}>{formatDate(client.lastLoginAt)}</span>
                </div>
              </div>

              <hr className="separator" />

              {/* Red Flags */}
              {client.redFlags.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--color-crimson-alert)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}>
                    🚩 Red Flags
                  </div>
                  {client.redFlags.map((flag, i) => (
                    <div key={i} style={{
                      fontSize: '12px',
                      color: 'var(--color-crimson-alert)',
                      marginBottom: '4px',
                      paddingLeft: '12px',
                    }}>
                      • {flag}
                    </div>
                  ))}
                </div>
              )}

              {/* Green Flags */}
              {client.greenFlags.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--color-success)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}>
                    ✅ Green Flags
                  </div>
                  {client.greenFlags.map((flag, i) => (
                    <div key={i} style={{
                      fontSize: '12px',
                      color: 'var(--color-success)',
                      marginBottom: '4px',
                      paddingLeft: '12px',
                    }}>
                      • {flag}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <button
                className="btn btn-primary"
                onClick={() => handleLoginAsClient(client)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                🔑 Login as {client.companyName}
              </button>
            </div>
          ))}

          {/* Empty State */}
          {clientsByTier[activeTab].length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '48px',
              color: 'var(--color-text-muted)',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                No {activeTab.replace('-', ' ')} clients yet
              </div>
              <div style={{ fontSize: '14px' }}>
                Clients will appear here once they sign up for this tier
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
