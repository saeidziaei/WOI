var keystone = require('keystone');
var WorkOrder = keystone.list('WorkOrder');

exports.browse = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.title = 'Work Order';
	locals.section = 'work order';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.submitted = false;
	try {
		locals.standardItems = require('../../config.json').standardItems;
	} catch (error) {
		console.error(error);	
	}
	
	
	
	view.on('init', function(next) {
		if (req.params.jobNumber) {
			keystone.list('WorkOrder').model.findOne({ jobNumber: req.params.jobNumber }).exec(function(err, result) {
				locals.data.wo = result;
				next(err);
			});
		} else {
			locals.wo = {status: 'DRAFT', items:[]};
			next();
		}
		
	});
	
	
	view.render('wo');
	
};

exports.byJobNumber =  function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.title = 'By Job Number';
	locals.section = 'work order';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.submitted = false;
	try {
		locals.standardItems = require('../../config.json').standardItems;
	} catch (error) {
		console.error(error);	
	}
	
	view.on('init', function(next) {
		if (req.params.jobNumber) {
			keystone.list('WorkOrder').model
				.findOne({ jobNumber: req.params.jobNumber })
				.populate([
					{path:"customer", select:"name phone email company billingAddress"}, 
					{path:"assignee", select:"name"}, 
					{path:"createdBy", select:"name"}
				])
				.exec(function(err, result) {
				locals.wo = result;
				next(err);
			});
		} else {
			locals.wo = {status: 'DRAFT', items:[]};
			next();
		}
		
	});
	view.render('wo');
	
};

