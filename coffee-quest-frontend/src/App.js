import React, { useEffect, useState } from "react";
import "./styles.css";

const API_BASE = "http://localhost:5001";

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1);

  return rows.map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const rowObj = {};
    headers.forEach((h, i) => {
      rowObj[h] = cols[i] ?? "";
    });

    return {
      name: rowObj.name || "Unknown",
      city: rowObj.city || "",
      segment: rowObj.segment || "Urban Millennial Professional",
      preferences: {
        roast: rowObj.roast || "medium",
        favDrinks: [rowObj.favDrink || "latte"],
        sweetness: rowObj.sweetness || "medium",
        rewardPreference: rowObj.rewardPreference || "discount",
        brewMethods: [rowObj.brewMethod || "french-press"]
      },
      behavior: {
        avgMonthlyOrders: Number(rowObj.avgMonthlyOrders || 0),
        lastOrderDaysAgo: Number(rowObj.lastOrderDaysAgo || 0),
        typicalCartValue: Number(rowObj.typicalCartValue || 0)
      },
      loyalty: {
        level: Number(rowObj.loyaltyLevel || 1),
        points: Number(rowObj.loyaltyPoints || 0),
        streakDays: Number(rowObj.streakDays || 0)
      }
    };
  });
}

function App() {
  // "page" selection like a website
  const [activeSection, setActiveSection] = useState("builder"); // 'builder' | 'brand' | 'simulation'

  // Brand config
  const [brandConfig, setBrandConfig] = useState(null);
  const [loadingBrand, setLoadingBrand] = useState(true);
  const [savingBrand, setSavingBrand] = useState(false);
  const [brandError, setBrandError] = useState("");
  const [heroQuest, setHeroQuest] = useState(null);
const [heroLoading, setHeroLoading] = useState(false);
const [channelAssets, setChannelAssets] = useState(null);
const [channelLoading, setChannelLoading] = useState(false);
const [channelError, setChannelError] = useState("");

function copyToClipboard(text) {
  if (!text) return;
  navigator.clipboard?.writeText(text).catch((err) =>
    console.error("Clipboard error:", err)
  );
}

async function handleGenerateChannelAssets() {
  if (!experience) {
    setChannelError("Generate a quest first.");
    return;
  }
  setChannelError("");
  setChannelAssets(null);
  setChannelLoading(true);

  try {
    const res = await fetch(`${API_BASE}/api/experience/channel-assets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experience })
    });

    const data = await res.json();
    if (!res.ok) {
      setChannelError(data.error || "Failed to generate channel assets.");
    } else {
      setChannelAssets(data);
    }
  } catch (err) {
    console.error(err);
    setChannelError("Could not connect to backend.");
  } finally {
    setChannelLoading(false);
  }
}


  // Experience builder
  const [profile, setProfile] = useState({
    name: "",
    city: "",
    segment: "Urban Millennial Professional",
    roast: "medium",
    favDrink: "latte",
    sweetness: "medium",
    brewMethod: "french-press",
    rewardPreference: "discount",
    avgMonthlyOrders: 2,
    lastOrderDaysAgo: 7,
    typicalCartValue: 800,
    loyaltyLevel: 1,
    loyaltyPoints: 0,
    streakDays: 0
  });
  const [goal, setGoal] = useState("increase-order-value");
  const [experience, setExperience] = useState(null);
  const [expLoading, setExpLoading] = useState(false);
  const [expError, setExpError] = useState("");

  // Simulation
  const [simGoal, setSimGoal] = useState("increase-order-value");
  const [simUsers, setSimUsers] = useState([]);
  const [simResults, setSimResults] = useState([]);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState("");

  // ---------- Brand Config Logic ----------

  useEffect(() => {
    async function fetchBrandConfig() {
      setLoadingBrand(true);
      setBrandError("");
      try {
        const res = await fetch(`${API_BASE}/api/brand-config`);
        const data = await res.json();
        setBrandConfig(data);
      } catch (err) {
        console.error(err);
        setBrandError("Failed to load brand config.");
      } finally {
        setLoadingBrand(false);
      }
    }
    fetchBrandConfig();
  }, []);

  useEffect(() => {
  async function fetchHeroQuest() {
    setHeroLoading(true);
    try {
      const demoUser = {
        name: "Aarav",
        city: "Bengaluru",
        segment: "Urban Millennial Professional",
        preferences: {
          roast: "medium-dark",
          favDrinks: ["cold brew"],
          sweetness: "low",
          rewardPreference: "discount",
          brewMethods: ["aeropress"]
        },
        behavior: {
          avgMonthlyOrders: 3,
          lastOrderDaysAgo: 5,
          typicalCartValue: 1200
        },
        loyalty: {
          level: 3,
          points: 1450,
          streakDays: 4
        }
      };

      const res = await fetch(`${API_BASE}/api/experience/custom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: demoUser,
          goal: "drive-new-product-trial"
        })
      });

      const data = await res.json();
      if (res.ok) {
        setHeroQuest(data);
      }
    } catch (err) {
      console.error("Hero quest error:", err);
    } finally {
      setHeroLoading(false);
    }
  }

  fetchHeroQuest();
}, []);


  function updateBrand(field, value) {
    setBrandConfig((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveBrand(e) {
    e.preventDefault();
    if (!brandConfig) return;
    setSavingBrand(true);
    setBrandError("");
    try {
      const res = await fetch(`${API_BASE}/api/brand-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandConfig)
      });
      const data = await res.json();
      if (!res.ok) {
        setBrandError(data.error || "Failed to save brand config.");
      } else {
        setBrandConfig(data);
      }
    } catch (err) {
      console.error(err);
      setBrandError("Could not connect to backend.");
    } finally {
      setSavingBrand(false);
    }
  }

  // ---------- Experience Builder Logic ----------

  function updateProfile(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleGenerate(e) {
    e.preventDefault();
    setExpError("");
    setExperience(null);

    if (!profile.name || !profile.city) {
      setExpError("Please enter at least a name and city.");
      return;
    }

    setExpLoading(true);
    try {
      const userPayload = {
        name: profile.name,
        city: profile.city,
        segment: profile.segment,
        preferences: {
          roast: profile.roast,
          favDrinks: [profile.favDrink],
          sweetness: profile.sweetness,
          rewardPreference: profile.rewardPreference,
          brewMethods: [profile.brewMethod]
        },
        behavior: {
          avgMonthlyOrders: Number(profile.avgMonthlyOrders) || 0,
          lastOrderDaysAgo: Number(profile.lastOrderDaysAgo) || 0,
          typicalCartValue: Number(profile.typicalCartValue) || 0
        },
        loyalty: {
          level: Number(profile.loyaltyLevel) || 1,
          points: Number(profile.loyaltyPoints) || 0,
          streakDays: Number(profile.streakDays) || 0
        }
      };

      const res = await fetch(`${API_BASE}/api/experience/custom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userPayload, goal })
      });

      const data = await res.json();
      if (!res.ok) {
        setExpError(data.error || "Something went wrong.");
      } else {
        setExperience(data);
      }
    } catch (err) {
      console.error(err);
      setExpError("Could not connect to backend.");
    } finally {
      setExpLoading(false);
    }
  }

  // ---------- Simulation Logic ----------

  function handleCsvFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSimError("");
    setSimUsers([]);
    setSimResults([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const users = parseCsv(text);
      if (users.length === 0) {
        setSimError("No valid rows found in CSV.");
      } else {
        setSimUsers(users);
      }
    };
    reader.readAsText(file);
  }

  async function handleRunSimulation(e) {
    e.preventDefault();
    setSimError("");
    setSimResults([]);

    if (simUsers.length === 0) {
      setSimError("Upload a CSV with at least one user.");
      return;
    }

    setSimLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/experience/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: simUsers, goal: simGoal })
      });

      const data = await res.json();
      if (!res.ok) {
        setSimError(data.error || "Simulation failed.");
      } else {
        setSimResults(data.results || []);
      }
    } catch (err) {
      console.error(err);
      setSimError("Could not connect to backend.");
    } finally {
      setSimLoading(false);
    }
  }

  // ---------- Section Renderers ----------

  function renderBuilderSection() {
    return (
      <section className="section section--builder">
        <div className="section-header">
          <h2>Design a personalised Coffee Quest</h2>
          <p>
            Enter a user profile and a campaign goal. The AI will generate a
            narrative, challenge, reward and progression tailored to them.
          </p>
        </div>

        <div className="builder-layout">
          <div className="panel panel--form">
            {expError && <p className="error">{expError}</p>}
            <form className="profile-grid" onSubmit={handleGenerate}>
              <div className="field-group">
                <label>Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile("name", e.target.value)}
                  placeholder="e.g. Aarav"
                />
              </div>

              <div className="field-group">
                <label>City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => updateProfile("city", e.target.value)}
                  placeholder="e.g. Bengaluru"
                />
              </div>

              <div className="field-group">
                <label>Segment</label>
                <select
                  value={profile.segment}
                  onChange={(e) => updateProfile("segment", e.target.value)}
                >
                  <option>Urban Millennial Professional</option>
                  <option>Health-Conscious Student</option>
                  <option>Coffee Connoisseur</option>
                  <option>Remote Worker</option>
                  <option>Weekend Café Hopper</option>
                </select>
              </div>

              <div className="field-group">
                <label>Preferred Roast</label>
                <select
                  value={profile.roast}
                  onChange={(e) => updateProfile("roast", e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="medium-dark">Medium-Dark</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="field-group">
                <label>Favourite Drink</label>
                <select
                  value={profile.favDrink}
                  onChange={(e) => updateProfile("favDrink", e.target.value)}
                >
                  <option value="latte">Latte</option>
                  <option value="cold brew">Cold Brew</option>
                  <option value="filter coffee">Filter Coffee</option>
                  <option value="espresso">Espresso</option>
                  <option value="oat milk latte">Oat Milk Latte</option>
                </select>
              </div>

              <div className="field-group">
                <label>Sweetness</label>
                <select
                  value={profile.sweetness}
                  onChange={(e) =>
                    updateProfile("sweetness", e.target.value)
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="field-group">
                <label>Brew Method</label>
                <select
                  value={profile.brewMethod}
                  onChange={(e) =>
                    updateProfile("brewMethod", e.target.value)
                  }
                >
                  <option value="french-press">French Press</option>
                  <option value="aeropress">Aeropress</option>
                  <option value="v60">V60</option>
                  <option value="espresso-machine">Espresso Machine</option>
                  <option value="south-indian-filter">
                    South Indian Filter
                  </option>
                </select>
              </div>

              <div className="field-group">
                <label>Reward Preference</label>
                <select
                  value={profile.rewardPreference}
                  onChange={(e) =>
                    updateProfile("rewardPreference", e.target.value)
                  }
                >
                  <option value="discount">Discounts</option>
                  <option value="exclusive-content">
                    Guides / Content
                  </option>
                  <option value="early-access">Early Access Drops</option>
                  <option value="badge">Badges & Status</option>
                </select>
              </div>

              <div className="field-group">
                <label>Avg Monthly Orders</label>
                <input
                  type="number"
                  value={profile.avgMonthlyOrders}
                  onChange={(e) =>
                    updateProfile("avgMonthlyOrders", e.target.value)
                  }
                />
              </div>

              <div className="field-group">
                <label>Days Since Last Order</label>
                <input
                  type="number"
                  value={profile.lastOrderDaysAgo}
                  onChange={(e) =>
                    updateProfile("lastOrderDaysAgo", e.target.value)
                  }
                />
              </div>

              <div className="field-group">
                <label>Typical Cart Value (₹)</label>
                <input
                  type="number"
                  value={profile.typicalCartValue}
                  onChange={(e) =>
                    updateProfile("typicalCartValue", e.target.value)
                  }
                />
              </div>

              <div className="field-group">
                <label>Loyalty Level</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={profile.loyaltyLevel}
                  onChange={(e) =>
                    updateProfile("loyaltyLevel", e.target.value)
                  }
                />
              </div>

              <div className="field-group">
                <label>Loyalty Points</label>
                <input
                  type="number"
                  value={profile.loyaltyPoints}
                  onChange={(e) =>
                    updateProfile("loyaltyPoints", e.target.value)
                  }
                />
              </div>

              <div className="field-group">
                <label>Streak Days</label>
                <input
                  type="number"
                  value={profile.streakDays}
                  onChange={(e) =>
                    updateProfile("streakDays", e.target.value)
                  }
                />
              </div>

              <div className="field-group field-group--goal">
                <label>Campaign Goal for Today</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option value="increase-order-value">
                    Increase order value
                  </option>
                  <option value="drive-new-product-trial">
                    Drive new product trial
                  </option>
                  <option value="boost-social-shares">
                    Boost social shares / UGC
                  </option>
                  <option value="collect-preferences">
                    Collect more preferences
                  </option>
                  <option value="reactivate-lapsed-user">
                    Reactivate a lapsed user
                  </option>
                </select>
              </div>

              <div className="field-group field-group--button">
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={expLoading}
                >
                  {expLoading
                    ? "Brewing your quest..."
                    : "Generate Coffee Quest"}
                </button>
              </div>
            </form>
          </div>

          <div className="panel panel--preview">
            <div className="grid">
              <div className="card card--wide">
                <h3>Story</h3>
                {experience ? (
                  <p>{experience.narrative}</p>
                ) : (
                  <p className="placeholder">
                    Generate a quest to see a personalised narrative for this
                    user.
                  </p>
                )}
              </div>

              <div className="card">
                <h3>Challenge</h3>
                {experience ? (
                  <>
                    <h4>{experience.challenge.title}</h4>
                    <p>{experience.challenge.description}</p>
                    <p className="meta">
                      <strong>Success:</strong>{" "}
                      {experience.challenge.successCriteria}
                    </p>
                    <p className="meta">
                      <strong>Rewards:</strong>{" "}
                      {experience.challenge.xpReward} XP ·{" "}
                      {experience.challenge.bonusPoints} bonus points
                    </p>
                  </>
                ) : (
                  <p className="placeholder">
                    Challenge details will appear here.
                  </p>
                )}
              </div>

              <div className="card">
                <h3>Reward</h3>
                {experience ? (
                  <>
                    <h4>{experience.reward.label}</h4>
                    <p>{experience.reward.description}</p>
                    {experience.reward.code && (
                      <p className="meta">
                        <strong>Code:</strong> {experience.reward.code}
                      </p>
                    )}
                    <p className="meta">
                      <strong>Conditions:</strong>{" "}
                      {experience.reward.conditions}
                    </p>
                  </>
                ) : (
                  <p className="placeholder">
                    The tailored reward structure will show up here.
                  </p>
                )}
              </div>

              <div className="card">
                <h3>Progress</h3>
                {experience ? (
                  <div className="progress">
                    <div className="progress-row">
                      <span>Level</span>
                      <span className="pill">
                        Lv. {experience.progress.level}
                      </span>
                    </div>
                    <div className="progress-row">
                      <span>Total Points</span>
                      <span>{experience.progress.points}</span>
                    </div>
                    <div className="progress-row">
                      <span>Streak</span>
                      <span>{experience.progress.streakDays} days</span>
                    </div>
                  </div>
                ) : (
                  <p className="placeholder">
                    Progression suggestions will appear once a quest is
                    generated.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="panel panel--channels">
  <div className="channels-header">
    <div>
      <h3>Channel Content & Next Steps</h3>
      <p>
        Turn this quest into ready-to-send assets for email, push and in-app.
        Use the reward config brief to set things up in your CRM/loyalty tools.
      </p>
    </div>
    <button
      className="primary-btn"
      onClick={handleGenerateChannelAssets}
      disabled={!experience || channelLoading}
    >
      {channelLoading ? "Generating content..." : "Generate Channel Content"}
    </button>
  </div>

  {channelError && <p className="error">{channelError}</p>}

  {!channelAssets && !channelError && !channelLoading && (
    <p className="placeholder">
      Generate a quest, then click &quot;Generate Channel Content&quot; to see
      email, push and in-app copy.
    </p>
  )}

  {channelAssets && (
    <div className="channels-grid">
      {/* Email */}
      <div className="card">
        <div className="card-header-row">
          <h4>Email campaign</h4>
          <button
            type="button"
            className="chip-button"
            onClick={() =>
              copyToClipboard(
                `Subject: ${channelAssets.email.subject}\nPreview: ${channelAssets.email.previewText}\n\n${channelAssets.email.bodyText}`
              )
            }
          >
            Copy email
          </button>
        </div>
        <p className="meta">
          <strong>Subject:</strong> {channelAssets.email.subject}
        </p>
        <p className="meta">
          <strong>Preview:</strong> {channelAssets.email.previewText}
        </p>
        <p>{channelAssets.email.bodyText}</p>
      </div>

      {/* Push */}
      <div className="card">
        <div className="card-header-row">
          <h4>Push notification</h4>
          <button
            type="button"
            className="chip-button"
            onClick={() =>
              copyToClipboard(
                `${channelAssets.push.title} — ${channelAssets.push.body}`
              )
            }
          >
            Copy push
          </button>
        </div>
        <p className="meta">
          <strong>Title:</strong> {channelAssets.push.title}
        </p>
        <p>{channelAssets.push.body}</p>
      </div>

      {/* In-app */}
      <div className="card">
        <div className="card-header-row">
          <h4>In-app banner/card</h4>
          <button
            type="button"
            className="chip-button"
            onClick={() =>
              copyToClipboard(
                `${channelAssets.inApp.heading}\n${channelAssets.inApp.body}\nCTA: ${channelAssets.inApp.ctaLabel}`
              )
            }
          >
            Copy in-app
          </button>
        </div>
        <p className="meta">
          <strong>Heading:</strong> {channelAssets.inApp.heading}
        </p>
        <p>{channelAssets.inApp.body}</p>
        <p className="meta">
          <strong>CTA:</strong> {channelAssets.inApp.ctaLabel}
        </p>
      </div>

      {/* Reward config */}
      <div className="card">
        <div className="card-header-row">
          <h4>Reward config (for CRM/loyalty)</h4>
          <button
            type="button"
            className="chip-button"
            onClick={() =>
              copyToClipboard(JSON.stringify(channelAssets.rewardConfig, null, 2))
            }
          >
            Copy JSON
          </button>
        </div>
        <p className="meta">
          <strong>Internal name:</strong>{" "}
          {channelAssets.rewardConfig.internalName}
        </p>
        <p className="meta">
          <strong>Type:</strong> {channelAssets.rewardConfig.type}
        </p>
        <p className="meta">
          <strong>Value:</strong> {channelAssets.rewardConfig.value}
        </p>
        <p className="meta">
          <strong>Conditions:</strong>{" "}
          {channelAssets.rewardConfig.conditions}
        </p>
        <p className="meta">
          <strong>Suggested expiry:</strong>{" "}
          {channelAssets.rewardConfig.expiryDays} days
        </p>
      </div>
      <div className="card card--helper">
  <h3>What do I do with this quest?</h3>
  <ul>
    <li>Paste the email copy into your ESP (Klaviyo, Mailchimp, etc.).</li>
    <li>Use the push text in your app / notifications system.</li>
    <li>Use the in-app copy for a home screen banner or quest card.</li>
    <li>
      Configure the reward in your CRM/loyalty platform using the rewardConfig
      brief.
    </li>
    <li>
      Use the Simulation Lab tab to see how this goal behaves for a whole
      cohort.
    </li>
  </ul>
</div>

    </div>
  )}
</div>

      </section>
    );
  }

  function renderBrandSection() {
    return (
      <section className="section">
        <div className="section-header">
          <h2>Brand Config</h2>
          <p>
            Define how your coffee brand speaks, feels and rewards. The AI uses
            this configuration to stay on-brand in every quest.
          </p>
        </div>

        <div className="panel">
          {loadingBrand ? (
            <p>Loading brand config...</p>
          ) : !brandConfig ? (
            <p className="error">
              {brandError || "No brand configuration found."}
            </p>
          ) : (
            <form className="brand-grid" onSubmit={handleSaveBrand}>
              {brandError && <p className="error">{brandError}</p>}

              <div className="field-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  value={brandConfig.brandName || ""}
                  onChange={(e) => updateBrand("brandName", e.target.value)}
                />
              </div>

              <div className="field-group field-group--wide">
                <label>Market</label>
                <textarea
                  rows={2}
                  value={brandConfig.market || ""}
                  onChange={(e) => updateBrand("market", e.target.value)}
                />
              </div>

              <div className="field-group field-group--wide">
                <label>Tone</label>
                <textarea
                  rows={2}
                  value={brandConfig.tone || ""}
                  onChange={(e) => updateBrand("tone", e.target.value)}
                />
              </div>

              <div className="field-group field-group--wide">
                <label>Theme</label>
                <textarea
                  rows={2}
                  value={brandConfig.theme || ""}
                  onChange={(e) => updateBrand("theme", e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Default Campaign Goal</label>
                <input
                  type="text"
                  value={brandConfig.defaultCampaignGoal || ""}
                  onChange={(e) =>
                    updateBrand("defaultCampaignGoal", e.target.value)
                  }
                />
              </div>

              <div className="field-group field-group--wide">
                <label>Primary Objectives (comma separated)</label>
                <input
                  type="text"
                  value={(brandConfig.primaryObjectives || []).join(", ")}
                  onChange={(e) =>
                    updateBrand(
                      "primaryObjectives",
                      e.target.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </div>

              <div className="field-group field-group--wide">
                <label>Guardrails</label>
                <textarea
                  rows={3}
                  value={brandConfig.guardrails || ""}
                  onChange={(e) => updateBrand("guardrails", e.target.value)}
                />
              </div>

              <div className="field-group field-group--button">
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={savingBrand}
                >
                  {savingBrand ? "Saving..." : "Save Brand Config"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    );
  }

  function renderSimulationSection() {
    return (
      <section className="section">
        <div className="section-header">
          <h2>Simulation Lab</h2>
          <p>
            Upload a CSV of users and see how the AI would personalise quests
            for an entire cohort under a single campaign goal.
          </p>
        </div>

        <div className="panel">
          {simError && <p className="error">{simError}</p>}
          <form className="sim-grid" onSubmit={handleRunSimulation}>
            <div className="field-group field-group--wide">
              <label>Upload Users CSV</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
              />
              <p className="helper">
                Expected columns:{" "}
                <code>
                  name, city, segment, roast, favDrink, sweetness, brewMethod,
                  rewardPreference, avgMonthlyOrders, lastOrderDaysAgo,
                  typicalCartValue, loyaltyLevel, loyaltyPoints, streakDays
                </code>
              </p>
              {simUsers.length > 0 && (
                <p className="meta">
                  Parsed <strong>{simUsers.length}</strong> users from CSV.
                </p>
              )}
            </div>

            <div className="field-group">
              <label>Campaign Goal</label>
              <select
                value={simGoal}
                onChange={(e) => setSimGoal(e.target.value)}
              >
                <option value="increase-order-value">
                  Increase order value
                </option>
                <option value="drive-new-product-trial">
                  Drive new product trial
                </option>
                <option value="boost-social-shares">
                  Boost social shares / UGC
                </option>
                <option value="collect-preferences">
                  Collect more preferences
                </option>
                <option value="reactivate-lapsed-user">
                  Reactivate lapsed users
                </option>
              </select>
            </div>

            <div className="field-group field-group--button">
              <button
                type="submit"
                className="primary-btn"
                disabled={simLoading || simUsers.length === 0}
              >
                {simLoading ? "Running simulation..." : "Run Simulation"}
              </button>
            </div>
          </form>

          {simResults.length > 0 && (
            <div className="sim-results">
              <h3>Simulation Results</h3>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>City</th>
                    <th>Segment</th>
                    <th>Challenge</th>
                    <th>Reward</th>
                    <th>Level · Points · Streak</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {simResults.map((r, idx) => (
                    <tr key={idx}>
                      <td>{r.user?.name}</td>
                      <td>{r.user?.city}</td>
                      <td>{r.user?.segment}</td>
                      <td>{r.challenge?.title || "—"}</td>
                      <td>{r.reward?.label || "—"}</td>
                      <td>
                        {r.progress
                          ? `Lv. ${r.progress.level} · ${r.progress.points} pts · ${r.progress.streakDays}d`
                          : "—"}
                      </td>
                      <td className={r.success ? "status-ok" : "status-fail"}>
                        {r.success ? "OK" : "Failed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ---------- Main ----------

  const brandName = brandConfig?.brandName || "Coffee Quest";

  return (
    <div className="app">
      <div className="app-shell">
        <header className="site-header">
          <div className="site-logo">
            <span className="logo-mark">☕</span>
            <div>
              <div className="logo-title">{brandName}</div>
              <div className="logo-sub">
                Gamified campaigns, brewed by AI.
              </div>
            </div>
          </div>
          <nav className="site-nav">
            <button
              className={
                "nav-link" + (activeSection === "builder" ? " nav-link--active" : "")
              }
              onClick={() => setActiveSection("builder")}
            >
              Experience
            </button>
            <button
              className={
                "nav-link" + (activeSection === "brand" ? " nav-link--active" : "")
              }
              onClick={() => setActiveSection("brand")}
            >
              Brand
            </button>
            <button
              className={
                "nav-link" +
                (activeSection === "simulation" ? " nav-link--active" : "")
              }
              onClick={() => setActiveSection("simulation")}
            >
              Simulation
            </button>
          </nav>
        </header>

        <main className="page-main">
          <section className="hero">
            <div className="hero-content">
              <div className="hero-badge">Premium Coffee · AI Gamification</div>
              <h1>
                Turn coffee lovers into loyal fans
                <span className="hero-highlight"> with GenAI quests.</span>
              </h1>
              <p>
                Design personalised challenges, rewards and stories for your
                coffee subscribers. Test campaigns on cohorts before you ever
                hit send.
              </p>
              <div className="hero-actions">
                <button
                  className="primary-btn hero-btn"
                  onClick={() => setActiveSection("builder")}
                >
                  Launch Experience Builder
                </button>
                <button
                  className="ghost-btn"
                  onClick={() => setActiveSection("simulation")}
                >
                  Open Simulation Lab
                </button>
              </div>
              <div className="hero-metas">
                <span>AI-personalised journeys</span>
                <span>Marketing-friendly UI</span>
                <span>Built for Indian coffee brands</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card">
                <div className="hero-card-title">Today&apos;s Quest</div>
                <div className="hero-card-body">
  {heroLoading && <p>Brewing a demo quest…</p>}
  {!heroLoading && heroQuest && (
    <p>
      {heroQuest.challenge.title}:{" "}
      {heroQuest.challenge.description}
    </p>
  )}
  {!heroLoading && !heroQuest && (
    <p>
      Help a subscriber discover a new single-origin and gently
      nudge them toward a higher-value cart.
    </p>
  )}
</div>

              </div>
            </div>
          </section>

          {activeSection === "builder" && renderBuilderSection()}
          {activeSection === "brand" && renderBrandSection()}
          {activeSection === "simulation" && renderSimulationSection()}
        </main>

        <footer className="app-footer">
          <span>© {new Date().getFullYear()} Developed by ARJU AMAN · p24arju@iima.ac.in · Prototype · Coffee Quest · AI-generated gamified campaigns</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
