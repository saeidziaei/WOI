var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WorkOrderActivity Model
 * ==================
 */

var WorkOrderActivity = new keystone.List('WorkOrderActivity', {
	track: true
});

WorkOrderActivity.add({
	activityType: { type: Types.Select, options: [
		{ value: 'comment', label: 'Comment' },
		{ value: 'modify', label: 'Field Change' },
		{ value: 'transition', label: 'Transition (State Change)' },
		{ value: 'assignment', label: 'Assign To' }
	] },
	workorder: { type: Types.Relationship, required: true, ref: 'WorkOrder', index: true, initial: false },
	comment: { type: String, required: true, initial: false },
	// only when type = transition
	transition: {
		fromStatus: { type: String, initial: false },
		toStatus: { type: String, initial: false }
	},
	// only when type = modify
	modify: {
		field: { type: String, initial: false },
		fromValue: { type: String, initial: false },
		toValue: { type: String, initial: false }
	},
	// only when type = assignment
	assignedTo: { type: Types.Relationship, required: false, ref: 'User', initial: false },
	// normally used for wait-for-part, wait-for-customer or re-open to provide more details
	note: { type: String, required: false, initial: false },
	
		
});

WorkOrderActivity.defaultSort = '-createdAt';

WorkOrderActivity.defaultColumns = 'workorder, createdBy, createdAt, comment, activityType';

WorkOrderActivity.register();
