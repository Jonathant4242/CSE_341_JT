// Purpose: Generate Swagger JSON file for API documentation.
const swaggerAutogen = require('swagger-autogen')();

// Load environment variables
const isProduction = process.env.NODE_ENV === 'production';

// Swagger JSON configuration
const doc = {
    info: {
        title: 'Contacts API',
        description: 'API documentation for the Contacts project',
        contact: {
            name: "John T",
            email: "jonathan.trok@outlook.com"
        }
    },
    // Host (optional)
    // host: "localhost:8080",
    // Base path (optional)
    // basePath: "/",
    host: isProduction ? "cse-341-jt.onrender.com" : "localhost:8080", 
    basePath: "/", 
    schemes: isProduction ? ['https'] : ['http'], 
    servers: [
        {
            url: "https://cse-341-jt.onrender.com",
            description: "Production Server (Render Deployment)"
        },
        {
            url: "http://localhost:8080",
            description: "Local Development Server"
        }
    ],
    tags: [
        {
            name: "Contacts",
            description: "Endpoints related to contacts"
        }
    ]
};
// Output file
const outputFile = './swagger.json';
const endpointsFiles = ['./server.js', './routes/contacts.js']; 

// Generate Swagger JSON
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server.js'); // Start server AFTER generating Swagger
});
