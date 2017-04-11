"use strict";

const _ = require('lodash');
const profileSvc = require('./profileService')
const merge = require('deepmerge');
const db = require('./db')
 

const svc = module.exports = {};

/**
 * Fields to fetch from the profile table and attach to casting call
 * @type {{username: number, display_name: number, avatar: number, user_id: number}}
 */
const user_fields = {username: 1,
	display_name: 1,
	avatar: 1 ,
	user_id: 1 };

svc.find = function(params){
	params = merge({limit : 20, skip: 0 }, params || {});
	params.skip = parseInt(params.skip); 
	params.limit = parseInt(params.limit); 
	
	
	var where =  _.pick(params.where || params || {}, ['status'])  ; 

	// by default we will only return active records, admin will have to explicitly request pending calls.
	where.status = where.status || 'Active'; 
	
	var fields = params.fields || {
			_id: 1 ,
			title: 1 ,
			location: 1 ,
			requirements: 1 ,
			user_id: 1 ,
			insert_time: 1 ,
			summary:  1 ,
			date : 1,
			tags: 1,

		};

	
	return db.castingcall.count(where).then(count => {
		return db.castingcall
			.find(where, fields)
			.limit(params.limit )
			.skip(params.skip ).then(rows => {
				
				var user_ids = _.uniq(rows.map(t=>t.user_id)).filter(t=> t);
				
				
				return profileSvc.findManyById(user_ids).select({
					username: 1,
					display_name: 1, 
					avatar: 1 ,
					user_id: 1 
				}).then(users => {
					return {
						limit: params.limit,
						skip: params.skip,
						count : count,
						rows : rows.map (item => {
							item = item.toJSON(); 
							
							if(item.user_id){
								item.user = users.find(t=>t.user_id.toString() == item.user_id.toString());	
							}
							
							return item; 
						})
					}
				})
				
				
				
			})
	})
		
};

svc.get = function(id) {
	return db.castingcall.findById(id).then(data => {
		var call = data.toJSON(); 
		return profileSvc.getById(call.user_id).then(user => {
			call.user = _.pick(user, _.keys(user_fields)); 
			return call;
		})
	});
}

svc.saveCastingCall = function(data){
	if(!data._id) 
		return db.castingcall.create(data);
	
	return db.castingcall.update({_id : data._id},{$set : data} , {upsert : true});
};

svc.apply = function(id, data){
	
	throw new Error("Not yet implemented ") ;
};
