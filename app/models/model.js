var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var config = require('../../config'); 

var Model = {
    save : function(collection_name, data, callback){
        // insert : function(collection_name, params, callback) {
        // updateRecord : function(collection_name, params, data, callback ) {

        if (data._id){
            var params = {'_id' : data._id}; 
            delete data._id; 
            
            this.updateRecord(collection_name, params, data, callback);
        } else {
            delete data._id; 
            this.insert(collection_name, data, callback); 
        }
    }, 
    count : function(collection_name, params, callback) {
        
        var collection = db_conn.collection(collection_name); 

        collection
            .count(params)
            .then(function(data) {
                callback(null, data);
            }, function(err){
                callback(err, null);
            });

        
    }, 
    delete : function(collection_name, params, callback) {

        if (params._id != null) {
            params._id = new ObjectID(params._id);
        }


        var archive_collection = db_conn.collection('_archives_' + collection_name); 
        var collection = db_conn.collection(collection_name); 

        collection
            .findOne(params)
            .then(function(data) {
                archive_collection.insert(data, function(err,result) {
                    collection.remove(params, {justOne:true}, function(err, num_removed){
                        callback(null, {'result' : 'OK', removed : num_removed}); 
                    }); 
                    

                });                    
            }, function(err){
                callback(err, null );
                console.log(err);
            });

    }, 
    updateRecord : function(collection_name, params, data, callback ) {
        var collection = db_conn.collection(collection_name); 

        console.log("Update item params #1 : ", params);
        
        if (params._id != null) {
            params._id = new ObjectID(params._id);
        } else {
            data.insert_time = data.insert_time || (new Date()).toUTCString();
        }
        
        if(data._id != null){
            delete(data._id);
        }

        collection
            .updateOne(
                params,
                {
                    $set:data,
                    $currentDate: { lastModified: true }
                }, 
                function(err, results){
                    callback(err , results);
                    
                });

    },
    pushChild : function(collection_name, params,field,  data, callback){
        if(params._id != null ) {
            params._id = new ObjectID(params._id); 
        }
        
        if (!data._id ) {
            data._id = new ObjectID();
        }

        data.insert_time = data.insert_time || (new Date()).toUTCString();
        
        

        var collection = db_conn.collection(collection_name); 
        
        var update_data = {};
        
        update_data[field] = data; 
        collection
            .updateOne(
                params,
                {
                    $push: update_data
                }, 
                function(err, results){
                    callback(err, data);
                });
        

    },
    pullChild : function(collection_name, params, field, child_params, callback) {

        var collection = db_conn.collection(collection_name); 
        
        var update_data = {};
        update_data[field] = child_params; 

        collection
            .updateOne(
                params,
                {
                    $pull: update_data
                }, 
                function(err, results){
                    callback(err, results);
                });

    },
    insert : function(collection_name, params, callback) {
        var collection = db_conn.collection(collection_name); 

        params.insert_time = params.insert_time || (new Date()).toUTCString();

        collection.insert(params, function(err, result) {
            if(err){
                callback(err);
            } else {

                callback(null, result.ops.length == 1 ?result.ops[0]  :result.ops);
            }
            
        });

    },
    find : function (collection_name, params, callback) {
        var collection = db_conn.collection(collection_name); 

        var limit = params.limit || 1000 ;
        var skip  = params.skip || 0; 

        limit = parseInt(limit);
        skip = parseInt(skip);

        delete params.limit;
        delete params.skip;

        if(params.id) {
            params.where = params.where || {} ;
            params.where._id = params.where._id || params.id;
        }

        if(params.where && params.where._id) {
            try {
                params.where._id = new ObjectID(params.where._id);    
            }
            catch (exception) { // non-standard
               return callback(exception);
            }
        } 

        // var fields = params.fields || null ;
        // delete params.fields; 

        

        var cursor = collection.find(params.where,params.fields).sort(params.sort).skip(skip).limit(limit); 

        var list = [];


        cursor.each(function(err, doc) {
            if (doc != null) {
                list.push(doc);
            } else {
                callback(null, list);
            }
        });

    },
    getRecord : function (collection_name, params, callback) {
        var collection = db_conn.collection(collection_name); 

        collection
            .findOne(params)
            .then(function(data) {
                callback(null, data);
            }, function(err){
                callback(err, null);
            });

    },
    getById : function(collection_name, id, callback) {
        Model.getRecord(collection_name, {_id : new ObjectID(id) }, callback);
    },
    validate : function(meta, data) {
        return new Promise(function(resovle, reject) {

            var errors = []; 

            if(meta.required) {
                for (var k in meta.required) {
                    var val = data[k]; 

                    if (val == '' || val == null) {
                        var message = meta.required[k]; 

                        errors.push({
                            field : k , 
                            message : message.message ? message.message : message + ' required'
                        });

                    } else {
                    }
                }
            }

            if (errors.length > 0 ) {
                reject(errors);
            } else { 
                resovle();
            }

        });
    },
};

module.exports = Model;