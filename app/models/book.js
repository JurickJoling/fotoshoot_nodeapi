const Promise = require('promise');
const mdb = require('../db/mdb');
const Schema = mdb.Schema;


const schema = new mdb.Schema( { 
    "location": String,
    "date": Date,
    "status": {type:String, default : 'P'},
    "description": String,
    
    // nudity, alcohol, tobacco, etc... 
    "objectionables": [String],
    
    "team" : String, 
    
    // for future use
    // "team": [{
    //     "name"  : String, 
    //     "role"  : String,
    //     "user_id"  : Schema.Types.ObjectId,
    //     "url"   : String,
    //    
    // }],
    
    "compensation": {
        "amount" : {
            "min" : Number, 
            "max" : Number, 
        }, 
        "type": {type:String},
        "details": {type:String}
    },
    "user_id": Schema.Types.ObjectId,
    "booked_user_id": Schema.Types.ObjectId,
    "insert_time": { type: Date, default: Date.now },
});


const model = module.exports =  mdb.model('bookings',schema);