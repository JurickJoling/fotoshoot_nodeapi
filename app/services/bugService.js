 /**
 * Created by cj on 3/4/17.
 */
 "use strict";

 const _ = require('lodash');
 const db = require('./db')
 const svc = module.export = {}; 
 
 svc.save = function(data) {
     return db.bugs.create(data); 
 }
 
 
 