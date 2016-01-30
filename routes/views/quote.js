var keystone = require('keystone');
var WorkOrder = keystone.list('WorkOrder');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'quote';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.submitted = false;
	try {
		locals.standardItems = require('../../config.json').standardItems;
	} catch (error) {
		console.error(error);	
	}
	
	// On POST requests, add the WorkItem item to the database
	view.on('post', { action: 'quote' }, function(next) {
		
		var newWorkOrder = new WorkOrder.model(),
			updater = newWorkOrder.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			// fields: 'name, email, phone, enquiryType, message',
			errorMessage: 'There was a problem submitting your quote:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.submitted = true;
			}
			next();
		});
		
	});
	
	view.render('quote');
	
};
