require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const contactsRoutes = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON requests
app.use(express.json());

// Swagger UI
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/contacts', contactsRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Root Route
app.get('/', (req, res) => {
    res.send('Hello, John!');
});

// API Test Route
app.get('/api/data', (req, res) => {
    res.json({
        message: "This is a test response",
        data: [
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" }
        ]
    });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
