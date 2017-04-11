'use strict'; 

const  mdb = require('../db/mdb');
const Schema = mdb.Schema;


var schema = new Schema({
	"full_location" : String,
	"cropped_location" : String,
	"originalname" 	: String,
	"encoding" 	: String,
	"mimetype" 	: String,
	"bucket" 	: String,
	"key" 		: String,
	"acl" 		: String,
	"contentType" 	: String,
	"storageClass" 	: String,
	"contentDisposition" : String,
	"location" 	: String,
	"etag" 		: String,
	"size" 		: {
		"height": Number,
		"width": Number,
	},
	"type" 		: String,
	"info" 		: Schema.Types.Mixed,
	"user_id"	: Schema.Types.ObjectId,
	"details" 	: Schema.Types.Mixed,
	"version" 	: String,
	"mature" 	: Boolean, 
	"avatar" 	: Boolean,
	"insert_time" 	: {type : Date, default : Date.now},
	"old"	 	: Schema.Types.Mixed,
	"fs_user_id": Number
});	

const model = module.exports = mdb.model('photos',schema);
