var keystone = require('keystone');
var url = require("url");

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;
 
	// Set locals
	locals.section = 'custdata';

	var queryData = url.parse(req.url, true).query;

	var conditions = [], regex;
	if (queryData.name) {
		regex = new RegExp(queryData.name, 'i');
		conditions.push({ $or: [
			{ "name.first": regex },
			{ "name.last": regex }]});
	}
	if (queryData.phone) {
		regex = new RegExp(queryData.phone, 'i');
		conditions.push({ "phone": regex });
	}
	if (queryData.email) {
		regex = new RegExp(queryData.email, 'i');
		conditions.push({ "email": regex });
	}
 
	// Load the customers
	view.query('customers', keystone.list('Customer').model
		.find({ $and: conditions }
			).sort('name.last')
		.limit(12));
 
	// Render the view
	view.render(function (err) {
		if (err)
			return res.apiError('error', err);
		res.apiResponse({
			customers: locals.customers
		});
	});

}
