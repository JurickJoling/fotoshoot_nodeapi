"use strict";
const  router = module.exports = require('express').Router(); 
var svc = require('../services/galleryService');

/**
 * @todo: Add remove gallery
 * @todo: Add edit gallery
 * @todo: add remove photo from a gallery
 * @todo: add gallery invitation for a private gallery
 */

/**
 * @swagger
 * definition:
 *   AddGalleryObject:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *         description: Gallery's title / caption
 *         example: Gallery #1
 *       description:
 *         type: string
 *         example: This is my first gallery
 *       access:
 *         type: string
 *         enum: [Public, Private]
 *         example: Public
 *     required: 
 *       - title
 *     
 * /v1/galleries:
 *   post:
 *     summary: Add gallery
 *     description: Add a new gallery
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: gallery's data
 *     tags:
 *       - Galleries
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/AddGalleryObject"
 */
router.post('/', (req,res,next) => {
	req.body.user_id = req.userId; 
	
	svc.addGallery(req.body).then(data => {
		res.status(200).json(data); 
	}).catch(err => next(err))
})


/**
 * @swagger
 * definition:
 *   AddPhotoObject:
 *     type: object
 *     properties:
 *       photo_id:
 *         type: uuid
 *         description: Photo's id
 *         example: 5877d8b6e0d5d29cede99999
 *     required:
 *       - photo_id
 *
 * /v1/galleries/addPhoto/{id}:
 *   post:
 *     summary: Add photo
 *     description: Add a photo to gallery
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: gallery's data
 *     tags:
 *       - Galleries
 *     parameters:
 *       - name: id
 *         in: path
 *         type: uuid
 *         required: true
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/AddPhotoObject"
 */
router.post('/addPhoto/:id', (req,res,next) => {
	req.body.user_id = req.userId;
	req.body.id = req.params.id;

	svc.addPhoto(req.body).then(data => {
		res.status(200).json(data);
	}).catch(err => next(err))
})
