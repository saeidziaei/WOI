var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Customer Model
 * ==========
 */

var Customer = new keystone.List('Customer');

Customer.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	phone: {type: String},
	billingAddress: {type: String},
	shippingAddress: {type: String},
	password: { type: Types.Password, initial: true, required: true }
});


/**
 * Relationships
 */

Customer.relationship({ ref: 'WorkOrder', path: 'workOrders', refPath: 'customer' });


/**
 * Registration
 */

Customer.defaultColumns = 'name, email, phone';
Customer.register();
