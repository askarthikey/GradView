import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const Connect = () => {
  const [activeTab, setActiveTab] = useState("alumni");

  const alumni = [
    { id: 1, name: "John Doe", photo: "https://via.placeholder.com/64", position: "Software Engineer" },
    { id: 2, name: "Jane Smith", photo: "https://via.placeholder.com/64", position: "Data Scientist" },
    { id: 3, name: "Alice Johnson", photo: "https://via.placeholder.com/64", position: "Product Manager" },
    { id: 4, name: "Bob Williams", photo: "https://via.placeholder.com/64", position: "UX Designer" },
    { id: 5, name: "Charlie Brown", photo: "https://via.placeholder.com/64", position: "DevOps Engineer" },
    { id: 6, name: "Daisy Adams", photo: "https://via.placeholder.com/64", position: "AI Researcher" },
    { id: 7, name: "Ethan White", photo: "https://via.placeholder.com/64", position: "Cybersecurity Analyst" },
    { id: 8, name: "Fiona Black", photo: "https://via.placeholder.com/64", position: "Cloud Architect" },
    { id: 9, name: "George Harris", photo: "https://via.placeholder.com/64", position: "ML Engineer" },
    { id: 10, name: "Hannah King", photo: "https://via.placeholder.com/64", position: "Software Developer" },
  ];

  const peers = [
    { id: 1, name: "Michael Scott", photo: "https://via.placeholder.com/64", position: "Student" },
    { id: 2, name: "Pam Beesly", photo: "https://via.placeholder.com/64", position: "Student" },
    { id: 3, name: "Jim Halpert", photo: "https://via.placeholder.com/64", position: "Student" },
    { id: 4, name: "Dwight Schrute", photo: "https://via.placeholder.com/64", position: "Student" },
    { id: 5, name: "Angela Martin", photo: "https://via.placeholder.com/64", position: "Student" },
    { id: 6, name: "Kevin Malone", photo: "https://via.placeholder.com/64", position: "Student" },
    { id: 7, name: "Oscar Martinez", photo: "https://via.placeholder.com/64", position: "Student" },
    { id: 8, name: "Stanley Hudson", photo: "https://via.placeholder.com/64", position: "Student" },
    { id: 9, name: "Toby Flenderson", photo: "https://via.placeholder.com/64", position: "Student" },
    { id: 10, name: "Ryan Howard", photo: "https://via.placeholder.com/64", position: "Student" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Connect</h1>
      <Tabs defaultValue="alumni">
        <TabsList className="flex justify-center space-x-4 bg-gray-200 p-2 rounded-lg">
          <TabsTrigger value="alumni" onClick={() => setActiveTab("alumni")} className={activeTab === "alumni" ? "bg-white shadow px-4 py-2 rounded-md font-medium" : "text-gray-600 px-4 py-2 rounded-md font-medium"}>
            Alumni
          </TabsTrigger>
          <TabsTrigger value="peers" onClick={() => setActiveTab("peers")} className={activeTab === "peers" ? "bg-white shadow px-4 py-2 rounded-md font-medium" : "text-gray-600 px-4 py-2 rounded-md font-medium"}>
            Class Peers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="alumni">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {alumni.map((person) => (
              <UserCard key={person.id} user={person} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="peers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {peers.map((person) => (
              <UserCard key={person.id} user={person} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const UserCard = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4">
      <img src={user.photo} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
      <div>
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-gray-600">{user.position}</p>
      </div>
    </div>
  );
};

export default Connect;
