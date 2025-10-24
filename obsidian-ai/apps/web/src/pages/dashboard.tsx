import { useState } from 'react';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data - will be replaced with real HubSpot data
  const metrics = {
    revenueAtRisk: 847000,
    revenueAtRiskDelta: -12.4,
    zombieDeals: 23,
    zombieDealsDelta: -8.0,
    healthyDeals: 156,
    healthyDealsDelta: 5.2,
    avgDealAge: 47,
    avgDealAgeDelta: 12.1,
  };

  const deals = [
    {
      id: 1,
      name: 'Enterprise License Renewal - Acme Corp',
      owner: 'Sarah Chen',
      value: 125000,
      age: 87,
      status: 'zombie',
      health: 34,
      lastActivity: '34 days ago',
    },
    {
      id: 2,
      name: 'Q4 Platform Upgrade - TechStart Inc',
      owner: 'Michael Torres',
      value: 95000,
      age: 62,
      status: 'at-risk',
      health: 58,
      lastActivity: '12 days ago',
    },
    {
      id: 3,
      name: 'Annual Contract - DataFlow Systems',
      owner: 'Jessica Park',
      value: 210000,
      age: 28,
      status: 'healthy',
      health: 92,
      lastActivity: '2 hours ago',
    },
    {
      id: 4,
      name: 'New Implementation - CloudNet',
      owner: 'David Kim',
      value: 78000,
      age: 71,
      status: 'zombie',
      health: 41,
      lastActivity: '28 days ago',
    },
    {
      id: 5,
      name: 'Expansion Deal - FinTech Solutions',
      owner: 'Sarah Chen',
      value: 156000,
      age: 19,
      status: 'healthy',
      health: 88,
      lastActivity: '1 day ago',
    },
  ];

  const getStatusPill = (status: string) => {
    switch (status) {
      case 'zombie':
        return <span className="status-pill status-pill-danger">ZOMBIE</span>;
      case 'at-risk':
        return <span className="status-pill status-pill-warning">AT RISK</span>;
      case 'healthy':
        return <span className="status-pill status-pill-success">HEALTHY</span>;
      default:
        return <span className="status-pill status-pill-info">UNKNOWN</span>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Top Navigation */}
      <header style={{
        background: 'var(--color-surface)',
        borderBottom: '2px solid var(--color-border)',
        padding: '16px 24px',
      }}>
        <div className="container" style={{ maxWidth: '1600px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.01em' }}>
              Obsidian
            </h1>
            <nav style={{ display: 'flex', gap: '16px' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Dashboard</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '14px', cursor: 'pointer' }}>Deals</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '14px', cursor: 'pointer' }}>Reports</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '14px', cursor: 'pointer' }}>Settings</span>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>HubSpot Connected</span>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--color-success)',
              boxShadow: '0 0 8px var(--color-success)',
            }} />
          </div>
        </div>
      </header>

      <main className="container" style={{ maxWidth: '1600px', padding: '32px 24px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Pipeline Command Center
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '16px' }}>
            Real-time pipeline discipline monitoring and enforcement
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid-dense" style={{ marginBottom: '48px' }}>
          {/* Revenue at Risk */}
          <div className="card card-elevated">
            <div className="metric">
              <div className="metric-label">REVENUE AT RISK</div>
              <div className="metric-value" style={{ color: 'var(--color-crimson-alert)' }}>
                {formatCurrency(metrics.revenueAtRisk)}
              </div>
              <div className="metric-delta metric-delta-negative">
                ↓ {Math.abs(metrics.revenueAtRiskDelta)}%
              </div>
            </div>
          </div>

          {/* Zombie Deals */}
          <div className="card card-elevated">
            <div className="metric">
              <div className="metric-label">ZOMBIE DEALS</div>
              <div className="metric-value" style={{ color: 'var(--color-signal-amber)' }}>
                {metrics.zombieDeals}
              </div>
              <div className="metric-delta metric-delta-positive">
                ↓ {Math.abs(metrics.zombieDealsDelta)}%
              </div>
            </div>
          </div>

          {/* Healthy Deals */}
          <div className="card card-elevated">
            <div className="metric">
              <div className="metric-label">HEALTHY DEALS</div>
              <div className="metric-value" style={{ color: 'var(--color-deep-teal)' }}>
                {metrics.healthyDeals}
              </div>
              <div className="metric-delta metric-delta-positive">
                ↑ {metrics.healthyDealsDelta}%
              </div>
            </div>
          </div>

          {/* Avg Deal Age */}
          <div className="card card-elevated">
            <div className="metric">
              <div className="metric-label">AVG DEAL AGE</div>
              <div className="metric-value" style={{ color: 'var(--color-burnt-sienna)' }}>
                {metrics.avgDealAge}d
              </div>
              <div className="metric-delta metric-delta-negative">
                ↑ {metrics.avgDealAgeDelta}%
              </div>
            </div>
          </div>
        </div>

        {/* Command Panel Layout */}
        <div className="grid-command">
          {/* Sidebar */}
          <aside>
            <div className="command-panel" style={{ marginBottom: '24px' }}>
              <div className="command-panel-header">FILTERS</div>
              <div className="command-panel-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Time Range
                  </label>
                  <select
                    className="input"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    style={{ fontSize: '14px' }}
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="12m">Last 12 Months</option>
                  </select>

                  <hr className="separator" />

                  <label style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Deal Status
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                      <input type="checkbox" defaultChecked />
                      <span>Zombie Deals</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                      <input type="checkbox" defaultChecked />
                      <span>At Risk</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                      <input type="checkbox" defaultChecked />
                      <span>Healthy</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="command-panel">
              <div className="command-panel-header">QUICK ACTIONS</div>
              <div className="command-panel-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                    🔍 Run New Scan
                  </button>
                  <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                    📊 Export Report
                  </button>
                  <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                    ⚙️ Configure Rules
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Deals Table */}
          <div>
            <div className="command-panel">
              <div className="command-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>DEAL PIPELINE</span>
                <span style={{ fontWeight: '400', fontSize: '12px' }}>{deals.length} deals found</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>DEAL NAME</th>
                      <th>OWNER</th>
                      <th>VALUE</th>
                      <th>AGE</th>
                      <th>HEALTH</th>
                      <th>STATUS</th>
                      <th>LAST ACTIVITY</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deals.map((deal) => (
                      <tr key={deal.id} className="interactive">
                        <td>
                          <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>
                            {deal.name}
                          </div>
                        </td>
                        <td>{deal.owner}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                          {formatCurrency(deal.value)}
                        </td>
                        <td>
                          <span style={{
                            color: deal.age > 60 ? 'var(--color-crimson-alert)' : 'var(--color-text-muted)',
                            fontWeight: deal.age > 60 ? '600' : '400',
                          }}>
                            {deal.age} days
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              flex: '1',
                              height: '6px',
                              background: 'var(--color-border)',
                              borderRadius: '3px',
                              overflow: 'hidden',
                              maxWidth: '60px',
                            }}>
                              <div style={{
                                width: `${deal.health}%`,
                                height: '100%',
                                background: deal.health > 80 ? 'var(--color-success)' : deal.health > 50 ? 'var(--color-warning)' : 'var(--color-danger)',
                              }} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', minWidth: '35px' }}>
                              {deal.health}%
                            </span>
                          </div>
                        </td>
                        <td>{getStatusPill(deal.status)}</td>
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                          {deal.lastActivity}
                        </td>
                        <td>
                          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
