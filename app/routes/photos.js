"use strict";
const  router = module.exports = require('express').Router(); 
var svc = require('../services/photoService');


/**
 * @swagger
 * definition:
 *   UpdatePhotoObject:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *         description: Photo's title / caption
 *         example: Photo #1
 *       description:
 *         type: string
 *         example: About the photo
 *       location:
 *         type: string
 *         example: New york, NY
 *       tags:
 *         schema:
 *           type: array
 *           items: 
 *             type: string
 *             example: [tag1  , tag3]
 *       copyright:
 *         type: string
 *         example: John Doe 2015
 *       mature:
 *         type: boolean
 *         example: false
 *       avatar:
 *         type: boolean
 *         example: true
 *     
 * /v1/photos/{id}:
 *   patch:
 *     summary: Update photo
 *     description: Update an existing photo
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Photo data
 *     tags:
 *       - Photos
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         description: Photo's id
 *         required: true
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/UpdatePhotoObject"
 */
router.patch('/:id', (req,res,next) => {
	svc.update({
		_id : req.params.id, 
		user_id : req.userId
	} , req.body).then(data => {
		res.status(200).json(data); 
	}).catch(err => next(err))
})