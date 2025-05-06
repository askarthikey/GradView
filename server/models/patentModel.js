const mongoose = require("mongoose");

const PatentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  authorsUsernames: [{ type: String }], // Array of author usernames
  thumbnail: { type: String }, // Thumbnail URL
  publicationDate: { type: Date },
  status: { type: String }, // e.g., "published"
  patentLink: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patent", PatentSchema);