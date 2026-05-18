const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce / User Management API',
      version: '1.0.0',
      description: 'User Authentication and Management API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000', 
        description: 'Development Server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app, port) => {
  // Swagger Page Route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
};

module.exports = swaggerDocs;