var ObjectID = require('mongodb').ObjectID;
var model = require('./model');

var Model = {
	collection_name : "projects",
    find : function(params, callback) {
        model.find(Model.collection_name, params, callback);
    },
    insert : function(params, callback) {
    	model.insert(Model.collection_name, params, callback); 
    },
    save : function(data, callback){
    	model.save(Model.collection_name, data,callback); 
    }, 
    addChild : function(id, field, data, callback) {
        model.pushChild(Model.collection_name, {_id : id},field,  data, function(err, data){
            callback(err, data);
        });
    },
    removeChild : function(id, field, fld_params, callback) {

        if(fld_params.id){
            fld_params._id= fld_params.id; 
            delete fld_params.id;
        }

        if(fld_params._id)
            fld_params._id = new ObjectID(fld_params._id);


        model.pullChild(Model.collection_name, {_id : id},field,  fld_params, function(err, data){
            callback(err, data);
        });
    },
}; 

module.exports = Model;