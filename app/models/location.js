/**
 * Created by cj on 3/5/17.
 * 
 * location - user location settings. Will be used later on for studios, rentals and other geo specific services
 */
var ObjectID = require('mongodb').ObjectID;
var mdb = require('../db/mdb');
var Schema = mdb.Schema;


var schema = new mdb.Schema( {
    "name"       : {type: String},
    "lat"      : {type: Number, index: true},
    "lng"      : {type: Number, index: true},
    "city"     : {type: String},
    "state"    : {type: String, index: true},
    "country"  : {type: String, index: true},
    "status"  : {type: String, default: 'A', index: true},
    "formatted": {type: String},
    "insert_time" : {type : Date, default : Date.now},
    "user_id" : {type : Schema.Types.Mixed, index: true},
    "raw" : {type: Schema.Types.Mixed} ,
    "fs_user_id" 	: Number,
});

module.exports = mdb.model('locations',schema);
