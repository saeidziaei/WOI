var keystone = require('keystone');
var Types = keystone.Field.Types;



var WorkOrder = new keystone.List('WorkOrder', {
	track: true
});

WorkOrder.add({
	jobNumber: {type: Types.Number, required: false, index: true},
	customer: { type: Types.Relationship, required: true, ref: 'User', filters:{isCustomer: true}, index: true, initial: false },
    status : {type: String, required: true, default: 'QUOTE', index:true },
    description: {type: String, initial: true },
    items: {type: Types.TextArray},
	price: {type: Types.Number, required: false},
	assignee: { type: Types.Relationship, required: false, ref: 'User', filters:{isOperator: true}, index: true, initial: false },
	location: { type: String, required: true, default: 'In Store'},
});

WorkOrder.relationship({ ref: 'WorkOrderActivity', refPath: 'workorder', path: 'activities' });

WorkOrder.schema.pre('save', function(next){
    var doc = this;
	if (!doc.jobNumber){
		var keyService = keystone.list('KeyService').model;
		keyService.findOneAndUpdate(
			{keyName: 'nextJobNumber'}, 
			{$inc: { seq: 1} }, 
			function(error, result){
				if (error) next(error);
				if (!result){
					var KeyService = keystone.list('KeyService');
					var newKey = new KeyService.model({
							keyName: 'nextJobNumber',
							seq: 1});
							
					newKey.save(function(err){
						if (err) next(err);
						doc.jobNumber = 1;
						next();
					})
				} else {
					doc.jobNumber = result.seq;
    				next();
				}
			}
		);
	} else {
		next();
	}		


	// keyService.getNextJobNumber(function(jn){
	// 	doc.jobNumber = jn;
	// })
});



WorkOrder.register();
