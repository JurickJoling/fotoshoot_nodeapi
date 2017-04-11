/**
 * Created by cj on 3/1/17.
 */
'use strict';
const _ = require('lodash');
const config = require('../../config');
const mdb = require('../db/mdb');
const Schema = mdb.Schema;
const svc = module.exports = {}
const merge = require('deepmerge')

var db = {
    account_types : require('../models/account_type') 
};


svc.get = function(){
    return db.account_types.find().then(data => {
        
        // console.log(data.map(t=> {
        //     var item = t;
        //     item.key = t.name.toLowerCase();
        //
        //     // t.key = t.name.toLowerCase(); 
        //     return item ;
        // }))
        return {rows : data.map(t=> {
            return merge(t.toJSON(), {key : t.name.toLowerCase()});
        })}; 
    });
} 