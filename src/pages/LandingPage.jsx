
import { useRef, useEffect } from 'react';
import LeadCaptureForm from '../components/LeadCaptureForm';
import Hero3DScene from '../components/Hero3DScene';

const LandingPage = () => {
    const handlePurchase = async (plan) => {
        try {
            console.log(`Initiating checkout for ${plan}...`);
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Checkout failed: ' + (data.error || 'Unknown Error'));
            }
        } catch (error) {
            console.error('Purchase Error:', error);
            alert('Failed to connect to payment server.');
        }
    };

    return (
        <div style={{ paddingBottom: '0', background: 'var(--bg-primary)' }}>
            {/* Hero Section */}
            <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <Hero3DScene /> {/* 3D Background */}

                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 50% 50%, transparent 0%, var(--bg-primary) 90%)',
                    zIndex: 2,
                    pointerEvents: 'none'
                }} />

                <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
                    <div className="hero-content fade-in" style={{ animationDelay: '0.1s' }}>
                        <span className="hero-tag">Enterprise AI Solution</span>
                        <h1>
                            Identify High-Intent <br />
                            <span style={{
                                color: 'var(--brand-gold)',
                                background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))'
                            }}>B2B Prospects</span>
                        </h1>
                        <p className="hero-description" style={{ fontSize: '1.25rem', maxWidth: '500px' }}>
                            Scalable lead generation infrastructure for modern sales teams.
                            Integrates seamlessly with HubSpot, Salesforce, and Zoho.
                        </p>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', alignItems: 'center', opacity: 0.6 }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>HubSpot</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>Salesforce</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>Zoho</div>
                        </div>
                    </div>

                    <div className="hero-form-wrapper fade-in" style={{ animationDelay: '0.3s', display: 'flex', justifyContent: 'center' }}>
                        <LeadCaptureForm />
                    </div>
                </div>
            </section>

            {/* Pricing Section - BOTTOM PAGE EDITS */}
            <section id="pricing" style={{
                padding: '8rem 2rem',
                background: 'linear-gradient(to bottom, var(--bg-primary), #000000)',
                textAlign: 'center',
                borderTop: '1px solid var(--border-color)'
            }}>
                <h2 style={{ marginBottom: '1rem' }}>Transparent Pricing</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 5rem auto' }}>
                    Choose the plan that fits your growth stage. No hidden fees.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2.5rem',
                    maxWidth: '1280px',
                    margin: '0 auto'
                }}>
                    {/* Starter */}
                    <div className="pricing-card" style={{
                        background: 'var(--bg-surface)',
                        padding: '3rem',
                        borderRadius: '24px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'left',
                        transition: 'transform 0.3s ease'
                    }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Starter</h3>
                        <div style={{ fontSize: '3.5rem', fontWeight: '700', margin: '1.5rem 0', color: 'white', letterSpacing: '-0.02em' }}>$49<span style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', fontWeight: '400' }}>/mo</span></div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', color: 'var(--text-secondary)', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li>✓ 500 Credits / month</li>
                            <li>✓ Basic Email Support</li>
                            <li>✓ CSV Export</li>
                        </ul>
                        <button onClick={() => handlePurchase('Starter')} className="cta-button" style={{ width: '100%', background: 'transparent', color: 'white', border: '1px solid var(--border-color)' }}>Get Started</button>
                    </div>

                    {/* Pro - Gold Highlight */}
                    <div className="pricing-card" style={{
                        background: 'linear-gradient(145deg, #111111, #050505)',
                        padding: '3rem',
                        borderRadius: '24px',
                        border: '1px solid var(--brand-gold)',
                        textAlign: 'left',
                        position: 'relative',
                        boxShadow: '0 0 40px -10px rgba(212, 175, 55, 0.15)'
                    }}>
                        <div style={{
                            position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%) translateY(-50%)',
                            background: 'var(--brand-gold)', color: 'black', padding: '6px 16px', borderRadius: '20px',
                            fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase'
                        }}>Most Popular</div>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--brand-gold)' }}>Pro Growth</h3>
                        <div style={{ fontSize: '3.5rem', fontWeight: '700', margin: '1.5rem 0', color: 'white', letterSpacing: '-0.02em' }}>$149<span style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', fontWeight: '400' }}>/mo</span></div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', color: 'var(--text-secondary)', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li>✓ <span style={{ color: 'white' }}>2,500 Credits</span> / month</li>
                            <li>✓ <b>CRM Integration (HubSpot)</b></li>
                            <li>✓ API Access & Webhooks</li>
                            <li>✓ Priority 24/7 Support</li>
                        </ul>
                        <button onClick={() => handlePurchase('Pro')} className="cta-button" style={{
                            width: '100%',
                            background: 'var(--brand-gold)',
                            color: 'black',
                            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                        }}>Start Free Trial</button>
                    </div>

                    {/* Enterprise */}
                    <div className="pricing-card" style={{
                        background: 'var(--bg-surface)',
                        padding: '3rem',
                        borderRadius: '24px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'left'
                    }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Enterprise</h3>
                        <div style={{ fontSize: '3.5rem', fontWeight: '700', margin: '1.5rem 0', color: 'white', letterSpacing: '-0.02em' }}>Custom</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', color: 'var(--text-secondary)', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li>✓ Unlimited Volume</li>
                            <li>✓ Dedicated Account Manager</li>
                            <li>✓ Custom AI Models</li>
                            <li>✓ SSO & Advanced Security</li>
                        </ul>
                        <button className="cta-button" style={{ width: '100%', background: 'white', color: 'black', fontWeight: '700' }}>Contact Sales</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
