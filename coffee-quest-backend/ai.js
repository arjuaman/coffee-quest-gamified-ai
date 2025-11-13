// ai.js - Chat Completions based AI logic (with campaign goal)

const client = require("./openaiClient");

const MODEL_NAME = "gpt-4.1-mini";

/**
 * Generate a full gamified experience for a given user and campaign goal.
 * @param {object} user - user profile object
 * @param {string} campaignGoal - e.g. "increase-order-value", "boost-social-shares"
 */
async function generateExperienceWithAI(user, campaignGoal) {
  const systemMessage = `
You are the AI game designer for "Coffee Quest", a gamified loyalty experience
for a premium Indian coffee subscription brand (like Blue Tokai / Third Wave, etc.).

Market:
- India (urban coffee culture, metros, students, young professionals).

Tone:
- Playful, warm, premium, a bit coffee-nerdy but approachable.

Theme:
- Coffee journeys, roastery realms, brew mastery, streaks, points.

You design a DAILY QUEST that should also optimise for a marketing goal
(campaignGoal) such as:
- "increase-order-value" (nudging user to add more / higher-value items)
- "boost-social-shares" (encourage sharing / UGC)
- "drive-new-product-trial" (get them to try something new)
- "reactivate-lapsed-user" (if they've been inactive)
- "collect-preferences" (encourage quizzes / profile completion)

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
${campaignGoal || "increase-order-value"}

Use:
- The user profile (demographics, preferences, behaviour, loyalty)
- The campaign goal

to design a DAILY quest that feels:
- Highly personalised
- Aligned with Indian coffee culture
- Aligned with the given marketing goal

Respond with JSON ONLY, matching the required shape exactly.
`;

  const completion = await client.chat.completions.create({
    model: MODEL_NAME,
    temperature: 0.9,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
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

module.exports = {
  generateExperienceWithAI,
};
