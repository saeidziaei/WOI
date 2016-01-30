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