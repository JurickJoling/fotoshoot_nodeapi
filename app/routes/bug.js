/**
 * Created by cj on 3/4/17.
 */
"use strict";

const router = module.exports = require('express').Router();
const svc = require('../services/bugService');

router.post('/' , (req,res,next ) => {
    svc.save(req.body).then(data => res.status(200).json(data)).catch(err => next(err))
})