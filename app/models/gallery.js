'use strict';

var mdb = require('../db/mdb');
var Schema = mdb.Schema;


var schema = new Schema({
    "user_id"	: Schema.Types.ObjectId,
    "access"    : {type: String, default: 'Public' }, 
    
    "title"     : String, 
    "description": String,
    "photos"    : [{"id" : Schema.Types.ObjectId}],
    "stats" : {
        "photos" : Number,
        "views"  : Number, 
        "last_view" : Date
    },
    "admin_review" : Schema.Types.Mixed,
    "flags" : [Schema.Types.Mixed],    
    "update_time" :  {type : Date, default : Date.now},
    "insert_time" 	: {type : Date, default : Date.now}

});

const model = module.exports = mdb.model('galleries',schema);