import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportData() {
  try {
    console.log('Fetching students from database...');
    const response = await axios.get('http://localhost:5001/student-api/students');
    
    // Remove MongoDB-specific fields
    const cleanData = response.data.map(student => {
      const { _id, __v, ...cleanStudent } = student;
      return cleanStudent;
    });
    
    // Save to project root directory
    const outputPath = path.resolve(__dirname, '../seed-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(cleanData, null, 2));
    console.log(`Student data exported successfully to ${outputPath}`);
    console.log(`Total students exported: ${cleanData.length}`);
  } catch (error) {
    console.error('Error exporting data:', error.message);
    console.error('Make sure your server is running at http://localhost:5001');
  }
}

exportData();
