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
		{ value: 'transition', label: 'Transition (State Change)' },
		{ value: 'assignment', label: 'Assign To' }
	] },
	workorder: { type: Types.Relationship, required: true, ref: 'WorkOrder', index: true, initial: false },
	comment: { type: String, required: true, initial: false },
	// only when type = transition
	transition: {
		fromState: { type: String, initial: false },
		toState: { type: String, initial: false }
	},
	// only when type = assignment
	assignedTo: { type: Types.Relationship, required: false, ref: 'User', initial: false },
		
});


WorkOrderActivity.register();
