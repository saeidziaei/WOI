var keystone = require('keystone');
var _ = require('underscore');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'workorders';
	
	locals.data = {
		workorders: []	
	};
	
	// Load the current category filter
	view.on('init', function(next) {
		var cat = req.params.category; 	
		if (cat) {
			cat = cat.toLowerCase();
			var index = _.indexOf(['in_progress', 'quote', 'wait_for_customer', 'wait_for_part'], cat);
			if (index != -1){
				// serach by status
				var status = ['IN PROGRESS', 'QUOTE', 'WAIT FOR CUSTOMER', 'WAIT FOR PART'][index];
				keystone.list('WorkOrder').model
				.find({ "status": status })
				.populate("assignee customer")
				.sort('-createdAt')
				.exec(function(err, result) {
					locals.data.workorders = result;
					next(err);
				});
			}
			else if (cat == 'unassigned'){
				keystone.list('WorkOrder').model
				.find({ "assignee": {$exists: false} })
				.populate("assignee customer")
				.sort('-createdAt')
				.exec(function(err, result) {
					locals.data.workorders = result;
					next(err);
				});
			}
			else if (cat == 'my_jobs'){
				keystone.list('WorkOrder').model
				.find({ "assignee": req.user._id })
				.populate("assignee customer")
				.sort('-createdAt')
				.exec(function(err, result) {
					locals.data.workorders = result;
					next(err);
				});
			}
			else {
				next();
			}
		} else {
			next();
		}
		
	});
	
	
	// Render the view
	view.render('woList');
	
};

