var Promise = require('promise');
var mdb = require('../db/mdb'); 
var Schema = mdb.Schema;


var schema = new mdb.Schema( { 
    "_collection": String,
    "entity_id": Schema.Types.ObjectId,
    "parent_id": Schema.Types.ObjectId,
    "user_id": Schema.Types.ObjectId,
    "title": String,
    "message": String,
    "insert_time": {type : Date, default : Date.now},
});


var model = mdb.model('notifications',schema);

module.exports = model;