var keystone = require('keystone');
var WorkOrder = keystone.list('WorkOrder');
var WorkOrderActivity = keystone.list('WorkOrderActivity');
var async = require('async');
var	url = require("url");

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
function createTransitionActivity(activity){
	return new WorkOrderActivity.model({
		activityType: activity.activityType,
		transition:{
			fromStatus: activity.fromStatus,
			toStatus: activity.toStatus
		},	
		comment: "Changed Status"
	});
}
function createAssignmentActivity(activity){
	return new WorkOrderActivity.model({
		activityType: activity.activityType,
		assignedTo: activity.assignedTo,
		comment: "Changed Assignee"
	});
}
function createModifyActivity(activity){
	return new WorkOrderActivity.model({
		activityType: activity.activityType,
		modify: {
			field: activity.field,
			fromValue: activity.fromValue,
			toValue: activity.toValue
		},
		comment: "Updated " + activity.field
	});
}
function insertActitivy (activity, next){
	var item = activity.activityType == 'modify' ? createModifyActivity(activity) : 
			   activity.activityType == 'assignment' ? createAssignmentActivity(activity) : 
			   activity.activityType == 'transition' ? createTransitionActivity(activity) : null;

    if (!item) next(null);
	
	// This is needed to maintain createdBy field from 'track'
	item._req_user = activity.user;
	
	item.workorder = activity.workorder;
	
	item.save(function(err){
		next(err);
	})
}
exports.changeStatus = function (req, res) {
	data = req.body;
	var activity = { activityType: 'transition', user: req.user};
	WorkOrder.model.findById(data._id, function(err, w){
		// TODO: Check for valid status transitions
		activity.fromStatus = w.status;
		activity.toStatus = data.status;
		activity.workorder = w;

		w.status = data.status;

		w.save(function(err){
			if (err) return res.apiError('database update error', err);
			insertActitivy(activity, function(err){
				if (err) return res.apiError('activity insert error', err);
				return res.apiResponse({workorder: w});
			});
		})
	});	
}
exports.updateField = function(req, res){
	data = req.body;
	var activity = { field: data.field, user: req.user};
	
	
	WorkOrder.model.findById(data._id, function(err, w){
		activity.workorder = w;
		if (err) return res.apiError('database read error', err);
		switch (data.field){
			case 'DESCRIPTION':
				activity.activityType = 'modify';
				activity.fromValue = w.description;
				activity.toValue = data.description;
				w.set({description: data.description});
				break;
			
			case 'ITEMS':
				activity.activityType = 'modify';
				activity.fromValue = w.items;
				activity.toValue = data.items;
				w.set({items: data.items});
				break;
			
			case 'PRICE':
				activity.activityType = 'modify';
				activity.fromValue = w.price;
				activity.toValue = data.price;
				w.set({price: data.price});
				break;
			
			case 'LOCATION':
				activity.activityType = 'modify';
				activity.fromValue = w.location;
				activity.toValue = data.location;
				w.set({location: data.location});
				break;
			
			case 'ASSIGNEE':
				activity.activityType = 'assignment';
				activity.assignedTo = keystone.mongoose.Types.ObjectId(data.assignee);
				w.set({assignee: data.assignee});
				break;
			
		}
		if (activity.activityType == 'modify' && activity.fromValue == activity.toValue) {
			// do nothing
			return res.apiResponse({workorder: w});
		}
		w.save(function(err){
			if (err) return res.apiError('database update error', err);
			insertActitivy(activity, function(err){
				if (err) return res.apiError('activity insert error', err);
				return res.apiResponse({workorder: w});
			});
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

exports.getActivities = function(req, res) {
	var q = WorkOrderActivity.model.find({workorder: req.params.workorder}).populate({path: "createdBy", select: "name"}); 
	q.exec(function(err, results){
		if (err) return res.apiError('database read error', err);
		res.apiResponse({	activities: results	});
	});
}

exports.search = function (req, res) {

	
	// Set locals
	// locals.section = 'workorder-search';

	var queryData = url.parse(req.url, true).query;
	var token = queryData.token;
	var conditions = [], regex;
	// conditions.push({"status": "DRAFT"});

	if (queryData.token) {
		regex = new RegExp(token, 'i');
		var subConditions = [
			{ "description": regex },
			{ "items": regex }
			];
		if (!isNaN(token)){
			subConditions.push({"jobNumber": token});
		}
		conditions.push({ $or: subConditions});
		
		
	}
 
 	var q = keystone.list('WorkOrder').model
		.find({ $and: conditions } )
		.populate("assignee customer")
		.sort('-createdAt')
		.limit('20'); 
		
	q.exec(function(err, results) {
		if (err) return res.apiError('database error', err);
		res.apiResponse({
			workorders: results
		});
		
	});
	

}