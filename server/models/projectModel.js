// projectModel.js
const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  teamMemUsernames: [{ type: String }], // Array of team member usernames
  thumbnail: { type: String }, // Thumbnail URL
  liveLink: { type: String },
  githubLink: { type: String },
  status: { type: String }, // e.g., "V0 done"
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);

