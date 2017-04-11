/**
 * Created by cj on 3/18/17.
 */
'use strict';

const  mdb = require('../db/mdb');
const Schema = mdb.Schema;


var schema = new Schema({
    body    : {type: String, required:true},
    key     : {type: String, required:true, index:true},
    name    : {type: String, required:true},
    sent    : {type: Number, required:true, default: 0 },
    status  : {type: String, required:true, default: 'P' },
    subject : {type: String, required:true},
});

const model = module.exports = mdb.model('email_templates',schema);



