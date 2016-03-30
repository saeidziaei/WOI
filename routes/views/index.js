var keystone = require('keystone');
var _ = require('underscore');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	
	view.on('init', function(next) {
		keystone.list('WorkOrder').model.aggregate([
			{"$group" : {_id:"$status", count:{$sum:1}}}
		]).exec(function(err, result){
			var item = _.find(result, function (item) { return item._id == "IN PROGRESS"});
			var inprogress = item ? item.count : 0; 
			locals.data = {
				inprogress: inprogress
			};
			next(err);
		})
		
	});
	
	// Render the view
	view.render('index');
	
};
