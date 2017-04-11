const ObjectID = require('mongodb').ObjectID;

const bcrypt = require('bcryptjs')
const Promise = require('bluebird');
const shortid = require('shortid');
const mdb = require('../db/mdb'); 

var Schema = mdb.Schema;


var schema = new mdb.Schema({ 
    "email" 	: {type: String, index: { unique: true }},
    "hash" 		: String,
    "hash_algo" : String,
    "insert_time" 	: {type : Date, default : Date.now}, 
    "status" 	: {type: String, default : 'P'},	
    "fs_user_id" 	: Number,
    "username" 	: {type: String, index: { unique: true }},
    "verification_code" : {type: String, default : shortid() + shortid() },
	"resetPasswordToken": String,
	"resetPasswordExpires": Date
});

var model = mdb.model('users',schema);



model.encryptPassword = function(password) {

    return new Promise(function (resolve, reject) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) return reject(err);

			bcrypt.hash(password, salt, function (err, hash) {
				if(err) return reject(err);

				var data = {
			            hash: hash,
			            hash_algo: 'bcrypt'
			          };

				resolve(data);
			});
		});
    });
};

model.checkPassword = function(password, hash) {
	return new Promise(function (resolve, reject) {
		bcrypt.compare(password, hash, function (err, isCorrect) {
	  		if (err) return reject(err); 

	  		resolve(isCorrect);
		}); 
	})
};


model.createUser = function(data) {
	return  new Promise((resolve, reject) => {
		var pwd = model.encryptPassword(data.password).then(pwd_data => {
			delete data.password;
			data.hash = pwd_data.hash;
			data.hash_algo = pwd_data.hash_algo;

			model.create(data).then(data => {
				resolve(data);
			}, err => {
				reject(err);
			});

			// return model.create(data);
		}, err => {
			reject(err);
		});	
	});
};

model.addLocation = function(id, data, cb) {
	model.pushChild(User.collection_name, {_id : id},'locations',  data, function(err, data){
		cb(err, data);
	});
};

model.addContact = function(id, data, cb) {
	model.pushChild(User.collection_name, {_id : id},'contacts',  data, function(err, data){
		cb(err, data);
	});
};

module.exports = model;