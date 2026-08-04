const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

let swaggerSpec = { openapi: '3.0.0', info: { title: 'JobConnect API', version: '1.0.0' }, paths: {} };

try {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'JobConnect API',
        version: '1.0.0',
        description: 'API documentation for the JobConnect MEAN stack job portal',
      },
      servers: [
        {
          url: `/api/v1`,
          description: 'Production API Server',
        },
      ],
    },
    apis: [path.join(__dirname, '../routes/*.js')],
  };
  swaggerSpec = swaggerJsdoc(options);
} catch (error) {
  console.warn('Swagger initialization skipped:', error.message);
}

module.exports = swaggerSpec;
