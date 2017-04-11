"use strict";

const router = require('express').Router();
const merge = require('deepmerge');
const svc = require('../services/messageService'); 

module.exports = router;



/**
 * @swagger
 * /v1/messages:
 *   get:
 *     summary: List of conversations
 *     description: List of conversations for the user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of messages
 *     tags:
 *       - Messages
 */
router.get('/', function(req,res,next) {
	req.query = merge({users : req.userId}, req.query || {});

	svc.getMessages(req.query).then(data => {
		res.status(200).json(data);
	}).catch(err => next(err));
});


router.get('/:id', function(req,res,next) {
	svc.get({_id : req.params.id, user_id : req.userId}).then(data => res.status(200).json(data)).catch(err => next(err));
});



/**
 * @swagger
 * definition:
 *   NewMessage:
 *     type: object
 *     properties:
 *       to:
 *         type: uuid
 *         example: 57d2474b52a3ae723bb806a7
 *       conversation_id:
 *         type: uuid
 *       message:
 *         type: string
 *         example: This is the message
 *     required:
 *     - to
 *     - body
 *     
 * /v1/messages:
 *   post:
 *     summary: New Message
 *     description: New Message
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref : "#/definitions/NewMessage"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: New Message
 *     tags:
 *       - Messages
 */
router.post('/', function(req,res,next) {
	req.body.from = req.userId;

	svc.sendMessage(req.body).then(data => {
		res.status(200).json(data);
	}).catch(err => next(err));
});