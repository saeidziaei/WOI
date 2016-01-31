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
function getWorkOrder(){
	var wo = {
		"description": $("#description").val().trim()
	}
	var items = [];
	$(".service-item").each(function(i, c){
		if (c.checked ) {
			items.push($(c).siblings("span").text());
		}
	});
	wo.items = items;
	
	return wo;
}
$('.alert .close').on('click', function(e) {
    $(this).parent().addClass("hidden");
});
function showError(s){
	$("#validation").removeClass("hidden");
	$("#validation #text").html(s);
}
$("#btn-save").on("click", function(event){
	event.preventDefault();

	try{
		if (!customer){
			showError("Customer is missing.");
			return;
		}
		var wo = getWorkOrder();
		if (!wo.description && !wo.items.length){
			showError("What work needs to be done?");
			return;
		}
		var dbCustomer = customer;
		if (typeof dbCustomer.name != "object"){
			dbCustomer.name = getNameObject(customer.name);
		}
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
				wo.customer = dbCustomer._id;
				saveWorkOrder(wo, function(result){
					alert("All done!");
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