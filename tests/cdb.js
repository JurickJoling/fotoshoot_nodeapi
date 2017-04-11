/**
 * Created by cj on 2/12/17.
 */
'use strict';

var chai = require('chai');
//var chaiHttp = require('chai-http');
// var server = require('../server/app');
var should = chai.should();
const db = require('../app/db/cdb');




describe('testing cdb connection', function() {

    it('should connect to db ', function(done) {
        db.connect().then(() => {
            done(); 
        }).catch(err => {done(err); })
        
    });
    
    it('should insert JSON ', function(done) {
        db.insert_json('users',{
            email: 'cj@cj.com', 
            username: 'cj'
        }).then(row => {
            console.log(row); 
            
            done();
        }).catch(err => done(err))
    })
    
    
});

