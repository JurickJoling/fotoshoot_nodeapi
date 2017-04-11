const Promise = require('promise');
const mdb = require('../db/mdb');
const Schema = mdb.Schema;


const schema = new mdb.Schema( { 
    "publish_date": {type: Date, default:Date.now},
    "insert_time": { type: Date, default: Date.now },
    
    "status": {type:String, default : 'P'},
    
    
    "title": String,
    "summary": String,
    "body": String,
    "notes": String,
    "categories": Array,
    "tags": Array,
    "reviewers": String,
    "seo" : {
        "title" : String, 
        "meta" : {
            "keywords" : String,
            "description" : String
        }
    },
    "user_id": Schema.Types.ObjectId,
    "slug" 	: {type: String, index: { unique: true }},
});


const model = mdb.model('blog_articles',schema);

module.exports = model;