"use strict";

// var model = require('./model');
const mdb = require('../db/mdb');
const ObjectID = require('mongodb').ObjectID;

const Schema = mdb.Schema;


const schema = new mdb.Schema({
    "users" 	: [ Schema.Types.ObjectId ],
    "messages" : [{
        "message": String,
        "from": Schema.Types.ObjectId,
        "insert_time": {type : Date, default : Date.now}
    }]
});

const model = module.exports = mdb.model('conversations',schema);


model.getConversation = function(params) {
    if(params.conversation_id) {
        return model.findById(params.conversation_id);
    } else {
        return model.create( {
            users : params.users.map(t => new ObjectID(t)),
        })
    }
}

model.addMessageToConversation = function(params) {
    return model.getConversation(params).then(conversation => {
        conversation.messages.unshift(params); 
        return conversation.save();
    }); 
}


