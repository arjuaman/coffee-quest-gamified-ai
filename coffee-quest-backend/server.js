// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { users } = require("./data/users");
const {
  generateChallenge,
  generateNarrative,
  generateReward
} = require("./ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "coffee-quest-backend" });
});

// Get available sample users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Generate personalised experience for a given user
app.post("/api/experience", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Rule-based personalization (MVP)
    const narrative = generateNarrative(user);
    const challenge = generateChallenge(user);
    const reward = generateReward(user);

    // Simulated progression
    const progress = {
      level: user.loyalty.level,
      points: user.loyalty.points + challenge.bonusPoints,
      streakDays: user.loyalty.streakDays + 1
    };

    res.json({
      user: {
        id: user.id,
        name: user.name,
        segment: user.segment,
        city: user.city
      },
      narrative,
      challenge,
      reward,
      progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Coffee Quest backend running on http://localhost:${PORT}`);
});
