import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

// ---------- Profile Card Component ----------
function ProfileCard({ platform, data }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-2">{platform}</h3>
      {data.avatar || data.profile ? (
        <img
          src={data.avatar || data.profile}
          alt={`${platform} profile`}
          className="w-20 h-20 rounded-full mb-4"
        />
      ) : null}
      <ul className="text-sm text-gray-700">
        {data.handle && <li><strong>Handle:</strong> {data.handle}</li>}
        {data.username && <li><strong>Username:</strong> {data.username}</li>}
        {data.name && <li><strong>Name:</strong> {data.name}</li>}
        {data.country && <li><strong>Country:</strong> {data.country}</li>}
        {data.rating && <li><strong>Rating:</strong> {data.rating}</li>}
        {data.currentRating && <li><strong>Rating:</strong> {data.currentRating}</li>}
        {data.maxRating && <li><strong>Max Rating:</strong> {data.maxRating}</li>}
        {data.highestRating && <li><strong>Highest:</strong> {data.highestRating}</li>}
        {data.rank && <li><strong>Rank:</strong> {data.rank}</li>}
        {data.globalRank && <li><strong>Global Rank:</strong> {data.globalRank}</li>}

        {/* Additional info for Codeforces */}
        {platform === "Codeforces" && (
          <>
            {data.submissions && <li><strong>Submissions:</strong> {data.submissions}</li>}
            {data.uniqueProblemsSolved && <li><strong>Unique Problems Solved:</strong> {data.uniqueProblemsSolved}</li>}
            {data.contestsParticipated && <li><strong>Contests Participated:</strong> {data.contestsParticipated}</li>}
          </>
        )}

        {/* Additional info for LeetCode */}
        {platform === "LeetCode" && (
          <>
            {data.totalSolved && <li><strong>Total Problems Solved:</strong> {data.totalSolved}</li>}
            {data.totalContestsParticipated !== undefined && <li><strong>Contests Participated:</strong> {data.totalContestsParticipated}</li>}
          </>
        )}

        {/* Additional info for CodeChef */}
        {platform === "CodeChef" && (
          <>
            {data.totalContestsParticipated !== undefined && <li><strong>Contests Participated:</strong> {data.totalContestsParticipated}</li>}
            {data.countryRank && <li><strong>Country Rank:</strong> {data.countryRank}</li>}
            {data.stars && <li><strong>Stars:</strong> {data.stars}</li>}
          </>
        )}
      </ul>
    </div>
  );
}

function RatingComparison({ codeforces, leetcode, codechef }) {
  const scores = [
    Math.max(0, codeforces?.rating - 800),
    Math.max(0, leetcode?.ranking - 1400),
    Math.max(0, codechef?.currentRating - 1000),
  ];

  const data = [
    { name: 'Codeforces', value: scores[0], color: '#4285F4' },
    { name: 'LeetCode', value: scores[1], color: '#34A853' },
    { name: 'CodeChef', value: scores[2], color: '#FBBC05' },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 my-4">
      <h3 className="text-lg font-semibold mb-2">Rating Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------- Rating Trend Chart Component ----------
function RatingTrendChart({ ratingData, title }) {
  const formattedData = ratingData.map((item) => ({
    date: `${item.getday}-${item.getmonth}-${item.getyear}`,
    rating: Number(item.rating),
  }));

  return (
    <div className="bg-white shadow-md rounded-lg p-4 my-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Line type="monotone" dataKey="rating" stroke="#4F46E5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------- Activity Heatmap Component ----------
function ActivityHeatmap({ heatMapData, title }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 my-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <CalendarHeatmap
        startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
        endDate={new Date()}
        values={heatMapData.map((item) => ({
          date: item.date,
          count: item.value,
        }))}
        classForValue={(value) => {
          if (!value) return 'bg-gray-200';
          if (value.count >= 50) return 'bg-green-800';
          if (value.count >= 20) return 'bg-green-600';
          if (value.count >= 5) return 'bg-green-400';
          return 'bg-green-200';
        }}
        tooltipDataAttrs={(value) =>
          value.date ? { 'data-tip': `${value.date}: ${value.count} submissions` } : {}
        }
        showWeekdayLabels
      />
    </div>
  );
}

// ---------- Comparative Statistics Component ----------
function ComparativeStats({ codeforces, leetcode, codechef }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 my-4 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">Comparative Stats</h3>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Metric</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Codeforces</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">LeetCode</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">CodeChef</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-2">Current Rating</td>
            <td className="px-4 py-2">{codeforces?.rating || '-'}</td>
            <td className="px-4 py-2">-</td>
            <td className="px-4 py-2">{codechef?.currentRating || '-'}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Max/Highest Rating</td>
            <td className="px-4 py-2">{codeforces?.maxRating || '-'}</td>
            <td className="px-4 py-2">-</td>
            <td className="px-4 py-2">{codechef?.highestRating || '-'}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Rank</td>
            <td className="px-4 py-2">{codeforces?.rank || '-'}</td>
            <td className="px-4 py-2">{leetcode?.ranking || '-'}</td>
            <td className="px-4 py-2">{codechef?.globalRank || '-'}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Country</td>
            <td className="px-4 py-2">{codeforces?.country || '-'}</td>
            <td className="px-4 py-2">{leetcode?.country || '-'}</td>
            <td className="px-4 py-2">{codechef?.countryName || '-'}</td>
          </tr>
          {/* Additional metrics */}
          <tr>
            <td className="px-4 py-2">Submissions / Total Submissions</td>
            <td className="px-4 py-2">{codeforces?.submissions || '-'}</td>
            <td className="px-4 py-2">
              {leetcode?.totalSubmissions ? leetcode.totalSubmissions[0]?.submissions : '-'}
            </td>
            <td className="px-4 py-2">{codechef?.submissions || '-'}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Problems Solved</td>
            <td className="px-4 py-2">{codeforces?.uniqueProblemsSolved || '-'}</td>
            <td className="px-4 py-2">{leetcode?.totalSolved || '-'}</td>
            <td className="px-4 py-2">{codechef?.problemsSolved || '-'}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Contests Participated</td>
            <td className="px-4 py-2">{codeforces?.contestsParticipated || '-'}</td>
            <td className="px-4 py-2">{leetcode?.totalContestsParticipated !== undefined ? leetcode.totalContestsParticipated : '-'}</td>
            <td className="px-4 py-2">{codechef?.totalContestsParticipated !== undefined ? codechef.totalContestsParticipated : '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ---------- Main Dashboard Component ----------
function Dashboard() {
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [codechefData, setCodechefData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data directly from external APIs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cfResponse = await axios.get(
          "https://codeforces.com/api/user.info?handles=askarthikey01"
        );
        const leetcodeResponse = await axios.get(
          "https://alfa-leetcode-api.onrender.com/askarthikey192005"
        );
        const codechefResponse = await axios.get(
          "https://codechef-api.vercel.app/strawhat01"
        );

        // For demonstration, merge in extra fields from your sample data
        const cfExtra = {
          submissions: 267,
          uniqueProblemsSolved: 130,
          contestsParticipated: 6,
        };
        const lcExtra = {
          totalContestsParticipated: 0,
          // totalSolved is already provided in the response in your sample
        };
        const ccExtra = {
          totalContestsParticipated: 0,
        };

        setCodeforcesData({ ...cfResponse.data.result[0], ...cfExtra });
        setLeetcodeData({ ...leetcodeResponse.data, ...lcExtra });
        setCodechefData({ ...codechefResponse.data, ...ccExtra });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profiles:", err.message);
        setError("Failed to fetch some or all profiles.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading dashboard...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600 text-lg">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Coding Profiles Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileCard platform="Codeforces" data={codeforcesData} />
        <ProfileCard platform="LeetCode" data={leetcodeData} />
        <ProfileCard platform="CodeChef" data={codechefData.profile ? codechefData : {}} />
      </div>
      <RatingComparison codeforces={codeforcesData} leetcode={leetcodeData} codechef={codechefData} />
      <ComparativeStats
        codeforces={codeforcesData}
        leetcode={leetcodeData}
        codechef={codechefData.profile ? codechefData : null}
      />

      {/* Render Rating Trend if CodeChef ratingData exists */}
      {codechefData.ratingData && (
        <RatingTrendChart ratingData={codechefData.ratingData} title="CodeChef Rating Trend" />
      )}
      {/* Render Activity Heatmap if CodeChef heatMap exists */}
      {codechefData.heatMap && (
        <ActivityHeatmap heatMapData={codechefData.heatMap} title="CodeChef Activity Heatmap" />
      )}
    </div>
  );
}

export default Dashboard;
