import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerRouter = express.Router();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trainline Web December Meetup - Rest API Example",
      version: "1.0.0",
      description: "A simple train based Express API",
    }
  },
  apis: ['**/*.ts'],
};

const specs = swaggerJsdoc(options);

swaggerRouter.get('/specs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});
swaggerRouter.use("/", swaggerUi.serve, swaggerUi.setup(specs));

export default swaggerRouter;
