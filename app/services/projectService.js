var ObjectID = require('mongodb').ObjectID;
var config = require('../../config'); 


var db = require('./db')

var Service = module.exports = {};

Service.find = function(params, cb){
	db.project.find(params, function(err, data) {
		if(err) {
			return cb(err); 
		}

		// console.log(params);


		if(data.length) {
			var promises = [];

			data.forEach(function(item) {
				promises.push(db.users.addUserToObject(item));
			}, null);
		} else {
			// no projects found, escaping the method
			return cb(null , []);
		}

		Promise.all(promises).then(function(projects) {

			if(params.where._id && projects.length == 1) {
				db.project_photos.find({project_id:params.where._id}, function(err, photos) {
					if(!err){
						projects[0].photos = photos ;

					}

					cb(null , projects);
				});
			} else {
				cb(null, projects);
			}
			
			
		})
	});
};

Service.saveProject = function(data, cb) {
	db.project.save(data, cb) ;
	
}


Service.addPhoto = function(id, data,cb) {
	data.project_id = new ObjectID(id); 

	db.project_photos.insert(data , cb);
	// db.project.addChild(id, 'photos', data, cb);
}


Service.addPhotoRevision = function(data,cb) {

	var id = data.photo_id ; 
	delete data.photo_id; 
	delete data.project_id;
	
	db.project_photos.addChild(id, 'revisions', data, cb);
}

Service.removePhotoRevision = function(photo_id, revision_id, cb){
	db.project_photos.removeChild(photo_id, 'revisions', {_id : revision_id}, cb);
};
