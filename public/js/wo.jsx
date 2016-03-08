var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var WO = require('./components/wo.js') 
var CustomerLookup = require('./components/customerLookup.js') 
var OperatorPicker = require('./components/operatorPicker.js');
var async = require('async');

$(document).ready(function(){
	
	ReactDOM.render(
		<WO standardItems={standardItems} data={woObject} />,
		document.getElementById('wo-container')
	);
	/*
	ReactDOM.render(
		<CustomerLookup onChange={customerLookupChange} />,
		document.getElementById('customer-lookup-container')
	);
	
	// Operators - Only needed after work item has been saved	
	$.get("/api/operator/list-names", function(result){
		ReactDOM.render(
			<OperatorPicker data={result.operators} onSelect={assignToOperator} />,
			document.getElementById('operator-picker')
		);
	});
	$("#operator-picker").hide();
	$("#btn-assignto").on('click', function(){ 
		 $("#operator-picker").fadeToggle("slow")
	});
	*/
});

function assignToOperator(operator){
	
}
