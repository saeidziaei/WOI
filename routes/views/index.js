var keystone = require('keystone');
var _ = require('underscore');
var async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	
	view.on('init', function(next) {
		// populate stats
		locals.data = {};
		async.parallel([
    		function(callback) { // the first task, count the work orders by status
				keystone.list('WorkOrder').model.aggregate([
					{"$group" : {_id:"$status", count:{$sum:1}}}
				]).exec(function(err, result){
					var item = _.find(result, function (item) { return item._id == "QUOTE"});
					locals.data.quote = item ? item.count : 0; 
					item = _.find(result, function (item) { return item._id == "IN PROGRESS"});
					locals.data.in_progress = item ? item.count : 0; 
						item = _.find(result, function (item) { return item._id == "WAIT FOR PART"});
					locals.data.wait_for_part = item ? item.count : 0; 
						item = _.find(result, function (item) { return item._id == "WAIT FOR CUSTOMER"});
					locals.data.wait_for_customer = item ? item.count : 0; 
					// async callback
					callback(err);
				});
			},
		    function(callback) { //This is the second task, populate unassigned work orders
				keystone.list('WorkOrder').model.aggregate(
					{"$match":{"assignee": {$exists:false}}}, 
					{$group:{_id: null, total:{$sum: 1}}})
				.exec(function(err, result){
					// async callback
					if (result && result.length){
						locals.data.unassigned = result[0].total || 0;
					}
					callback(err);
				});
        		 
			}
		], function(err) { //This is the final callback
			next(err);
		});
		
	});
	
	// Render the view
	view.render('index');
	
};
