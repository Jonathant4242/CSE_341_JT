const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'API documentation for the Contacts project'
  },
  host: 'cse-341-jt.onrender.com',  // Change to your Render deployment URL
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/contacts.js'];  // Only scan the contacts routes

swaggerAutogen(outputFile, endpointsFiles, doc);
