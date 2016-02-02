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
	workorder: { type: Types.Relationship, required: true, ref: 'WorkOrder', index: true, initial: false },
	comment: { type: String, required: true, initial: false }
});


WorkOrderActivity.register();
