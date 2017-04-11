/**
 * Created by cj on 2/12/17.
 */
"use strict";

const cassandra = require('cassandra-driver');
const uuid = require('uuid');

// const authProvider = new cassandra.auth.PlainTextAuthProvider('my_user', 'p@ssword1!');

const client = new cassandra.Client({ contactPoints: ['localhost'], keyspace: 'fsdb' });


const svc = module.exports = {};


svc.insert_json = function(table, data) {
    var res = null;

    data.id = data.id || uuid();

    return client.connect()
        .then(() =>  {
            return client.execute(`INSERT INTO ${table} JSON '${JSON.stringify(data)}'`  );
        }).then(response => {
            res = response;
            return client.shutdown();
        }).then(() => {
            return res;
        })
}

svc.query = function(query) {
    var res = null;
    return client.connect()
        .then(() =>  {
            return client.execute(query );
        }).then(response => {
            res = response;
            return client.shutdown();
        }).then(() => {
            return res;
        })
}

svc.connect = function(){

    return client.connect()
        .then(function () {
            console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
            console.log('Keyspaces: %j', Object.keys(client.metadata.keyspaces));
            console.log('Shutting down');
            return client.shutdown();
        })
        .catch(function (err) {
            console.error('There was an error when connecting', err);
            return client.shutdown();
        });
}
