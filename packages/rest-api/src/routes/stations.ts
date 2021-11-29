/**
 *  @swagger
 *   components:
 *     schemas:
 *       Station:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *             description: The unique identifier of the station.
 *           name:
 *             type: string
 *             description: The english name of the station.
 *           code:
 *             type: string
 *             description: Short letter code of the station
 *           countryCode:
 *             type: boolean
 *             description: The ISO 3166-1 alpha-2 country code of the station
 *           latitude:
 *             type: number
 *             format: float
 *             description: The latitude value of the station
 *           longitude:
 *             type: number
 *             format: float
 *             description: The longitude value of the station
 *         example:
 *            id: ab17d211-1e9c-433e-848e-fcc48452294b
 *            name: Birmingham New Street
 *            code: BHM
 *            countryCode: GB
 *            latitude: -68.969238
 *            longitude: 97.112376
 *       StationsResponse:
 *         type: object
 *         properties:
 *           stations:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Station'
 */

/**
 *  @swagger
 *  tags:
 *    name: Stations
 *    description: API to retrieve stations
 */

/**
 * @swagger
 * /stations:
 *   get:
 *     description: Get all stations
 *     tags: [Stations]
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
 *     responses:
 *       "200":
 *         description: An array of UK stations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StationsResponse'
 */

/**
 * @swagger
 * /stations/{id}:
 *   get:
 *     description: Get a station
 *     tags: [Stations]
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
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: ab17d211-1e9c-433e-848e-fcc48452294b
 *         required: true
 *         description: The id of the station to return
 *     responses:
 *       "200":
 *         description: A station
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       "404":
 *         description: Station not found.
 */

import express from "express";
import stationsFixture from "../fixtures/stations.json";

const stationsRouter = express.Router();

stationsRouter.get("/", (request, response) => {
    if(!request.headers['x-client-name']){
        return response.status(400).send('Missing client name header')
    }
    if(!request.headers['x-auth-token']){
        return response.status(400).send('Missing auth token header')
    }
    return response.send({ stations: stationsFixture });
});

stationsRouter.get("/:id", (request, response) => {
    if(!request.headers['x-client-name']){
        return response.status(400).send('Missing client name header')
    }
    if(!request.headers['x-auth-token']){
        return response.status(400).send('Missing auth token header')
    }
    if(!request.params.id){
        return response.status(400).send('Missing id in path')
    }

    const station = stationsFixture.find(station => station.id === request.params.id);

    if(!station){
        return response.status(404).send('Unable to find station')
    }

    return response.send(station);
});

export default stationsRouter;
 