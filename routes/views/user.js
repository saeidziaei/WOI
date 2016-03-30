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
		var redirectPath;
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
					break;
					
			}
			updater = newEntity.getUpdateHandler(req);
		}
		
		var item = req.body;
		if (item.password){
			item.password_confirm = item.password;
		}
		item.isViewerOnly = item.isViewerOnly == 'on'; 
		
		updater.process(item, {
			flashErrors: true,
			fields: 'name, company, email, phone, billingAddress, shippingAddress, ABN, password, isViewerOnly',
			errorMessage: 'There was a problem saving database record:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.submitted = true;
				req.flash('success', 'Operator saved!');
				res.redirect("/operators");
			}
			next();
		});
		
	});
	
	
	view.render('user');
}