import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { initDb, addLead, getAnalytics } from './database.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize DB
initDb();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Files (Vite Build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));

// --- SERVICES ---

// Real Email Service (Nodemailer) - Configured for Production
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendDripCampaign = async (email, name) => {
    console.log(`[DRIP-SYSTEM] Scheduling email for ${email}...`);
    if (!process.env.SMTP_USER) return;

    try {
        await transporter.sendMail({
            from: `"Leadsplatter Team" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Welcome to Leadsplatter! 🚀",
            text: `Hi ${name || 'there'},\n\nThanks for joining. Here is your free guide to AI Lead Gen.\n\nBest,\nLeadsplatter Team`,
            html: `<b>Hi ${name || 'there'},</b><br><br>Thanks for joining. Here is your free guide to <i>AI Lead Gen</i>.<br><br>Best,<br>Leadsplatter Team`
        });
    } catch (error) {
        console.error('[DRIP-SYSTEM] ❌ Failed to send email:', error.message);
    }
};

// --- ROUTES ---

// 1. CRM Lead Capture
app.post('/api/crm/lead', async (req, res) => {
    try {
        const { email, phone, company } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        await addLead(email, company, phone);

        if (process.env.VITE_HUBSPOT_ACCESS_TOKEN) {
            try {
                await axios.post('https://api.hubapi.com/crm/v3/objects/contacts', {
                    properties: { email, phone, company, lastname: "Lead", lifecyclestage: "lead" }
                }, {
                    headers: { 'Authorization': `Bearer ${process.env.VITE_HUBSPOT_ACCESS_TOKEN}` }
                });
            } catch (hubErr) {
                console.error('HubSpot Sync Failed:', hubErr.message);
            }
        }

        sendDripCampaign(email, company);
        res.status(200).json({ success: true, message: 'Lead captured' });
    } catch (error) {
        console.error('System Error:', error);
        res.status(500).json({ error: 'Failed to process lead' });
    }
});

// 2. Analytics
app.get('/api/analytics', async (req, res) => {
    try {
        const stats = await getAnalytics();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// 3. AI Chatbot
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await axios.post("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
            inputs: `You are a helpful sales assistant for Leadsplatter. Answer concisely.\nUser: ${message}\nAssistant:`,
            parameters: { return_full_text: false, max_new_tokens: 150, temperature: 0.7 }
        }, {
            headers: { "Authorization": `Bearer ${process.env.VITE_HUGGING_FACE_TOKEN}` }
        });
        res.json({ response: response.data[0]?.generated_text || "I couldn't generate a response." });
    } catch (error) {
        if (error.response?.data?.error?.includes('loading')) {
            return res.status(503).json({ error: 'Model is loading, please try again.' });
        }
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
});

// Mock Stripe Checkout Endpoint
app.post('/api/create-checkout-session', async (req, res) => {
    // In real life, use: const session = await stripe.checkout.sessions.create(...)
    res.json({ url: 'https://checkout.stripe.com/test-link' });
});

// Handle SPA Routing (Always return index.html for unknown routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
