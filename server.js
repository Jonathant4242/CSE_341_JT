require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const contactsRoutes = require('./routes/contacts');

// Middleware to parse JSON requests
app.use(express.json());

// Route for contacts
app.use('/contacts', contactsRoutes);

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
    res.send('Hello, John!');
});

// API route
app.get('/api/data', (req, res) => {
    res.json({
        message: "This is a test response",
        data: [
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" }
        ]
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});