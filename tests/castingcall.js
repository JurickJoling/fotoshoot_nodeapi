"use strict";
var ObjectID = require('mongodb').ObjectID;
var chai = require('chai'); 
var should = chai.should();

var Service = require('../app/services/castingcallService');

describe("We are testing casting call service and model", function() {
	const rand = Math.round(Math.random() * 999999);

	var _id =  new ObjectID('58b8ffd2263a6e6cce05ac89') ;

	

	it("Should create a new casting call" , function(done) {
		var date = new Date();
		date.setDate(date.getDate() + 35);

		const call = {
			title : 'test - ' + rand,
			description : 'description - ' + rand,
			summary		 : 'summary - ' + rand,
			tags : ["Tag1", "tag2", "tag3", "tag4", "tag5", "tag6"], 
			duration: {
				amount: 4, 
				unit : 'hour', 
				formatted : '4 Hours'
			},
			date : date,
			location : {
				lat: rand, 
				lng: -rand, 
				city: "New York", 
				state: "NY", 
				country: "US", 
				"formatted" : "New york, ny"
			},
			user_id : '57f9e605351a49968085ed6b',
			roles : [
				{
					"account_type"   : "model",
					"about"          : "Looking for an awesome model",
					"requirements"   : [],
					"objectionables" : [],
					"compensation"   : {
						"compensation_type" : "paid",
						"amount_start"      : 100,
						"amount_end"        : 100, 
						"message"			: "$100",
						"formatted"			: "$100"
					}
				}
			]
		};

		Service.saveCastingCall(call).then(data => {
			_id = data._id;
			done();
		}).catch(err => done(err));
	});
	
	it("Should change status of casting call to 'Test'", done => {
		Service.saveCastingCall({_id : _id, status : 'Test'}).then(data => {
			console.log(data);
			return done();
		}).catch(err => {
			return done(err);
		})
	})
	
	it("Should return all casting calls", function(done) {
		const q = {where : {'status' : 'Test'}};
		Service.find(q).then(data => {
			done();
		}).catch(err => done(err))
	});
	
	
	it("Should return a casting call (full details)", done => {
		return Service.get(_id).then(data=>{
			console.log(data);
			done();
		}).catch(err => done(err))
	})
	

	it("Should fail, sending bad ide to method", function(done){
		Service.find({id : 'test'}).then(data => done(data.rows == 0 ? null : "Wasn't supposed to return results.")).catch(err => done(err));

	})
})