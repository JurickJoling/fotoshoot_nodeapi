"use strict";

const router = module.exports  = require('express').Router();

const svc = require('../../services/adminService');

router.get('/dashboard', (req,res,next) => {
    svc.dashbaord({}).then(data => {
        res.status(200).json(data);
    }).catch(err => next(err))
})