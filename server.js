require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const contactsRoutes = require('./routes/contacts');
const cors = require('cors'); // Import CORS middleware

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all requests
app.use(cors());  

// Middleware to parse JSON requests
app.use(express.json());

// Swagger UI
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/contacts', contactsRoutes);

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

// MongoDB Connection and Start Server 
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
