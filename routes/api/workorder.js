var keystone = require('keystone');
var WorkOrder = keystone.list('WorkOrder');

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
		.populate('customer createdBy')
		.limit('40');
	
	q.exec(function(err, results) {
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			workorders: results
		});
	});
}