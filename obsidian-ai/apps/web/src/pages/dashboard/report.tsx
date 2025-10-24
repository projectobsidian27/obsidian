import { useState } from 'react';

export default function DiagnosticReport() {
  const [showExplainer, setShowExplainer] = useState<string | null>(null);

  // Mock data - will come from API later
  const reportData = {
    pipelineHealth: 68,
    revenueAtRisk: 847000,
    zombieDeals: 23,
    integrityScore: 72,
    confidenceIndex: 0.91,
    totalDeals: 127,
    signals: [
      {
        id: 'stalled_deals',
        name: 'Stalled Deals',
        value: 23,
        weight: 0.35,
        threshold: 15,
        status: 'warning',
        description: 'Deals that have exceeded expected stage velocity by 2x'
      },
      {
        id: 'ownership_gaps',
        name: 'Ownership Gaps',
        value: 8,
        weight: 0.25,
        threshold: 5,
        status: 'danger',
        description: 'High-value opportunities without assigned owners'
      },
      {
        id: 'missing_activities',
        name: 'Missing Follow-ups',
        value: 45,
        weight: 0.20,
        threshold: 20,
        status: 'warning',
        description: 'Deals without contact activity in past 14 days'
      },
      {
        id: 'task_compliance',
        name: 'Task Compliance',
        value: 78,
        weight: 0.20,
        threshold: 85,
        status: 'success',
        description: 'Percentage of required tasks completed on time'
      }
    ],
    revivalForecast: {
      potential: 520000,
      probability: 0.68,
      timeframe: '45-60 days'
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'danger':
        return 'var(--color-danger)';
      default:
        return 'var(--color-text-muted)';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>
          Pipeline Diagnostic Report
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '16px' }}>
          Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn btn-primary">
            🎧 Listen to Audio Briefing
          </button>
          <button className="btn btn-secondary">
            📤 Share Report
          </button>
          <button className="btn btn-secondary">
            📊 Export Data
          </button>
        </div>
      </header>

      <main>
        {/* Key Metrics Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {/* Pipeline Health */}
          <div className="card">
            <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pipeline Health
            </h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '48px', fontWeight: '700', color: getHealthColor(reportData.pipelineHealth) }}>
                {reportData.pipelineHealth}
              </span>
              <span style={{ fontSize: '24px', color: 'var(--color-text-muted)' }}>/100</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Based on {reportData.signals.length} weighted signals
            </p>
          </div>

          {/* Revenue at Risk */}
          <div className="card">
            <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Revenue at Risk
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '36px', fontWeight: '700', color: 'var(--color-danger)' }}>
                ${(reportData.revenueAtRisk / 1000).toFixed(0)}K
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              From {reportData.zombieDeals} stalled deals
            </p>
          </div>

          {/* Integrity Score */}
          <div className="card">
            <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Integrity Score
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '48px', fontWeight: '700', color: getHealthColor(reportData.integrityScore) }}>
                {reportData.integrityScore}%
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              CRM data quality & completeness
            </p>
          </div>

          {/* Confidence Index */}
          <div className="card">
            <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Confidence Index
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '48px', fontWeight: '700', color: 'var(--color-success)' }}>
                {(reportData.confidenceIndex * 100).toFixed(0)}%
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Signal reliability score
            </p>
          </div>
        </section>

        {/* Explainable Signals */}
        <section className="card" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>
            Explainable Signals
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '14px' }}>
            Every score is derived from transparent calculations. Click any signal to see the math.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reportData.signals.map((signal) => (
              <div
                key={signal.id}
                className="card"
                style={{
                  background: 'var(--color-bg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setShowExplainer(showExplainer === signal.id ? null : signal.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{signal.name}</h3>
                      <span className={`badge badge-${signal.status}`}>
                        {signal.value}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        Weight: {(signal.weight * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                      {signal.description}
                    </p>
                  </div>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: `4px solid ${getStatusColor(signal.status)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: getStatusColor(signal.status)
                  }}>
                    {signal.value > signal.threshold ? '⚠️' : '✓'}
                  </div>
                </div>

                {/* Explainer section */}
                {showExplainer === signal.id && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    background: 'var(--color-surface)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)'
                  }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--color-primary)' }}>
                      How this signal is calculated:
                    </h4>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                      <p>Current Value: <strong style={{ color: 'var(--color-text)' }}>{signal.value}</strong></p>
                      <p>Threshold: <strong style={{ color: 'var(--color-text)' }}>{signal.threshold}</strong></p>
                      <p>Weight in Score: <strong style={{ color: 'var(--color-text)' }}>{(signal.weight * 100).toFixed(0)}%</strong></p>
                      <p style={{ marginTop: '8px' }}>
                        Impact on Health: {signal.value > signal.threshold
                          ? <span style={{ color: 'var(--color-danger)' }}>-{Math.round((signal.value - signal.threshold) / signal.threshold * signal.weight * 100)} points</span>
                          : <span style={{ color: 'var(--color-success)' }}>No penalty</span>
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Revival Forecast */}
        <section className="card" style={{ marginBottom: '48px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Revival Forecast
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '14px' }}>
            Estimated revenue recovery if discipline is enforced
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Potential Recovery</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-success)' }}>
                ${(reportData.revivalForecast.potential / 1000).toFixed(0)}K
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Probability</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary)' }}>
                {(reportData.revivalForecast.probability * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Timeframe</p>
              <p style={{ fontSize: '32px', fontWeight: '700' }}>
                {reportData.revivalForecast.timeframe}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="card" style={{ textAlign: 'center', background: 'var(--color-surface)', borderColor: 'var(--color-primary)' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Ready to enforce discipline?
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Upgrade to start injecting tasks into your CRM and track compliance in real-time
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-primary">
              Start 30-Day Trial →
            </button>
            <button className="btn btn-secondary">
              Install Tracking Pixel
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
