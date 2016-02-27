var keystone = require('keystone');
var WorkOrder = keystone.list('WorkOrder');
var async = require('async');

/**
 * Create a Work Order
 */
exports.create = function(req, res) {
	
	var item = new WorkOrder.model(),
		data = req.body;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			workorder: item
		});
		
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