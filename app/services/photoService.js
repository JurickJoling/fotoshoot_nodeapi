"use strict";
var ObjectID = require('mongodb').ObjectID;
const Promise = require('bluebird');
const ExifImage = require('exif').ExifImage;
const sizeOf = require('image-size');
const merge = require('deepmerge');

var svc = module.exports = {};


var db = {
    users : require('../models/user'),
    photos : require('../models/photo')
};

svc.update = function(params, data){
    return Promise.resolve().then(()=> {

        if (!params._id) {
            throw new Error("Photo id required");
        }

        if (!params.user_id) {
            throw  new Error("Access denied");
        }
    }).then(() => {
        
        return db.photos.findOne({_id : params._id, user_id : params.user_id}).then(photo => {
            photo.details = merge(photo.details || {}, _.omit(data, ['avatar','mature']));
            photo.mature = data.mature || false;
            
            if(data.avatar) {
                
            }
            
            
            return photo.save(); 
        })
    });
}


svc.upload = function(photo) {
    return new Promise((resolve, reject) => {

        const request = require('request').defaults({ encoding: null });
        
        request.get(photo.location, function (err, res, body) {
            
            if(err)
                return Promise.reject(new Error('File could not be found (41)'))
            
            try {
                var dimensions = sizeOf(body);
                Object.assign(photo, dimensions);
            }catch(error){}
            
            try {
                new ExifImage({ image : body }, function (error, exifData) {
                    if (!error)
                        photo.info = exifData;

                    return resolve();
                });
            } catch (error) {
                return resolve();
            }
        });
    }).then(()=>{
        return db.photos.create(photo);
    }).then(photo_data => { 
        return db.users.findById(photo.user_id).then(user => {
            user.photos = user.photos || [];
            user.photos.push({id : photo_data._id});
            return user.save().then(() => {
                return photo_dat
            })
        })
    })
    
}


svc.setAvatar = function(user_id, photo_id) {
    return Promise.props({
        user  : db.users.findById(user_id), 
        photo : db.photos.findById(photo_id),
        avatar : db.photos.findOne({avatar : true, user_id: user_id})
    }).then(results => {
        if(results.photo.avatar)
            return true; 
        
        if(results.photo.mature)
            throw new Error('Mature only content may not be used as an avatar'); 
        
        if(results.avatar) {
            results.avatar.avatar = false; 
        }

        results.photo.avatar = true;
        results.user.avatar = results.photo
        results.user.avatar.id = results.photo._id;
        
        
        return Promise.all([
            results.photo.save(), 
            results.user.save(),
            results.avatar ? results.avatar.save() : null 
        ]).then(()=> { 
            return true;
        });
    })
    
}