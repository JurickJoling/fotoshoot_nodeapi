/**
 * Created by cj on 3/1/17.
 */
"use strict";

var mdb = require('../db/mdb');

var Schema = mdb.Schema;


var schema = new mdb.Schema({
    "name" 	: {type: String},
    "slug" 	: {type: String},
    "plural": {type: String},
});


const model = module.exports = mdb.model('account_types',schema);