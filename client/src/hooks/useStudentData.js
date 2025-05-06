import { useState, useEffect } from 'react';
import axios from 'axios';

function useStudentData(email) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentByEmail = async () => {
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5001/student-api/students?email=${email}`);
        if (response.data && response.data.length > 0) {
          setStudent(response.data[0]);
        } else {
          setStudent(null);
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentByEmail();
  }, [email]);

  const refreshStudentData = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/student-api/students?email=${email}`);
      if (response.data && response.data.length > 0) {
        setStudent(response.data[0]);
      } else {
        setStudent(null);
      }
    } catch (err) {
      console.error('Error refreshing student data:', err);
      setError('Failed to refresh student data');
    } finally {
      setLoading(false);
    }
  };

  const updateStudentData = async (studentId, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5001/student-api/students/${studentId}, updatedData`);
      setStudent(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating student data:', err);
      setError('Failed to update student data');
      throw err;
    }
  };

  const createStudentData = async (newStudentData) => {
    try {
      const response = await axios.post(`http://localhost:5001/student-api/students`, {
        ...newStudentData,
        email: email
      });
      setStudent(response.data);
      return response.data;
    } catch (err) {
      console.error('Error creating student data:', err);
      setError('Failed to create student data');
      throw err;
    }
  };

  return {
    student,
    loading,
    error,
    refreshStudentData,
    updateStudentData,
    createStudentData
  };
}

export default useStudentData;