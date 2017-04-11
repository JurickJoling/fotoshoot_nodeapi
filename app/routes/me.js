'use strict';
const router = module.exports = require('express').Router();
const User = require('../services/userService');
const photos_svc = require('../services/photoService');
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const merge = require('deepmerge')
const shortid = require('shortid')
const config = require('../../config')
const profileSvc = require('../services/profileService')


var s3 = new aws.S3({
	accessKeyId : config.aws.s3.key,
	secretAccessKey : config.aws.s3.secret
	// params: {Bucket: 'crave-test-bucket'}
});

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket:  'fs.photos.v2',
		// bucket:  'crave-test-bucket',
		metadata: function (req, file, cb) {
			cb(null, {fieldName: file.fieldname});
		},
		key: function (req, file, cb) {
			const segments = file.originalname.split('.');
			const ext = segments[segments.length - 1];
			
			req.uploaded = {key  : req.userId + '/' + shortid.generate() + '.' + ext} ;
			cb(null,req.uploaded.key);
		}
	})
}) ;




/**
 * @swagger
 * /v1/me:
 *   get:
 *     summary: User Info
 *     description: User info for logged-in user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User Info
 *     tags:
 *       - Profile
 */
router.get('/', function(req,res,next) {
	User.getById(req.userId).then(data => res.status(200).json(data)).catch(err => next(err)); 
});


/**
 * @swagger
 * /v1/me/photos:
 *   get:
 *     summary: User Photos
 *     description: User photos for logged-in user. This list will have extended information.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User Photos
 *     tags:
 *       - Profile
 */
router.get('/photos', function(req,res,next) {
	User.photos(req.userId, null, function(err, data){
		if(err) {
			res.send({'error' : err});
		} else {
			res.send(data);
		}
	});
});


/**
 * @swagger
 * /v1/me/photo:
 *   post:
 *     summary: Upload Photo
 *     description: Upload user's photo
 *     parameters:
 *       - name : file
 *         in : formData
 *         required : true
 *         type : file
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Upload Photo
 *     tags:
 *       - Profile
 */
router.post('/photo', upload.single('file'), function(req,res,next) {
	req.file.user_id = req.userId;
	
	photos_svc.upload(req.file).then(data => {
		res.status(200).json(data);
	}).catch(err => next(err));
});


/**

 *
 * @swagger
 * definition:
 *   UpdateProfileData:
 *     type: object
 *     properties:
 *       about:
 *         type: string
 *         description: About the talent
 *         example: A little about me, I'm great and awesome
 *     required:
 *       - photo_id
 *
 * /v1/me:
 *   post:
 *     summary: Update profile
 *     description: Update user's profile
 *     parameters:
 *       - in : body
 *         name: body
 *         schema:
 *           $ref : "#/definitions/UpdateProfileData"
 *     produces:	
 *       - application/json
 *     responses:
 *       200:
 *         description: Update profile
 *     tags:
 *       - Profile
 */
router.post('/', function(req,res,next) {
	
	req.body.user_id = req.userId;

	profileSvc.update(req.body).then(data=> res.status(200).json(data)).catch(err => next(err))
});



router.delete('/photo/:id', function(req,res,next) {
	User.delete_photo(req.params.id, function(err, data) {
		if(err) {
			res.send({'error' : err});
		} else {
			res.send(data);
		}
	});
});

router.put('/contact', function(req,res,next) {
	User.addContact(req.userId, req.body,function(err, data) {
		if(err) {
			res.send({'error' : err});
		} else {
			res.send(data);
		}
	});
})

router.put('/location', function(req,res,next) {
	User.addLocation(req.userId, req.body,function(err, data) {
		if(err) {
			res.send({'error' : err});
		} else {
			res.send(data);
		}
	});
// User.addLocation = function(userId, data, cb) {
});
