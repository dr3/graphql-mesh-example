/**
 *  @swagger
 *   components:
 *     schemas:
 *       Basket:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *             description: The unique identifier of the basket.
 *           journeys:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Journey'
 *             description: The journeys in the basket
 */

/**
 *  @swagger
 *  tags:
 *    name: Baskets
 *    description: API to create and receive baskets
 */

/**
 * @swagger
 * /baskets/create:
 *   post:
 *     description: Create a basket containing journeys
 *     tags: [Baskets]
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Journeys'
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
 *         description: The created basket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Basket'
 */

/**
 * @swagger
 * /baskets/{id}:
 *   get:
 *     description: Get a basket
 *     tags: [Baskets]
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
 *         description: The id of the basket to return
 *     responses:
 *       "200":
 *         description: A Basket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Basket'
 *       "404":
 *         description: Basket not found.
 */

import express from "express";
import { v4 as uuidv4 } from 'uuid';

const basketRouter = express.Router();

const basketStore: any = {};

basketRouter.post("/create", (request, response) => {
    if(!request.headers['x-client-name']){
        return response.status(400).send('Missing client name header')
    }
    if(!request.headers['x-auth-token']){
        return response.status(400).send('Missing auth token header')
    }

    const journeys = request.body;

    if(!journeys){
        return response.status(400).send('Missing journeys')
    }
    if(!Array.isArray(journeys) || !journeys.length){
        return response.status(400).send('Post body is not array containing journeys')
    }

    const id = uuidv4();

    const basket = {
        id,
        journeys
    };

    basketStore[id] = basket;

    return response.send(basket);
});

basketRouter.get("/:id", (request, response) => {
    if(!request.headers['x-client-name']){
        return response.status(400).send('Missing client name header')
    }
    if(!request.headers['x-auth-token']){
        return response.status(400).send('Missing auth token header')
    }
    if(!request.params.id){
        return response.status(400).send('Missing id in path')
    }

    const basket = basketStore[request.params.id]

    if(!basket){
        return response.status(404).send('Unable to find basket')
    }

    return response.send(basket);
});

export default basketRouter;
 