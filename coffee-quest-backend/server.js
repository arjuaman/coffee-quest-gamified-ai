require("dotenv").config({ path: __dirname + "/.env", override: true });
const { generateExperienceWithAI } = require("./ai");
const express = require("express");
const cors = require("cors");
const { users } = require("./data/users");
const { brandConfig, saveBrandConfigToFile } = require("./brandConfig");


const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;

// -------------------------------
// Confirm OpenAI Key is Loaded
// -------------------------------
if (process.env.OPENAI_API_KEY) {
  console.log("🔐 OpenAI API Key Loaded: YES");
  console.log("Key Prefix:", process.env.OPENAI_API_KEY.slice(0, 4) + "...");
} else {
  console.log("❌ OpenAI API Key Loaded: NO");
  console.log("Please set OPENAI_API_KEY in your .env file.");
}

// -------------------------------
// Health Check
// -------------------------------
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "coffee-quest-backend" });
});

// -------------------------------
// Get All Sample Users
// -------------------------------
app.get("/api/users", (req, res) => {
  res.json(users);
});

// -------------------------------
// Generate AI-Personalized Experience
// -------------------------------
app.post("/api/experience", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`Generating AI experience for user: ${user.name}`);

    const aiResult = await generateExperienceWithAI(user);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        segment: user.segment,
        city: user.city,
      },
      narrative: aiResult.narrative,
      challenge: aiResult.challenge,
      reward: aiResult.reward,
      progress: aiResult.progress,
    });
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({
      error: "AI generation failed. Check server logs and API key.",
    });
  }
});

// NEW: fully custom experience using user input from frontend
app.post("/api/experience/custom", async (req, res) => {
  try {
    const { user, goal } = req.body;

    if (!user || !user.name) {
      return res.status(400).json({ error: "User profile is required." });
    }

    console.log(
      `Generating custom AI experience for user: ${user.name}, goal: ${goal}`
    );

    const aiResult = await generateExperienceWithAI(
      user,
      goal || "increase-order-value"
    );

    res.json({
      user: {
        id: user.id || null,
        name: user.name,
        segment: user.segment,
        city: user.city,
      },
      narrative: aiResult.narrative,
      challenge: aiResult.challenge,
      reward: aiResult.reward,
      progress: aiResult.progress,
    });
  } catch (err) {
    console.error("Custom AI Generation Error:", err);
    res.status(500).json({
      error: "AI generation failed for custom user. Check logs.",
    });
  }
});

// Generate AI experiences for multiple users (batch simulation)
app.post("/api/experience/batch", async (req, res) => {
  try {
    const { users: batchUsers, goal } = req.body;

    if (!Array.isArray(batchUsers) || batchUsers.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide a non-empty 'users' array." });
    }

    console.log(
      `Running batch simulation for ${batchUsers.length} users, goal: ${goal}`
    );

    // Run sequentially to be gentle on the API and easier to debug
    const results = [];
    for (const user of batchUsers) {
      try {
        const aiResult = await generateExperienceWithAI(
          user,
          goal || "increase-order-value"
        );
        results.push({
          success: true,
          user: {
            name: user.name,
            city: user.city,
            segment: user.segment
          },
          narrative: aiResult.narrative,
          challenge: aiResult.challenge,
          reward: aiResult.reward,
          progress: aiResult.progress
        });
      } catch (err) {
        console.error(`Batch AI error for user ${user.name}:`, err.message);
        results.push({
          success: false,
          user: {
            name: user.name,
            city: user.city,
            segment: user.segment
          },
          error: "AI generation failed for this user."
        });
      }
    }

    res.json({ results });
  } catch (err) {
    console.error("Batch generation error:", err);
    res.status(500).json({ error: "Batch AI generation failed." });
  }
});


// Get current brand config
app.get("/api/brand-config", (req, res) => {
  res.json(brandConfig);
});

// Update brand config (partial update)
app.put("/api/brand-config", (req, res) => {
  try {
    const newConfig = req.body || {};
    saveBrandConfigToFile(newConfig);
    res.json(brandConfig);
  } catch (err) {
    console.error("Brand config update error:", err.message);
    res.status(500).json({ error: "Failed to update brand config." });
  }
});


// -------------------------------
// Start Server
// -------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Coffee Quest backend running at http://localhost:${PORT}`);
});
