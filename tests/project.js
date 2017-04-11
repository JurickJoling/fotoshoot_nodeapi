var ObjectID = require('mongodb').ObjectID;
var chai = require('chai');
//var chaiHttp = require('chai-http');
// var server = require('../server/app');
var should = chai.should();

var Service = require("../app/services/projectService"); 


describe("We are testing project functions" , function(){
	it("Should return a single project", function(done) {
		Service.find({id : '579a9ce137b16ec002148697'}, function(err, data) {
			console.log("ERR : ", err);
			console.log("DATA : ", data);

			process.exit();
		})
		
	}); 

	it("Should create a new project (Service)", function(done){

		Service.saveProject({
			title : 'Project title',
			description : 'Description',

		}, function(err, data) {
			console.log(data);

			done(err);
		});

	})

})