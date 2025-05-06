import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  try {
    // Path to the seed data file
    const seedDataPath = path.resolve(__dirname, '../seed-data.json');
    
    // Check if the file exists
    if (!fs.existsSync(seedDataPath)) {
      console.error(`Seed data file not found at ${seedDataPath}`);
      console.error('Please run export-data.mjs first to create this file');
      return;
    }
    
    // Read the seed data
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
    console.log(`Found ${seedData.length} students to seed`);
    
    // Import each student
    for (const student of seedData) {
      try {
        // Check if student already exists
        const checkResponse = await axios.get(`http://localhost:5001/student-api/students?email=${student.email}`);
        
        if (checkResponse.data && checkResponse.data.length > 0) {
          console.log(`Student with email ${student.email} already exists, skipping`);
          continue;
        }
        
        // Add the student
        await axios.post('http://localhost:5001/student-api/students', student);
        console.log(`Added student: ${student.name} (${student.email})`);
      } catch (error) {
        console.error(`Error adding student ${student.email}:`, error.message);
      }
    }
    
    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    console.error('Make sure your server is running at http://localhost:5001');
  }
}

seedDatabase();
