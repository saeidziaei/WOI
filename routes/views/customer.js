var keystone = require("keystone");
var User = keystone.list('User');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res),
		locals = res.locals;
		
	// Init locals
	locals.section = "customer";
	locals.data = {};
	locals.section = 'contact';
	
	locals.customer = req.body || {};
	locals.validationErrors = {};
	locals.submitted = false;
	
	view.on("init", function(next){
		if (req.params.customer){
			User.model.findOne({
				_id: req.params.customer})
				.exec(function(err, result){
					if (result && result.isCustomer)
						locals.customer = result;
					else
						req.flash("error", "Invalid Customer ID");
					next(err);
				});
		} else {
			next();
		}
	});
	
	view.on('post', { action: 'customer' }, function(next) {
		var updater;
		if (locals.customer){
			updater = locals.customer.getUpdateHandler(req);
		} else {
			var newEntity = new User.model();
			updater = newEntity.getUpdateHandler(req);
		}
		
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, company, email, phone, billingAddress, shippingAddress, ABN',
			errorMessage: 'There was a problem savign customer:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.submitted = true;
			}
			next();
		});
		
	});
	
	
	view.render('customer');
}