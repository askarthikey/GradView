const puppeteer = require("puppeteer");
const axios = require("axios");

async function scrapeProfiles() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const codeforces = "tourist";
  const leetcode = "askarthikey192005";
  const codechef = "strawhat01";

  let results = {};

  // ✅ Scrape Codeforces
  try {
    await page.goto(`https://codeforces.com/profile/${codeforces}`, { waitUntil: "networkidle2" });
    await page.waitForSelector(".info", { timeout: 10000 });

    results.codeforces = await page.evaluate(() => ({
      name: document.querySelector(".main-info h1")?.innerText.trim() || "N/A",
      rating: document.querySelector(".info li span")?.innerText.trim() || "N/A",
      rank: document.querySelector(".info li a")?.innerText.trim() || "N/A",
    }));
  } catch (err) {
    console.error("Codeforces scraping failed:", err.message);
    results.codeforces = { error: "Failed to fetch data" };
  }

  // ✅ Fetch LeetCode Data Using Axios
  try {
    const leetcodeResponse = await axios.get(`https://alfa-leetcode-api.onrender.com/${leetcode}`);
    const leetcodeData = leetcodeResponse.data;

    results.leetcode = {
      username: leetcodeData.username || "N/A",
      solvedProblems: leetcodeData.totalSolved || "N/A",
      ranking: leetcodeData.ranking || "N/A",
    };
  } catch (err) {
    console.error("LeetCode API fetch failed:", err.message);
    results.leetcode = { error: "Failed to fetch data" };
  }

  // ✅ Scrape CodeChef
  try {
    await page.goto(`https://www.codechef.com/users/${codechef}`, { waitUntil: "networkidle2" });
    await page.waitForSelector(".rating-number", { timeout: 10000 });

    results.codechef = await page.evaluate(() => ({
      rating: document.querySelector(".rating-number")?.innerText.trim() || "N/A",
      stars: document.querySelector(".rating-star")?.innerText.trim() || "N/A",
      globalRank: document.querySelector(".rating-ranks span strong")?.innerText.trim() || "N/A",
    }));
  } catch (err) {
    console.error("CodeChef scraping failed:", err.message);
    results.codechef = { error: "Failed to fetch data" };
  }

  await browser.close();
  console.log("Scraped Data:", results);
  return results;
}

// ✅ Export Function Properly
module.exports = { scrapeProfiles };
