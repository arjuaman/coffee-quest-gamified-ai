// ai.js

// In a real setup, you would import and configure your LLM client here
// e.g. OpenAI, local LLM, etc.
// const OpenAI = require("openai");
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function generateChallenge(user) {
  const { name, preferences, behavior, loyalty } = user;

  // Simple personalization
  const favDrink = preferences.favDrinks[0];
  const method = preferences.brewMethods[0];
  const isLapsed = behavior.lastOrderDaysAgo > 7;

  let missionTitle = "";
  let missionText = "";
  let targetAction = "";

  if (isLapsed) {
    missionTitle = "Revive Your Brew Streak";
    missionText = `Hey ${name}, your coffee streak is calling! Explore our latest ${preferences.roast} roast and add any ${favDrink} blend to your cart. Complete the checkout to revive your streak and unlock bonus points.`;
    targetAction = "Complete a purchase with any recommended coffee from the dashboard.";
  } else if (loyalty.level >= 4) {
    missionTitle = "Brew Master Challenge";
    missionText = `You’re already a pro, ${name}. Today’s challenge: brew a cup using your ${method}, then explore a new single-origin on our store and add it to your wishlist.`;
    targetAction = "Add at least one new single-origin to your wishlist.";
  } else {
    missionTitle = "Discover Your Signature Cup";
    missionText = `Let’s find your perfect brew, ${name}. Take today’s quick flavour quiz, then try any recommended ${favDrink} from our curated list.`;
    targetAction = "Complete the in-app flavour quiz and view at least one product detail page.";
  }

  return {
    title: missionTitle,
    description: missionText,
    successCriteria: targetAction,
    xpReward: 150,
    bonusPoints: isLapsed ? 250 : 100
  };
}

function generateNarrative(user) {
  const { name, segment, city, loyalty } = user;
  const level = loyalty.level;

  if (level <= 2) {
    return `Welcome to the Roastery Realm, ${name}. You’ve just unlocked the first gates of the Coffee Quest. From the bustle of ${city}, your journey begins with simple beans and big curiosity. Every sip you choose today helps shape your personal brew story.`;
  } else if (level <= 4) {
    return `${name}, the roastery crew now recognises you as a serious brewer. In the mid-level chambers, your choices unlock hidden tasting notes and limited micro-lots. Today, the beans whisper of new experiments waiting in your cart.`;
  } else {
    return `The Roastery Council greets you, ${name}. As a high-tier Coffee Keeper, your palate helps decide the future of upcoming Indian-origin blends. One more challenge completed today, and a secret batch may be revealed only to you.`;
  }
}

function generateReward(user) {
  const { name, preferences, behavior, loyalty } = user;
  const pref = preferences.rewardPreference;
  const highSpender = behavior.typicalCartValue >= 1500;
  const lapsed = behavior.lastOrderDaysAgo > 10;

  if (pref === "discount") {
    const discount = highSpender ? 20 : 10;
    return {
      type: "discount",
      label: `${discount}% off on your next bag`,
      code: `BREW${discount}`,
      description: `Nice going, ${name}! Use this personalised code to get ${discount}% off on any coffee beans in your next order.`,
      conditions: "Valid for 3 days on coffee beans only."
    };
  }

  if (pref === "exclusive-content") {
    return {
      type: "exclusive-content",
      label: "Unlock a Guided Brew Session",
      code: null,
      description: `You’ve unlocked an exclusive step-by-step brew guide tailored to your taste profile. Learn how to perfect your next pour-over in under 10 minutes.`,
      conditions: "Available in your ‘Brew Academy’ section."
    };
  }

  if (pref === "early-access" || loyalty.level >= 4) {
    return {
      type: "early-access",
      label: "Early Access: Limited Single-Origin",
      code: null,
      description: `Because your taste is legendary, ${name}, you get early access to our next limited single-origin drop. Reserve your bag before it goes public.`,
      conditions: "Limited quantity; early access window 48 hours."
    };
  }

  // Fallback reward for lapsed users
  if (lapsed) {
    return {
      type: "comeback",
      label: "Welcome Back Perk",
      code: "WELCOME-BACK",
      description: `We’ve missed you, ${name}. Here’s free shipping on your next order if you complete today’s quest.`,
      conditions: "Valid for 1 order over ₹500."
    };
  }

  // Generic fallback
  return {
    type: "badge",
    label: "Roastery Explorer Badge",
    code: null,
    description: `You’ve earned a new profile badge for completing today’s quest. Flaunt it in the community leaderboard.`,
    conditions: "Visible on your profile immediately."
  };
}

// OPTIONAL: Example LLM hook pattern (pseudo-code)
/*
async function generateWithLLM(user, type) {
  const prompt = `You are designing a ${type} for a gamified coffee subscription app in India...
  User JSON:
  ${JSON.stringify(user, null, 2)}
  Respond with a short, engaging, coffee-themed ${type}.`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return response.choices[0].message.content;
}
*/

module.exports = {
  generateChallenge,
  generateNarrative,
  generateReward
};
