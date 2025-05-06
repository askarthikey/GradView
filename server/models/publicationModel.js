const mongoose = require("mongoose");

const PublicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },  // Explicit ID field
  title: { type: String, required: true },
  description: { type: String, required: true },
  authorsUsernames: [{ type: String }], // Array of author usernames
  thumbnail: { type: String }, // Thumbnail URL
  publicationDate: { type: Date },
  status: { type: String }, // e.g., "published"
  publicationLink: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Publication", PublicationSchema);