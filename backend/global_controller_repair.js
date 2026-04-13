const fs = require('fs');
const path = require('path');

const controllersDir = './src/controllers';
const controllers = [
  'superAdminController.js',
  'settingsController.js',
  'retryController.js',
  'followUpController.js',
  'communicationController.js',
  'callLogController.js',
  'autoResponseSettingsController.js',
  'authController.js',
  'attendanceController.js',
  'analyticsController.js'
];

console.log('--- GLOBAL CONTROLLER REPAIR START ---');

controllers.forEach(file => {
  const filePath = path.join(controllersDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace imports
    content = content.replace(/const db = require\(['"]\.\.\/config\/db['"]\);/g, "const { query, transaction } = require('../config/db');");
    
    // Replace method calls
    content = content.replace(/db\.query\(/g, 'query(');
    content = content.replace(/db\.transaction\(/g, 'transaction(');
    content = content.replace(/db\.execute\(/g, 'execute(');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ FIXED: ${file}`);
  } else {
    console.log(`❌ NOT FOUND: ${file}`);
  }
});

console.log('--- REPAIR COMPLETE ---');
