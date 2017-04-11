'use strict';

var chai = require('chai');
//var chaiHttp = require('chai-http');
// var server = require('../server/app');
var should = chai.should();

var photo = require("../app/models/photo");
var svc = require('../app/services/galleryService');

describe("We are testing gallery services", function(){
    const  rand = Math.round(Math.random() * 99999);
    const user_id = '57d2474b52a3ae723bb806a7'; 
    var gdata = {}; 
    
        
    it("Should add a new gallery", done => {
        svc.addGallery({
            user_id : user_id, 
            title : 'Gall ' + rand, 
            description: 'Description  ' + rand
        }).then(data => {
            gdata.id  = data._id; 
            gdata.user_id = data.user_id;
            
            done();
        }).catch(err => done(err))
    })
    
    it('Should add photo to gallery', done => {
        gdata.photo_id = '5877d7ffe6cc52eaece254c5' ; 
        
        svc.addPhoto(gdata).then(data => {
            console.log(data); 
            done(); 
        }).catch(err => done(err))
    })
})