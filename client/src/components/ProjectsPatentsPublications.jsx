import { useState } from "react";

const ProjectsPatentsPublications = () => {
  const [activeTab, setActiveTab] = useState("projects");

  const projects = [
    { id: 1, title: "Xcelifiee", description: "A data visualization platform for analytics." },
    { id: 2, title: "GradView", description: "A student performance management system." },
    { id: 3, title: "ClipVault", description: "A secure video management platform." },
  ];

  const patents = [
    { id: 1, title: "AI-based Fraud Detection", description: "A patent for an AI-driven fraud detection system." },
  ];

  const publications = [
    { id: 1, title: "Deep Learning for Image Processing", description: "A research paper on image processing techniques using deep learning." },
  ];

  let data;
  if (activeTab === "projects") data = projects;
  else if (activeTab === "patents") data = patents;
  else data = publications;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Projects, Patents & Publications
      </h1>
      
      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 bg-gray-200 p-2 rounded-lg">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 rounded transition-colors duration-300 ${
            activeTab === "projects" ? "bg-white shadow font-medium" : "bg-gray-200 text-gray-600"
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab("patents")}
          className={`px-4 py-2 rounded transition-colors duration-300 ${
            activeTab === "patents" ? "bg-white shadow font-medium" : "bg-gray-200 text-gray-600"
          }`}
        >
          Patents
        </button>
        <button
          onClick={() => setActiveTab("publications")}
          className={`px-4 py-2 rounded transition-colors duration-300 ${
            activeTab === "publications" ? "bg-white shadow font-medium" : "bg-gray-200 text-gray-600"
          }`}
        >
          Publications
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPatentsPublications;
