var model = require('./model');

var Model = {
    collection_name : "conversations",
    find : function(params, callback) {
        model.find(Model.collection_name, params, callback);
    },
    
    getConversation : function(params) {
        
        if(params.conversation_id) {
            return model.getById(Model.collection_name, params.conversation_id);
        } else {
            return model.insert(Model.collection_name, {
                users : params.users,
            })
        }
    }, 
    addMessage : function(conversation_id, params) {
        return model.pushChild(Model.collection_name, {_id : conversation_id}, 'messages', params);
    }
};

module.exports = Model;