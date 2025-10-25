import { useState, useEffect } from 'react';
import { mockDeals, calculateMockMetrics } from '../lib/mockData';

interface Deal {
  id: string;
  name: string;
  owner: string;
  amount: number;
  dealAge: number;
  daysSinceLastActivity: number;
  healthScore: number;
  status: 'healthy' | 'at-risk' | 'zombie';
  signals: {
    noRecentActivity?: boolean;
    missingNextSteps?: boolean;
    stuckInStage?: boolean;
    lowEngagement?: boolean;
  };
}

interface Metrics {
  totalDeals: number;
  zombieDeals: number;
  atRiskDeals: number;
  healthyDeals: number;
  totalValue: number;
  revenueAtRisk: number;
  avgDealAge: number;
}

interface ApiResponse {
  success: boolean;
  deals: Deal[];
  metrics: Metrics;
  fetchedAt: string;
}

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [useMockData, setUseMockData] = useState(true); // Toggle for mock vs real data
  const [realDeals, setRealDeals] = useState<Deal[]>([]);
  const [realMetrics, setRealMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch real data when toggle is disabled
  useEffect(() => {
    if (!useMockData) {
      fetchRealData();
    }
  }, [useMockData]);

  const fetchRealData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/deals/fetch');
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch deals');
      }

      setRealDeals(data.deals);
      setRealMetrics(data.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching real data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from mock data
  const mockMetrics = calculateMockMetrics();

  // Use real metrics if available, otherwise use mock
  const currentMetrics = useMockData || !realMetrics ? mockMetrics : realMetrics;

  const metrics = {
    revenueAtRisk: currentMetrics.revenueAtRisk,
    revenueAtRiskDelta: -12.4, // TODO: Calculate from historical data
    zombieDeals: currentMetrics.zombieDeals,
    zombieDealsDelta: -8.0,
    healthyDeals: currentMetrics.healthyDeals,
    healthyDealsDelta: 5.2,
    avgDealAge: currentMetrics.avgDealAge,
    avgDealAgeDelta: 12.1,
  };

  // Format last activity helper
  const formatLastActivity = (days: number): string => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months === 1) return '1 month ago';
    return `${months} months ago`;
  };

  // Use real deals if available, otherwise use mock
  const currentDeals = useMockData || realDeals.length === 0 ? mockDeals : realDeals;

  // Transform deals for display
  const deals = currentDeals.slice(0, 10).map(deal => ({
    ...deal,
    lastActivityFormatted: formatLastActivity(deal.daysSinceLastActivity),
  }));

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              <input
                type="checkbox"
                checked={useMockData}
                onChange={(e) => setUseMockData(e.target.checked)}
              />
              <span>Use Mock Data</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading ? (
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  Loading...
                </span>
              ) : error ? (
                <span style={{ fontSize: '13px', color: 'var(--color-crimson-alert)' }}>
                  Error: {error}
                </span>
              ) : (
                <>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    {useMockData ? 'Demo Mode' : 'HubSpot Connected'}
                  </span>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: useMockData ? 'var(--color-signal-amber)' : 'var(--color-success)',
                    boxShadow: useMockData ? '0 0 8px var(--color-signal-amber)' : '0 0 8px var(--color-success)',
                  }} />
                </>
              )}
            </div>
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
                          {formatCurrency(deal.amount)}
                        </td>
                        <td>
                          <span style={{
                            color: deal.dealAge > 60 ? 'var(--color-crimson-alert)' : 'var(--color-text-muted)',
                            fontWeight: deal.dealAge > 60 ? '600' : '400',
                          }}>
                            {deal.dealAge} days
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
                                width: `${deal.healthScore}%`,
                                height: '100%',
                                background: deal.healthScore > 80 ? 'var(--color-success)' : deal.healthScore > 50 ? 'var(--color-warning)' : 'var(--color-danger)',
                              }} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', minWidth: '35px' }}>
                              {deal.healthScore}%
                            </span>
                          </div>
                        </td>
                        <td>{getStatusPill(deal.status)}</td>
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                          {deal.lastActivityFormatted}
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
