/**
 * Created by cj on 2/19/17.
 */
'use strict';
const Promise = require('bluebird');
const merge = require('deepmerge');
const _ = require('lodash');
const config = require('../../config');

const mdb = require('../db/mdb');

const Schema = mdb.Schema;

const LoginLogSchema = new Schema({}, { strict: false });

const svc = module.exports = {}

// allowed params for browse
const browse_params = [
    { key: 'account_type_top' },
    { key: 'status' },
    { key: 'gender' },
    { key: 'tf' },
    { key: 'nudity' },
    { key: 'account_type' },
    

    { key: 'ethnicity', fld : 'model_attributes.ethnicity' },
    { key: 'eyeColor', fld : 'model_attributes.eyeColor' },
    { key: 'hairLength', fld : 'model_attributes.hairLength' },
    { key: 'hairColor', fld : 'model_attributes.hairColor' },
    { key: 'bodyType', fld : 'model_attributes.bodyType' },
    { key: 'piercings', fld : 'model_attributes.piercings' },
    { key: 'tattoos', fld : 'model_attributes.tattoos' },
];

const browse_range_params = [
    { key: 'age' },
    { key: 'height', fld : 'model_attributes.height' },
    { key: 'weight', fld : 'model_attributes.weight' },
    { key: 'shoeSize', fld : 'model_attributes.shoeSize' },
    { key: 'waist', fld : 'model_attributes.waist' },
    { key: 'bust', fld : 'model_attributes.bust' },
    { key: 'hips', fld : 'model_attributes.hips' },
    { key: 'waist', fld : 'model_attributes.waist' },
];


const db = require('./db')


/**
 * Rekey an object
 * 
 * @todo: make a global function
 * 
 * @param obj
 * @param keyMap
 * @return {{}}
 */
svc.rekey = function(obj, keyMap) {
    var b = {};

    _.each(obj, function(value, key) {
        var key_obj = keyMap.find(t=>t.key == key); 
        
        key = key_obj?key_obj.fld||key_obj.key : key; 
        
        b[key] = value;
    });
    
    return b;
}


/**
 * Search profiles. 
 * 
 * 
 * @param params
 * @return {Promise|Promise.<TResult>|*}
 */
svc.find = function(params) {
    const q = svc.rekey(_.pick(merge({status:'A'}, params) , browse_params.map(t=>t.key)), browse_params);
    
    
    params = merge({limit:20, skip:0}, params);
    
    browse_range_params.forEach(function(item) {
        var min_key = item.key + '_min';
        var max_key = item.key + '_max';
        
        if(params[min_key]) {
            q[item.fld || item.key] = merge(q[item.fld || item.key] || {}, {$gte : params[min_key]});
        }

        if(params[max_key]) {
            q[item.fld || item.key] = merge(q[item.fld || item.key] || {}, {$lte : params[max_key]});
        }
    })
    
    params.limit = parseInt(params.limit)
    params.skip  = parseInt(params.skip)
    
    return db.profile.count(q).then(count => {
        return Promise.props({
            count   : count, 
            skip    : params.skip, 
            limit   : params.limit, 
            rows : db.profile.find(q).limit(params.limit).skip(params.skip).select({
                fname           : 1,
                lname           : 1,
                display_name    : 1,
                account_type_top: 1,
                account_type    : 1,
                age         : 1, 
                username    : 1,
                avatar      : 1,
                model_attributes  : 1,
                stats       : 1,
                insert_time : 1,
                location    : 1
            })
        })
    }); 
}

svc.findManyById = function(ids) {
    return db.profile.find({$or : [{_id : {$in:ids}} , {user_id  : {$in:ids}} ]});
}

svc.getById = function(id) {
    return svc.getProfile({$or : [{_id : id} , {user_id : id} ]});
}

svc.getByUsername = function(uname) {
    return svc.getProfile({username:uname });
}

svc.getProfile = function(query) {
    
    return db.profile.findOne(query).then(profile => {
        profile = profile.toJSON();
        if(!profile) return null;
        
        return Promise.props({
            photos : db.photos.find({user_id : profile.user_id}).select({
                full_location : 1 ,
                bucket : 1, 
                key: 1, 
                mature: 1, 
                avatar: 1
            }),
            locations : db.location.find({user_id : profile.user_id}).select({
                city: 1, state: 1 , country : 1 , lat:1, lng:1 , formatted:1 
            }),
        }).then(results => {
            // console.log(results);
            Object.assign(profile, results); 
            
            return profile;
        })
        
    })
}

svc.updateAvatarByUserId = function(_id, data) {
    return db.profile.findOne({user_id:_id}).then(profile => {
        profile.avatar = data; 
        return profile.save(); 
    })
}


svc.update = function(data) {
    return db.profile.findOne({user_id : data.user_id}).then( data => {
        console.log('data', data); 
        
    })
}


/**
 * returns a minimal version of the profile, typically part of another query (adjunct profile) .
 * 
 * @param id
 * @return {*|Request<SimpleDB.Types.SelectResult, AWSError>|SchemaType|{get, set}|void}
 */
svc.minimal = function(id) {
    return db.profile.findOne({$or : [{_id : id} , {user_id : id} ]}).select({
        account_type:1,
        username: 1, 
        display_name: 1, 
        age: 1,
        avatar: 1, 
        user_id: 1
    })
}


svc.minimalArray = function(ids) {
    return Promise.mapSeries(ids, id => {
         return svc.minimal(id);
    })
}