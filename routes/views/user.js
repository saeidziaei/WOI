var keystone = require("keystone");
var User = keystone.list('User');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res),
		locals = res.locals;
		
	// Init locals 
	locals.data = {};
	
	locals.user = req.body || {};
	locals.validationErrors = {};
	locals.submitted = false;
	
	view.on("init", function(next){
		if (req.params.customer){
			User.model.findOne({
				_id: req.params.customer})
				.exec(function(err, result){
					if (result && result.isCustomer)
						locals.user = result;
					else
						req.flash("error", "Invalid Customer ID");
					next(err);
				});
		} else {
			next();
		}
	});
	
	view.on("init", function(next){
		if (req.params.operator){
			User.model.findOne({
				_id: req.params.operator})
				.exec(function(err, result){
					if (result && result.isOperator)
						locals.user = result;
					else
						req.flash("error", "Invalid Operator ID");
					next(err);
				});
		} else {
			next();
		}
	});
	
	// view.on('post', { action: 'customer' }, function(next) {
	view.on('post', function(next) {
		var updater;
		if (locals.user && locals.user._id){
			updater = locals.user.getUpdateHandler(req);
		} else {
			var newEntity = new User.model();
			switch (req.body.action){
				case 'customer':
					newEntity.isCustomer = true;
					break;
					
				case 'operator':
					newEntity.isOperator = true;
					newEntity.password = "1";
					break;
					
			}
			updater = newEntity.getUpdateHandler(req);
		}
		
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, company, email, phone, billingAddress, shippingAddress, ABN, password',
			errorMessage: 'There was a problem saving database record:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.submitted = true;
			}
			next();
		});
		
	});
	
	
	view.render('user');
}