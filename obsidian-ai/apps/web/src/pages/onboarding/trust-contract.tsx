import { useState } from 'react';
import { useRouter } from 'next/router';

export default function TrustContract() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (accepted) {
      router.push('/onboarding/connect-crm');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
      <header style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>
          Trust Contract
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '16px' }}>
          Before we connect to your CRM, here's how we handle your data
        </p>
      </header>

      <main>
        <div className="card" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Our Commitments</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontSize: '24px' }}>🔒</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                  No Raw CRM Storage
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  We never store your raw CRM data. We only keep derived metrics and signals needed for analysis.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontSize: '24px' }}>🎯</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                  Ephemeral Processing
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  Your pipeline data is processed in memory and discarded. We only persist anonymized patterns.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontSize: '24px' }}>🔐</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                  Single-Tenant by Design
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  Your instance is isolated. Your AI Units never share data with other customers.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                  Explainable Signals
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  Every score, weight, and threshold is visible. No black boxes, no hidden algorithms.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontSize: '24px' }}>🔄</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                  Revocable Access
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  You can disconnect your CRM or delete your account anytime. All derived data will be purged.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '32px', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'var(--color-primary)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>What We Access</h2>
          <ul style={{ paddingLeft: '20px', color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.8' }}>
            <li>Deal properties (stage, value, owner, last activity)</li>
            <li>Contact engagement metrics (emails, calls, meetings)</li>
            <li>Task completion status</li>
            <li>Pipeline movement timestamps</li>
          </ul>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: 'var(--color-surface)',
          borderRadius: '8px',
          marginBottom: '32px',
          cursor: 'pointer'
        }} onClick={() => setAccepted(!accepted)}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label style={{ fontSize: '15px', cursor: 'pointer' }}>
            I understand and accept the trust contract
          </label>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={() => router.back()}
          >
            ← Go Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleContinue}
            disabled={!accepted}
            style={{ opacity: accepted ? 1 : 0.5 }}
          >
            Continue to CRM Connection →
          </button>
        </div>
      </main>
    </div>
  );
}
