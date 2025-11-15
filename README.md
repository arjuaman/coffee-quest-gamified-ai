# ☕ Coffee Quest — AI-Powered Gamified Marketing Engine  
**Personalized, dynamic, gamified marketing campaigns… powered by GenAI.**

Coffee Quest is a full-stack prototype demonstrating how brands can deliver *hyper-personalized*, *gamified*, and *AI-generated* daily experiences to customers.  
The system dynamically generates **quests**, **narratives**, **rewards**, and **channel-ready marketing content** using OpenAI models — all wrapped in a modern, interactive UI.

This project is built for:
- Product & growth teams exploring AI-driven personalization  
- Marketers and loyalty teams designing gamified experiences  
- Developers evaluating how to integrate LLMs into real-time user journeys  
- Innovators exploring the future of CRM, loyalty, and lifecycle marketing  

---

## 🚀 Features

### 🎮 **AI-Generated Gamified Experiences**
- Generates a unique daily quest for any user.
- Includes narrative, challenge, reward, and progression.
- Dynamically adapts based on profile, preferences, behavior.

### 🧠 **Brand Config Engine**
A full CMS-style panel where marketers define:
- Brand tone  
- Campaign objectives  
- Reward pool  
- Behavioral guardrails  
- Narrative theme  

The AI then generates personalized quests fully aligned with brand identity.

### 📬 **Channel Content Generator**
Transforms a quest into:
- Email subject + body  
- Push notification title + message  
- In-app banner headline + CTA  
- Reward configuration metadata  

### 🔄 **Simulation Lab**
Upload a CSV of users to:
- Generate quests in batch  
- Preview segment-level differences  
- Test campaign goals across cohorts  

---

## 🧱 Architecture Overview

Coffee Quest is a single Render-hosted web service:

Frontend (React SPA)
↓ served by
Backend (Node + Express)
↓ calls
OpenAI API (LLM generation)


### Frontend (React)
- Single-page application  
- Hero section with dynamic “Today’s Quest”  
- Experience Builder  
- Brand Config panel  
- Simulation Lab  
- Channel Content output cards  

### Backend (Express)
- `/api/experience/custom`  
- `/api/experience/batch`  
- `/api/experience/channel-assets`  
- `/api/brand-config` (GET/PUT)  
- OpenAI completion logic with JSON-safe parsing  

---

## 🛠️ Tech Stack
- **Frontend:** React, TailwindCSS, CSV parser  
- **Backend:** Node.js, Express  
- **AI:** OpenAI `gpt-4.1-mini`  
- **Hosting:** Render Web Service  
- **Storage:** JSON persistence (brand config)  

---

## 📦 Project Structure

coffee-quest/
│
├── coffee-quest-frontend/
│ ├── src/
│ ├── public/
│ └── build/ (auto-generated)
│
└── coffee-quest-backend/
├── server.js
├── ai.js
├── brandConfig.js
├── brandConfig.json
├── openaiClient.js
├── data/
└── .env (local only)


---

## ⚙️ Local Development Setup

### 1. Clone the repo
bash
git clone https://github.com/<yourname>/coffee-quest.git
cd coffee-quest

### 2. Setup the frontend
cd coffee-quest-frontend
npm install
npm start

### 3. Setup the backend
cd ../coffee-quest-backend
npm install

Create .env:
OPENAI_API_KEY=your_key_here
PORT=5001

Start backend:
npm start

Visit:
👉 http://localhost:3000
 (dev)
👉 http://localhost:5001
 (prod-style)

## 🚀 Deploying to Render

### Build Command
cd coffee-quest-frontend && npm install && npm run build && cd ../coffee-quest-backend && npm install

### Start Command
cd coffee-quest-backend && npm start

Add environment variables on Render:
OPENAI_API_KEY=sk-...
NODE_ENV=production

## 🌱 Future Enhancements

Multi-day narrative arcs
Automated cohort insights
A/B testing for challenge difficulty
Integrations: Klaviyo, MoEngage, Braze
Full loyalty engine (badges, XP store, levels)
Marketplace for brand modules (e.g., Fitness Quest, Finance Quest)
