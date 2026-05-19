const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multivendor Ecommerce API',
      version: '1.0.0',
      description: 'Production Grade Scalable High Density Core REST API Documentation Engine for Multivendor E-Commerce Applications (MERN Stack). Built with Dual Token Engine Mechanics.',
      contact: {
        name: 'Nusrat Jahan Dina',
        email: 'nusrat49141@gmail.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`, 
        description: 'Development Server',
      },
    ],
    components: {
     
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          name: 'Authorization',
          description: 'Standard security header formatting layout checklist. Type "Bearer " followed by your validated system access token signature string payload context. Example: "Bearer eyJhbG..."'
        }
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2, description: "User's legal profile identity name metadata tracking parameter.", example: 'John Doe' },
            email: { type: 'string', format: 'email', description: 'Unique core communications index identifier user email.', example: 'john@example.com' },
            password: { type: 'string', format: 'password', minLength: 8, description: 'Secure identity password matching validation constraints profile string.', example: 'securePassword123' },
            phone: { type: 'string', description: 'Optional sparse index profile customer phone parameter tracing string.', example: '+1234567890' },
            role: { type: 'string', enum: ['customer', 'vendor', 'admin'], default: 'customer', description: 'Multi tenant operations system authorization mapping level metrics status identifier.', example: 'customer' }
          }
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Registration Successfully Done' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' },
                role: { type: 'string', example: 'customer' }
              }
            }
          }
        },

        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'securePassword123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login Successfully Done' },
            accessToken: { type: 'string', description: 'Short lived system utility credentials validation token string token layer verification data structure key identifier.', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDBm...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' },
                role: { type: 'string', example: 'customer' },
                isEmailVerified: { type: 'boolean', example: false }
              }
            }
          }
        },

        RefreshSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            accessToken: { type: 'string', description: 'Newly spawned security clearance payload matrix signature validation credential parameters token string data.', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.newFreshAccessSignatureTrace...' }
          }
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', description: 'Generic system trace failure error context string message notification layout matching framework verification data.', example: 'Internal server error exception logs fallback data processing execution tracking' }
          }
        }
      }
    }
  },
 
  apis: ['./src/routes/**/*.js', './routes/**/*.js'], 
};

const swaggerdoc = swaggerJsdoc(options);

const swaggerSpecs = (app, port) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerdoc));
  console.log(`Automated Swagger API Engine Running Active Context Portal:`);
  console.log(`Link Workspace UI Document Framework Access At: http://localhost:${port}/api-docs`);
};

module.exports = swaggerSpecs;
