import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import RootLayout from "../components/RootLayout";
import Footer from "../components/Footer";

const Home = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [codingData, setCodingData] = useState({
    codeforces: null,
    leetcode: null,
    codechef: null,
    loading: true,
    error: null
  });

  // Fetch user's coding profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Codeforces data
        const cfResponse = await axios.get(
          'https://codeforces.com/api/user.info?handles=askarthikey01'
        );
        const cfSubmissionsResponse = await axios.get(
          'https://codeforces.com/api/user.status?handle=askarthikey01&from=1&count=10000'
        );
        const cfContestsResponse = await axios.get(
          'https://codeforces.com/api/user.rating?handle=askarthikey01'
        );

        // Process Codeforces data
        const submissions = cfSubmissionsResponse.data.result;
        const solvedProblems = new Set();
        submissions.forEach((submission) => {
          if (submission.verdict === 'OK') {
            const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
            solvedProblems.add(problemId);
          }
        });

        // Fetch LeetCode data
        const leetcodeProfileResponse = await axios.get(
          'https://alfa-leetcode-api.onrender.com/userProfile/askarthikey192005'
        );
        const leetcodeContestResponse = await axios.get(
          'https://alfa-leetcode-api.onrender.com/userContestRankingInfo/askarthikey192005'
        );
        
        // Fetch CodeChef data
        const codechefResponse = await axios.get(
          'https://codechef-api.vercel.app/strawhat01'
        );

        setCodingData({
          codeforces: {
            user: cfResponse.data.result[0],
            submissions: submissions.length,
            solved: solvedProblems.size,
            contests: cfContestsResponse.data.result.length,
            ratingHistory: cfContestsResponse.data.result.slice(-10).map(item => ({
              contestName: item.contestName,
              rating: item.newRating
            }))
          },
          leetcode: {
            profile: leetcodeProfileResponse.data,
            contest: leetcodeContestResponse.data,
            totalSolved: leetcodeProfileResponse.data.totalSolved,
            easySolved: leetcodeProfileResponse.data.easySolved,
            mediumSolved: leetcodeProfileResponse.data.mediumSolved,
            hardSolved: leetcodeProfileResponse.data.hardSolved
          },
          codechef: codechefResponse.data,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Error fetching coding profiles:', err.message);
        setCodingData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch coding profiles data.'
        }));
      }
    };

    // Only fetch data if the user is signed in
    if (isSignedIn) {
      fetchData();
    }
  }, [isSignedIn]);

  // Redirect user to start page if not signed in
  if (!isSignedIn) {
    navigate("/");
  }

  // Prepare data for charts
  const prepareProblemDifficultyData = () => {
    if (!codingData.leetcode?.profile) return [];
    
    return [
      { name: 'Easy', value: codingData.leetcode.easySolved || 0, fill: '#00b8a3' },
      { name: 'Medium', value: codingData.leetcode.mediumSolved || 0, fill: '#ffc01e' },
      { name: 'Hard', value: codingData.leetcode.hardSolved || 0, fill: '#ff375f' }
    ];
  };

  const prepareComparisonData = () => {
    if (codingData.loading) return [];
    
    return [
      { 
        name: 'Problems Solved', 
        Codeforces: codingData.codeforces?.solved || 0, 
        LeetCode: codingData.leetcode?.totalSolved || 0, 
        CodeChef: codingData.codechef?.problemsSolved || 0 
      },
      { 
        name: 'Contests', 
        Codeforces: codingData.codeforces?.contests || 0, 
        LeetCode: codingData.leetcode?.contest?.totalContestCount || 0, 
        CodeChef: codingData.codechef?.contestCount || 0 
      }
    ];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold mb-2">
              Welcome to GradView
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-4">
              Welcome, {user?.firstName} {user?.lastName}!
            </h1>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-4">
              Empowering Students to Reach Their Full Potential
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mt-2">
              A comprehensive platform designed to help students excel academically, track their achievements, and seamlessly connect with the industry. Gain insights, optimize your growth, and unlock career opportunities.
            </p>
          </div>

          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total Problems Solved Card */}
            <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-md flex flex-col items-center">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Total Problems Solved</h3>
              <div className="text-4xl font-bold text-purple-700">
                {codingData.loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  (codingData.codeforces?.solved || 0) + 
                  (codingData.leetcode?.totalSolved || 0) + 
                  (codingData.codechef?.problemsSolved || 0)
                )}
              </div>
              <p className="text-sm text-purple-600 mt-2">Across all platforms</p>
            </div>

            {/* Contests Participated Card */}
            <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-md flex flex-col items-center">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Contests Participated</h3>
              <div className="text-4xl font-bold text-blue-700">
                {codingData.loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  (codingData.codeforces?.contests || 0) + 
                  (codingData.leetcode?.contest?.totalContestCount || 0) + 
                  (codingData.codechef?.contestCount || 0)
                )}
              </div>
              <p className="text-sm text-blue-600 mt-2">Across all platforms</p>
            </div>

            {/* Highest Rating Card */}
            <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-md flex flex-col items-center">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Highest Rating</h3>
              <div className="text-4xl font-bold text-green-700">
                {codingData.loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  Math.max(
                    codingData.codeforces?.user?.maxRating || 0,
                    codingData.codechef?.highestRating || 0
                  )
                )}
              </div>
              <p className="text-sm text-green-600 mt-2">Best performance</p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Coding Performance Card */}
            <div className="p-6 bg-gradient-to-br from-red-100 to-red-200 rounded-xl shadow-md text-center hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                Coding Performance Tracker
              </h3>
              <p className="text-gray-600 mt-2">Track your progress in coding challenges, improve your skills, and showcase your coding profile to recruiters.</p>
              <button onClick={() => navigate("/code")} 
                className="mt-4 px-6 py-2 bg-white rounded-lg text-red-600 font-medium shadow hover:shadow-md">
                View My Coding Profile
              </button>
            </div>

            {/* Connect with Alumni Card */}
            <div className="p-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-md text-center hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                Alumni Connections
              </h3>
              <p className="text-gray-600 mt-2">Connect with industry professionals and alumni to receive mentorship and guidance in your career journey.</p>
              <button 
                onClick={() => navigate("/connect")} 
                className="mt-4 px-6 py-2 bg-white rounded-lg text-orange-600 font-medium shadow hover:shadow-md">
                Join the Alumni Network
              </button>
            </div>

            {/* Projects Card */}
            <div className="p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl shadow-md text-center hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                Showcase Your Projects
              </h3>
              <p className="text-gray-600 mt-2">Build and display your projects to potential employers, track your contributions, and get recognition for your work.</p>
              <button onClick={() => navigate("/schwk/projects")}
                className="mt-4 px-6 py-2 bg-white rounded-lg text-yellow-600 font-medium shadow hover:shadow-md">
                Explore My Projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-16 px-6 md:px-16 bg-gradient-to-r from-red-50 to-yellow-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-8 text-center">
            Your Coding Performance Dashboard
          </h2>
          
          {codingData.loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl text-gray-500">Loading your coding data...</p>
            </div>
          ) : codingData.error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl text-red-500">{codingData.error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LeetCode Problem Difficulty Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Problem Difficulty Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={prepareProblemDifficultyData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prepareProblemDifficultyData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Codeforces Rating History */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Codeforces Rating History</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={codingData.codeforces?.ratingHistory || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="contestName" tick={false} />
                    <YAxis />
                    <Tooltip labelFormatter={() => 'Contest'} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Rating"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Platform Comparison */}
              <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Platform Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={prepareComparisonData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Codeforces" fill="#ff8c00" />
                    <Bar dataKey="LeetCode" fill="#00b8a3" />
                    <Bar dataKey="CodeChef" fill="#5b4638" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/dash")}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-all"
            >
              View Detailed Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Advanced Insights Section */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6">
            Advanced Insights & Analytics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Insight Card 1 */}
            <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-md text-center hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                Real-time Coding Metrics
              </h3>
              <p className="text-gray-600 mt-2">View your real-time performance, including solved problems, difficulty levels, and time spent on challenges.</p>
            </div>

            {/* Insight Card 2 */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md text-center hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                Research Publications Tracker
              </h3>
              <p className="text-gray-600 mt-2">Keep track of your published research, citations, and academic achievements in real-time.</p>
            </div>

            {/* Insight Card 3 */}
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-md text-center hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                Career Opportunities & Networking
              </h3>
              <p className="text-gray-600 mt-2">Access curated career opportunities and network with professionals in your field.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 px-6 md:px-16 bg-gradient-to-r from-red-50 to-yellow-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6">
            Featured Courses & Certifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-md text-center hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                Data Science Fundamentals
              </h3>
              <p className="text-gray-600 mt-2">Master the basics of data science and start your journey to becoming a data analyst.</p>
              <button className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg text-white font-medium shadow hover:shadow-md">
                Enroll Now
              </button>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md text-center hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                Full-stack Web Development
              </h3>
              <p className="text-gray-600 mt-2">Learn full-stack web development from front-end to back-end and build your own applications.</p>
              <button className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg text-white font-medium shadow hover:shadow-md">
                Start Learning
              </button>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md text-center hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                Artificial Intelligence & ML
              </h3>
              <p className="text-gray-600 mt-2">Dive into AI and machine learning with hands-on projects and real-world examples.</p>
              <button className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg text-white font-medium shadow hover:shadow-md">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6">
            What Our Users Say
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-md max-w-xs">
              <p className="text-gray-600 italic">"GradView helped me connect with industry experts and grow my career!"</p>
              <h4 className="mt-4 text-xl font-semibold text-red-600">Jane Doe</h4>
              <p className="text-gray-500">Computer Science Graduate</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-md max-w-xs">
              <p className="text-gray-600 italic">"The platform provides invaluable insights into my academic and coding progress."</p>
              <h4 className="mt-4 text-xl font-semibold text-yellow-600">John Smith</h4>
              <p className="text-gray-500">Software Engineer</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;