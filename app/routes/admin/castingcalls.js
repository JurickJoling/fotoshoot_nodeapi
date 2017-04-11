/**
 * Created by cj on 2/4/17.
 */
"use strict";

const router = module.exports  = require('express').Router();

const svc = require('../../services/castingcallService');

/**
 * Get list of users
 */
router.get('/', (req,res,next) => {

    svc.find(req.query).then(list => {
        res.status(200).json(list);
    }).catch(err => next(err))
})


/**
 * Get user details
 */
router.get('/:id', (req,res,next) => {

    svc.get(req.params.id).then(list => {
        res.status(200).json(list);
    }).catch(err => next(err))
});

/**
 * Update a user
 */
router.patch('/:id', (req,res,next) => {
    req.body._id = req.params.id;

    svc.update(req.body).then(list => {
        res.status(200).json(list);
    }).catch(err => next(err))
})