var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Work Order Model
 * =============
 */

var WorkOrder = new keystone.List('WorkOrder', {
	track: true
});

WorkOrder.add({
	customer: { type: Types.Relationship, required: true, ref: 'User', index: true, initial: false },
    status : {type: String, required: true, default: 'quote', index:true },
    description: {type: String, initial: true },
    items: {type: Types.TextArray}
});

WorkOrder.register();
