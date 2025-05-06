import { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

// Create context
const StudentContext = createContext(null);

// Create provider component
export function StudentProvider({ children }) {
  const { user, isLoaded } = useUser();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch student by email
  const fetchStudentDataByEmail = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5001/student-api/students?email=${email}`);
      if (response.data && response.data.length > 0) {
        setStudentData(response.data[0]);
      } else {
        setStudentData(null);
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError('Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }
      
      const email = user.primaryEmailAddress.emailAddress;
      await fetchStudentDataByEmail(email);
    };

    fetchStudentData();
  }, [isLoaded, user]);

  // Function to refresh student data
  const refreshStudentData = async () => {
    if (!user) return;

    setLoading(true);
    const email = user.primaryEmailAddress.emailAddress;
    await fetchStudentDataByEmail(email);
  };

  // Create value object to pass to context
  const value = {
    studentData,
    loading,
    error,
    refreshStudentData
  };

  // Return provider
  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

// Custom hook for using student context
export function useStudent() {
  const context = useContext(StudentContext);
  if (context === null) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
