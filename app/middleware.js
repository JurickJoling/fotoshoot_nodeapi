const bodyParser = require('body-parser')
const router = module.exports = require('express').Router()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const jwt = require('jsonwebtoken')


router.use(bodyParser.urlencoded({
  extended: true
}))
router.use(bodyParser.json())

// redirect to https
if (process.env.NODE_ENV === 'production') {
  router.use(function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.get('Host') + req.url)
    }
    next()
  })
}





// verify token and set req.userId
router.use(function (req, res, next) {
  var token = req.body.accessToken ||
      req.query.accessToken ||
      req.headers['x-access-token'] ||
      parseBearerToken(req)
  if (!token) return next();

  delete req.query.accessToken;

  jwt.verify(token, config.tokenSecret, function (err, decoded) {
    //new Error('Invalid token.')
    if (err) return next();
    req.userId = decoded.u;
    req.roles = decoded.roles;
    req.is_super = false; // req.isInRole('super');
    // req.is_admin = req.is_super || req.isInRole('admin');
    next();
  })

})

function parseBearerToken (req) {
  var auth
  // console.log(req.headers.authorization);
  if (!req.headers || !(auth = req.headers.authorization)) {
    return null
  }
  var parts = auth.split(' ')
  if (parts.length < 2) return null
  var schema = parts.shift().toLowerCase()
  var token = parts.join(' ')
  if (schema !== 'bearer') return null
  return token
}



// log requests
router.use(function (req, res, next) {

  console.log(req.method, req.url)
  next()
})

router.use(cors())

// controller helper methods
router.use(function (req, res, next) {
  res.notFound = function (msg) {
    return this.status(404).error(msg || 'Not found.')
  }
  res.accessDenied = function (msg) {
    return this.status(403).error(msg || 'Access denied.')
  }
  res.tokenRequired = function (msg) {
    return this.status(401).error(msg || 'Access token is required.')
  }
  res.error = function (err) {
    if (this.statusCode === 200) {
      this.statusCode = 400
    }
    var msg = err.msg || err.message || err
    if (err.notFound) {
      return this.notFound()
    }
    if (err.accessDenied) {
      return this.accessDenied()
    }
    var error = {
      message: msg
    }
    // format postgres unique key error
    if (err.detail) {
      var matches = err.detail.match(/Key \((.*)\)=\((.*)\) already exists\./)
      if (matches && matches[1]) {
        var field = matches[1].charAt(0).toUpperCase() + matches[1].substring(1)
        error.message = `${field} ${matches[2]} is already taken.`
      }
    }
    if (process.env.NODE_ENV !== 'production') {
      if (err.stack) {
        error.stack = err.stack.split('\n')
      }
    }
    return this.json({
      error: error
    })
  }

  next()
})


router.use(function(req,res,next) {
  if(!db_conn) {
    // res.error({
    //   message : 'Could not connect to the database.'
    // });
    MongoClient.connect(config.db, function(err, db) { 
      if(err) {
        return res.error(err);
      }

      db_conn = db; 

      console.log("Connected to the database ");
      next();


    });


    // res.send({error : {message : 'Could not connect to the database'}})
  } else {
    next();

  }

})