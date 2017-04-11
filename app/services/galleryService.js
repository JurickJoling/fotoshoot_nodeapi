"use strict";

const merge = require('deepmerge')
const _ = require('lodash')

const svc = module.exports = {};

const db = {
    users : require('../models/user'),
    gallery : require('../models/gallery'),
    photos : require('../models/photo'),
};


/**
 * Create a new gallery under a user 
 * @param data
 * @return {Promise.<TResult>}
 */
svc.addGallery = function(data) {
    return Promise.resolve().then(() => {
        if(!data.user_id) 
            throw new Error('Must be logged in'); 
        
        if(!data.title) {
            throw new Error('Title required'); 
        }
        
        return db.gallery.create(data);
    }); 
}

/**
 * Adding photo to a gallery
 * 
 * @param data
 * @return {Promise.<TResult>}
 */
svc.addPhoto = function(data) {
    return Promise.resolve().then(() => {
        if(!data.id || !data.photo_id || !data.user_id) {
            throw new Error('Invalid photo entry');  
        }

        return db.gallery.findOne({
            _id : data.id, 
            user_id : data.user_id
        }).then(gallery => {
            if(gallery == null ) {
                throw new Error('Invalid photo entry');
            }
                
            
            gallery.photos = gallery.photos || [];
            gallery.update_time = new Date(); 
            
            
            gallery.photos.push({
                id : data.photo_id
            });
            
            return gallery.save();

        })
    });
}