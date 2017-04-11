"use strict";

const router = module.exports  = require('express').Router();

const svc = require('../../services/blogService');

router.get('/', (req,res,next) => {

    svc.find_articles({}).then(list => {
        res.status(200).json(list);
    }).catch(err => next(err))
})



router.post('/', (req,res,next) => {

    req.body.id = null; 
    
    svc.saveArticle(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => next(err))
})


router.patch('/', (req,res,next) => {
    
    if(!req.body.id){
        return next(new Error('Article id required'))
    }

    svc.saveArticle(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => next(err))
})