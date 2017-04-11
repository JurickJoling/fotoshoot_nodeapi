"use strict";

const router = module.exports =  require('express').Router(); 
var User = require('../services/userService'); 

router.get('/', (req,res,next) => {
    User.find(req.query).then(list => {
        res.send(list);
    })    
});