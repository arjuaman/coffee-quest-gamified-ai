// brandConfig.js
const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "brandConfig.json");

let brandConfig = {
  brandName: "Roastery Realm Coffee",
  market:
    "Urban Indian coffee drinkers in metros like Bengaluru, Mumbai, Delhi, Pune",
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
      id: "discount15-new-origin",
      type: "discount",
      label: "15% off this month’s single-origin",
      description:
        "Encourages upgrading to a more premium or new single-origin.",
      conditions: "Applicable only on featured single-origin SKUs."
    },
    {
      id: "free-shipping-weekend",
      type: "discount",
      label: "Free shipping weekend",
      description: "Removes friction for topping up subscriptions.",
      conditions: "Valid on orders above ₹699, this weekend only."
    },
    {
      id: "guide-pourover",
      type: "exclusive-content",
      label: "Pour-over Mastery Mini Guide",
      description: "Short, practical video + steps for perfect pour-over.",
      conditions: "Unlocked after completing a discovery challenge."
    },
    {
      id: "brew-along-session",
      type: "exclusive-content",
      label: "Live Brew-Along Session invite",
      description:
        "Join our barista for a live Zoom session on better home brewing.",
      conditions: "Limited seats; requires RSVP from the quest screen."
    },
    {
      id: "early-single-origin",
      type: "early-access",
      label: "Early access to next single-origin drop",
      description: "Reserve a limited micro-lot before it goes public.",
      conditions: "Limited quantity, 48-hour early window."
    },
    {
      id: "badge-espresso-ace",
      type: "badge",
      label: "Espresso Ace badge",
      description:
        "Profile badge for completing multiple espresso-related quests.",
      conditions: "Purely cosmetic, shows on profile and leaderboard."
    },
    {
      id: "badge-south-indian-legend",
      type: "badge",
      label: "South Indian Legend badge",
      description:
        "For users who complete a filter-coffee-centric quest series.",
      conditions: "Unlock after 3 South Indian filter challenges."
    },
    {
      id: "comeback-boost",
      type: "comeback",
      label: "Welcome Back Boost",
      description:
        "Extra loyalty points for returning after a break and completing a quest.",
      conditions: "For users inactive for 21+ days."
    },
    {
      id: "refer-friend-bonus",
      type: "other",
      label: "Refer-a-friend bonus",
      description:
        "Bonus points or discount unlocked if they share the quest and a friend orders.",
      conditions:
        "Reward is granted when referred friend places an order above a threshold."
    },
    {
      id: "mystery-sampler",
      type: "other",
      label: "Mystery sampler add-on",
      description:
        "Small sampler of a surprise coffee with their next order to spark discovery.",
      conditions: "Available once per user per season."
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
