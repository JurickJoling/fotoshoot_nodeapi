var ObjectID = require('mongodb').ObjectID;
var chai = require('chai');
var svc = require("../app/services/bookingService"); 
var model = require("../app/models/book");
var assert = chai.assert;


"use strict";

describe("We are testing booking functions" , function(){
	var booking_request = {
		"date": "10/10/2010",
		"location": "New york, NY",
		"team": "Me myself & I ii",
		"description": "Aliens running ii",
		"user_id": "58cc6e85329a1b6948140a2c",
		"booked_user_id": "58cc6e96329a1b6948140c29",
		"compensation": {
			"amount" : {
				"min" : 100,
				"max" : 300,
			},
			"type": "hourly",
			"details": "30/hr with a bonus at the end"
		},
	}; 
	
	
	var c_id = null ;



	it("Should book a user for a gig", function(done) {
		svc.create(booking_request).then(data => {
			booking_request._id = data._id; 
			done(); 
		}).catch(err => done(err));
	}); 
	
	


	it("Should return the user's pending bookings" , function(done) {
		svc.find({user_id : booking_request.booked_user_id,status:'P'}).then(data => {
			assert(data.rows.find(t=>t._id.toString() == booking_request._id), 'new booking not found');
			done(); 
		}).catch(err => done(err));
	});

	it("Should update booking" , function(done) {
		var data = { status: 'T', user_id: booking_request.booked_user_id, _id: booking_request._id }
		svc.update(data).then(data => {
			done();
		}).catch(err => done(err)); 

	});


})