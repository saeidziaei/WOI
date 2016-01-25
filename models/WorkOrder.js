var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Work Order Model
 * =============
 */

var WorkOrder = new keystone.List('WorkOrder');

WorkOrder.add({
	customer: { type: Types.Relationship, required: true, ref: 'Customer', index: true, initial: false },
    status : {type: String, required: true, default: 'quote', index:true },
    createdAt: { type: Date, default: Date.now },
    description: {type: String },
    items: {type: Types.TextArray}
});

WorkOrder.register();
