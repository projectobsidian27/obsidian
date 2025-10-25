import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Navigate to qualification form with email as query param
    router.push(`/onboarding/qualify?email=${encodeURIComponent(email)}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Sticky CTA Bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--color-surface)',
        borderBottom: '2px solid var(--color-border)',
        padding: '12px 24px',
      }}>
        <div className="container" style={{
          maxWidth: '1400px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.01em' }}>
              Obsidian
            </h1>
            <span style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              Pipeline Discipline Platform
            </span>
          </div>
          <button
            onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn btn-primary"
            style={{ padding: '8px 24px' }}
          >
            Start Free Scan →
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <header className="container" style={{ maxWidth: '1200px', padding: '120px 24px 80px', textAlign: 'center' }}>
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '56px',
            fontWeight: '800',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
          }}>
            Your Pipeline Is Bleeding Revenue.<br />
            <span style={{ color: 'var(--color-signal-amber)' }}>AI Won&apos;t Save You.</span>
          </h2>
          <p style={{
            fontSize: '24px',
            color: 'var(--color-text-muted)',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>
            Every day, your sales pipeline leaks millions in recoverable revenue. <br />
            Not from bad leads — from <strong style={{ color: 'var(--color-text)' }}>zombie deals</strong> and <strong style={{ color: 'var(--color-text)' }}>disengaged sellers</strong>.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '64px',
        }}>
          <div className="card card-elevated" style={{ textAlign: 'center', padding: '32px' }}>
            <div className="metric-value" style={{ color: 'var(--color-crimson-alert)', fontSize: '48px' }}>
              $2.3M
            </div>
            <div className="metric-label" style={{ marginTop: '8px' }}>
              AVG REVENUE AT RISK
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              Per company with 50+ deals
            </p>
          </div>

          <div className="card card-elevated" style={{ textAlign: 'center', padding: '32px' }}>
            <div className="metric-value" style={{ color: 'var(--color-signal-amber)', fontSize: '48px' }}>
              68%
            </div>
            <div className="metric-label" style={{ marginTop: '8px' }}>
              STALLED DEALS
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              No activity in 30+ days
            </p>
          </div>

          <div className="card card-elevated" style={{ textAlign: 'center', padding: '32px' }}>
            <div className="metric-value" style={{ color: 'var(--color-deep-teal)', fontSize: '48px' }}>
              24%
            </div>
            <div className="metric-label" style={{ marginTop: '8px' }}>
              RECOVERABLE
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              With systematic discipline
            </p>
          </div>
        </div>
      </header>

      {/* Problem Section */}
      <section className="container" style={{ maxWidth: '1200px', padding: '80px 24px', background: 'var(--color-surface)' }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '800',
          marginBottom: '48px',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}>
          The Hidden Crisis in Your CRM
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Problem 1 */}
          <div className="card card-elevated" style={{ borderLeft: '4px solid var(--color-crimson-alert)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>🧟</span>
              Zombie Deals Everywhere
            </h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              The average pipeline has <strong>40-60% zombie deals</strong> — opportunities stuck in stages for months with no real buyer engagement.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Your reps mark them as &ldquo;still interested&rdquo; to avoid tough conversations. Your forecast is fiction.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="card card-elevated" style={{ borderLeft: '4px solid var(--color-signal-amber)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>🤖</span>
              AI Black Boxes = Blind Trust
            </h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Most AI sales tools give you a score without showing their work. <strong>82% of revenue leaders</strong> say they don&apos;t trust AI predictions.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              When the model is wrong, you don&apos;t know why. When it&apos;s right, you can&apos;t explain it to your CEO.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="card card-elevated" style={{ borderLeft: '4px solid var(--color-burnt-sienna)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>😴</span>
              Disengaged Sellers
            </h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              <strong>73% of sellers</strong> admit they don&apos;t follow up consistently. They rely on memory, not process.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Without enforced discipline, your best deals die from neglect — not competition.
            </p>
          </div>
        </div>
      </section>

      {/* Cost Section */}
      <section className="container" style={{ maxWidth: '1000px', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '800',
          marginBottom: '24px',
          letterSpacing: '-0.02em',
        }}>
          What This Really Costs You
        </h2>
        <p style={{
          fontSize: '18px',
          color: 'var(--color-text-muted)',
          marginBottom: '48px',
          lineHeight: '1.6',
        }}>
          Poor pipeline discipline isn&apos;t just a metric problem — it&apos;s a revenue killer.
        </p>

        <div className="command-panel" style={{ textAlign: 'left' }}>
          <div className="command-panel-header">THE REAL NUMBERS</div>
          <div className="command-panel-body" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Lost Revenue from Zombie Deals</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Deals that could have been saved with intervention</div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-crimson-alert)' }}>$1.8M</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Wasted Rep Time on Dead Deals</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Hours spent nurturing opportunities that won&apos;t close</div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-signal-amber)' }}>43%</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Forecast Accuracy Drop</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>When pipelines are full of ghosts</div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-burnt-sienna)' }}>-58%</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Cost of Bad Decisions from Blind AI</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Trusting scores you can&apos;t explain or validate</div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-deep-teal)' }}>$420K</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container" style={{ maxWidth: '1200px', padding: '80px 24px', background: 'var(--color-surface)' }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '800',
          marginBottom: '24px',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}>
          Obsidian: Discipline, Not Hustle
        </h2>
        <p style={{
          fontSize: '18px',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          marginBottom: '64px',
          maxWidth: '700px',
          margin: '0 auto 64px',
          lineHeight: '1.6',
        }}>
          We don&apos;t predict the future. We enforce the fundamentals that prevent revenue loss.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'var(--color-primary)' }}>
              ⚡ EXPLAINABLE SIGNALS
            </h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '12px' }}>
              Every zombie alert shows exactly why: days inactive, deal age, stage duration, ownership gaps.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '14px' }}>
              No black boxes. No blind trust. Just transparent, actionable signals.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'var(--color-primary)' }}>
              🎯 ENFORCE DISCIPLINE
            </h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '12px' }}>
              Automatically inject follow-up tasks into your CRM when deals stall.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '14px' }}>
              Make process non-negotiable. Track compliance. Prove ROI.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'var(--color-primary)' }}>
              🔒 PRIVACY-FIRST
            </h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '12px' }}>
              We compute health scores and inject tasks — we never store raw CRM data.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '14px' }}>
              Your customer data stays in your CRM. Always.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container" style={{ maxWidth: '1000px', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          marginBottom: '48px',
          letterSpacing: '-0.02em',
        }}>
          Built for Revenue Leaders Who Demand Truth
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="card" style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px', fontStyle: 'italic' }}>
              &ldquo;Finally, a tool that shows me the deals I can actually save instead of pretending to predict the future.&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-border)' }}></div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>Sarah Chen</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>VP Revenue Ops</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px', fontStyle: 'italic' }}>
              &ldquo;We recovered $890K in Q1 by systematically reviving zombie deals. Obsidian paid for itself in 3 weeks.&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-border)' }}></div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>Marcus Rodriguez</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>CRO</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px', fontStyle: 'italic' }}>
              &ldquo;The explainability is what sold me. I can defend every decision to my board with data.&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-border)' }}></div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>Priya Kapoor</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Head of Sales Strategy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        id="signup-form"
        className="container"
        style={{
          maxWidth: '800px',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div className="card card-elevated" style={{ padding: '64px 48px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Stop Guessing. Start Recovering.
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--color-text-muted)', marginBottom: '40px', lineHeight: '1.6' }}>
            Get your free diagnostic scan in 90 seconds.<br />
            See exactly how much revenue is at risk right now.
          </p>

          <form onSubmit={handleGetStarted} style={{ maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="email"
              className="input"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ marginBottom: '16px', fontSize: '16px', padding: '16px' }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', fontSize: '18px', padding: '16px' }}
            >
              {isLoading ? 'Starting...' : 'Get Your Free Scan →'}
            </button>
          </form>

          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '24px' }}>
            No credit card required • 30-day free trial • HubSpot native
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '32px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
            <div>✓ 90-second setup</div>
            <div>✓ No data storage</div>
            <div>✓ Cancel anytime</div>
          </div>
        </div>
      </section>

      <footer style={{
        textAlign: 'center',
        padding: '64px 24px',
        color: 'var(--color-text-muted)',
        fontSize: '14px',
        background: 'var(--color-surface)',
        borderTop: '2px solid var(--color-border)',
      }}>
        <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Obsidian</p>
        <p>Pipeline Discipline Platform</p>
        <p style={{ marginTop: '16px' }}>Made for RevOps teams who restore order to revenue</p>
      </footer>
    </div>
  );
}
