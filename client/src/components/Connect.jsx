import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { useStudent } from '../contexts/StudentContext';
import { Search, Filter, Linkedin, Mail, MapPin, Briefcase } from 'lucide-react';

const ConnectPage = () => {
  const { studentData, loading } = useStudent();
  const [filteredPeers, setFilteredPeers] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [displayData, setDisplayData] = useState({ peers: [], alumni: [] });
  const [currentTab, setCurrentTab] = useState('peers');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (loading || !studentData?.email) return;
    const API_BASE_URL = `http://localhost:5001/student-api`;
    const fetchData = async () => {
      try {
        const resUser = await fetch(`${API_BASE_URL}/current-user?email=${studentData.email}`);
        const currentUserData = await resUser.json();
        setUserData(currentUserData);

        // Fetch all students
        const resAll = await fetch(`${API_BASE_URL}/students`);
        const students = await resAll.json();
        
        // Filter Class Peers: same yearOfAdmission, exclude self
        const peers = students.filter(s => 
          s.yearOfAdmission === currentUserData.yearOfAdmission && 
          s._id !== currentUserData._id
        );
        
        // Filter Alumni: those with earlier yearOfAdmission
        const alumni = students.filter(s => 
          parseInt(s.yearOfAdmission) < parseInt(currentUserData.yearOfAdmission)
        );
        
        setFilteredPeers(peers);
        setFilteredAlumni(alumni);
        setDisplayData({
          peers: peers,
          alumni: alumni
        });
      } catch (error) {
        console.error("Error fetching connect data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentData, loading]);

  // Apply search and filters
  useEffect(() => {
    const applyFilters = () => {
      const filterByQuery = (person) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          person.name?.toLowerCase().includes(query) ||
          person.branch?.toLowerCase().includes(query) ||
          person.section?.toLowerCase().includes(query)
        );
      };

      const filterByBranch = (person) => {
        if (!branchFilter) return true;
        return person.branch === branchFilter;
      };

      const filteredPeersData = filteredPeers.filter(
        (peer) => filterByQuery(peer) && filterByBranch(peer)
      );

      const filteredAlumniData = filteredAlumni.filter(
        (alum) => filterByQuery(alum) && filterByBranch(alum)
      );

      setDisplayData({
        peers: filteredPeersData,
        alumni: filteredAlumniData,
      });
    };

    applyFilters();
  }, [searchQuery, branchFilter, filteredPeers, filteredAlumni]);

  // Get unique branches for filter dropdown
  const allBranches = [...new Set([
    ...filteredPeers.map(p => p.branch),
    ...filteredAlumni.map(p => p.branch)
  ])].filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const StudentCard = ({ student }) => (
    <div className="flex flex-col p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white w-full max-w-md">
      <div className="flex items-center gap-4 mb-3">
        <div className="relative">
          <img
            src={student.photo || "/default-avatar.png"}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{student.branch} - {student.section}</span>
          </div>
          <p className="text-gray-500 text-sm flex items-center">
            <Briefcase size={14} className="mr-1" />
            <span>Class of {parseInt(student.yearOfAdmission) + 4}</span>
          </p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          {student.linkedin && (
            <a 
              href={student.linkedin} 
              className="flex items-center px-3 py-1.5 text-sm rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Linkedin size={16} className="mr-1" />
              LinkedIn
            </a>
          )}
          <a 
            href={`mailto:${student.email}`} 
            className="flex items-center px-3 py-1.5 text-sm rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Mail size={16} className="mr-1" />
            Contact
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Connect with Peers & Alumni</h1>
        <p className="text-gray-600 max-w-3xl">
          Build your network with classmates and senior alumni. Discover connections that can help shape your academic and professional journey.
        </p>
        
        {userData && (
          <div className="mt-4 flex items-center">
            <img 
              src={userData.photo || "/default-avatar.png"} 
              alt={userData.name}
              className="w-10 h-10 rounded-full mr-3 border-2 border-white" 
            />
            <div>
              <p className="font-medium">{userData.name}</p>
              <p className="text-sm text-gray-600">Class of {parseInt(userData.yearOfAdmission) + 4}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, branch or section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none appearance-none bg-white transition"
          >
            <option value="">All Branches</option>
            {allBranches.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <Tabs 
        defaultValue="peers" 
        className="w-full"
        onValueChange={setCurrentTab}
      >
        <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="peers" 
            className="px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-base font-medium transition"
          >
            Class Peers ({displayData.peers.length})
          </TabsTrigger>
          <TabsTrigger 
            value="alumni" 
            className="px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-base font-medium transition"
          >
            Alumni Network ({displayData.alumni.length})
          </TabsTrigger>
        </TabsList>

        {/* Peers */}
        <TabsContent value="peers">
          {displayData.peers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayData.peers.map((peer) => (
                <StudentCard key={peer._id} student={peer} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-2">No peers found matching your filters.</p>
              {(searchQuery || branchFilter) && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setBranchFilter('');
                  }}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </TabsContent>

        {/* Alumni */}
        <TabsContent value="alumni">
          {displayData.alumni.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayData.alumni.map((alum) => (
                <StudentCard key={alum._id} student={alum} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-2">No alumni found matching your filters.</p>
              {(searchQuery || branchFilter) && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setBranchFilter('');
                  }}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectPage;