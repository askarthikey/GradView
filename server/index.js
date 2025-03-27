const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const crypto = require("crypto");

dotenv.config();
const app = express();
const port = process.env.PORT || 5002;

mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Database connection successful");
    app.listen(port, () => console.log(`🚀 Server is running on port ${port}...`));
  })
  .catch((err) => {
    console.error("❌ Error in DB connection:", err.message);
    process.exit(1);
  });

app.use(express.json());

// ✅ Function to Generate Codeforces API Signature
const generateCodeforcesSignature = (methodName, params) => {
  const apiKey = process.env.CODEFORCES_API_KEY;
  const apiSecret = process.env.CODEFORCES_API_SECRET;
  if (!apiKey || !apiSecret) throw new Error("Missing Codeforces API Key or Secret in .env");

  const rand = Math.random().toString(36).substring(2, 8); // Random 6-character string
  const time = Math.floor(Date.now() / 1000); // Unix timestamp

  // Sort parameters lexicographically (first by key, then by value)
  const paramString = [
    `apiKey=${apiKey}`,
    `handles=${params.handles}`,
    `time=${time}`,
  ].sort().join("&");

  // Create signature input string
  const hashInput = `${rand}/${methodName}?${paramString}#${apiSecret}`;
  const hash = crypto.createHash("sha512").update(hashInput).digest("hex");

  return { time, apiKey, apiSig: `${rand}${hash}`, paramString };
};

// ✅ Scrape Profiles API
app.get("/scrape", async (req, res, next) => {
  try {
    const usernames = {
      codeforces: "askarthikey01",
      leetcode: "askarthikey192005",
      codechef: "strawhat01",
    };

    let results = {};

    // 🔹 Fetch Codeforces Data (Using Official API with Signature)
    try {
      const methodName = "user.info";
      const { time, apiKey, apiSig, paramString } = generateCodeforcesSignature(methodName, {
        handles: usernames.codeforces,
      });

      const url = `https://codeforces.com/api/${methodName}?${paramString}&apiSig=${apiSig}`;
      console.log("🔗 Requesting Codeforces API:", url);

      const cfRes = await axios.get(url);
      if (cfRes.data.status === "OK") {
        results.codeforces = cfRes.data.result[0];
        console.log("✅ Codeforces Data Fetched Successfully");
      } else {
        throw new Error(cfRes.data.comment || "Unknown error");
      }
    } catch (err) {
      console.error("❌ Codeforces API Failed:", err.message);
      results.codeforces = { error: err.message };
    }

    // 🔹 Fetch LeetCode Data (Using API)
    try {
      const leetRes = await axios.get(`https://alfa-leetcode-api.onrender.com/${usernames.leetcode}`);
      results.leetcode = leetRes.data;
      console.log("✅ LeetCode Data Fetched");
    } catch (err) {
      console.error("❌ LeetCode API Failed:", err.message);
      results.leetcode = { error: "Failed to fetch data" };
    }

    // 🔹 Fetch CodeChef Data (Using API)
    try {
      const codechefRes = await axios.get(`https://codechef-api.vercel.app/${usernames.codechef}`);
      results.codechef = codechefRes.data;
      console.log("✅ CodeChef Data Fetched");
    } catch (err) {
      console.error("❌ CodeChef API Failed:", err.message);
      results.codechef = { error: "Failed to fetch data" };
    }

    res.json({ message: "Scraping successful", data: results });
  } catch (error) {
    console.error("❌ Scraping failed:", error.message);
    next(error);
  }
});

// ✅ Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

module.exports = app; // Useful for testing
