const express = require('express');
const nodemailer = require('nodemailer');

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

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  try {
    await transporter.sendMail({
      from: `"Available Nurse Staffing Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Contact form from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}

Message:
${message}
      `,
    });

    res.json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

module.exports = router;
