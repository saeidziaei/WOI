var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, index: true },
	phone: {type: String},
	password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Admin', index: true },
	isManager: { type: Boolean, label: 'Manager/ Owner' },
	isOperator: { type: Boolean, label: 'Operator' },
	isCustomer: { type: Boolean, label: 'Customer' },
},
	'Customer', {
		billingAddress: {type: String},
		shippingAddress: {type: String},
		company: {type: String},
		ABN: {type: String},
	}
);

User.schema.virtual('displayName').get(function(){
	var fullName = this.name.first + " " + this.name.last;
	
	if (this.company){
		return this.company + " (" + fullName + ")";
	} else {
		return fullName;
	}
});
// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

User.relationship({ ref: 'WorkOrder', path: 'workOrders', refPath: 'customer' });

/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
