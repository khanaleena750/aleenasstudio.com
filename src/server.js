const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse incoming data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors());

// Serve static files from the "public" folder (if you have one)
app.use(express.static(path.join(__dirname, '../public')));

// Dummy in-memory users store (replace this with a real database in production)
let users = []; 

// POST endpoint for sign up
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, email, password: hashedPassword };
        users.push(newUser);

        res.json({ success: true, message: 'Sign-up successful! You can now log in.' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, message: 'Server error during signup.' });
    }
});

// POST endpoint for login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ email }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ success: true, message: 'Login successful', token });
});

// POST endpoint for contact form
app.post('/send', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).send('All fields are required.');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aleenasstudio@gmail.com',
            pass: 'qdkh lbrp punw njzs'
        }
    });

    const mailOptions = {
        from: email,
        to: 'aleenasstudio@gmail.com',
        subject: `New Message from ${name} - ${subject}`,
        text: `You received a new message from your website contact form:\n\n
        Name: ${name}\n
        Email: ${email}\n
        Subject: ${subject}\n
        Message: \n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Failed to send message. Please try again.');
        }
        console.log('Email sent:', info.response);

        const userMailOptions = {
            from: 'aleenasstudio@gmail.com',
            to: email,
            subject: 'Thank you for contacting us!',
            text: `Hello ${name},\n\nThank you for reaching out! We have received your message and will get back to you soon.\n\nRegards, \nAleena's Studio`
        };

        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Confirmation email error:', error);
            } else {
                console.log('Confirmation email sent:', info.response);
            }
        });

        res.send('Message sent successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
