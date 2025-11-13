const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/.env", override: true });

console.log("CWD:", process.cwd());
console.log("__dirname:", __dirname);

const fs = require("fs");
try {
  const envContent = fs.readFileSync(__dirname + "/.env", "utf8");
  console.log("RAW .env content below:");
  console.log(envContent);
} catch (e) {
  console.log("Could not read .env:", e.message);
}

console.log("DEBUG: has key?", Object.prototype.hasOwnProperty.call(process.env, "OPENAI_API_KEY"));
console.log("DEBUG: value JSON:", JSON.stringify(process.env.OPENAI_API_KEY));
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
