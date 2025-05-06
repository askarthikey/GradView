import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Coding() {
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [codeforcesSubmissions, setCodeforcesSubmissions] = useState(null);
  const [codeforcesSolved, setCodeforcesSolved] = useState(0);
  const [codeforcesContests, setCodeforcesContests] = useState(0);
  // const [leetcodeData, setLeetcodeData] = useState(null);
  const [leetcodeProfile, setLeetcodeProfile] = useState(null);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [leetcodeContest, setLeetcodeContest] = useState(null);
  const [leetcodeSubmissions, setLeetcodeSubmissions] = useState(null);
  const [leetcodeCalendar, setLeetcodeCalendar] = useState(null);
  const [leetcodeSkills, setLeetcodeSkills] = useState(null);
  const [leetcodeTotalProblems, setLeetcodeTotalProblems] = useState(0);
  const [leetcodeTotalContests, setLeetcodeTotalContests] = useState(0);
  const [codechefData, setCodechefData] = useState(null);
  const [codechefContests, setCodechefContests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cfResponse = await axios.get(
          'https://codeforces.com/api/user.info?handles=askarthikey01'
        );
        const cfSubmissionsResponse = await axios.get(
          'https://codeforces.com/api/user.status?handle=askarthikey01&from=1&count=10000'
        );
        const cfContestsResponse = await axios.get(
          'https://codeforces.com/api/user.rating?handle=askarthikey01'
        );

        const submissions = cfSubmissionsResponse.data.result;
        const solvedProblems = new Set();
        submissions.forEach((submission) => {
          if (submission.verdict === 'OK') {
            const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
            solvedProblems.add(problemId);
          }
        });

        setCodeforcesData(cfResponse.data.result[0]);
        setCodeforcesSubmissions(submissions.length);
        setCodeforcesSolved(solvedProblems.size);
        setCodeforcesContests(cfContestsResponse.data.result.length);

        const leetcodeProfileResponse = await axios.get(
          'https://alfa-leetcode-api.onrender.com/userProfile/askarthikey192005'
        );
        const leetcodeStatsResponse = await axios.get(
          'https://alfa-leetcode-api.onrender.com/languageStats?username=askarthikey192005'
        );
        const leetcodeContestResponse = await axios.get(
          'https://alfa-leetcode-api.onrender.com/userContestRankingInfo/askarthikey192005'
        );
        const leetcodeSubmissionResponse = await axios.get(
          'https://alfa-leetcode-api.onrender.com/askarthikey192005/submission'
        );
        const leetcodeCalendarResponse = await axios.get(
          'https://alfa-leetcode-api.onrender.com/userProfileCalendar?username=askarthikey192005&year=2024'
        );
        const leetcodeSkillsResponse = await axios.get(
          'https://alfa-leetcode-api.onrender.com/skillStats/askarthikey192005'
        );
        const codechefResponse = await axios.get(
          'https://codechef-api.vercel.app/strawhat01'
        );

        // setLeetcodeData(leetcodeProfileResponse.data);
        setLeetcodeProfile(leetcodeProfileResponse.data);
        setLeetcodeStats(leetcodeStatsResponse.data);
        setLeetcodeContest(leetcodeContestResponse.data);
        setLeetcodeSubmissions(leetcodeSubmissionResponse.data);
        setLeetcodeCalendar(leetcodeCalendarResponse.data);
        setLeetcodeSkills(leetcodeSkillsResponse.data);
        setCodechefData(codechefResponse.data);
        setCodechefContests(codechefResponse.data.contestCount || 0);

        setLeetcodeTotalProblems(leetcodeProfileResponse.data.totalSolved);
        setLeetcodeTotalContests(leetcodeContestResponse.data.totalContestCount || 0);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching profiles:', err.message);
        setError('Failed to fetch some or all profiles.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading profiles...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Coding Profiles</h2>
      <section>
        <h3>Codeforces</h3>
        <p>Number of Submissions: {codeforcesSubmissions}</p>
        <p>Total Unique Problems Solved: {codeforcesSolved}</p>
        <p>Total Contests Participated: {codeforcesContests}</p>
        <pre>{JSON.stringify(codeforcesData, null, 2)}</pre>
      </section>
      <section>
        <h3>LeetCode Profile</h3>
        <p>Total Problems Solved: {leetcodeTotalProblems}</p>
        <p>Total Contests Participated: {leetcodeTotalContests}</p>
        <pre>{JSON.stringify(leetcodeProfile, null, 2)}</pre>
      </section>
      <section>
        <h3>LeetCode Language Stats</h3>
        <pre>{JSON.stringify(leetcodeStats, null, 2)}</pre>
      </section>
      <section>
        <h3>LeetCode Contest</h3>
        <pre>{JSON.stringify(leetcodeContest, null, 2)}</pre>
      </section>
      <section>
        <h3>LeetCode Submissions</h3>
        <pre>{JSON.stringify(leetcodeSubmissions, null, 2)}</pre>
      </section>
      <section>
        <h3>LeetCode Calendar</h3>
        <pre>{JSON.stringify(leetcodeCalendar, null, 2)}</pre>
      </section>
      <section>
        <h3>LeetCode Skills</h3>
        <pre>{JSON.stringify(leetcodeSkills, null, 2)}</pre>
      </section>
      <section>
        <h3>CodeChef</h3>
        <p>Total Contests Participated: {codechefContests}</p>
        <pre>{JSON.stringify(codechefData, null, 2)}</pre>
      </section>
    </div>
  );
}

export default Coding;
