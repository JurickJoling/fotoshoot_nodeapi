var router = require('express').Router(); 
var pjson = require('../../package.json');
var MongoClient = require('mongodb').MongoClient;
var config = require('../../config'); 

module.exports = router; 


router.get('/version' , function(req,res, next) {
	res.send({version:pjson.version})
});


router.get('/db' , function(req,res, next) {
// console.log(config.db); 
	MongoClient.connect(config.db, function(err, db) { 
		if(err == null) {
			res.send({'conncted': '1', env: process.env.NODE_ENV});
			return ;
		}
        res.send(err);
    });
});