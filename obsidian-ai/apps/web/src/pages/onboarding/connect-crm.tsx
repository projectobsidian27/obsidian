import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ConnectCRM() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectHubSpot = async () => {
    setIsConnecting(true);
    // TODO: Implement actual HubSpot OAuth flow
    // For now, simulate the connection
    setTimeout(() => {
      router.push('/onboarding/scanning');
    }, 1500);
  };

  return (
    <div className="container" style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>
      <header style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>
          Connect Your CRM
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '16px' }}>
          Choose your CRM platform to begin the diagnostic scan
        </p>
      </header>

      <main>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
          {/* HubSpot */}
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '2px solid var(--color-border)'
            }}
            onClick={handleConnectHubSpot}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: '#ff7a59',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: 'white'
              }}>H</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                  HubSpot
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  <span className="badge badge-success">Available Now</span>
                </p>
              </div>
            </div>
            <button
              className="btn btn-primary"
              disabled={isConnecting}
              style={{ pointerEvents: 'none' }}
            >
              {isConnecting ? 'Connecting...' : 'Connect →'}
            </button>
          </div>

          {/* Salesforce */}
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: 0.6,
              cursor: 'not-allowed',
              border: '2px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: '#00a1e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: 'white'
              }}>S</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                  Salesforce
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  <span className="badge badge-warning">Phase 2</span>
                </p>
              </div>
            </div>
            <button
              className="btn btn-secondary"
              disabled
              style={{ opacity: 0.5 }}
            >
              Coming Soon
            </button>
          </div>

          {/* Dynamics 365 */}
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: 0.6,
              cursor: 'not-allowed',
              border: '2px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: '#0078d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: 'white'
              }}>D</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                  Dynamics 365
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  <span className="badge badge-warning">Phase 2</span>
                </p>
              </div>
            </div>
            <button
              className="btn btn-secondary"
              disabled
              style={{ opacity: 0.5 }}
            >
              Coming Soon
            </button>
          </div>
        </div>

        <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>What happens next?</h3>
          <ol style={{ paddingLeft: '20px', color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.8' }}>
            <li>You'll be redirected to HubSpot to authorize access</li>
            <li>Vanguard will scan your pipeline (takes ~90 seconds)</li>
            <li>You'll receive an explainable diagnostic report</li>
            <li>Optional: Install our tracking pixel to measure ROI</li>
          </ol>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => router.back()}
          >
            ← Back to Trust Contract
          </button>
        </div>
      </main>
    </div>
  );
}
