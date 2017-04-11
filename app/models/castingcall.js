const ObjectID = require('mongodb').ObjectID;
const mdb = require('../db/mdb');
const Schema = mdb.Schema;


const schema = new mdb.Schema( { 
    "title"       : {type: String, required: true},
    "summary"     : String,
    "description" : String,
    "location"    : {
       "lat"      : Number, 
       "lng"      : Number, 
       "city"     : {type: String, required: true}, 
       "state"    : String, 
       "country"  : {type: String, required: true}, 
       "formatted": {type: String, required: true}, 
    },
    "date"     :  Date, 
    "status"   : {type : String, enum : ['active', 'pending', 'test'], default : 'pending'},
    "user_id"  : Schema.Types.ObjectId,
    "tags"     : [String],
    "duration" : {
       "amount"     : Number,
       "unit"       : {type: String, enum: ['hour', 'day'], default: 'hour'},
       "formatted"  : String
    },
    "roles"    : [{
       "account_type"   : String, 
       "about"          : String, 
       "requirements"   : String, 
       "objectionables" : [String], 
       "compensation"   : {
          "compensation_type" : String, 
          "amount_start"      : Number,
          "amount_end"        : Number,
          "message"			  : String,
          "formatted"		  : String
       }
    }], 
    "insert_time" : {type : Date, default : Date.now}, 
    "public_time" : Date,
    "votes" : {
       "up"    : [Schema.Types.ObjectId],
       "down"  : [Schema.Types.ObjectId],
    }
});

module.exports = mdb.model('castingcalls',schema);
