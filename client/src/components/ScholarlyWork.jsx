import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ScholarlyWork = () => {
  const [projects, setProjects] = useState([]);
  const [patents, setPatents] = useState([]);
  const [publications, setPublications] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("projects");
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    teamMemUsernames: [],
    authorsUsernames: [],
    thumbnail: "",
    liveLink: "",
    githubLink: "",
    patentLink: "",
    publicationLink: "",
    publicationDate: "",
    status: ""
  });
  const [editMode, setEditMode] = useState(false);
  
  // State for detail view
  const [detailView, setDetailView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || "projects";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, patentsRes, publicationsRes] = await Promise.all([
          fetch("http://localhost:5001/student-api/projects"),
          fetch("http://localhost:5001/student-api/patents"),
          fetch("http://localhost:5001/student-api/publications"),
        ]);

        const projectsData = await projectsRes.json();
        const patentsData = await patentsRes.json();
        const publicationsData = await publicationsRes.json();

        setProjects(projectsData);
        setPatents(patentsData);
        setPublications(publicationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Close detail view when tab changes
  useEffect(() => {
    setDetailView(false);
    setSelectedItem(null);
  }, [activeTab]);

  const data =
    activeTab === "projects"
      ? projects
      : activeTab === "patents"
      ? patents
      : publications;

  const setData = (newData) => {
    if (activeTab === "projects") setProjects(newData);
    else if (activeTab === "patents") setPatents(newData);
    else setPublications(newData);
  };

  const handleTabClick = (tab) => {
    navigate(`/schwk/${tab}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Reset form based on the active tab type
  const getEmptyFormData = (type) => {
    const baseData = {
      id: "",
      title: "",
      description: "",
      thumbnail: "",
      status: "",
    };

    if (type === "projects") {
      return {
        ...baseData,
        teamMemUsernames: [],
        liveLink: "",
        githubLink: "",
      };
    } else if (type === "patents") {
      return {
        ...baseData,
        authorsUsernames: [],
        publicationDate: "",
        patentLink: "",
      };
    } else { // publications
      return {
        ...baseData,
        authorsUsernames: [],
        publicationDate: "",
        publicationLink: "",
      };
    }
  };

  const openForm = (type, item = null) => {
    setFormType(type);
    setEditMode(!!item);
    setFormData(
      item || getEmptyFormData(type)
    );
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e) => {
    const { name, value } = e.target;
    // Split comma-separated values into an array
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, [name]: arrayValue }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const method = editMode ? "PUT" : "POST";
    const endpoint = `http://localhost:5001/student-api/${formType}${editMode ? `/${formData._id}` : ""}`;
  
    try {
      // Prepare the data according to the model schema
      const submissionData = {
        id: editMode ? formData.id : new Date().getTime().toString(),
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail || "",
        status: formData.status || "",
      };

      // Add type-specific fields
      if (formType === "projects") {
        submissionData.teamMemUsernames = formData.teamMemUsernames || [];
        submissionData.liveLink = formData.liveLink || "";
        submissionData.githubLink = formData.githubLink || "";
      } else {
        // For patents and publications
        submissionData.authorsUsernames = formData.authorsUsernames || [];
        submissionData.publicationDate = formData.publicationDate ? new Date(formData.publicationDate) : null;
        
        if (formType === "patents") {
          submissionData.patentLink = formData.patentLink || "";
        } else { // publications
          submissionData.publicationLink = formData.publicationLink || "";
        }
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
  
      const updatedItem = await res.json();
  
      const updatedData = editMode
        ? data.map((item) =>
            item._id === updatedItem._id ? updatedItem : item
          )
        : [...data, updatedItem];
  
      setData(updatedData);
      setShowForm(false);
      
      // Update selected item if in detail view
      if (detailView && selectedItem && selectedItem._id === updatedItem._id) {
        setSelectedItem(updatedItem);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5001/student-api/${formType}/${id}`, {
        method: "DELETE",
      });
      setData(data.filter((item) => item._id !== id));
      
      // Close detail view if deleted item is currently selected
      if (detailView && selectedItem && selectedItem._id === id) {
        setDetailView(false);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Open detail view when clicking on a card
  const openDetailView = (item) => {
    setSelectedItem(item);
    setDetailView(true);
  };

  // Render specific fields based on the type of form
  const renderTypeSpecificFields = () => {
    if (formType === "projects") {
      return (
        <>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Team Members (comma-separated)</label>
            <input
              type="text"
              name="teamMemUsernames"
              value={formData.teamMemUsernames ? formData.teamMemUsernames.join(', ') : ''}
              onChange={handleArrayInputChange}
              placeholder="username1, username2, ..."
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Live Link</label>
            <input
              type="url"
              name="liveLink"
              value={formData.liveLink || ''}
              onChange={handleInputChange}
              placeholder="https://..."
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">GitHub Link</label>
            <input
              type="url"
              name="githubLink"
              value={formData.githubLink || ''}
              onChange={handleInputChange}
              placeholder="https://github.com/..."
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </>
      );
    } else {
      // Common fields for patents and publications
      return (
        <>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Authors (comma-separated)</label>
            <input
              type="text"
              name="authorsUsernames"
              value={formData.authorsUsernames ? formData.authorsUsernames.join(', ') : ''}
              onChange={handleArrayInputChange}
              placeholder="username1, username2, ..."
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Publication Date</label>
            <input
              type="date"
              name="publicationDate"
              value={formData.publicationDate ? new Date(formData.publicationDate).toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          {formType === "patents" ? (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Patent Link</label>
              <input
                type="url"
                name="patentLink"
                value={formData.patentLink || ''}
                onChange={handleInputChange}
                placeholder="https://..."
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          ) : (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Publication Link</label>
              <input
                type="url"
                name="publicationLink"
                value={formData.publicationLink || ''}
                onChange={handleInputChange}
                placeholder="https://..."
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          )}
        </>
      );
    }
  };

  // Render detailed view component
  const renderDetailView = () => {
    if (!selectedItem) return null;
    
    const getTypeColor = () => {
      if (activeTab === "projects") return "bg-blue-500";
      if (activeTab === "patents") return "bg-green-500";
      return "bg-purple-500"; // publications
    };
    
    const getTypeIcon = () => {
      if (activeTab === "projects") return "📂"; // Project icon
      if (activeTab === "patents") return "📜"; // Patent icon
      return "📚"; // Publication icon
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{getTypeIcon()}</span>
              <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
            </div>
            <button 
              onClick={() => setDetailView(false)}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Main content - Left side (2/3) */}
            <div className="md:col-span-2 space-y-6">
              {/* Thumbnail */}
              {selectedItem.thumbnail && (
                <div className="rounded-lg overflow-hidden shadow-md bg-gray-100 h-72">
                  <img 
                    src={selectedItem.thumbnail} 
                    alt={selectedItem.title}
                    className="w-full h-full object-contain" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/800x400?text=No+Image";
                    }}
                  />
                </div>
              )}
              
              {/* Description */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedItem.description}</p>
              </div>
            </div>
            
            {/* Right side (1/3) - Metadata and actions */}
            <div className="space-y-6">
              {/* Status badge */}
              {selectedItem.status && (
                <div className={`${getTypeColor()} text-white text-sm font-medium py-1 px-3 rounded-full inline-block`}>
                  {selectedItem.status}
                </div>
              )}
              
              {/* Metadata card */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Details</h3>
                <ul className="space-y-3">
                  {/* Show team members for projects */}
                  {activeTab === "projects" && selectedItem.teamMemUsernames && selectedItem.teamMemUsernames.length > 0 && (
                    <li>
                      <span className="block text-sm text-gray-500">Team Members</span>
                      <span className="font-medium">{selectedItem.teamMemUsernames.join(', ')}</span>
                    </li>
                  )}
                  
                  {/* Show authors for patents and publications */}
                  {(activeTab === "patents" || activeTab === "publications") && 
                   selectedItem.authorsUsernames && selectedItem.authorsUsernames.length > 0 && (
                    <li>
                      <span className="block text-sm text-gray-500">Authors</span>
                      <span className="font-medium">{selectedItem.authorsUsernames.join(', ')}</span>
                    </li>
                  )}
                  
                  {/* Publication date for patents and publications */}
                  {(activeTab === "patents" || activeTab === "publications") && selectedItem.publicationDate && (
                    <li>
                      <span className="block text-sm text-gray-500">Publication Date</span>
                      <span className="font-medium">{formatDate(selectedItem.publicationDate)}</span>
                    </li>
                  )}
                </ul>
              </div>
              
              {/* Links card */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <div className="space-y-3">
                  {/* Project links */}
                  {activeTab === "projects" && selectedItem.liveLink && (
                    <a 
                      href={selectedItem.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <span className="mr-2">🔗</span> Live Demo
                    </a>
                  )}
                  
                  {activeTab === "projects" && selectedItem.githubLink && (
                    <a 
                      href={selectedItem.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <span className="mr-2">💻</span> GitHub Repository
                    </a>
                  )}
                  
                  {/* Patent link */}
                  {activeTab === "patents" && selectedItem.patentLink && (
                    <a 
                      href={selectedItem.patentLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <span className="mr-2">📄</span> Patent Document
                    </a>
                  )}
                  
                  {/* Publication link */}
                  {activeTab === "publications" && selectedItem.publicationLink && (
                    <a 
                      href={selectedItem.publicationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <span className="mr-2">📃</span> Read Publication
                    </a>
                  )}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    openForm(activeTab, selectedItem);
                    setDetailView(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedItem._id);
                    setDetailView(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Projects, Patents & Publications
      </h1>

      <div className="flex justify-center space-x-4 bg-gray-200 p-2 rounded-lg">
        {["projects", "patents", "publications"].map((tabName) => (
          <button
            key={tabName}
            onClick={() => handleTabClick(tabName)}
            className={`px-4 py-2 rounded transition-colors duration-300 ${
              activeTab === tabName
                ? "bg-white shadow font-medium"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => openForm(activeTab)}
          className={`px-4 py-2 rounded text-white ${
            activeTab === "projects"
              ? "bg-blue-500"
              : activeTab === "patents"
              ? "bg-green-500"
              : "bg-purple-500"
          }`}
        >
          Add {activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-lg overflow-hidden border relative hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => openDetailView(item)}
            >
              {/* Thumbnail Image */}
              {item.thumbnail && (
                <div className="h-40 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                    }}
                  />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                {/* Show additional fields based on the item type */}
                {activeTab === "projects" && item.teamMemUsernames && item.teamMemUsernames.length > 0 && (
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Team:</strong> {item.teamMemUsernames.join(', ')}
                  </p>
                )}
                
                {(activeTab === "patents" || activeTab === "publications") && item.authorsUsernames && item.authorsUsernames.length > 0 && (
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Authors:</strong> {item.authorsUsernames.join(', ')}
                  </p>
                )}
                
                {/* Display formatted date for patents and publications */}
                {(activeTab === "patents" || activeTab === "publications") && item.publicationDate && (
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Date:</strong> {formatDate(item.publicationDate)}
                  </p>
                )}
                
                {item.status && (
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Status:</strong> {item.status}
                  </p>
                )}
                
                {/* Display indicator for more content instead of all links */}
                <div className="absolute bottom-3 right-4 text-blue-500">
                  <span>View details →</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-2">No data available</p>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {editMode ? "Edit" : "Add"} {formType.slice(0, -1)}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail || ''}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full border border-gray-300 p-2 rounded"
                />
                {formData.thumbnail && (
                  <div className="mt-2 h-24 w-full bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      className="h-full w-auto object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x200?text=Invalid+URL";
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Published, In Progress, V0 Done"
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              
              {/* Type-specific fields */}
              {renderTypeSpecificFields()}
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editMode ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {detailView && renderDetailView()}
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ScholarlyWork;