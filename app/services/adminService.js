"use strict";

const ObjectID = require('mongodb').ObjectID;
const uuid = require('uuid').v4;
const config = require('../../config');

const svc = module.exports = {};

var db = {
    blog_articles : require('../models/blog_article'),
    users : require('../models/user'),
    photos : require('../models/photo'),
    book : require('../models/book'),
};

/**
 * @todo make dashboard dynamic
 * @return {{summary: {users: number, castingCalls: number, photos: number}}}
 */
svc.dashbaord = function(){
    return Promise.resolve({
        summary : {
            users : 56, 
            castingCalls : 24,
            photos : 3323,
            total_members: 122,
        },
        membersActivity: {
            week: {
                active_rate: 63,
                total: 53,
                values: '3,5,1,12,4,15,13'
            },
            month: {
                rate: 63,
                total: 153,
                values: '3,5,1,12,4,15,13,3,5,1,12,4,15,13,3,5,1,12,4,15,13,3,5,1,12,4,15,13,16,2'
            }
        },
        signups : {
            
            week: {
                active_rate: 63,
                total: 53,
                values: '3,5,1,12,4,15,13'
            }
        }
        
    });
}