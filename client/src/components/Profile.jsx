import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    contact: '',
    branch: '',
    section: '',
    yearOfAdmission: '',
    yearOfGraduation: '',
    linkedin: '',
    twitter: '',
    codingProfiles: {
      leetcode: '',
      github: '',
      codeforces: '',
      codechef: '',
      gfg: ''
    }
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!isLoaded || !user) return;
      
      try {
        const email = user.primaryEmailAddress.emailAddress;
        const response = await axios.get(`http://localhost:5001/student-api/students?email=${email}`);
        
        if (response.data && response.data.length > 0) {
          setStudentData(response.data[0]);
          // Initialize form data with student data
          setFormData({
            name: response.data[0].name || '',
            rollNumber: response.data[0].rollNumber || '',
            email: response.data[0].email || '',
            contact: response.data[0].contact || '',
            branch: response.data[0].branch || '',
            section: response.data[0].section || '',
            yearOfAdmission: response.data[0].yearOfAdmission || '',
            yearOfGraduation: response.data[0].yearOfGraduation || '',
            linkedin: response.data[0].linkedin || '',
            twitter: response.data[0].twitter || '',
            codingProfiles: {
              leetcode: response.data[0].codingProfiles?.leetcode || '',
              github: response.data[0].codingProfiles?.github || '',
              codeforces: response.data[0].codingProfiles?.codeforces || '',
              codechef: response.data[0].codingProfiles?.codechef || '',
              gfg: response.data[0].codingProfiles?.gfg || ''
            }
          });
        } else {
          // No student data found for this email
          setError('No student profile found. Please create your profile.');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to fetch student data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [isLoaded, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };  

  const validateForm = () => {
    const errors = {};
    
    // Validate required fields
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.rollNumber.trim()) errors.rollNumber = 'Roll Number is required';
    if (!formData.contact.trim()) errors.contact = 'Contact is required';
    if (!formData.branch.trim()) errors.branch = 'Branch is required';
    if (!formData.section.trim()) errors.section = 'Section is required';
    if (!formData.yearOfAdmission.trim()) errors.yearOfAdmission = 'Year of Admission is required';
    if (!formData.yearOfGraduation.trim()) errors.yearOfGraduation = 'Year of Graduation is required';
    if (!formData.linkedin.trim()) errors.linkedin = 'LinkedIn URL is required';
    
    // Validate URLs
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
    
    if (formData.linkedin.trim() && !urlPattern.test(formData.linkedin)) {
      errors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    
    if (formData.twitter.trim() && !urlPattern.test(formData.twitter)) {
      errors.twitter = 'Please enter a valid Twitter URL';
    }
    
    // Validate coding profile URLs
    if (formData.codingProfiles.github.trim()) {
      if (!urlPattern.test(formData.codingProfiles.github)) {
        errors['codingProfiles.github'] = 'Please enter a valid GitHub URL';
      }
    } else {
      errors['codingProfiles.github'] = 'GitHub URL is required';
    }
    
    if (formData.codingProfiles.leetcode.trim()) {
      if (!urlPattern.test(formData.codingProfiles.leetcode)) {
        errors['codingProfiles.leetcode'] = 'Please enter a valid LeetCode URL';
      }
    } else {
      errors['codingProfiles.leetcode'] = 'LeetCode URL is required';
    }
    
    if (formData.codingProfiles.codeforces.trim()) {
      if (!urlPattern.test(formData.codingProfiles.codeforces)) {
        errors['codingProfiles.codeforces'] = 'Please enter a valid Codeforces URL';
      }
    } else {
      errors['codingProfiles.codeforces'] = 'Codeforces URL is required';
    }
    
    if (formData.codingProfiles.codechef.trim()) {
      if (!urlPattern.test(formData.codingProfiles.codechef)) {
        errors['codingProfiles.codechef'] = 'Please enter a valid CodeChef URL';
      }
    } else {
      errors['codingProfiles.codechef'] = 'CodeChef URL is required';
    }
    
    if (formData.codingProfiles.gfg.trim()) {
      if (!urlPattern.test(formData.codingProfiles.gfg)) {
        errors['codingProfiles.gfg'] = 'Please enter a valid GeeksforGeeks URL';
      }
    } else {
      errors['codingProfiles.gfg'] = 'GeeksforGeeks URL is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form before submitting
    if (!validateForm()) {
      return;
    }
    
    try {
      if (studentData) {
        // Update existing student
        await axios.put(`http://localhost:5001/student-api/students/${studentData._id}`, formData);
        // Refresh data
        const response = await axios.get(`http://localhost:5001/student-api/students?email=${user.primaryEmailAddress.emailAddress}`);
        setStudentData(response.data[0]);
      } else {
        // Create new student
        const response = await axios.post(`http://localhost:5001/student-api/students`, {
          ...formData,
          email: user.primaryEmailAddress.emailAddress
        });
        setStudentData(response.data);
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving student data:', err);
      setError('Failed to save student data. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading student profile...</div>;

  if (error && !studentData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Create Profile
        </button>
        
        {isEditing && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>
            <StudentForm 
              formData={formData} 
              handleInputChange={handleInputChange} 
              handleSubmit={handleSubmit} 
              setIsEditing={setIsEditing}
              validationErrors={validationErrors}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Student Profile</h1>
      
      {isEditing ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <StudentForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSubmit={handleSubmit} 
            setIsEditing={setIsEditing}
            validationErrors={validationErrors}
          />
        </div>
      ) : (
        <div>
          <StudentProfile studentData={studentData} />
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md mt-6"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

function StudentProfile({ studentData }) {
  if (!studentData) return null;
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">{studentData.name}</h2>
          <p className="text-gray-600 mb-2"><span className="font-medium">Email:</span> {studentData.email}</p>
          <p className="text-gray-600 mb-2"><span className="font-medium">Roll Number:</span> {studentData.rollNumber}</p>
          <p className="text-gray-600 mb-2"><span className="font-medium">Contact:</span> {studentData.contact}</p>
          <p className="text-gray-600 mb-2"><span className="font-medium">Branch:</span> {studentData.branch}</p>
          <p className="text-gray-600 mb-2"><span className="font-medium">Section:</span> {studentData.section}</p>
        </div>
        <div>
          <p className="text-gray-600 mb-2"><span className="font-medium">Year of Admission:</span> {studentData.yearOfAdmission}</p>
          <p className="text-gray-600 mb-2"><span className="font-medium">Year of Graduation:</span> {studentData.yearOfGraduation}</p>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">LinkedIn:</span>{" "}
            {studentData.linkedin && (
              <a href={studentData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {studentData.linkedin}
              </a>
            )}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Twitter:</span>{" "}
            {studentData.twitter && (
              <a href={studentData.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {studentData.twitter}
              </a>
            )}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Coding Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentData.codingProfiles?.github && (
            <a 
              href={studentData.codingProfiles.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <span>GitHub</span>
            </a>
          )}
          {studentData.codingProfiles?.leetcode && (
            <a 
              href={studentData.codingProfiles.leetcode} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <span>LeetCode</span>
            </a>
          )}
          {studentData.codingProfiles?.codeforces && (
            <a 
              href={studentData.codingProfiles.codeforces} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <span>Codeforces</span>
            </a>
          )}
          {studentData.codingProfiles?.codechef && (
            <a 
              href={studentData.codingProfiles.codechef} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <span>CodeChef</span>
            </a>
          )}
          {studentData.codingProfiles?.gfg && (
            <a 
              href={studentData.codingProfiles.gfg} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <span>GeeksforGeeks</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentForm({ formData, handleInputChange, handleSubmit, setIsEditing, validationErrors }) {
  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors.name && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="rollNumber">
            Roll Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors.rollNumber ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors.rollNumber && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.rollNumber}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="contact">
            Contact <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors.contact && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.contact}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="branch">
            Branch <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors.branch ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors.branch && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.branch}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="section">
            Section <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="section"
            name="section"
            value={formData.section}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors.section ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors.section && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.section}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="yearOfAdmission">
            Year of Admission <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="yearOfAdmission"
            name="yearOfAdmission"
            value={formData.yearOfAdmission}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors.yearOfAdmission ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors.yearOfAdmission && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.yearOfAdmission}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="yearOfGraduation">
            Year of Graduation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="yearOfGraduation"
            name="yearOfGraduation"
            value={formData.yearOfGraduation}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors.yearOfGraduation ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors.yearOfGraduation && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.yearOfGraduation}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="linkedin">
            LinkedIn URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors.linkedin ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors.linkedin && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.linkedin}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="twitter">
            Twitter URL
          </label>
          <input
            type="text"
            id="twitter"
            name="twitter"
            value={formData.twitter}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors.twitter ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
          />
          {validationErrors.twitter && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.twitter}</p>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-4">Coding Profiles <span className="text-red-500">*</span></h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="codingProfiles.github">
            GitHub <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="codingProfiles.github"
            name="codingProfiles.github"
            value={formData.codingProfiles.github}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors['codingProfiles.github'] ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors['codingProfiles.github'] && (
            <p className="text-red-500 text-sm mt-1">{validationErrors['codingProfiles.github']}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="codingProfiles.leetcode">
            LeetCode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="codingProfiles.leetcode"
            name="codingProfiles.leetcode"
            value={formData.codingProfiles.leetcode}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors['codingProfiles.leetcode'] ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors['codingProfiles.leetcode'] && (
            <p className="text-red-500 text-sm mt-1">{validationErrors['codingProfiles.leetcode']}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="codingProfiles.codeforces">
            Codeforces <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="codingProfiles.codeforces"
            name="codingProfiles.codeforces"
            value={formData.codingProfiles.codeforces}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors['codingProfiles.codeforces'] ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors['codingProfiles.codeforces'] && (
            <p className="text-red-500 text-sm mt-1">{validationErrors['codingProfiles.codeforces']}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="codingProfiles.codechef">
            CodeChef <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="codingProfiles.codechef"
            name="codingProfiles.codechef"
            value={formData.codingProfiles.codechef}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors['codingProfiles.codechef'] ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors['codingProfiles.codechef'] && (
            <p className="text-red-500 text-sm mt-1">{validationErrors['codingProfiles.codechef']}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="codingProfiles.gfg">
            GeeksforGeeks <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="codingProfiles.gfg"
            name="codingProfiles.gfg"
            value={formData.codingProfiles.gfg}
            onChange={handleInputChange}
            className={`w-full border ${validationErrors['codingProfiles.gfg'] ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
            required
          />
          {validationErrors['codingProfiles.gfg'] && (
            <p className="text-red-500 text-sm mt-1">{validationErrors['codingProfiles.gfg']}</p>
          )}
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        <button 
          type="button" 
          onClick={() => setIsEditing(false)} 
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProfilePage;