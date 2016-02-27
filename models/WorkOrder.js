var keystone = require('keystone');
var Types = keystone.Field.Types;



var WorkOrder = new keystone.List('WorkOrder', {
	track: true
});

WorkOrder.add({
	jobNumber: {type: Types.Number, required: false, index: true},
	customer: { type: Types.Relationship, required: true, ref: 'User', filters:{isCustomer: true}, index: true, initial: false },
    status : {type: String, required: true, default: 'quote', index:true },
    description: {type: String, initial: true },
    items: {type: Types.TextArray}

});

WorkOrder.relationship({ ref: 'WorkOrderActivity', refPath: 'workorder', path: 'activities' });

WorkOrder.schema.pre('save', function(next){
    var doc = this;
	var keyService = keystone.list('KeyService').model;
    keyService.findOneAndUpdate(
		{keyName: 'nextJobNumber'}, 
		{$inc: { seq: 1} }, 
	 	function(error, result){
			doc.jobNumber = result.seq;
			next();
		}
	);
		


	// keyService.getNextJobNumber(function(jn){
	// 	doc.jobNumber = jn;
	// })
});



WorkOrder.register();
