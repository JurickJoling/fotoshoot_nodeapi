/**
 * Created by Thomas on 03/20/17.
 */
"use strict";

const mdb = require('../db/mdb');

const Schema = mdb.Schema;

const schema = new mdb.Schema({
    "body" 	: {type: String},
    "status": {type: String, default: 'P'},
    "insert_time": { type: Date, default: Date.now },
    "user_id"   : {type: Schema.Types.ObjectId, required: true, index: true, ref: 'users'},
    "blog_article_id": {type: Schema.Types.ObjectId, required: true, index: true, ref: 'comments'},
});


const model = module.exports = mdb.model('comments',schema);