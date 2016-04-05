var keystone = require('keystone');
var WorkOrder = keystone.list('WorkOrder');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// item in the header navigation.
	locals.section = 'tracking';
	locals.job = {
		jobNumber: 12444,
		status: 'IN PROGRESS',
		comments: [{
			date: '1 Jan 2016',
			text: 'Come on man!'
		},
		{
			date: '12 Jan 2016',
			text: 'This is getting too late. I am giving up'
		}]
	}	
	
	view.on("init", function(next){
		if (req.params.jobNumber){
			WorkOrder.model.findOne({
				jobNumber: req.params.jobNumber
			})
			.exec(function(err, result){
				if (req.user.isCustomer && req.user._id.id != result.customer.id) {
					// customer can only see their own jobs not anybody else's
					// staff can see all jobs
					req.flash("error", "This job number does not belong to you")					
					next(err);
				} else {
					result.populateRelated("activities", function() {
						locals.job = {
							jobNumber: result.jobNumber,
							status: result.status,
						}
						var comments = [];
						result.activities.map(function(a){
							// only show 'Wait For Customer' activities
							if (!req.user.isCustomer ||
								(a.activityType == 'transition' &&
								a.transition.toStatus == 'WAIT FOR CUSTOMER')){
									comments.push({
										date: a.createdAt, 
										text: a.comment + ' ' + (a.note || '') });
							}
						})
						locals.job.comments = comments;
						next(err);
					})
				}
			});
			
		} else {
			next();
		}
	});
	
	// Render the view
	view.render('tracking');
	
};
