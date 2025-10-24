import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Qualify() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    companySize: '',
    industry: '',
    role: '',
    crm: 'hubspot',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Store qualification data (localStorage for now, database later)
    localStorage.setItem('qualification', JSON.stringify(formData));

    // Navigate to trust contract
    router.push('/onboarding/trust-contract');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: 'var(--font-size-4xl)',
            fontWeight: 'var(--font-weight-extrabold)',
            marginBottom: '16px',
            letterSpacing: 'var(--letter-spacing-tight)',
          }}>
            Tell Us About Your Team
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-lg)' }}>
            Help us personalize your pipeline diagnostic
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="card card-elevated" style={{ padding: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

              {/* Company Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--letter-spacing-wide)',
                  marginBottom: 'var(--spacing-sm)',
                }}>
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  className="input"
                  placeholder="Acme Corporation"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Company Size */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--letter-spacing-wide)',
                  marginBottom: 'var(--spacing-sm)',
                }}>
                  Company Size
                </label>
                <select
                  name="companySize"
                  className="input"
                  value={formData.companySize}
                  onChange={handleChange}
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1,000 employees</option>
                  <option value="1001+">1,001+ employees</option>
                </select>
              </div>

              {/* Industry */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--letter-spacing-wide)',
                  marginBottom: 'var(--spacing-sm)',
                }}>
                  Industry
                </label>
                <select
                  name="industry"
                  className="input"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select industry</option>
                  <option value="saas">SaaS / Software</option>
                  <option value="technology">Technology / IT Services</option>
                  <option value="professional-services">Professional Services</option>
                  <option value="consulting">Consulting</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="financial-services">Financial Services</option>
                  <option value="retail">Retail / E-commerce</option>
                  <option value="media">Media / Marketing</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--letter-spacing-wide)',
                  marginBottom: 'var(--spacing-sm)',
                }}>
                  Your Role
                </label>
                <select
                  name="role"
                  className="input"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select your role</option>
                  <option value="cro">Chief Revenue Officer (CRO)</option>
                  <option value="vp-sales">VP of Sales</option>
                  <option value="vp-revops">VP of Revenue Operations</option>
                  <option value="director-sales">Director of Sales</option>
                  <option value="director-revops">Director of Revenue Operations</option>
                  <option value="sales-ops-manager">Sales Operations Manager</option>
                  <option value="revops-manager">RevOps Manager</option>
                  <option value="sales-manager">Sales Manager</option>
                  <option value="account-executive">Account Executive</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* CRM (pre-selected HubSpot) */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--letter-spacing-wide)',
                  marginBottom: 'var(--spacing-sm)',
                }}>
                  CRM Platform
                </label>
                <select
                  name="crm"
                  className="input"
                  value={formData.crm}
                  onChange={handleChange}
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="hubspot">HubSpot</option>
                  <option value="salesforce" disabled>Salesforce (Coming Soon)</option>
                  <option value="dynamics" disabled>Microsoft Dynamics (Coming Soon)</option>
                </select>
              </div>

              <hr className="separator" />

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => router.back()}
                  style={{ flex: '1' }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: '2' }}
                >
                  Continue to Trust Contract →
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <p style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-subtle)',
            textAlign: 'center',
            marginTop: 'var(--spacing-lg)',
            lineHeight: 'var(--line-height-relaxed)',
          }}>
            🔒 Your information is encrypted and never shared. We use it only to personalize your experience.
          </p>
        </form>
      </div>
    </div>
  );
}
