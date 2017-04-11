"use strict";

var ObjectID = require('mongodb').ObjectID;
var chai = require('chai');
//var chaiHttp = require('chai-http');
// var server = require('../server/app');
var should = chai.should();

var Msg = require("../app/models/message"); 
var Service = require("../app/services/messageService"); 
var model = require("../app/models/model"); 


describe("We are testing messaging functions" , function(){
	var c_id = null ;
	
	const users = {
		to   : '58cc6e82329a1b69481409ec' ,
		from : '58cc6eb5329a1b694814101a'
	};

	it("Should send a message using the service", function(done) {

		Service.sendMessage({
			to   : users.to ,
			from : users.from , 
			message : 'This is the test message'
		}).then(function(msg) {
			
			// add message to the conversation 
			return Service.sendMessage({
				conversation_id : msg._id,
				to   : users.to ,
				from : users.from ,
				message : 'This a followup test message'
			}).then(data => {
				done();	
			})
		}, function(err){ 
			done(err)
		})

	})

	it('Should return a single conversation', done => {
		Service.get({_id : '58ccbaedf931b0b7a2d7fc00', users : users.to})
			.then(data => {
				console.log(data); 
				done();
			})
			.catch(err => done(err))
	})

	it("Should return the inbox for the user", function(done) {
		Service.getConversations({user_id : users.to, limit : 15, skip : 0 }).then(data => {
			done();
		}).catch(err => done(err));

	})


})