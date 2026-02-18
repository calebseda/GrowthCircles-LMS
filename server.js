// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'JateloArchitect@2025',
  database: 'growthcircles',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// POST handler for Expression of Interest
app.post('/submit-interest', async (req, res) => {
  const {
    orgName,
    contactPerson,
    email,
    phone,
    country,
    serviceType,
    projectDetails,
    additionalInfo
  } = req.body;

  try {
    const sql = `
      INSERT INTO applications
      (full_name, email, phone, country, role_applied, artefacts, comment, status, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;
    const artefacts = JSON.stringify({
      organization: orgName,
      contactPerson,
      projectDetails,
      additionalInfo
    });

    await pool.query(sql, [
      orgName, // full_name used for org
      email,
      phone,
      country,
      serviceType, // role_applied extended to include premium services
      artefacts,
      `Submitted by ${contactPerson}`
    ]);

    res.json({ success: true, message: 'Expression of Interest submitted successfully!' });
  } catch (err) {
    console.error('Error inserting application:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Serve all static files from the GrowthCircles folder
// Make sure you run this file from inside the GrowthCircles directory
app.use(express.static(path.join(__dirname)));

// Default route: load completeStarterCourse.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'completeStarterCourse.html'));
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
