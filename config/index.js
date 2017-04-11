var merge = require('deepmerge')
var bluebird = require('bluebird')
var nodemailer = require('nodemailer');

var config = {}

console.log("* NODE_ENV", process.env.NODE_ENV);



config.default = {
    notification: {
        mailgun_key : 'key-7bc793c5235d275e963096c243dbe96e',
        mailgun_domain : 'fotoshoot.com', 
        from        : 'fotoshoot.com <no-reply@fotoshoot.com>', 
    },
     
    mssql : 'mssql://sa:Test5510164@db1.emagid.net/saSegevs',
    mssql_obj : {
        user: 'sa',
        password: 'Test5510164',
        server: 'db1.emagid.net',
        database: 'saSegevs'
    },
  db : "mongodb://localhost/fs",
  debug: false,
  Promise: bluebird,
  memoize: 150,
  tokenSecret: '8wns,k3ju$A1fDgRk2\'/1HJ5p6371}',
    stripe : {
        'sk' : 'sk_test_aBk4G6WKq8efSfR7rqSoccnV', 
        'pk' : 'pk_test_Uk0WO6v0vpk8SYsCWfvwNkfd',
    },
  smtp : {
  	port : 587, 
  	host : 'email-smtp.us-east-1.amazonaws.com', 
    auth : {
      user : 'AKIAIDETEYSRBZHOIKSQ',
      pass : 'AiPYgMpzHOI1mAnj+oa6zAbV6sQUgKVkoJPb4hPPLpeT',
    },
  	
    from : 'no-reply@fotoshoot.com',
  },
  aws : {
      s3 : {
          key : 'AKIAIDMKZQG7MGFYKMQA',
          secret : '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'
      }
  },
  account_types : {
    models : { key : 'model'},
    photographers : { key : 'photographer'},
    others : { key : 'other'},

  }
}

config.staging = {
	db : 'mongodb://fsuser:test5343@ds013024.mlab.com:13024/fs'
}

config.production = {
	db : 'mongodb://fsuser:test5343@ds013024.mlab.com:13024/fs',
    stripe : {
        'sk' : 'sk_live_y9pXzfRo2E0b2IeOoxnU3Ks1',
        'pk' : 'pk_live_0Q7OzfSLDIWHADCVdMBDmgy4',
    }
}


var config_exp = merge(
  config.default,
  config[process.env.NODE_ENV] || {}
);


config_exp.smtp.transporter = nodemailer.createTransport(config_exp.smtp);
// config.smtp.transporter = nodemailer.createTransport('smtps://' + config.smtp.user + ':' + config.smtp.pass +'@' + config.smtp.host);


module.exports = config_exp;
