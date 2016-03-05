
var async = require('async'),
	keystone = require('keystone'),
	url = require("url");

var User = keystone.list('User');

/**
 * List Users
 */

exports.operatorListNames = function(req, res){
	var q = keystone.list('User').model
		.find({"isOperator":true})
		.limit('100'); // Safety limit only
	
	q.exec(function(err, results) {
		if (err) return res.apiError('database error', err);
		res.apiResponse({
			operators: results
		});
		
	});
		
}

exports.list = function(req, res) {
	User.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			users: items
		});
		
	});
}

exports.createCustomer = function(req, res) {
	
	var item = new User.model(),
		// data = (req.method == 'POST') ? req.body : req.query;
		data = req.body;
	
	item.isCustomer = true;
	item.isAdmin = false;
	item.isOperator = false;
	item.isManager = false;
	item.password = data.phone ? data.phone : require('../../config.json').customerDefaultPassword;
	item.name = data.name;
	item.email = data.email;
	item.phone = data.phone;
	item.billingAddress = data.address;
	item.save(function(err){
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			user: item
		});
	});

}

exports.searchCustomer = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;
 
	// Set locals
	locals.section = 'custdata';

	var queryData = url.parse(req.url, true).query;

	var conditions = [], regex;
    conditions.push({"isCustomer": true});
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
	view.query('customers', keystone.list('User').model
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
