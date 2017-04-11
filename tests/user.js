"use strict";


var chai = require('chai');
//var chaiHttp = require('chai-http');
// var server = require('../server/app');
var should = chai.should();

var User = require("../app/models/user"); 
var svc = require("../app/services/userService"); 
var config = require('../config'); 
const Model  = require('../app/models')


describe("Testing User model", function(){

	var rand = Math.round(Math.random()*9999999); 

	
	var pwd = '123456'; 

	var user_model = {
		username	: 'cj-test' + rand, 
		password	: pwd, 
		email 		: ` fname.lname.${rand}@cj-segevs.co.edu`,
		account_type: `model`,
		// display_name: `fname mname lname`,
		fname 		: `fname`,
		lname 		: `lname`, 
		dob	 		: new Date('2000-02-21'), 
		// type		: 'Personal',  
		
		
	};

	it('should register a new user', function(done) {
	
		svc.register(user_model).then(data => {
			console.log(user_model); 
			done();
		}).catch(err => done(err)); 
		
	});
	
	it('should fail to register user (duplicate email / username)', function(done) {
	
		svc.register(user_model).then(data => {
			done(new Error('Should have failed'));
		}).catch(err => done());
	});
	
	it('should fail to login', function(done) {
		svc.authenticate({
			email		:'none', 
			password	:'none'
		}).then(data => {
			done(new Error('Should have failed'));
		}).catch(err => {console.log(err); done(); })
	});
	
	it('should login', function(done) {
		svc.authenticate({
			email		: user_model.email,
			password	: user_model.password
		}).then(data => {
			// console.log('\n*******************************\nLogin\n******************************\n')
			// console.log(data); 
			done();
		}).catch(err => done(err))
	});
	
});