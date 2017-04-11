var chai = require('chai');
var should = chai.should();
var smtp = require('../app/lib/smtp');




// var SMTPConnection = require('smtp-connection');

// var connection = new SMTPConnection({
// 	port : 587, 
// 	host : 'email-smtp.us-east-1.amazonaws.com', 


// });


describe('Testing SMTP connection', function() {

	it('Should send template message for new registration', function(done) {
		smtp.sendTemplate('views/emails/register.jade', {
			subject : 'Welcome to fotoshoot.com', 
			title   : 'New registration',


		}, function(err, data) {
			console.log("ERR", err);
			console.log("Data", data);
			done();
		});

		// connection.connect(function() {
		// 	connection.login({
		// 		user:'AKIAIDETEYSRBZHOIKSQ',
		// 		pass:'AiPYgMpzHOI1mAnj+oa6zAbV6sQUgKVkoJPb4hPPLpeT'
		// 	}, function(err, data) {
		// 		var env = {
		// 			from : 'no-reply@fotoshoot.com',
		// 			// 'to' : 'no-reply@fotoshoot.com', 
		// 			'to' : 'segevs09@gmail.com', 

		// 		};
		// 		connection.send(env, 'This is a test message', function(err, info){

		// 			console.log("err : ", err);
		// 			console.log("info : ", info);

		// 			done();
		// 		})

		// 	})
		// }

		// );

		
	})
});