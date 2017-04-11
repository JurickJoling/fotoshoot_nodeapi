var router = require('express').Router(); 
var Service = require('../services/projectService'); 

module.exports = router; 

router.get('/:id?', function(req,res,next){ 
	var data = req.query ;
	data.where = data.where || {} ;
	data.where.user_id = req.userId ;

	if(req.params.id != null ) {
		data.where._id = req.params.id
	}

	Service.find(data, function(err, data) {
		if(err)
			res.send({'error' : err});
		else  {
			if(req.params.id != null && data.length > 0 ) {
				res.send(data[0]);
			} else {
				res.send(data);
			}
		}

			
	});

});


router.post('/', function(req,res,next){ 
	var data = req.body ;
	data.user_id = req.userId ;

	Service.saveProject(data, function(err, data) {
		if(err)
			res.send({'error' : err});
		else 
			res.send(data);
	});

});


router.post('/:id/photo' ,function(req,res,next) {
	var data = req.body; 
	var id = req.params.id;

	Service.addPhoto(id, data,function(err, data) {
		if(err)
			res.send({'error' : err});
		else 
			res.send(data);
	});
});



router.post('/:id/photo/:pid/revision' ,function(req,res,next) {
	var data = req.body; 
	var id = req.params.id;
	var pid = req.params.pid;

	data.photo_id = pid; 
	data.project_id = id; 
	

	Service.addPhotoRevision(data,function(err, data) {
		if(err)
			res.send({'error' : err});
		else 
			res.send(data);
	});
});

router.delete('/:id/photo/:pid/revision/:rid' ,function(req,res,next) {
	Service.removePhotoRevision(req.params.pid, req.params.rid ,function(err, data) {
		if(err)
			res.send({'error' : err});
		else 
			res.send(data);
	});
});

Service.removePhotoRevision




