"use strict";

const Promise = require('bluebird')
const config = require('../../config'); 
const db = require('./db');
const notificationSvc = require('./notificationService');
const userSvc = require('./userService');
const profileSvc = require('./profileService');
const merge = require('deepmerge');
const _ = require('lodash');


var svc = module.exports = {};

/**
 * 
 * @param data
 * @return {Promise|Promise.<TResult>|*}
 * 
 * @todo: Send notification 
 */
svc.create = function(data){
	var retval = {}; 
	
	return db.book.create(data).then(booking => {
		retval.request = booking ;
		return Promise.props({
			booking_user:userSvc.getForEmailNotification(booking.user_id),  
			booked_user	:userSvc.getForEmailNotification(booking.booked_user_id)  
		})
		;
	}).then(results => {
		retval.user = results.booked_user;
		
		
		
		return Promise.all([
			notificationSvc.new_booking_request(retval), 
			notificationSvc.booking_request_received({
				request	: retval.request, 
				user	: results.booking_user,
				booked_user	: results.booked_user,
			}), 
		]);
	}).then(()=>{
		return retval.request;
	});
};

/** 
* Find booking requests
*/
svc.find = function(params) {
	if(!params.user_id) {
		throw new Error('user_id required')
	}
	
	const q = merge(_.pick(params, ['status']), {$or : [{user_id : params.user_id},{booked_user_id : params.user_id}]});
	
	return db.book.find(q).then(list => {

		// reformat for consistency
		return Promise.props({
			count : list.length,
			rows : Promise.map(list, item => {
				item = item.toJSON();
				return Promise.props({
					user : profileSvc.minimal(item.user_id), 
					booked_user : profileSvc.minimal(item.booked_user_id), 
				}).then(users => {
					Object.assign(item, users);
					
					return item;
				})
			})
		});
	}); 
};


/** 
* Update a booking request.
*/
svc.update = function(data) {
	if(!data.user_id || !data._id) {
		throw 	new Error("UserID and booking request id are required");
	}


	return db.book.update({_id : data._id, booked_user_id: data.user_id}, _.pick(data, ['status']));
};