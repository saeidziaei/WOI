var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Key Service Model
 * =============
 */
var KeyService = new keystone.List('KeyService');
KeyService.add({
    keyName: {type: String, required: true, initial: false},
    seq: { type: Types.Number, default: 0 }
});

// KeyService.schema.statics.getNextJobNumber = function (cb) {
// 	this.update({keyName: 'nextJobNumber'}, {$inc: { seq: 1} }, { upsert: true }, function(error, counter)   {
//         if(error){
//             console.log("key error", error);
//             return cb(error);
// 		}
// 		cb(counter);
//     });
// 
// }

KeyService.register();
