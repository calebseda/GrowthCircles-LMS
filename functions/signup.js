// Netlify Function: signup.js
// Handles POST /signup requests from signup.html

const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    // Parse form data (Netlify Functions receive body as string)
    const formData = new URLSearchParams(event.body);

    const full_name = formData.get('full_name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const country = formData.get('country');
    const location_details = formData.get('location_details');
    const education_level = formData.get('education_level');
    const field_of_study = formData.get('field_of_study');
    const occupation = formData.get('occupation');
    const years_experience = formData.get('years_experience');
    const skills = formData.get('skills');
    const interests = formData.get('interests');
    const linkedin = formData.get('linkedin');
    const twitter = formData.get('twitter');
    const whatsapp = formData.get('whatsapp');
    const role = formData.get('role');
    const consent = formData.get('consent');

    // Connect to MySQL (use environment variables in Netlify dashboard)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Insert into applicants table
    await connection.execute(
      `INSERT INTO applicants 
        (full_name, email, phone, country, location_details, education_level, field_of_study, occupation, years_experience, skills, interests, linkedin, twitter, whatsapp, role, consent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name, email, phone, country, location_details, education_level,
        field_of_study, occupation, years_experience, skills, interests,
        linkedin, twitter, whatsapp, role, consent === 'true'
      ]
    );

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Signup successful. Thank you for joining GrowthCircles LMS!" }),
    };

  } catch (err) {
    console.error("Signup error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error during signup", error: err.message }),
    };
  }
};
