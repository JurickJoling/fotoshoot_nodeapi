'use strict';

const ObjectID = require('mongodb').ObjectID;
const Promise = require('bluebird');
const uuid = require('uuid').v4;
const isEmail = require('isemail').validate;
const jwt = require('jsonwebtoken');
const moment = require('moment');
const accessDenied = require('../lib/errors').accessDenied;
const notFound = require('../lib/errors').notFound;
const config = require('../../config');
const merge = require('deepmerge');
const _ = require('lodash');
const validationError = require('../lib/errors').validationError;

const mdb = require('../db/mdb');

const Schema = mdb.Schema;

const LoginLogSchema = new Schema({}, { strict: false });
const LoginLog = mdb.model('login_log', LoginLogSchema);
const profileSvc = require('./profileService');
const svc = module.exports = {};
const db = require('./db');


const notificationService = require('./notificationService');

svc.log = function(data){
    var thing = new LoginLog(data);
    return thing.save();
}

svc.authenticate = function(data) {
    return Promise.resolve().then(()=> {

        if (!data.email) {
            throw validationError('Email / username required');
        }

        if (!data.password) {
            throw validationError('Password required');
        }

        return svc.log(data);

    }).then(() => {
        const loginFailed = new Error('Login failed');

        return db.users.find({$or : [{'email' : data.email},{'username' : data.email}] }).then(res =>  {
            // console.log(res);

            if(res.length == 0) {
                loginFailed.code = 1;
                throw loginFailed;
            } else if(res.length > 1) {
                loginFailed.code = 2;
                throw loginFailed;
            } else {
                var user = res[0];

                return db.users.checkPassword(data.password,user.hash).then(data_pwd => {

                    if(data_pwd) {
                        // generate token
                        var token = generateToken(user._id);

                        return db.profile.findOne({user_id:user._id}).then(profile => {
                            token.profile = profile;
                            return token;
                        })
                    } else {
                        loginFailed.code = 3;
                        throw loginFailed;
                    }

                }, err => {
                    loginFailed.code = 4;
                    throw loginFailed;
                }, err => {
                    loginFailed.code = 5;
                    throw loginFailed;
                });
            }
        }, err => {
              loginFailed.code(6);
              throw loginFailed;
            }
        );
    });
}

svc.getPasswordRecoveryToken = function (email) {

};

svc.getEmailToken = function (user, email) {
    if (!user.permissions || user.permissions.indexOf('admin') === -1) {
        accessDenied();
    }

    return svc.getByEmail(email).then(user => {

        if (!user) {
          notFound();
        }

        return generateToken(user.id);
    });
}

svc.register = function (data) {

    // new user to insert
    var u = {};
    data.email = (data.email || '').trim();

    // validation
    isEmail(data.email) || error('Email address is invalid.');
    (data.display_name || data.fname || data.lname) || error('Name is required');
  

    return db.users.find({$or : [{username:data.username}, {email: data.email}]}).then(rows => {
        if(rows && rows.length > 0) {
            if (rows[0].username == data.username) {
                throw new Error('Username is taken');
            } else if(rows[0].email == data.email) {
                throw new Error('Email address is already in the system');
            }
        }
    }).then(() => {
        return db.users.encryptPassword(data.password);
    }).then(pwd_data => {
        Object.assign(data, pwd_data);
        return db.users.create(data);
    }).then(user => {
        // console.log('user', merge(data , { user_id : user._id.toString() }));
        return db.profile.create(merge(data , { user_id : user._id.toString() }));
    }).then(profile => {
        var token = generateToken(profile.user_id);
        // profile.accessToken = token;

        return  {
            _id : profile.user_id,
            accessToken : token.accessToken,
            fname : data.fname,
            lname : data.lname
        };
    });

    // // save new user and set password
    // db.users.save(u, function(err, res){
    //   if(err) {
    //     // return callback(err.message ? err : {message : err.message});
    //     return callback(err);
    //   }

    // });
}

/**
 *
 * @param data
 * @return {json}
 *
 * @todo: Change Password
 */
svc.changePassword = function(data) {
    var password = data.password;

    var u = {};
    var id = data.id || error('id is required');

    data.email = (data.email || '').trim();

    password || error('Password is required');


    return db.users.findOne({ _id: ObjectID(id) })
          .then(user => {
              u = user;
          })
          .then(() => {
              return db.users.encryptPassword(password);
           }).then(new_pwd => {
               Object.assign(u, new_pwd);
               return db.users.update(u);
           }).then(user => {
               return {
                   username: user.username,
                   email: user.email,
                   message: 'Password was successfully changed.',
                   success: true
               };
           });

}

/**
 *
 * @param data
 * @return {json}
 *
 * @todo: Forgot a password
 */
svc.forgotPassword = function(data) {

    var u = {};
    data.email = (data.email || '').trim();

    // validation
    isEmail(data.email) || error('Email address is invalid.');

    return db.users.findOne({email: data.email}).then(user => {
            if (!user)
                error('Invalid username or email.');
            return user;
        }).then(user => {
            var token = generateToken(user._id);
            user.resetPasswordToken = token.accessToken;
            user.resetPasswordExpires = token.expires;
            u = user;
            return db.users.create(user);
        }).then(user => {
            if (!user)
                error('save failed');
            //return notificationService.forgot_password(user, user.resetPasswordToken);
            return true;
        }).then(res => {
            if (!res)
                error('notification failed');
            return {
                username: u.username,
                email: u.email,
                message: 'Password reset request.',
                token: u.resetPasswordToken,
                success: true
            };
        });

}

/**
 *
 * @param token
 * @return {json}
 *
 * @todo: Check if token is valid
 */
svc.isValidToken = function(token) {
    return db.users.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}}).then(
        user => {
            console.log(user);
            if (!user)
                error('invalid user');

            return user;
        }).then(user => {
            return {
                username: user.username,
                email: user.email,
                message: 'Valid token',
                success: true
            };

        });
}

/**
 *
 * @param data, token
 * @return {Promise|Promise.<TResult>|*}
 *
 * @todo: Reset a password
 */
svc.resetPassword = function(data, token) {

    var password = data.password;

    return db.users.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}}).then(
        user => {
            if (!user)
                error('invalid user');

            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            return db.users.create(user);
        }).then(user => {
            if (!user)
                error('Password Reset Error');
            return notificationService.reset_password(user);
        });

}

svc.get = function (user, id) {

    if (!user.isAdmin()) {
        accessDenied();
    }

    if (isUUID(id)) {
        return svc.getById(id);
    }

    return db.users.findOne({email : id});

}


/**
 * Returns a user model for email notification (profile + user.email). 
 * @param id
 */
svc.getForEmailNotification = function(id){
  
  return db.users.findOne({_id: id}).then(user => {

      if(!user) {
          throw new Error('User not found');
      }

      return profileSvc.minimal(id).then(profile => {
          profile = profile.toJSON();
          profile.email = user.email;
          return profile;
      });

  });
}

svc.getById = function (id, opts) {
    opts = opts || {};
    var user_out = null;


    return Promise.props({
        user : db.users.findOne({_id : id}).select({
            username: 1,
            email : 1
        }),
        profile : db.profile.findOne({user_id : id}),
        photos : db.photos.find({user_id : id}).select({
            key : 1,
            bucket: 1,
            full_location: 1,
            mature : 1,
            avatar: 1
        }),
        locations: db.location.find({user_id : id})
    }).then(results => {
        return results;
    });
  
}

svc.delete_photo = function(id, cb) {

    db.photos.delete(id, function(err, data) {
        cb(err,data);
    });

}

svc.update = function (data) {

    return db.users.findOne({_id : new ObjectID(data._id)}).then(user => {

        delete data._id;
        Object.assign(user, data);
        return user.save();
    });
}

svc.add_photo = function (userId, data, cb) {

    data.user_id = userId;


    return db.photos.create(data).then(photo => {

        svc.getById(userId).then(user => {
            user.photos.push({id : photo._id });

            user.save(err => {

                if (err) return handleError(err);

                return Promise.resolve(photo);
            });
        });
    });
}

svc.update_photo = function (id, data, cb) {

    db.photos.update(id, data, function(err, data) {
        cb(err, data);
    });

}

svc.photos = function(userId, params, cb) {
    params = params || {};
    params.where = params.where || {};


    if(userId) {
        params.where.user_id = new ObjectID(userId);
    }

    // console.log(params.where);

    db.photos.find(params.where, function(err, data) {
        cb(err, data);
    });

}

svc.find = function(params) {

    var limit = params.limit || 20;
    var skip = params.skip || 0;

    const q = _.pick(params, 'account_type', 'status');

    return Promise.props({
        total_records : db.users.count(q),
        skip : skip,
        limit : limit,
        rows : db.users.find(q)
                       .limit(limit)
                       .skip(skip)
                       .select({
                           status:1,
                           account_type: 1,
                           avatar: 1,
                           contacts: 1,
                           details:1,
                           email : 1,
                           locations:1,
                           photos:1,
                           username:1,
                       })
    });

};


/**
 * Deletes a migrated user with the intention of reimporting 
 * @param id
 */
svc.deleteMigrated = function(id) {

    const q = {fs_user_id:id};
    return db.users.remove(q).then(()=> {
        return db.profile.remove(q);
    }).then(()=> {
        return db.photos.remove(q);
    }).then(()=> {
        return db.location.remove(q);
    });

}


// svc.getProfileByUsername = function(username, params) {
//   return svc.getProfile({username:username});
// };
//
// svc.getProfile = function(params) {
//   return db.users.findOne(params).select({
//     username:1,
//     account_type: 1,
//     photos:1,
//     locations:1,
//     details:1,
//     contacts: 1,
//     email : 1
//   }).then(function(data) {
//     if(data == null)
//       throw new Error('User was not found');
//
//     const photos_ids = data.photos.map(t=> new ObjectID(t.id));
//     console.log(photos_ids);
//     return db.photos.find({_id :  {$in:photos_ids}}).select({
//       "key": 1,
//       "full_location": 1,
//       "photo_url": 1,
//       "w": 1,
//       "h": 1,
//     }).then(photos => {
//       data.photos = photos ;
//       return data;
//     })
//   });
// };

svc.getToken = function(userId) {
    return generateToken(userId);
};

svc.addContact = function(userId, data,cb) {

    db.users.addContact(userId, data, function(err, data) {
        cb(err, data);
    });

};

svc.addLocation = function(userId, data, cb) {

    db.users.addLocation(userId, data, function(err, data) {
        cb(err, data);
    });

};

//
// svc.browse = function(params, cb) {
//   params.status = 'active';
//
//   return svc.find(params);
//
// };

function generateToken(userId, options) {

    options = options || {};

    var exp = options.expiration || moment().add(90, 'days').format('X');

    exp = parseInt(exp, 10);

    var payload = {
        u: userId,
        exp: exp
    };

    payload = merge(payload, options.payload || {});

    var token = jwt.sign(payload, config.tokenSecret);

    return {
        accessToken: token,
        expires: new Date(exp * 1000)
    };
}


function error(msg) {

    var err = new Error(msg);
    err.statusCode = 400;

    throw err;

}
