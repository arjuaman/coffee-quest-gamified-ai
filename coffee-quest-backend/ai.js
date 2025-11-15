// ai.js - AI logic for Coffee Quest (Groq-powered)

const groq = require("./groqClient");
const { brandConfig } = require("./brandConfig");

const MODEL_NAME = "llama-3.3-70b-versatile"; // Groq model

function safeJsonParse(text, contextLabel = "AI response") {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error(`Failed to parse JSON for ${contextLabel}:`, err);
    console.error("Raw text:", text);
    throw new Error(`Could not parse ${contextLabel} as JSON.`);
  }
}

/**
 * Generate a full gamified experience for a given user and campaign goal,
 * informed by the current brandConfig.
 *
 * @param {object} user - user profile object
 * @param {string} campaignGoal - e.g. "increase-order-value"
 * @param {object} overrideBrandConfig - optional brandConfig override
 */
async function generateExperienceWithAI(
  user,
  campaignGoal,
  overrideBrandConfig
) {
  const cfg = overrideBrandConfig || brandConfig;

  const systemMessage = `
You are the AI game designer for "Coffee Quest", a gamified loyalty experience
for a premium Indian coffee subscription brand.

BRAND CONFIG:
- Brand name: ${cfg.brandName}
- Market: ${cfg.market}
- Tone: ${cfg.tone}
- Theme: ${cfg.theme}
- Primary objectives: ${(cfg.primaryObjectives || []).join(", ")}

Reward pool examples (you may reference or echo their spirit, but you don't have to copy exactly):
${JSON.stringify(cfg.rewardPool || [], null, 2)}

Guardrails (must follow):
${cfg.guardrails}

When choosing a reward:
- Prefer a mix of reward types over time (not always discounts).
- Align the reward type with the campaignGoal:
  - increase-order-value → cart boosters, add-on discounts, free shipping.
  - drive-new-product-trial → single-origin promos, samplers, early access.
  - boost-social-shares → badges, UGC-based bonuses, refer-a-friend perks.
  - reactivate-lapsed-user → comeback boosts, welcome-back discounts.
  - collect-preferences → content rewards, guides, brew-alongs, badges.
- Feel free to create new on-brand reward labels based on these patterns.

You design a DAILY QUEST that should optimise for a marketing goal (campaignGoal)
such as:
- "increase-order-value"
- "boost-social-shares"
- "drive-new-product-trial"
- "reactivate-lapsed-user"
- "collect-preferences"

You MUST respond in VALID JSON ONLY (no extra commentary, no markdown).

Your response MUST be a JSON object with EXACTLY this shape:

{
  "narrative": "string",
  "challenge": {
    "title": "string",
    "description": "string",
    "successCriteria": "string",
    "xpReward": number,
    "bonusPoints": number
  },
  "reward": {
    "type": "discount | exclusive-content | early-access | badge | comeback | other",
    "label": "string",
    "code": "string or null",
    "description": "string",
    "conditions": "string"
  },
  "progress": {
    "level": number,
    "points": number,
    "streakDays": number
  }
}
`;

  const userMessage = `
Here is the user profile JSON:

${JSON.stringify(user, null, 2)}

Here is the campaign goal for this quest:
${campaignGoal || cfg.defaultCampaignGoal || "increase-order-value"}

Use:
- The user profile (demographics, preferences, behaviour, loyalty)
- The campaign goal
- The brandConfig (tone, theme, objectives, guardrails, reward pool)

to design a DAILY quest that feels:
- Highly personalised for THIS user
- On-brand for ${cfg.brandName}
- Aligned with the given marketing goal
- Ethically respectful (no manipulation, no guilt-tripping)

Respond with JSON ONLY, matching the required shape exactly.
`;

  const completion = await groq.chat.completions.create({
    model: MODEL_NAME,
    temperature: 0.9,
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage }
    ]
  });

  const text = completion.choices?.[0]?.message?.content;
  if (!text) {
    console.error("Empty AI response for experience:", completion);
    throw new Error("AI response was empty for experience generation.");
  }

  const parsed = safeJsonParse(text, "experience");

  // Fill in sane defaults if something is missing instead of crashing
  const experience = {
    narrative: parsed.narrative || "",
    challenge: {
      title: parsed.challenge?.title || "Daily Coffee Quest",
      description:
        parsed.challenge?.description ||
        "Complete today’s coffee journey to unlock a reward.",
      successCriteria:
        parsed.challenge?.successCriteria ||
        "Follow the quest instructions inside the app.",
      xpReward:
        typeof parsed.challenge?.xpReward === "number"
          ? parsed.challenge.xpReward
          : 50,
      bonusPoints:
        typeof parsed.challenge?.bonusPoints === "number"
          ? parsed.challenge.bonusPoints
          : 10
    },
    reward: {
      type: parsed.reward?.type || "discount",
      label: parsed.reward?.label || "Special Coffee Perk",
      code: parsed.reward?.code ?? null,
      description:
        parsed.reward?.description ||
        "A personalised perk for completing today’s quest.",
      conditions:
        parsed.reward?.conditions ||
        "Valid for a limited time. See campaign details."
    },
    progress: {
      level:
        typeof parsed.progress?.level === "number"
          ? parsed.progress.level
          : 1,
      points:
        typeof parsed.progress?.points === "number"
          ? parsed.progress.points
          : 0,
      streakDays:
        typeof parsed.progress?.streakDays === "number"
          ? parsed.progress.streakDays
          : 0
    }
  };

  if (!experience.narrative) {
    console.warn("Experience narrative missing, using fallback.");
    experience.narrative =
      "Your coffee journey continues today. Complete the quest to unlock a personalised perk.";
  }

  return experience;
}

/**
 * Take an already-generated experience (narrative, challenge, reward, progress)
 * and turn it into channel-ready content:
 * - email campaign
 * - push notification
 * - in-app banner/card
 * - reward configuration brief
 */
async function generateChannelAssets(experience) {
  const cfg = brandConfig;

  const systemMessage = `
You are a lifecycle marketing copywriter and CRM strategist for a premium Indian coffee subscription brand.

You are given:
- brandConfig: tone, theme, market, guardrails
- a generated "Coffee Quest" experience for a single user:
  - narrative (story)
  - challenge (title, description, success criteria, XP/points)
  - reward (type, label, description, conditions)
  - progress (level, points, streak)

Your task:
1. Turn this into READY-TO-USE channel assets:
   - Email campaign
   - Push notification
   - In-app banner/card

2. Also output a "rewardConfig" object that a CRM/loyalty manager can plug into
   their system (promo name, type, value, expiry etc).

Follow brandConfig tone and guardrails.
Always be transparent, never manipulative.

Return ONLY valid JSON with this exact shape:

{
  "email": {
    "subject": "string",
    "previewText": "string",
    "bodyText": "string"
  },
  "push": {
    "title": "string",
    "body": "string"
  },
  "inApp": {
    "heading": "string",
    "body": "string",
    "ctaLabel": "string"
  },
  "rewardConfig": {
    "internalName": "string",
    "type": "string",
    "value": "string",
    "conditions": "string",
    "expiryDays": number
  }
}
`;

  const userMessage = `
BRAND CONFIG:
${JSON.stringify(cfg, null, 2)}

EXPERIENCE JSON:
${JSON.stringify(experience, null, 2)}

Generate channel assets that:
- Match the narrative and challenge
- Use the reward details appropriately
- Feel on-brand for ${cfg.brandName}
- Are appropriate for Indian coffee subscribers

Remember: JSON only, matching the specified shape exactly.
`;

  const completion = await groq.chat.completions.create({
    model: MODEL_NAME,
    temperature: 0.85,
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage }
    ]
  });

  const text = completion.choices?.[0]?.message?.content;
  if (!text) {
    console.error("Empty channel assets response:", completion);
    throw new Error("AI response was empty for channel assets.");
  }

  const parsed = safeJsonParse(text, "channel assets");

  // Soft validation + defaults instead of hard failure
  const assets = {
    email: {
      subject: parsed.email?.subject || "Your Coffee Quest for Today",
      previewText:
        parsed.email?.previewText ||
        "Unlock a personalised coffee challenge and reward.",
      bodyText:
        parsed.email?.bodyText ||
        "Hi there,\n\nYour Coffee Quest is ready. Open the app to see your challenge and reward.\n\nHappy brewing!"
    },
    push: {
      title: parsed.push?.title || "Your Coffee Quest Awaits",
      body:
        parsed.push?.body ||
        "Open the app to see today’s coffee challenge and your personalised perk."
    },
    inApp: {
      heading: parsed.inApp?.heading || "Today’s Coffee Quest",
      body:
        parsed.inApp?.body ||
        "Complete the quest to unlock a perk tailored to your taste.",
      ctaLabel: parsed.inApp?.ctaLabel || "View quest"
    },
    rewardConfig: {
      internalName:
        parsed.rewardConfig?.internalName || "coffee-quest-daily-perk",
      type: parsed.rewardConfig?.type || (experience.reward?.type || "discount"),
      value:
        parsed.rewardConfig?.value ||
        experience.reward?.label ||
        "Personalised perk",
      conditions:
        parsed.rewardConfig?.conditions ||
        experience.reward?.conditions ||
        "See campaign terms in-app.",
      expiryDays:
        typeof parsed.rewardConfig?.expiryDays === "number"
          ? parsed.rewardConfig.expiryDays
          : 7
    }
  };

  return assets;
}

module.exports = {
  generateExperienceWithAI,
  generateChannelAssets
};
