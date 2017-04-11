"use strict";

const router = module.exports = require('express').Router();
const svc = require('../services/castingcallService'); 
const errorHandler = require('../lib/errorHandler');


/**
 * @swagger
 * /v1/castingcalls:
 *   get:
 *     summary: Get casting calls
 *     description: Get list of casting calls
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: login
 *     tags:
 *       - Casting Calls
 */
router.get('/:id?', function(req,res,next) {
	// req.query.where = req.query.where || {};
	if(req.params.id || req.query.id )
	{
		return svc.get(req.params.id).then(data => res.status(200).json(data)).catch(err => next(err))
		
	}

	svc.find(req.query).then(data => res.status(200).json(data) ).catch(err => next(err)); 
});


/**
 * @todo: rewrite swagger documentation
 * 
 * @swagger
 * definition:
 *   NewCastingCall:
 *     type: object
 *     properties: 
 *       title:
 *         type: string
 *         example: My casting call
 *       location:
 *         type: string
 *         example: New York / NY
 *       date:
 *         type: string
 *         example: 01/01/2018
 *       description:
 *         type: string
 *         example: A little about my casting call and our needs
 *       genres:
 *         type: Array
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             example: [fashion show, sportswear]
 *       roles: 
 *         type: Array
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             schema: 
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: model
 *                 about:
 *                   type: string
 *                   example: about role 1
 *                 requirements:
 *                   type: string
 *                   example: requirements for role 1
 *                 objectionables:
 *                   type: Array
 *                   schema:
 *                     type: array
 *                     items: 
 *                       type: string
 *                       example: [nudity, alcohol]
 *                   
 *                 
 *             
 *     required: 
 *       - title
 *       - location
 *       - date
 *     
 * /v1/castingcalls:
 *   post:
 *     summary: New casting call
 *     description: Create a new casting call
 *     parameters: 
 *       - name: body
 *         in: body
 *         required: true
 *         schema: 
 *           $ref: "#/definitions/NewCastingCall"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Casting call object
 *     tags:
 *       - Casting Calls
 */
router.post('/', function(req,res,next) {
	req.body.user_id = req.userId;

	svc.saveCastingCall(req.body).then(data => {
		res.status(200).json(data);
	}).catch(err => next(err))
});

router.post('/apply', function(req,res,next) {
	req.body.user_id = req.userId;
	svc.apply(req.body, function(err, data) {
		if(err)
			res.send({'error' : err});
		else 
			res.send(data);		
	})
});