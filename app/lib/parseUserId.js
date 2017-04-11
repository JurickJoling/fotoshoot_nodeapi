var ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken')
var config = require('../../config')

// verify token and set req.userId
module.exports = function (req, res, next) {
  var token = req.body.accessToken ||
    req.query.accessToken ||
    req.headers['x-access-token'] ||
    parseBearerToken(req)
  if (!token) return res.status(401).error('Access token is required.')

  jwt.verify(token, config.tokenSecret, function (err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.error('Access token is expired.')
      }
      return res.error('Invalid access token.')
    }
    if (!decoded.u) {
      return res.error('Access token is not valid.')
    }

    // TODO make sure this token is newer than user.revokeTokenTime
    req.userId = decoded.u;

    req.userId = new ObjectID(req.userId);
    next();
    // get the user (and his permissions) from the db
    // db.users.get(req.userId)
    //   .then(function (user) {
    //     req.user = user
    //     return user.getAccountIds()
    //   })
    //   .then(function (accountIds) {
    //     req.user.accountIds = accountIds || []
    //     next()
    //   })
  })
}

function parseBearerToken (req) {
  var auth
  console.log(req.headers.authorization);
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
