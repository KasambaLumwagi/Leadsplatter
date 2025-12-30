# Leadsplatter | Enterprise-Grade AI Lead Gen

The complete infrastructure for B2B lead generation, enrichment, and CRM synchronization.

## 🚀 Features
- **AI-Powered Lead Scoring**: Uses Llama 3 (via Hugging Face) to qualify prospects.
- **CRM Sync**: Native integrations with HubSpot.
- **Real-Time Analytics**: Dashboard with SQLite persistence.
- **Monetization Ready**: Tiered pricing structure prepared for Stripe integration.

## 🛠 Tech Stack
- **Frontend**: React, Vite, Recharts, Lucide Icons
- **Backend**: Node.js, Express
- **Database**: SQLite (Production-ready via volume mounting)
- **Email**: Nodemailer (SMTP)

## 📦 Deployment Instructions

### Option 1: Docker (Recommended)
This repo includes a production-ready `Dockerfile`.

1. **Build the Image**
   ```bash
   docker build -t leadsplatter .
   ```

2. **Run the Container**
   ```bash
   docker run -p 3000:3000 \
     -e VITE_HUBSPOT_ACCESS_TOKEN=your_token \
     -e VITE_HUGGING_FACE_TOKEN=your_token \
     leadsplatter
   ```

### Option 2: VPS / Railway / Render
1. Push this repo to GitHub.
2. Connect your account (e.g., in Render, select "New Web Service").
3. Set the Build Command: `npm install && npm run build`
4. Set the Start Command: `node server.js`
5. Add your Environment Variables in the dashboard.

## 🔑 Environment Variables
Create a `.env` file in the root:
```env
VITE_HUBSPOT_ACCESS_TOKEN=pat-eu1-...
VITE_HUGGING_FACE_TOKEN=hf_...
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@email.com
SMTP_PASS=your_app_password
```

## 💰 Monetization
To enable real payments:
1. Sign up for [Stripe](https://stripe.com).
2. Get your Publishable/Secret keys.
3. Update `server.js` `create-checkout-session` endpoint with the official Stripe Node.js library.
