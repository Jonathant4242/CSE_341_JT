const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Contacts API',
        description: 'API documentation for the Contacts project',
        contact: {
            name: "John T",
            email: "jonathan.trok@outlook.com"
        }
    },
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
    ],
    schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js', './routes/contacts.js']; // API endpoint files

// Generate Swagger JSON
// Start server AFTER generating Swagger
// This is a workaround to ensure that the Swagger JSON is generated before the server starts
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server.js'); // Start server AFTER generating Swagger
});
