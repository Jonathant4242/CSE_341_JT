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
            url: "http://localhost:8080",
            description: "Local Development Server"
        },
        {
            url: "https://cse-341-jt.onrender.com",
            description: "Production Server (Render Deployment)"
        }
    ],
    tags: [
        {
            name: "Contacts",
            description: "Endpoints related to contacts"
        }
    ],
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js', './routes/contacts.js']; // This is the file that contains the API endpoints

// ✅ Pass the `doc` object into `swaggerAutogen`
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server.js'); // Start the server AFTER generating Swagger
});
