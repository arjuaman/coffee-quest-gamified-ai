// ai.js - Chat Completions based AI logic (with campaign goal + brand config)

const client = require("./openaiClient");
const { brandConfig } = require("./brandConfig");

const MODEL_NAME = "gpt-4.1-mini";

/**
 * Generate a full gamified experience for a given user and campaign goal,
 * informed by the current brandConfig.
 *
 * @param {object} user - user profile object
 * @param {string} campaignGoal - e.g. "increase-order-value"
 * @param {object} overrideBrandConfig - optional brandConfig override (usually not needed)
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
When choosing a reward:
- Prefer a mix of reward types over time (not always discounts).
- Align the reward type with the campaignGoal:
  - increase-order-value → cart boosters, add-on discounts, free shipping.
  - drive-new-product-trial → single-origin promos, samplers, early access.
  - boost-social-shares → badges, UGC-based bonuses, refer-a-friend perks.
  - reactivate-lapsed-user → comeback boosts, welcome-back discounts.
  - collect-preferences → content rewards, guides, brew-alongs, badges.
- Feel free to create new on-brand reward labels based on these patterns.


Guardrails (must follow):
${cfg.guardrails}

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

  const completion = await client.chat.completions.create({
    model: MODEL_NAME,
    temperature: 0.9,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage }
    ]
  });

  const text = completion.choices?.[0]?.message?.content;
  if (!text) {
    console.error("Empty AI response:", completion);
    throw new Error("AI response was empty.");
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI JSON:", err, "Raw text:", text);
    throw new Error("AI response could not be parsed as JSON.");
  }

  if (
    !parsed.narrative ||
    !parsed.challenge ||
    !parsed.reward ||
    !parsed.progress
  ) {
    console.error("AI JSON missing required fields:", parsed);
    throw new Error("AI response missing required fields.");
  }

  return parsed;
}

/**
 * Take an already-generated experience (narrative, challenge, reward, progress)
 * and turn it into channel-ready content:
 * - email campaign copy
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

Remember: JSON only, matching the specified shape.
`;

  const completion = await client.chat.completions.create({
    model: MODEL_NAME,
    temperature: 0.9,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage }
    ]
  });

  const text = completion.choices?.[0]?.message?.content;
  if (!text) {
    console.error("Empty channel assets response:", completion);
    throw new Error("AI response was empty.");
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse channel assets JSON:", err, "Raw:", text);
    throw new Error("Channel assets JSON parse error.");
  }

  if (!parsed.email || !parsed.push || !parsed.inApp || !parsed.rewardConfig) {
    console.error("Channel assets missing keys:", parsed);
    throw new Error("Channel assets missing required keys.");
  }

  return parsed;
}

module.exports = {
  generateExperienceWithAI,
  generateChannelAssets
};
