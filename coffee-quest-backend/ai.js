// ai.js - Chat Completions based AI logic

const client = require("./openaiClient");

// Cheap, strong, and available model
const MODEL_NAME = "gpt-4.1-mini";

/**
 * Generate a full gamified experience for a given user using the LLM.
 * Returns: { narrative, challenge, reward, progress }
 */
async function generateExperienceWithAI(user) {
  const systemMessage = `
You are the AI game designer for "Coffee Quest", a gamified loyalty experience
for a premium Indian coffee subscription brand (like Blue Tokai / Third Wave, etc.).

Rules:
- Market: India.
- Tone: playful, warm, premium, a bit coffee-nerdy but approachable.
- Theme: coffee journeys, roastery realms, brew mastery, streaks, points.
- Make everything feel like it's part of an Indian urban coffee culture.

The app is generating a personalised DAILY QUEST for one user.
You must respond in VALID JSON ONLY (no extra commentary).

Use the user JSON and their behaviour / preferences to:
- Craft a short narrative (2–4 sentences).
- Create a challenge that drives brand actions (view products, add to cart, checkout, share, quiz, etc.).
- Create a reward aligned with rewardPreference when possible.
- Slightly advance their progression (points, streak).

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
Here is the user profile and behaviour JSON:

${JSON.stringify(user, null, 2)}

Generate a single personalised DAILY quest for THIS user only.
Remember: respond with JSON ONLY (no markdown, no explanation, no extra keys).
`;

  // Call Chat Completions with JSON response enforced
  const completion = await client.chat.completions.create({
    model: MODEL_NAME,
    temperature: 0.9,
    response_format: { type: "json_object" }, // ensures valid JSON
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

  // Basic sanity checks so frontend doesn't crash
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
