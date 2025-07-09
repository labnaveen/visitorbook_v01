const swaggerJsdoc = require('swagger-jsdoc')
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Common components APIs Dev',
      version: '1.0.0',
      description: 'Swagger documentation for Sanity APIs'
    },
    servers: [{
      url: process.env.APIURL
    }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./swagger.js', './src/controllers/swagger.js']
}
const specs = swaggerJsdoc(options)
module.exports = specs

/**
* @swagger
* components:
*  schemas:
*   SuccessResponse:
*    type: object
*    example:
*     status: 200
*     meta: {}
*     info: {}
*     errors: []
*     data: []
*     message: success message
*     purpose: api purpose
*   ErrorResponse:
*    type: object
*    example:
*     status: 500
*     data: []
*     message: error message
*     errors: ['error descriptors']
*     meta: {}
*     info: {}
*     purpose: api purpose
*   ValidationResponse:
*    type: object
*    example:
*     status: 422
*     data: []
*     message: validation error message
*     purpose: api purpose
*/
