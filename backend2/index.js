import express from 'express';
import config from './connection/connection.js';
import quizRouter from './endpoints/quizroute.js';
import userRouter from './endpoints/userroute.js';
import questionRouter from './endpoints/questionRoutes.js';
import submissionRouter from './endpoints/submissionRoutes.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Quiz Platform API',
      version: '1.0.0',
      description: 'API documentation for the Online Quiz Platform',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./endpoints/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(config);

// Routes
app.use('/users', userRouter);
app.use('/quizzes', quizRouter);
app.use('/questions', questionRouter);
app.use('/submissions', submissionRouter);

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(5000, () => {
  console.log("Listening on port 5000");
  console.log(`API documentation available at http://localhost:5000/api-docs`);
});