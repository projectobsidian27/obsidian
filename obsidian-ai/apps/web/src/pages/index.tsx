import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Navigate to qualification form
    router.push('/onboarding/qualify');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Hero Section */}
      <header className="container" style={{ maxWidth: '1200px', padding: '80px 24px 48px', textAlign: 'center' }}>
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h1 style={{
            fontSize: 'var(--font-size-5xl)',
            fontWeight: 'var(--font-weight-extrabold)',
            marginBottom: 'var(--spacing-lg)',
            letterSpacing: 'var(--letter-spacing-tight)',
            lineHeight: 'var(--line-height-tight)',
          }}>
            Obsidian
          </h1>
          <p style={{
            fontSize: 'var(--font-size-xl)',
            color: 'var(--color-text-muted)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 'var(--line-height-relaxed)',
          }}>
            Restore order to your revenue pipeline — recover what you&apos;ve already earned
          </p>
        </div>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 0' }}>
        <section style={{ marginBottom: '64px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>
              Get your free diagnostic scan
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
              Discover revenue at risk, pipeline health, and revival opportunities — in under 90 seconds
            </p>

            <form onSubmit={handleGetStarted} style={{ maxWidth: '400px', margin: '0 auto' }}>
              <input
                type="email"
                className="input"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ marginBottom: '16px' }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{ width: '100%' }}
              >
                {isLoading ? 'Sending...' : 'Get Started Free →'}
              </button>
            </form>

            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '16px' }}>
              No credit card required • 30-day trial included
            </p>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '64px' }}>
          <div className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>⚡ Discipline &gt; Hustle</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Stop chasing deals. Start enforcing process with CRM-native task injection.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>🎯 Outcome &gt; Noise</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Explainable signals with confidence scores. No black boxes.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>📊 Signal &gt; Vanity</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Track what matters: Pipeline integrity, motion discipline, revival opportunities.
            </p>
          </div>
        </section>

        <section className="card" style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>How it works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>1</div>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Connect your CRM</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  OAuth to HubSpot in seconds. We never store raw CRM data.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>2</div>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Get your diagnostic scan</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  Vanguard analyzes stalls, ownership gaps, and revenue at risk in under 90 seconds.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>3</div>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Review explainable results</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  See every signal, weight, and threshold. Audio briefing included.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>4</div>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Enforce discipline</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  Inject tasks into your CRM. Track compliance. Prove ROI.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-muted)', fontSize: '14px' }}>
        <p>Obsidian — Pipeline Discipline Platform</p>
        <p style={{ marginTop: '8px' }}>Made for RevOps teams who restore order to revenue</p>
      </footer>
    </div>
  );
}
