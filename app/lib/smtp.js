var pug = require('pug');
var config = require('../../config'); 
var merge = require('deepmerge');
var nodemailer = require('nodemailer');
 
module.exports = {
	sendTemplate  : function(view, options, callback) {
		var html = pug.renderFile(view, options);


		// setup e-mail data with unicode symbols 
		var mailOptions = {
		    from: config.smtp.from, 
		    to: 'segevs09@gmail.com',
		    subject: options.subject,
		    html: html
		    // text: 'Hello world 🐴', // plaintext body 
		};
		 
		// send mail with defined transport object 
		config.smtp.transporter.sendMail(mailOptions, callback);


	}
};