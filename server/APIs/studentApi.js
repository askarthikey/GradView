const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/studentModel");
const bcryptjs = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const Project = require("../models/projectModel.js");
const Patent = require("../models/patentModel.js");
const Publication = require("../models/publicationModel.js");

const studentApp = express.Router();
studentApp.use(express.json());
const cors = require('cors');
studentApp.use(cors());

// ============ STUDENT ROUTES ============

// Get all students or filter by email
studentApp.get('/students', async (req, res) => {
  try {
    const { email } = req.query;
    const students = email
      ? await Student.find({ email: email })
      : await Student.find();
    
    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current logged in user (assuming authentication middleware sets req.user)
studentApp.get('/current-user', async (req, res) => {
  try {
    // If you have authentication middleware, you would use req.user
    // For this example, we'll assume user email is passed as query parameter
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    
    const student = await Student.findOne({ email });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.status(200).json(student);
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /students/:id - Get a student by ID
studentApp.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /students - Create a new student
studentApp.post('/students', async (req, res) => {
  try {
    // Check if student with this email already exists
    const existingStudent = await Student.findOne({ email: req.body.email });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this email already exists' });
    }
    
    // Create new student
    const newStudent = new Student(req.body);
    
    // Save student
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    console.error('Error creating student:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /students/:id - Update a student by ID
studentApp.put('/students/:id', async (req, res) => {
  try {
    // Find and update student
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return updated document and run validators
    );
    
    // Check if student exists
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.status(200).json(updatedStudent);
  } catch (err) {
    console.error('Error updating student:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /students/:id - Delete a student by ID
studentApp.delete('/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /students/email/:email - Get a student by email (alternative endpoint)
studentApp.get('/students/email/:email', async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    console.error('Error fetching student by email:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ PROJECT ROUTES ============

// Get all projects
studentApp.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get project by ID
studentApp.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create project
studentApp.post('/projects', async (req, res) => {
  try {
    // Set timestamps for new project
    const projectData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const newProject = new Project(projectData);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Error creating project:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project by ID
studentApp.put('/projects/:id', async (req, res) => {
  try {
    // Update the 'updatedAt' timestamp
    const projectData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const updated = await Project.findByIdAndUpdate(
      req.params.id, 
      projectData, 
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(updated);
  } catch (err) {
    console.error('Error updating project:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project
studentApp.delete('/projects/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ PATENT ROUTES ============

// Get all patents
studentApp.get('/patents', async (req, res) => {
  try {
    const patents = await Patent.find();
    res.json(patents);
  } catch (err) {
    console.error('Error fetching patents:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get patent by ID
studentApp.get('/patents/:id', async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id);
    if (!patent) {
      return res.status(404).json({ error: 'Patent not found' });
    }
    res.json(patent);
  } catch (err) {
    console.error('Error fetching patent:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create patent
studentApp.post('/patents', async (req, res) => {
  try {
    // Set timestamps for new patent
    const patentData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const newPatent = new Patent(patentData);
    await newPatent.save();
    res.status(201).json(newPatent);
  } catch (err) {
    console.error('Error creating patent:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update patent by ID
studentApp.put('/patents/:id', async (req, res) => {
  try {
    // Update the 'updatedAt' timestamp
    const patentData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const updated = await Patent.findByIdAndUpdate(
      req.params.id, 
      patentData, 
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Patent not found' });
    }
    
    res.json(updated);
  } catch (err) {
    console.error('Error updating patent:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete patent
studentApp.delete('/patents/:id', async (req, res) => {
  try {
    const deletedPatent = await Patent.findByIdAndDelete(req.params.id);
    if (!deletedPatent) {
      return res.status(404).json({ error: 'Patent not found' });
    }
    res.json({ message: "Patent deleted" });
  } catch (err) {
    console.error('Error deleting patent:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ PUBLICATION ROUTES ============

// Get all publications
studentApp.get('/publications', async (req, res) => {
  try {
    const publications = await Publication.find();
    res.json(publications);
  } catch (err) {
    console.error('Error fetching publications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get publication by ID
studentApp.get('/publications/:id', async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ error: 'Publication not found' });
    }
    res.json(publication);
  } catch (err) {
    console.error('Error fetching publication:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create publication
studentApp.post('/publications', async (req, res) => {
  try {
    // Set timestamps for new publication
    const publicationData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const newPublication = new Publication(publicationData);
    await newPublication.save();
    res.status(201).json(newPublication);
  } catch (err) {
    console.error('Error creating publication:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update publication by ID
studentApp.put('/publications/:id', async (req, res) => {
  try {
    // Update the 'updatedAt' timestamp
    const publicationData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const updated = await Publication.findByIdAndUpdate(
      req.params.id, 
      publicationData, 
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Publication not found' });
    }
    
    res.json(updated);
  } catch (err) {
    console.error('Error updating publication:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete publication
studentApp.delete('/publications/:id', async (req, res) => {
  try {
    const deletedPublication = await Publication.findByIdAndDelete(req.params.id);
    if (!deletedPublication) {
      return res.status(404).json({ error: 'Publication not found' });
    }
    res.json({ message: "Publication deleted" });
  } catch (err) {
    console.error('Error deleting publication:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = studentApp;