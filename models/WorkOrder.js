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
		keyService.findOne({keyName: 'nextJobNumber'}, function(err, result){
			// JobNumber is in this format YYxxxx in which YY is the last 2 digits of year
			if (err) next(err);
			var nextJobNumber;
			var year = new Date().getFullYear().toString().substr(2, 2);

			if (result && result.seq.toString().substr(0, 2) == year){
				// still in current year
				nextJobNumber = result.seq + 1;
			} else {
				// initial step as well as when the year changes
				nextJobNumber = Number(year) * 1000 + 1;
				// initial step only
				if (!result) {
					result = new KeyService.model({
							keyName: 'nextJobNumber',
							seq: nextJobNumber});
				}
			}
			result.seq = nextJobNumber;
			result.save(function(err){
				if (err) next(err);
				doc.jobNumber = nextJobNumber;
				next();
			});
		});
		
	} else {
		next();
	}		


});



WorkOrder.register();
