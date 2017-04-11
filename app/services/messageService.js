"use strict";
const Promise = require('bluebird');
const merge = require('deepmerge')
const _ = require('lodash')
const db = require('./db');
const svc = module.exports = {};
const profileSvc = require('./profileService') ;
const notificationSvc = require('./notificationService'); 




/**
 * Get conversations for the user
 * @param userId
 */
svc.getConversations = function(params) {
	return db.conversation.find({users: params.user_id})
		.limit(params.limit || 20 )
		.skip(params.skip || 0)
		.then(list => {
			
			// get the user profiles (mini profiles);
			return Promise.mapSeries(list, item => {
				item = item.toJSON(); 
				
				return profileSvc.minimalArray(item.users).then(profiles => {
					item.profiles = profiles;

					// assign the profile each message (so we have username/ avatar / etc... )  
					item.messages = item.messages.map(t=> {
						t.user = item.profiles.find(profile => profile.user_id.toString() == t.from.toString());
						return t;
					})
					
					return item ;
				})
			})
	})
}


svc.getMessages = function(params) {
	params = merge({limit : 20, skip:0 }, params); 
	
	const q = _.omit(params, ['limit','skip']); 
	return db.conversations.count(q).then(count => {
		return db.conversations.find(q).skip(params.skip).limit(params.limit).then(data => {
			return  {
				count : count, 
				skip : params.skip,
				limit : params.limit, 
				rows : data
			}

		});
		
	});
};



svc.get = function(params) {
	return db.conversation.findOne(params).then(item => {
		if(!item) {
			throw new Error('Conversation not found');
		}


		item = item.toJSON();

		return profileSvc.minimalArray(item.users).then(profiles => {
			item.profiles = profiles;

			// assign the profile each message (so we have username/ avatar / etc... )  
			item.messages = item.messages.map(t=> {
				t.user = item.profiles.find(profile => profile.user_id.toString() == t.from.toString());
				return t;
			})

			return item;
		})
	})
}

/**
 * Add a message to a conversation, if conversation doesn't exist yet than it will create it. 
 * 
 * @param data
 * @return {Promise|Promise.<TResult>|*}
 */
svc.sendMessage = function(data) {
	data.users = [data.to ,data.from]; 
	
	return db.conversation
		.addMessageToConversation(data)
		.then(conv => {
		return conv; 
		
	}); 
	
}