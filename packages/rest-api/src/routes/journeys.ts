/**
 *  @swagger
 *   components:
 *     schemas:
 *       Journey:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *             description: The unique identifier of the journey.
 *           origin:
 *             type: string
 *             description: The id of the origin station.
 *           destination:
 *             type: string
 *             description: The id of the destination station
 *           departAt:
 *             type: string
 *             description: When the train leaves
 *           arriveAt:
 *             type: string
 *             description: When the train arrives
 *           price:
 *             type: number
 *             format: float
 *             description: The cost of the journey in GBP
 *         example:
 *            id: d3750126-4cbb-4599-acd3-ef573257a8e0
 *            origin: ab17d211-1e9c-433e-848e-fcc48452294b
 *            destination: b2ccbb92-e50e-4741-88e1-e7b7faa8fe16
 *            departAt: 2021-11-25T23:29:47.497Z
 *            arriveAt: 2021-11-26T04:12:46.567Z
 *            price: 97.11
 *       Journeys:
 *         type: array
 *         items:
 *           $ref: '#/components/schemas/Journey'
 */

/**
 *  @swagger
 *  tags:
 *    name: Journeys
 *    description: API to retrieve journeys
 */

/**
 * @swagger
 * /search:
 *   get:
 *     description: Get journeys between two stations
 *     tags: [Journeys]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: X-Client-Name
 *         schema:
 *           type: string
 *           example: TrainlineWebsite
 *         required: true
 *         description: The name of the platform making the request
 *       - in: header
 *         name: X-Auth-Token
 *         schema:
 *           type: string
 *           example: 8f1e0825a84.14b33afae21.9aefd0072a
 *         required: true
 *         description: User authorisation token
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *           example: ab17d211-1e9c-433e-848e-fcc48452294b
 *         required: true
 *         description: The id of the origin station
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *           example: b2ccbb92-e50e-4741-88e1-e7b7faa8fe16
 *         required: true
 *         description: The id of the destination station
 *       - in: query
 *         name: departAt
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2021-11-25T23:29:47.497Z
 *         required: true
 *         description: The time to search for
 *     responses:
 *       "200":
 *         description: An array of Journeys
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journeys'
 */

import express from "express";
import { v4 as uuidv4 } from 'uuid';

const journeyRouter = express.Router();

const dateAddHours = (date: Date, hours: number) => {
  date.setTime(date.getTime()+(hours*60*60*1000))
  return date;
}

journeyRouter.get("/", (request, response) => {
    if(!request.headers['x-client-name']){
        return response.status(400).send('Missing client name header')
    }
    if(!request.headers['x-auth-token']){
        return response.status(400).send('Missing auth token header')
    }

    const origin = request.query.origin;
    const destination = request.query.destination;
    const departAt = request.query.departAt;

    if(!origin){
        return response.status(400).send('Missing origin')
    }
    if(!destination){
        return response.status(400).send('Missing destination')
    }
    if(!departAt){
        return response.status(400).send('Missing departAt')
    }
    
    const output = [...Array(7)].map((_, i) => ({
        "id": uuidv4(),
        "origin": origin,
        "destination": destination,
        "departAt": dateAddHours(new Date("2021-01-26T13:29:00.000Z"), i),
        "arriveAt": dateAddHours(new Date("2021-01-26T13:29:00.000Z"), i + 3),
        "price": (Math.floor(Math.random() * (10000 - 100) + 100) / 100),
    }));

    return response.send(output);
});

export default journeyRouter;
 