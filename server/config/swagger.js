const swaggerJsdoc = require('swagger-jsdoc');
const appConfig = require('./appConfig');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tourism Company API',
            version: '1.0.0',
            description: 'API documentation for Tourism Company backend services',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: appConfig.baseUrl,
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        message: {
                            type: 'string'
                        }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        data: {
                            type: 'object'
                        },
                        message: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        security: []
    },
    apis: ['./routes/*.js', './models/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
console.log('📖 Swagger base URL:', swaggerSpec.servers[0].url);

module.exports = swaggerSpec;
