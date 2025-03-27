import React, { useEffect, useState } from "react";

// Format LeetCode data into a simpler structure
const formatData = (data) => {
  let sendData = {
    totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
    totalSubmissions: data.matchedUser.submitStats.totalSubmissionNum,
    totalQuestions: data.allQuestionsCount[0].count,
    easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
    totalEasy: data.allQuestionsCount[1].count,
    mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
    totalMedium: data.allQuestionsCount[2].count,
    hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
    totalHard: data.allQuestionsCount[3].count,
    ranking: data.matchedUser.profile.ranking,
    contributionPoint: data.matchedUser.contributions.points,
    reputation: data.matchedUser.profile.reputation,
    submissionCalendar: JSON.parse(data.matchedUser.submissionCalendar),
    recentSubmissions: data.recentSubmissionList,
    matchedUserStats: data.matchedUser.submitStats
  };
  return sendData;
};

function Coding() {
  const [leetData, setLeetData] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [codechefData, setCodechefData] = useState(null);

  useEffect(() => {
    // Fetch LeetCode data using the complete GraphQL query via a free CORS proxy
    const fetchLeetCodeData = async () => {
      const query = `
        query getUserProfile($username: String!) {
          allQuestionsCount {
            difficulty
            count
          }
          matchedUser(username: $username) {
            contributions {
              points
            }
            profile {
              reputation
              ranking
            }
            submissionCalendar
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
              totalSubmissionNum {
                difficulty
                count
                submissions
              }
            }
          }
          recentSubmissionList(username: $username) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
            __typename
          }
          matchedUserStats: matchedUser(username: $username) {
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
                __typename
              }
              totalSubmissionNum {
                difficulty
                count
                submissions
                __typename
              }
              __typename
            }
          }
        }
      `;
      const variables = { username: "askarthikey192005" };
      // Use a free CORS proxy (development only)
      const proxyUrl = "https://thingproxy.freeboard.io/fetch/";
      const targetUrl = "https://leetcode.com/graphql";
      try {
        const response = await fetch(proxyUrl + targetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables }),
        });
        const json = await response.json();
        if (json.data) {
          setLeetData(formatData(json.data));
        } else {
          console.error("Error in LeetCode response:", json.errors);
        }
      } catch (error) {
        console.error("Error fetching LeetCode data:", error);
      }
    };

    // Fetch Codeforces data using their public API
    const fetchCodeforcesData = async () => {
      try {
        const response = await fetch("https://codeforces.com/api/user.info?handles=askarthikey01");
        const json = await response.json();
        if (json.status === "OK") {
          setCodeforcesData(json.result[0]);
        } else {
          console.error("Error fetching Codeforces data:", json.comment);
        }
      } catch (error) {
        console.error("Error fetching Codeforces data:", error);
      }
    };

    // Simulate CodeChef data (real implementation requires OAuth)
    const fetchCodechefData = async () => {
      const simulatedData = {
        username: "sampleUser",
        rating: 2000,
        highestRating: 2100,
        globalRank: 1500,
      };
      setCodechefData(simulatedData);
    };

    fetchLeetCodeData();
    fetchCodeforcesData();
    fetchCodechefData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Coding Profiles Data</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">LeetCode Data</h2>
        <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto">
          {leetData ? JSON.stringify(leetData, null, 2) : "Loading LeetCode data..."}
        </pre>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Codeforces Data</h2>
        <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto">
          {codeforcesData ? JSON.stringify(codeforcesData, null, 2) : "Loading Codeforces data..."}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold">CodeChef Data</h2>
        <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto">
          {codechefData ? JSON.stringify(codechefData, null, 2) : "Loading CodeChef data..."}
        </pre>
      </section>
    </div>
  );
}

export default Coding;
