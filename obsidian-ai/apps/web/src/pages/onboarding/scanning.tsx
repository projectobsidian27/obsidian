import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Scanning() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Connecting to CRM...');

  const steps = [
    { text: 'Connecting to CRM...', duration: 1000 },
    { text: 'Analyzing pipeline stages...', duration: 2000 },
    { text: 'Detecting stalled deals...', duration: 1500 },
    { text: 'Identifying ownership gaps...', duration: 1500 },
    { text: 'Calculating revenue at risk...', duration: 2000 },
    { text: 'Building explainable signals...', duration: 1500 },
    { text: 'Generating report...', duration: 1000 }
  ];

  useEffect(() => {
    let currentProgress = 0;
    let stepIndex = 0;

    const runSteps = async () => {
      for (const step of steps) {
        setCurrentStep(step.text);
        const increment = 100 / steps.length;
        const stepDuration = step.duration;
        const intervalTime = 50;
        const incrementPerInterval = increment / (stepDuration / intervalTime);

        await new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            currentProgress += incrementPerInterval;
            if (currentProgress >= (stepIndex + 1) * increment) {
              currentProgress = (stepIndex + 1) * increment;
              clearInterval(interval);
              resolve();
            }
            setProgress(Math.min(currentProgress, 100));
          }, intervalTime);
        });

        stepIndex++;
      }

      // Navigate to results
      setTimeout(() => {
        router.push('/dashboard/report');
      }, 500);
    };

    runSteps();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%' }}>
        <header style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>
            Running Diagnostic Scan
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '16px' }}>
            Vanguard is analyzing your pipeline...
          </p>
        </header>

        <main>
          <div className="card" style={{ marginBottom: '32px' }}>
            {/* Animated spinner */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 32px',
              border: '4px solid var(--color-border)',
              borderTop: '4px solid var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>

            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--color-border)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-hover))',
                transition: 'width 0.3s ease',
                borderRadius: '4px'
              }}></div>
            </div>

            {/* Current step */}
            <p style={{
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: '14px',
              minHeight: '20px'
            }}>
              {currentStep}
            </p>

            {/* Progress percentage */}
            <p style={{
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: '600',
              marginTop: '16px',
              color: 'var(--color-primary)'
            }}>
              {Math.round(progress)}%
            </p>
          </div>

          <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>What we're checking:</h3>
            <ul style={{ paddingLeft: '20px', color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.8' }}>
              <li>Deals stuck in stages beyond normal velocity</li>
              <li>Ownership gaps and unassigned opportunities</li>
              <li>Missing follow-up activities and tasks</li>
              <li>Revenue at risk from stalled pipeline</li>
              <li>Engagement patterns and contact behavior</li>
            </ul>
          </div>
        </main>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
