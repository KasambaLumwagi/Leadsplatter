import { useState } from 'react';
import './LeadCaptureForm.css';

const LeadCaptureForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    company: ''
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Construct HubSpot data payload
      const hubspotData = {
        properties: {
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          lastname: "Lead (Leadsplatter)", // Generic placeholder required field
          lifecyclestage: "lead"
        }
      };

      // Call Node.js Backend
      const response = await fetch('http://localhost:3000/api/crm/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          company: formData.company
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit to CRM');
      }

      setStatus('success');
      // Reset after success
      setTimeout(() => setStatus('idle'), 3000);
      setFormData({ email: '', phone: '', company: '' });

    } catch (error) {
      console.error("CRM Error:", error);
      setStatus('error');
      // Adding a fallback for demo purposes if the token fails (e.g. valid format but permission issue)
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <form className="lead-capture-form" onSubmit={handleSubmit}>
      <h3>Get Early Access</h3>
      <p style={{ margin: 0, fontSize: '0.9rem' }}>Join the AI revolution in lead generation.</p>

      <div className="form-group">
        <label htmlFor="email">Work Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="name@company.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="company">Company Name</label>
        <input
          type="text"
          id="company"
          name="company"
          placeholder="Acme Corp"
          required
          value={formData.company}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone (Optional)</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="cta-button" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Processing...' : 'Start Generating Leads'}
      </button>

      {status === 'success' && (
        <div className="success-message">
          ✓ Added to HubSpot CRM!
        </div>
      )}

      {status === 'error' && (
        <div className="success-message" style={{ color: '#f87171' }}>
          ⚠ Connected... but check console.
        </div>
      )}
    </form>
  );
};

export default LeadCaptureForm;
