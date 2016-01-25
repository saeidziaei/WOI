var keystone = require('keystone');


exports = module.exports = function(req, res) {
 
 var view = new keystone.View(req, res),
 locals = res.locals;
 
 // Set locals
 locals.section = 'custdata';
 
 var token = req.params.token;
 var regex = new RegExp(token, 'i');
 // Load the customers
 view.query('customers', keystone.list('Customer').model
 		.find({ $or:[
	{"name.first" : regex}, 
	{"name.last" : regex}, 
	{"phone" : regex}]} 
 ).sort('phone'));
 
 // Render the view
 view.render(function(err) {
 	if (err) 
	 return res.apiError('error', err);
 	res.apiResponse({
 		customers: locals.customers
	 });
 });
 
}
