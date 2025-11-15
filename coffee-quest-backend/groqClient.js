// groqClient.js
// Groq SDK client wrapper for Coffee Quest backend

const Groq = require("groq-sdk");
require("dotenv").config();

if (!process.env.GROQ_API_KEY) {
  console.warn(
    "⚠️ GROQ_API_KEY is not set. AI routes will fail until this is configured."
  );
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

module.exports = groq;
