// server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email යැවීම සඳහා Nodemailer සැකසීම (වැඩි දියුණු කළ ක්‍රමය)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Port 465 සඳහා true භාවිතා කරන්න
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        // ජාල සම්බන්ධතා ගැටළු මඟහරවා ගැනීමට මෙය උපකාරී වේ
        rejectUnauthorized: false
    }
});

// Front-end එකෙන් දත්ත ලබා ගන්නා API Route එක (POST Request)
app.post('/api/contact', (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Email එකේ ආකෘතිය සැකසීම
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL, // පණිවිඩය ලැබිය යුතු ඔබේ Email ලිපිනය
        subject: `New Contact Form Submission: ${subject}`,
        html: `
            <h3>New Message from Accounting Advisor Website</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    // Email එක යැවීම
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send message.' });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ success: true, message: 'Message sent successfully!' });
        }
    });
});

// සර්වර් එක ආරම්භ කිරීම
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
