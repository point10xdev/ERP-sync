// Import required dependencies
// express: Web framework for creating routes
// swagger-jsdoc: Generates OpenAPI/Swagger documentation from code comments
// swagger-ui-express: Serves Swagger UI for viewing API documentation
// config: Our application configuration
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from '../config/config';

// Create a new router instance
// A router helps organize our routes in a modular way
const router = express.Router();

// Swagger definition
// Swagger/OpenAPI is a standard for documenting REST APIs
// This configuration tells Swagger how to generate our API documentation
const swaggerOptions = {
  definition: {
    // Specify the OpenAPI version we're using
    openapi: '3.0.0',
    // Basic information about our API
    info: {
      title: 'ERP Sync API',           // The name of our API
      version: '1.0.0',                // Current version
      description: 'API documentation for ERP Sync application',  // What our API does
      contact: {
        name: 'API Support',           // Who to contact for help
        email: 'support@erpsync.com'   // Support email
      },
      license: {
        name: 'MIT',                   // Our API's license
        url: 'https://opensource.org/licenses/MIT'  // License details
      }
    },
    // Define our API servers
    servers: [
      {
        url: `http://localhost:${config.port}/api`,  // Development server URL
        description: 'Development server'            // Server description
      },
      {
        url: 'https://api.erpsync.com/api',         // Production server URL
        description: 'Production server'             // Server description
      }
    ],
    // Define security schemes (how to authenticate)
    components: {
      securitySchemes: {
        bearerAuth: {                  // We use Bearer token authentication
          type: 'http',                // HTTP authentication
          scheme: 'bearer',            // Bearer token scheme
          bearerFormat: 'JWT'          // Our tokens are JWT format
        }
      }
    },
    // Apply security to all endpoints by default
    security: [{
      bearerAuth: []                   // Require JWT token for all endpoints
    }]
  },
  // Tell Swagger where to find our route files
  // It will scan these files for JSDoc comments to generate documentation
  apis: ['./src/routes/*.ts']
};

// Generate the Swagger specification
// This creates a JSON object containing all our API documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Set up the Swagger UI
// This creates a beautiful, interactive documentation page
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,                      // Enable the API explorer
  customCss: '.swagger-ui .topbar { display: none }',  // Hide the Swagger top bar
  customSiteTitle: 'ERP Sync API Documentation'        // Custom page title
}));

// Provide raw Swagger JSON
// This endpoint returns the Swagger specification as JSON
// Useful for tools that need to parse our API documentation
router.get('/api-docs.json', (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'application/json');  // Set correct content type
  res.send(swaggerSpec);                              // Send the Swagger spec
});

// Export the router
// This makes our documentation routes available to the main application
export default router; 