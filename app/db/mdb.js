var config = require('../../config'); 
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(config.db);


module.exports = mongoose; 