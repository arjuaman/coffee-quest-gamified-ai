// brandConfig.js
const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "brandConfig.json");

let brandConfig = {
  brandName: "Roastery Realm Coffee",
  market: "Urban Indian coffee drinkers in metros like Bengaluru, Mumbai, Delhi, Pune",
  tone: "playful, warm, premium, coffee-nerdy but approachable",
  theme: "coffee journeys, roastery realms, brew mastery, streaks, points",
  defaultCampaignGoal: "increase-order-value",
  primaryObjectives: [
    "increase-order-value",
    "drive-new-product-trial",
    "boost-social-shares"
  ],
  rewardPool: [
    {
      id: "discount10",
      type: "discount",
      label: "10% off any coffee bag",
      description: "Gentle nudge to add one more bag to the cart.",
      conditions: "Valid on coffee beans only, for 3 days."
    },
    {
      id: "guide-pourover",
      type: "exclusive-content",
      label: "Pour-over Mastery Mini Guide",
      description: "Short, practical video + steps for perfect pour-over.",
      conditions: "Unlocked after completing a discovery challenge."
    },
    {
      id: "early-single-origin",
      type: "early-access",
      label: "Early access to next single-origin drop",
      description: "Reserve a limited micro-lot before it goes public.",
      conditions: "Limited quantity, 48-hour early window."
    }
  ],
  guardrails:
    "Avoid manipulative language. Do not guilt-trip the user. Stay respectful, friendly, and transparent about rewards and conditions."
};

function loadBrandConfigFromFile() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, "utf8");
      const parsed = JSON.parse(raw);
      brandConfig = { ...brandConfig, ...parsed };
      console.log("✅ Loaded brandConfig from brandConfig.json");
    } else {
      console.log("ℹ️ brandConfig.json not found, using default config.");
    }
  } catch (err) {
    console.error("⚠️ Failed to load brandConfig.json:", err.message);
  }
}

function saveBrandConfigToFile(newConfig) {
  brandConfig = { ...brandConfig, ...newConfig };
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(brandConfig, null, 2), "utf8");
    console.log("✅ Saved brandConfig to brandConfig.json");
  } catch (err) {
    console.error("⚠️ Failed to save brandConfig.json:", err.message);
  }
}

loadBrandConfigFromFile();

module.exports = {
  brandConfig,
  saveBrandConfigToFile
};
