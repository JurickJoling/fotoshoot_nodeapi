"use strict";

const router = module.exports = require('express').Router();
const svc = require('../services/profileService');
const _ = require('lodash');
const merge = require('deepmerge')



/**
 * @swagger
 * /v1/browse{type}:
 *   get:
 *     summary: Browse profiles
 *     description: Get list of profiles
 *     parameters:
 *       - name: type
 *         in : path
 *         type: string
 *         enum : ['/', '/models','/photographers']
 *         default: '/'
 *       - name: gender
 *         in  : query
 *         type: string
 *         enum: [M,F]
 *       - name: age_min
 *         in  : query
 *         type: number
 *       - name: age_max
 *         in  : query
 *         type: number
 *       - name: height_min
 *         in  : query
 *         type: number
 *       - name: height_max
 *         in  : query
 *         type: number
 *       - name: weight_min
 *         in  : query
 *         type: number
 *       - name: weight_max
 *         in  : query
 *         type: number
 *       - name: waist_min
 *         in  : query
 *         type: number
 *       - name: waist_max
 *         in  : query
 *         type: number
 *       - name: bust_min
 *         in  : query
 *         type: number
 *       - name: bust_max
 *         in  : query
 *         type: number
 *       - name: hips_min
 *         in  : query
 *         type: number
 *       - name: hips_max
 *         in  : query
 *         type: number
 *       - name: shoeSize_min
 *         in  : query
 *         type: number
 *       - name: shoeSize_max
 *         in  : query
 *         type: number
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: list of profiles
 *     tags:
 *       - Browse
 */
/**
 * @todo: add filters to documentaion 
 * 
 */
router.get('/:account_type_top?', function(req,res,next) {
	
	req.query = _.omitBy(merge(req.query, req.params), _.isEmpty); 

	svc.find(req.query).then(data => res.status(200).json(data)).catch(err => next(err))
});



/**
 * @swagger
 * /v1/browse/profile/{uname}:
 *   get:
 *     summary: View Profile
 *     description: Profile page
 *     parameters:
 *       - name: uname
 *         in: path
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User's profile
 *     tags:
 *       - Browse
 */
router.get('/profile/:uname?', function(req,res,next) {

	if(!req.params.uname) {
		return next(new Error('Username required'))
	}

	svc.getByUsername(req.params.uname).then(data => res.status(200).json(data) ).catch( err => next(err))
});
