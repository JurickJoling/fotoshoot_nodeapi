/**
 * Created by cj on 3/4/17.
 * 
 * Object for bug reports and error logging.
 * We will use the bug object to capture errors from the frontend app as well as backend api.
 * 
 */
var ObjectID = require('mongodb').ObjectID;
var mdb = require('../db/mdb');
var Schema = mdb.Schema;


var schema = new mdb.Schema( {
    "body" : Schema.Types.Mixed,
    "headers": Schema.Types.Mixed,
    "query": Schema.Types.Mixed,
    "source": String,
    "url": String,
    "browser" : Schema.Types.Mixed,
    "ip_address" : String,
    "insert_time" : {type : Date, default : Date.now},
    
});

module.exports = mdb.model('errors',schema);
