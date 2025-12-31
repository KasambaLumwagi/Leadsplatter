import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { initDb, addLead, getAnalytics } from './database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import basicAuth from 'express-basic-auth';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// Initialize Stripe if key is present, otherwise null.
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Initialize DB
initDb();

// --- MIDDLEWARE ---
app.use(helmet()); // Security Headers
app.use(cors());
app.use(express.json());

// Rate Limiter: 100 requests per 15 mins
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Serve Static Files (Vite Build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));

// --- SERVICES ---

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

// 2. Analytics (SECURED)
// Uses Basic Auth: admin / password (from .env or default)
const authMiddleware = basicAuth({
    users: { [process.env.DASHBOARD_USER || 'admin']: process.env.DASHBOARD_PASS || 'admin' },
    challenge: true // Browse will prompt for login
});

app.get('/api/analytics', authMiddleware, async (req, res) => {
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
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
});

// 4. Stripe Checkout (REAL)
app.post('/api/create-checkout-session', async (req, res) => {
    const { plan } = req.body;
    let priceId;

    // Define price IDs (In production, use Stripe Dashboard IDs like 'price_123...')
    // For this demo, we create one-time mock prices or use test IDs if provided.
    if (plan === 'Starter') priceId = 'price_1Q...'; // Replace with real ID
    if (plan === 'Pro') priceId = 'price_1Q...';

    // If no key is set or stripe didn't initialize, fallback to mock
    if (!process.env.STRIPE_SECRET_KEY || !stripe) {
        return res.json({ url: 'https://checkout.stripe.com/test-link-mock' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (e.g. pr_1234) of the product you want to sell
                    price: priceId || 'price_12345',
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `http://localhost:3000/?success=true`,
            cancel_url: `http://localhost:3000/?canceled=true`,
        });
        res.json({ url: session.url });
    } catch (err) {
        console.error('Stripe Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Handle SPA Routing
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
