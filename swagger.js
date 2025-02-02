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
    host: process.env.NODE_ENV === "production" 
        ? "cse-341-jt.onrender.com" 
        : "localhost:8080",  
    basePath: "/",  
    schemes: process.env.NODE_ENV === "production" ? ["https"] : ["http"],  
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
const outputFile = "./swagger.json";
const endpointsFiles = ["./server.js", "./routes/contacts.js"];  

// ✅ DELETE existing Swagger JSON before regenerating
const fs = require("fs");
if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);  // 🔥 No more `rm -f swagger.json`
}

// ✅ Generate Swagger JSON
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require("./server.js"); // Start the server AFTER generating Swagger
});
