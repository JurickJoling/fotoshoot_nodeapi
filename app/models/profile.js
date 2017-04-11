/**
 * Created by cj on 2/18/17.
 */
"use strict";

var ObjectID = require('mongodb').ObjectID;

var bcrypt = require('bcryptjs')
// var model = require('./model');
var Photo = require('./photo');
var Promise = require('bluebird');
var merge = require('deepmerge');

var mdb = require('../db/mdb');

var Schema = mdb.Schema;


var schema = new mdb.Schema({
    "fname" 	: {type: String},
    "lname" 	: {type: String},
    "display_name" 	: {type: String, required: true},
    "account_type" 	: {type: String , index: true},
    "account_type_top" 	: {type: String , index: true},
    "insert_time" 	: {type : Date, default : Date.now},
    "status" 	: {type: String, default : 'P' , index: true},
    "user_id"   : {type: Schema.Types.ObjectId, required: true , index: true},
    "about"     : String,
    "dob"       : {type: Date}, 
    "gender"    : {type: String, index:true}, 
    "age"       : {type:Number, index: true}, 
    "username"       : {type:String, index: true, unique: true}, 
    "type"      : {type: String, default: 'Personal' },
    "fs_user_id" 	: Number,
    "stats"     : Schema.Types.Mixed, 
    "location"  : Schema.Types.Mixed, 
    "avatar"    : {
        "_id" : Schema.Types.ObjectId,
        "full_location" : String,
        "bucket" 	    : String,
        "key" 		    : String,
        "cropped_key"   : String,
    },
    "model_attributes" :  {
            "age" : {type: Number, index: true},
            "height" : {type: Number, index: true},
            "weight" : {type: Number, index: true},
            "shoeSize" : {type: Number, index: true},
            "waist" : {type: Number, index: true},
            "bust" : {type: Number, index: true},
            "hips" : {type: Number, index: true},
            "gender" : {type: String, index: true},
            "tf" : {type: String, index: true},
            "nudity" : {type: String, index: true},
            "skin" : {type: String},
            "ethnicity" : {type: String},
            "eyeColor" : {type: String},
            "hairLength" : {type: String},
            "hairColor" : {type: String},
            "bodyType" : {type: String},
            "piercings" : {type: String},
            "tattoos" : {type: String},
        }
    


});


schema.pre('validate', function(error, doc, next) {
    const account_type_tops = ['model','photographer'];
    // assign account_type_top 
    this.account_type_top = account_type_tops.indexOf(this.account_type) >= 0 ? this.account_type + 's' : 'other';

    this.stats = this.stats || {photos:0}; 
    

    if(this.dob) {
        var ageDifMs = Date.now() - this.dob.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        this.age =  Math.abs(ageDate.getUTCFullYear() - 1970);
        this.model_attributes.age = this.age;
    }


    if(this.display_name && !this.fname && !this.lname) {
        var name_segments = this.display_name.split(' ');

        this.fname = name_segments[0];
        name_segments.shift();
        this.lname = name_segments.join(' ');

    } else if(!this.display_name) {
        this.display_name = this.display_name || `${this.fname} ${this.lname}`;
    }

    
    next();
});

const model = module.exports = mdb.model('profiles',schema);

