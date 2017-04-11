'use strict';

var chai = require('chai');
//var chaiHttp = require('chai-http');
// var server = require('../server/app');
var should = chai.should();

var photo = require("../app/models/photo"); 
var svc = require('../app/services/photoService');

describe("We are testing photo model", function(){
	it ("Should find photos to display on profile" , function(done) {
		photo.findProfilePhotos({user_id :'56ecb5c337045d8905191389'}, function(err, data) {
			console.log(data.length); 
			process.exit(); 
		});
	})
	
	
	it("Should change avatar", done => {
		svc.setAvatar('57d2474b52a3ae723bb806a7','5877d8b6e0d5d29cede4591a').then(data => {
			console.log(data); 
			done();
		}).catch(err => done(err))
	})
})