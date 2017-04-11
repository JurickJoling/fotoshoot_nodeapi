
'use strict';
// import test from 'ava';

// test('foo', t => {
// 	t.pass();
// });
var config = require('../config');



var chai = require('chai');
//var chaiHttp = require('chai-http');
// var server = require('../server/app');
var should = chai.should();

var userService = require("../app/services/userService");
var model = require("../app/models/model");
var MongoClient = require('mongodb').MongoClient;

var db_conn = null;



describe("Testing User services", function(){
	const rand = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
	var user_obj = {};
	//
	// before(function(done) {
	// 	MongoClient.connect(config.db, function(err, db) { 
	//       if(err) { done("Could not connect to DB"); process.exit(); }
	//
	//       db_conn = db; 
	//
	//       done(); 
	//     });
	//	
	// });
	//

	it("Should return the user's photos", done => {
		userSerivce.photos('57d2474b52a3ae723bb806a7', {}, function(err, data) {
			console.log(data);
			done();
		}, err => {
			done(err);
		}).catch(err => {
			done(err);
		});
	})

	it("should return a list of pending users", done => {
		userService.find({status :'P'}).then(list => {
			console.log(list);
			done();
		}, err => {
			done(err);
		}).catch(err => {
			done(err);
		});
	});

	it("Login should fail (user does not exist)", done => {
		userService.authenticate({
			'email': 'NOUSER-test@test.com',
			'password': 'test@test.com',
		}).then(function (data) {
			done(new Error("Found user, didn't expect to find one"));
		}, function (err) {
			done(err);
		}).catch(err => {
			done(err);
		});
	});

	it("Login should fail (multiple users with that email)", done => {
		userService.authenticate({
			'email': 'test@test.com',
			'password': 'test@test.com',
		}).then(function (data) {
			done(new Error("Found user, didn't expect to find one"));
		}, function (err) {
			done(err);
		}).catch(err => {
			done(err);
		});
	});

	it("Login should fail (bad password)", done => {
		userService.authenticate({
			'email': 'test.101@test.com',
			'password': 'xxxxxxx',
		}).then(function (data) {
			done(new Error("Found user, didn't expect to find one"));
		}, function (err) {
			done(err);
		}).catch(err => {
			done(err);
		});
	});

	it("Register should fail (email exists)", done => {
		userService.register({
			'fname': 'test',
			'lname': 'test',
			'username': 'test',
			'email': 'test@test.com',
			'password': 'test',
		}).then(function (data) {
			done(new Error("Should have failed registering user"));
		}, function(err) {
			done(err);
		}).catch(err => {
			done(err);
		});
	});

	it("Register succeed registering a user", done => {
		var data = {
			'email': 'test' + rand + '@test.com',
			'username': 'user' + rand,
			'password': 'test',
			'fname' : 'test' + rand ,
			'lname' : 'test' + rand ,
			'account_type': 'model'
		};

		userService.register(data).then(data => {
			console.log(data);
			done();
		}, err => {
			done(err);
		}).catch(err => {
			done(err);
		});
	});

	it("Browse users", done => {
		userService.browse({
			account_type : 'model'
		}).then(users => {
			console.log(users);
			done();
		}, err => {
			done(err);
		}).catch(err => {
			done(err);
		});
	});

	it("Should return user by Id", done => {
		userSerivce.getById(user_obj._id || "57d2474b52a3ae723bb806a7", {}).then(function (data) {
			console.log(data);
			done();
		}, err => {
			done(err);
		}).catch(err => {
			done(err);
		});
	});

	it("should update a user", done => {
		userService.update({
			details : {
				fname 	: 'fname',
				lname 	: 'lname'
			},
			_id: '586b4a6477d9c5bcaebe92cf'
		}).then(data => {
			console.log(data);
			done();
		}, err => {
			done(err);
		}).catch(err => {
			done(err);
		});
	});

	it("should change a password", done => {
		userService.changePassword({
			id: '58cdec0e04c7f62a132b3df4',
			password: 'kuiskuis221'
		}).then(data => {
			console.log(data);
			done();
		}, err => {
			done(err);
		}).catch(err => {
			done(err);
		});
	});

	it("should forgot a password", done => {
		userService.forgotPassword({email: "lucky.thomaslee@gmail.com"}).then(data => {
			console.log(data);
			done();
		}, err => {
			done(err);
		}).catch(err => {
			done(err);
		});
	});

	it("should be valid token", done => {

		userService.isValidToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiNThjZGVjMGUwNGM3ZjYyYTEzMmIzZGY0IiwiZXhwIjoxNDk4MDAxNDk5LCJpYXQiOjE0OTAyMjU0OTl9.tbWYQbWwHxvKUE8sbgvu9ny9nOFN6lH7xmRswYK0rEA").then(data => {
			console.log(data);
			done();
        }, err => {
			done(err);
        }).catch(err => {
        	done(err);
		});

	});

	it("should reset a password", done => {
		userService.resetPassword({password: 'kuiskuis221'}, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiNThjZGVjMGUwNGM3ZjYyYTEzMmIzZGY0IiwiZXhwIjoxNDk4MDAxNDk5LCJpYXQiOjE0OTAyMjU0OTl9.tbWYQbWwHxvKUE8sbgvu9ny9nOFN6lH7xmRswYK0rEA").then(data => {
			console.log(data);
			done();
		}, err => {
			done(err);
		}).catch(err => {
			done(err);
		});
	})
});