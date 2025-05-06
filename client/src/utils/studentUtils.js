import axios from 'axios';

const API_BASE_URL = `http://localhost:5001/student-api`;

export const getStudentByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students?email=${email}`);
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error getting student by email:', error);
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting student by ID:', error);
    throw error;
  }
};

export const updateStudent = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/students/${id}, data`);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const createStudent = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/students, data`);
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/students/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// Format student data for display
export const formatStudentData = (studentData) => {
  if (!studentData) return null;

  return {
    id: studentData._id,
    name: studentData.name || 'N/A',
    email: studentData.email || 'N/A',
    rollNumber: studentData.rollNumber || 'N/A',
    phone: studentData.phone || studentData.contact || 'N/A',
    branch: studentData.branch || 'N/A',
    section: studentData.section || 'N/A',
    yearOfAdmission: studentData.yearOfAdmission || 'N/A',
    yearOfGraduation: studentData.yearOfGraduation || 'N/A',
    linkedin: studentData.linkedin || '',
    twitter: studentData.twitter || '',
    codingProfiles: {
      github: studentData.codingProfiles?.github || '',
      leetcode: studentData.codingProfiles?.leetcode || '',
      codeforces: studentData.codingProfiles?.codeforces || '',
      codechef: studentData.codingProfiles?.codechef || '',
      gfg: studentData.codingProfiles?.gfg || ''
    }
  };
};

// Check if student data is complete (has all required fields)
export const isStudentProfileComplete = (studentData) => {
  if (!studentData) return false;
  
  const requiredFields = [
    'name', 
    'email', 
    'rollNumber',
    'branch'
  ];
  
  return requiredFields.every(field => 
    studentData[field] && studentData[field].trim() !== ''
  );
};

// Get student full name display
export const getStudentDisplayName = (studentData) => {
  if (!studentData) return 'Student';
  return studentData.name || 'Student';
};