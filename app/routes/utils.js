/**
 * Created by cj on 3/1/17.
 */
"use strict";

const router = module.exports = require('express').Router();
const svc = require('../services/accountTypeService');
const errorHandler = require('../lib/errorHandler');


router.get('/account-types', (req,res,next) => {
    svc.get().then(data => res.status(200).json(data)).catch(err => next(err));
})