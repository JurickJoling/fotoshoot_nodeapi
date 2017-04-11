var router = require('express').Router(); 
var Book = require('../services/bookingService'); 

module.exports = router; 

router.post('/', function(req,res,next) {
	req.body.user_id = req.userId; 


	

	if(req.body.id) {

		req.body._id = req.body.id;
		delete req.body.id;

		Book.update(req.body, function(err, data){
			if(err) {
				res.send({'error' : err});
			} else {
				res.send(data);
			}
		});
	} else {
		req.body.compensation = req.body.compensation || {};
		req.body.compensation.type = req.body.compensation.type || req.body.compensation_type;
		req.body.compensation.details = req.body.compensation.details || req.body.compensation_details;

		delete req.body.compensation_type;
		delete req.body.compensation_details;
		
		req.body.booked_user_id = req.body.uid; 


		Book.newBooking(req.body, function(err, data){
			if(err) {
				res.send({'error' : err});
			} else {
				res.send(data);
			}
		});	
	}
	
	
});



router.get('/pending' , function(req,res,next) {
	req.query.user_id = req.userId; 

	Book.pendingBookings(req.query, function(err, data) {
		if(err) {
			res.send({'error' : err});
		} else {
			res.send(data);
		}
	})

});
