"use strict";

const sql = require('mssql');
const config = require('../../config')
const Promise = require('bluebird')

const db = module.exports = {};

const connection = new sql.Connection(config.mssql_obj);

 


db.query = function(query) {
    return Promise.resolve().then(()=> {
        
    
        return sql.connect(config.mssql).then(() => {
            return new sql.Request().query(query).then(recordset => {
                // console.dir(recordset);
                return Promise.resolve(recordset);
            }).catch(function (err) {
                throw new Error(err);
                // ... query error checks 
            });
        })
    })
};



db.one = function(query) {
    return db.query(query).then(records => {
        if(records.length > 0) {
            return records[0];
        }
    });
};

//
// db.oneOrNone = function(query) {
//     return db.connect().then(() => {
//         return new sql.Request().query(query);
//     })
// };