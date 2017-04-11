"use strict";
const ObjectID = require('mongodb').ObjectID;
const chai = require('chai');
const should = chai.should();

var svc = require("../app/services/profileService"); 


describe("We are testing profile functions" , function(){
	 var profile = null;

	it("Should return a list of users", function(done) {
		svc.find({}).then(data => {
			profile = data.rows[0];
			// console.log(data); 
			done();
		}).catch(err => done(err))
	});
	
	it("filter users", function(done) {
		svc.find({gender:'M', age_min: 33, age_max: 44}).then(data => {
			console.log(data.rows.map(t=>t.age));
			done();
		}).catch(err => done(err))
	});

	it("should find a user by username", function(done) {
		svc.getByUsername(profile.username).then(function(data) {
			console.log(data);
			done(); 
		}, function(err) {
			done(err); 

		});
	})
	
	it('Should return mini-profile', (done) =>{
		svc.getByUsername('jenyount').then(function(data) {
			return svc.minimal(data._id).then(data => {
				console.log(data); 
				done();
			})
		}).catch(err => done(err));
	})
})