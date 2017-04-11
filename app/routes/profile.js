const router = module.exports = require('express').Router();
const svc = require('../services/profileService'); 

router.get('/:id', function(req,res,next) {
	svc.getByUsername(req.params.id).then(data => res.status(200).json(data)).catch(err => next(err));
})


