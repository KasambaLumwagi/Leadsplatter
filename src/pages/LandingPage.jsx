import { useRef, useEffect } from 'react';
import LeadCaptureForm from '../components/LeadCaptureForm';

const LandingPage = () => {
    const heroRef = useRef(null);
    const formRef = useRef(null);

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <section className="hero-section" ref={heroRef} style={{ marginTop: '2rem' }}>
                <div className="hero-content fade-in" style={{ animationDelay: '0.1s' }}>
                    <span className="hero-tag">Artificial Intelligence Lead Gen</span>
                    <h1>
                        Supercharge Your <br />
                        <span className="gradient-text">B2B Growth</span>
                    </h1>
                    <p className="hero-description">
                        Stop chasing dead ends. Our AI identifies and qualifies high-intent leads across
                        global markets, integrating directly with your CRM for seamless outreach.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            TRUSTED BY 500+ ENTERPRISES
                        </div>
                    </div>
                </div>

                <div className="hero-form-wrapper fade-in" style={{ animationDelay: '0.3s' }} ref={formRef}>
                    <LeadCaptureForm />
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
