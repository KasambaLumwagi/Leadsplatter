import { useRef, useEffect } from 'react';
import LeadCaptureForm from '../components/LeadCaptureForm';

const LandingPage = () => {
    const handlePurchase = (plan) => {
        // Mock Stripe Checkout
        console.log(`Purchasing ${plan}...`);
        alert(`Redirecting to Stripe Checkout for ${plan}... (This would be a real payment link)`);
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <section className="hero-section">
                <div className="hero-content fade-in" style={{ animationDelay: '0.1s' }}>
                    <span className="hero-tag">Enterprise AI Solution</span>
                    <h1>
                        Identify High-Intent <br />
                        <span style={{ color: 'var(--accent-primary)' }}>B2B Prospects</span>
                    </h1>
                    <p className="hero-description">
                        Scalable lead generation infrastructure for modern sales teams.
                        Integrates seamlessly with HubSpot, Salesforce, and Zoho.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#cbd5e1' }}>HubSpot</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#cbd5e1' }}>Salesforce</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#cbd5e1' }}>Zoho</div>
                    </div>
                </div>

                <div className="hero-form-wrapper fade-in" style={{ animationDelay: '0.3s' }}>
                    <LeadCaptureForm />
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" style={{ padding: '4rem var(--spacing-xl)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>Transparent Pricing</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                    Choose the plan that fits your growth stage. No hidden fees.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Starter */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', textAlign: 'left' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>Starter</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', margin: '1rem 0' }}>$49<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '400' }}>/mo</span></div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', color: 'var(--text-secondary)' }}>
                            <li style={{ marginBottom: '0.5rem' }}>✓ 500 Credits / month</li>
                            <li style={{ marginBottom: '0.5rem' }}>✓ Basic Email Support</li>
                            <li>✓ CSV Export</li>
                        </ul>
                        <button onClick={() => handlePurchase('Starter')} className="cta-button" style={{ width: '100%', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Get Started</button>
                    </div>

                    {/* Pro */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius)', border: '2px solid var(--accent-primary)', textAlign: 'left', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-12px', right: '2rem', background: 'var(--accent-primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>POPULAR</div>
                        <h3 style={{ fontSize: '1.25rem' }}>Pro Growth</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', margin: '1rem 0' }}>$149<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '400' }}>/mo</span></div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', color: 'var(--text-secondary)' }}>
                            <li style={{ marginBottom: '0.5rem' }}>✓ 2,500 Credits / month</li>
                            <li style={{ marginBottom: '0.5rem' }}>✓ <b>CRM Integration (HubSpot)</b></li>
                            <li style={{ marginBottom: '0.5rem' }}>✓ API Access</li>
                            <li>✓ Priority Support</li>
                        </ul>
                        <button onClick={() => handlePurchase('Pro')} className="cta-button" style={{ width: '100%' }}>Start Free Trial</button>
                    </div>

                    {/* Enterprise */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', textAlign: 'left' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>Enterprise</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', margin: '1rem 0' }}>Custom</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', color: 'var(--text-secondary)' }}>
                            <li style={{ marginBottom: '0.5rem' }}>✓ Unlimited Volume</li>
                            <li style={{ marginBottom: '0.5rem' }}>✓ Dedicated Account Manager</li>
                            <li>✓ Custom AI Models</li>
                        </ul>
                        <button className="cta-button" style={{ width: '100%', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Contact Sales</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
