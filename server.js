import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- SERVICES ---

// Mock Email Service for Drip Campaign
const sendDripCampaign = (email, name) => {
    console.log(`[DRIP-SYSTEM] Scheduling welcome email for ${email}...`);

    // Simulate immediate Welcome Email
    setTimeout(() => {
        console.log(`
       ---------------------------------------------------
       [EMAIL SENT] To: ${email}
       Subject: Welcome to Leadsplatter! 🚀
       Body: Hi ${name || 'there'}, 
             Thanks for joining. Here is your free guide to AI Lead Gen.
             (Day 1 Content)
       ---------------------------------------------------
       `);
    }, 2000);

    // Simulate Day 3 Follow-up
    console.log(`[DRIP-SYSTEM] Queued 'Case Studies' email for ${email} in 3 days.`);
};

// --- ROUTES ---

// 1. CRM Lead Capture Route (HubSpot)
app.post('/api/crm/lead', async (req, res) => {
    try {
        const { email, phone, company } = req.body;

        // Basic validation
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const hubspotData = {
            properties: {
                email,
                phone,
                company,
                lastname: "Lead (Leadsplatter)",
                lifecyclestage: "lead"
            }
        };

        const response = await axios.post('https://api.hubapi.com/crm/v3/objects/contacts', hubspotData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.VITE_HUBSPOT_ACCESS_TOKEN}`
            }
        });

        // Trigger Retention Flow
        // We use the company name or email as a fallback name since we don't ask for First Name specifically yet
        sendDripCampaign(email, company);

        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error('HubSpot Error:', error.response?.data || error.message);

        // Handle specific HubSpot error (e.g., Contact already exists)
        if (error.response?.status === 409) {
            return res.status(409).json({ error: 'Contact already exists' });
        }

        res.status(500).json({ error: 'Failed to save lead to CRM' });
    }
});

// 2. AI Chatbot Route (Hugging Face)
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const MODEL_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";

        const response = await axios.post(MODEL_URL, {
            inputs: `You are a helpful sales assistant for Leadsplatter, a B2B lead generation tool. Answer the user clearly and concisely.\nUser: ${message}\nAssistant:`,
            parameters: {
                return_full_text: false,
                max_new_tokens: 150,
                temperature: 0.7
            }
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.VITE_HUGGING_FACE_TOKEN}`,
                "Content-Type": "application/json",
            }
        });

        // Hugging Face returns an array
        const botText = response.data[0]?.generated_text || "I couldn't generate a response.";

        res.json({ response: botText.trim() });

    } catch (error) {
        console.error('AI Error:', error.response?.data || error.message);

        // Check for model loading error (common with free tier)
        if (error.response?.data?.error?.includes('loading')) {
            return res.status(503).json({ error: 'Model is loading, please try again in 20 seconds.' });
        }

        res.status(500).json({ error: 'Failed to generate AI response' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
