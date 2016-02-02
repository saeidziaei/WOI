var keystone = require('keystone');
var WorkOrderActivity = keystone.list('WorkOrderActivity');

/**
 * Create a Work Order
 */
exports.create = function(req, res) {
	
	var item = new WorkOrderActivity.model(),
		data = req.body;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		keystone.list('WorkOrderActivity').model
			.findById(item._id)
			.populate({path:"createdBy", select:"name"})
			.exec(function(err, newItem) {
				if (err) return res.apiError('database error', err);
				res.apiResponse({
					workorderactivity: newItem
				});
		
			});
		
		
	});
}
