const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  linkedin: String,
  twitter: String,
  contact: String,
  rollNumber: String,
  yearOfAdmission: String,
  yearOfGraduation: String,
  branch: String,
  section: String,
  codingProfiles: {
    leetcode: String,
    github: String,
    codeforces: String,
    codechef: String,
    gfg: String
  }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;