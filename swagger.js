const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
        info: {
            title: 'BD Address Line API',
            version: '1.0.0',
            description: 'API documentation for BD Address Line API',
        },
    },
    apis: ['./index.js'], // Path to your Express.js routes file
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
