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
    // host: "localhost:8080",
    // basePath: "/",
    host: "cse-341-jt.onrender.com", 
    basePath: "/",
    schemes: ['https'],  
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

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js', './routes/contacts.js']; 

// Generate Swagger JSON
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server.js'); // Start server AFTER generating Swagger
});
