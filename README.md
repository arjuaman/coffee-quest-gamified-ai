# ☕ Coffee Quest — GenAI-Powered Gamified Loyalty MVP

**Coffee Quest** is a fully working MVP of a **gamified, AI-personalized loyalty experience** built for a **Premium Coffee Subscription Brand** in India.
It features a **React frontend**, a **Node.js/Express backend**, and a modular “AI-ready” engine for generating personalized narratives, challenges, and rewards.

This project demonstrates how brands can use **GenAI + gamification** to deepen engagement, grow loyalty, and increase conversions.

---

## 🚀 Features

### ✅ **Frontend (React)**

* Beautiful dark roasted UI
* Persona selection
* “Generate Today’s Coffee Quest” button
* Displays:

  * Personalized **Narrative**
  * Personalized **Challenge**
  * Personalized **Reward**
  * Dynamic **Progress Update**
* Fully responsive
* Styled for premium-brand aesthetics (coffee-themed gradients + soft shadows)

### ✅ **Backend (Node.js + Express)**

* `/api/users`: Simulated user profiles
* `/api/experience`: Generates:

  * Coffee-themed narrative
  * Daily challenge
  * Personalized reward
  * Updated user progression
* AI logic built modularly (`ai.js`) with dedicated LLM hook points
* CORS enabled

### ✅ **AI-Ready Architecture**

Works out-of-the-box using rule-based personalization, but includes clean, commented integration points for:

* OpenAI / Anthropic models
* Local LLMs
* RAG-based personalization
* Embedding-based similarity lookups

---

## 🧱 Project Structure

```
.
├── coffee-quest-backend/        # Express server + AI logic
│   ├── server.js
│   ├── ai.js
│   └── data/
│       └── users.js
│
└── coffee-quest-frontend/       # React frontend UI
    ├── src/
    │   ├── App.js
    │   ├── styles.css
    │   └── index.js
    └── public/
```

---

## 🛠️ Tech Stack

### **Frontend**

* React (CRA)
* CSS (custom, premium dark theme)
* Fetch API

### **Backend**

* Node.js
* Express
* CORS
* dotenv (optional for LLM keys)

### **AI Layer**

* Currently rule-based
* LLM integration placeholders included

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

## 2. Install & Run Backend

```bash
cd coffee-quest-backend
npm install
npm start
```

Backend runs on:

```
http://localhost:5001
```

Test it directly:

```
http://localhost:5001/api/users
```

You should see a list of sample users.

---

## 3. Install & Run Frontend

In another terminal:

```bash
cd coffee-quest-frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

# 🎮 Using the App

1. Open the frontend in your browser
2. Choose a persona (Aarav, Isha, Vikram)
3. Click **Generate Today’s Coffee Quest**
4. Watch:

   * A personalized **story snippet**
   * A personalized **challenge**
   * A tailored **reward**
   * Updated **experience progression**

Feels like a premium Indian coffee brand with AI superpowers.

---

# 🤖 LLM Integration (Optional)

Inside `coffee-quest-backend/ai.js` you will find:

```js
// TODO: plug LLM here
```

You can integrate:

```js
const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

And replace any generator with:

```js
const response = await client.chat.completions.create({
  model: "gpt-4.1",
  messages: [{ role: "user", content: prompt }],
});
```

Return:

```js
response.choices[0].message.content
```

Strip or parse as needed.

---

# 🌟 Roadmap

### 🔜 Short-Term

* [ ] Persistent user progress (SQLite or PostgreSQL)
* [ ] Daily missions and streak system
* [ ] Reward wallet & claim system
* [ ] Coffee quiz inside frontend

### 🤖 Medium-Term (AI)

* [ ] Full LLM-generated narratives & challenges
* [ ] Coffee preference embeddings
* [ ] RAG retrieval of brand product data
* [ ] Personalized discount code system

### 🔥 Long-Term Vision

* AR-based coffee tasting
* Brew-along guided sessions
* Multi-player “brew battles”
* Integration with IoT smart brewers
* Mobile app (React Native)

---

# 📸 Screenshots (To be added later)



---

# 🛡️ License

MIT — free to use, modify, fork.

---

