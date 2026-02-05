const express = require('express');
const nodemailer = require('nodemailer');
const upload = require('../middleware/upload');
const db = require('../db');

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/', upload.single('resume'), async (req, res) => {
  const { name, email, phone, position } = req.body;
  const file = req.file;

  if (!name || !email || !position || !file) {
    return res.status(400).json({ message: 'Name, email, position, and resume are required.' });
  }

  try {
    // Save to DB
    await db.execute(
      `INSERT INTO applications (name, email, phone, position, resume_path, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, email, phone || null, position, file.filename]
    );

    // Email notification
    await transporter.sendMail({
      from: `"Available Nurse Staffing Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New application: ${position} - ${name}`,
      text: `
New application received:

Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Position: ${position}
Resume file: ${file.filename}
      `,
      attachments: [
        {
          filename: file.originalname,
          path: file.path,
        },
      ],
    });

    res.json({ message: 'Application submitted successfully.' });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Failed to submit application.' });
  }
});

module.exports = router;
