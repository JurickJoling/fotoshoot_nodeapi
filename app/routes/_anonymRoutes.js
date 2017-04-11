var router = require('express').Router(); 
var User = require('../services/userService'); 

module.exports = router;


/**
 * @swagger
 * definition:
 *   RegisterObject: 
 *     type: object
 *     required:
 *     - username
 *     - email
 *     - password
 *     - account_type
 *     example: {"username" : "myusername" , "email":"email@example.com", "password":"123456", "account_type":"model"}
 *   RegisterResponse:
 *     type: object
 *     example: { "_id": "57f9debea58107c4799e4079", "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiNTdmOWRlYmVhNTgxMDdjNDc5OWU0MDc5IiwiZXhwIjoxNDgzNzcyODc4LCJpYXQiOjE0NzU5OTMyNzh9.M98Uz5GkEfoeJeWPXVwAkn3sRHSFhDPAphouuLSxJN0"}
 */

/**
 * @swagger
 * /v1/register:
 *   post:
 *     summary: Register
 *     description: Register
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema: 
 *           $ref: "#/definitions/RegisterObject"
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           $ref: "#/definitions/RegisterResponse"
 *     tags:
 *       - Membership Security
 */
router.post('/v1/register', function(req,res,next) {
	User.register(req.body).then(data => res.status(200).json(data)).catch(err => next(err));
});

/**
 * @swagger
 * definition:
 *   AuthenticateUser:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     example : {"email":"myemail@example.com" , "password":"mypassword"}
 *   AuthenticationUserRes:
 *     type: object
 *     example : {"accessToken": "XXXXX-ACCESS-TOKEN-XXXXX", "fname": "first", "lname": "last" }
 */
/**
 * @swagger
 * /v1/authenticate:
 *   post:
 *     summary: Authenticate
 *     description: Authenticate
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema: 
 *           $ref: "#/definitions/AuthenticateUser"
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           $ref : "#/definitions/AuthenticationUserRes"
 *     tags:
 *       - Membership Security
 */
router.post('/v1/authenticate', function(req,res,next) {
	User.authenticate(req.body).then(data => res.status(200).json(data)).catch(err => next(err));

});



/**
 * @swagger
 * /v1/reminderToken:
 *   post:
 *     summary: Password Reminder Token
 *     description: Password Reminder Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: login
 *     tags:
 *       - Membership Security
 */
router.post('/v1/reminderToken', function(req,res,next) {
	res.send({
		function:'reminderToken',
		version:'1.0'
	}); 
});



/**
 * @swagger
 * /v1/reset:
 *   post:
 *     summary: Reset Password
 *     description: Reset Password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: login
 *     tags:
 *       - Membership Security
 */
router.post('/v1/reset', function(req,res,next) {
	res.send({
		function:'reset',
		version:'1.0'
	}); 
});

router.post('/v1/change_password', function(req,res,next) {
    User.changePassword(req.body).then(data => res.status(200).json(data)).catch(err => next(err));
});

router.post('/v1/forgot', function(req,res,next) {
	User.forgotPassword(req.body).then(data => res.status(200).json(data)).catch(err => next(err));
});

router.get('/v1/reset/:token', function(req,res,next) {
	User.isValidToken(req.params.token).then(data => res.status(200).json(data)).catch(err => next(err));
});

router.post('/v1/reset/:token', function(req, res,next) {
	User.resetPassword(req.body, req.params.token).then(data => res.status(200).json(data)).catch(err => next(err));
});

