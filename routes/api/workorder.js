var keystone = require('keystone');
var WorkOrder = keystone.list('WorkOrder');
var async = require('async');

/**
 * Create a Work Order
 */
exports.create = function(req, res) {
	
	var item = new WorkOrder.model(),
		data = req.body;
	
	var updater = item.getUpdateHandler(req);
	data.status = 'QUOTE';
	 
	updater.process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			workorder: item
		});
		
	});
	
	/*
	WorkOrder.model
		.findOne({"_id": "56d8132897c26a28190d33ec"})
		.populate([
			{path:"customer", select:"name phone email company"}, 
			{path:"createdBy", select:"name"}
		])
		.exec(function(err, result){
			if (err) return res.apiError('database error', err);
			result.state = 'QUOTE';
			res.apiResponse({
				workorder: result
			});
		});
		
		
	*/
}
insertActitivy = function(){
	console.log("NEW ACTIVITY");
}
exports.updateDescription = function(req, res){
	data = req.body;
	
	WorkOrder.model.findById(data._id, function(err, w){
		if (err) return res.apiError('database read error', err);
		w.set({
			description: data.description
			});
		w.save(function(err){
			if (err) return res.apiError('database update error', err);
			insertActitivy();
			res.apiResponse({workorder: w});
		})
	});
}

exports.updatePrice = function(req, res){
	data = req.body;
	
	WorkOrder.model.findById(data._id, function(err, w){
		if (err) return res.apiError('database read error', err);
		w.set({
			price: data.price
			});
		w.save(function(err){
			if (err) return res.apiError('database update error', err);
			insertActitivy();
			res.apiResponse({workorder: w});
		})
	});
}

/**
 * List Posts
 */
exports.list = function(req, res) {
	
	var q = keystone.list('WorkOrder').model
		.find({"customer":{$exists:true}})
		.sort('-createdAt')
		.populate([
			{path:"customer", select:"name phone email company"}, 
			{path:"createdBy", select:"name"}
		])
		.limit('40');
	
	q.exec(function(err, results) {
		if (err) return res.apiError('database error', err);
		async.forEach(results, function(w, callback) { //The second argument (callback) is the "task callback" for a specific messageId
				w.populateRelated("activities[createdBy]", function(){
					w._doc.activities = w.activities;
					callback();
				});
			}, function(err) {
				if (err) return res.apiError('database error populate related', err);
				res.apiResponse({
					workorders: results
			});
			
		});
	});
		
	
}