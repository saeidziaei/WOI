var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var CustomerLookup = require('./components/customerLookup.js') 
var async = require('async');

$(document).ready(function(){
	ReactDOM.render(
		<CustomerLookup onChange={customerLookupChange} />,
		$('#customer-lookup-container')[0]
	);
});
var customer;
function customerLookupChange(c){
	customer = c;
}

$("#btn-save").on("click", function(event){
	try{
		var dbCustomer = customer;
		if (typeof dbCustomer.name != "object"){
			dbCustomer.name = getNameObject(customer.name);
		}
		var customerID = dbCustomer._id;
		async.series([
			function(cb){
				if (!dbCustomer._id){
					saveCustomer(dbCustomer, function(saved){
						console.log("customer saved", dbCustomer, saved);
						dbCustomer._id = saved.user._id;
						cb();
					});
				} else {
					cb();
				}
			},
			function(){
				saveWorkOrder({
					"customer": dbCustomer._id,
					"description": $("#description").val()
				}, function(result){
					alert("Fantastic!");
					console.log("/workorder/save", result);
				});
			}
		]);
	}
	catch (e){
		console.log(e);
		alert("Ooops! someting is not working.");
	}
	return false;
});



function saveCustomer(customer, cb){
	$.post("/api/customer/create", customer, function(result){
		console.log("/customer/save", result);
		cb(result);
	});
}

function saveWorkOrder(workOrder, cb){
	$.post("/api/workorder/create", workOrder, function(result){
		cb(result);
	});
}

function getNameObject(name){
	if (!name) return null;
	
	var first, last, delimiterIndex = name.indexOf("-");
	if (delimiterIndex != -1){
		first = name.substring(0, delimiterIndex - 1).trim();
		last = name.substring(delimiterIndex + 1).trim();
	} else {
		// 'Paul Steve Panakkal'.split(' ').slice(0, -1).join(' '); // returns "Paul Steve"
		// 'Paul Steve Panakkal'.split(' ').slice(-1).join(' '); // returns "Panakkal"
		first = name.split(' ').slice(0, -1).join(' ');
		last = name.split(' ').slice(-1).join(' ');
	}
	return {first: first, last: last};
}