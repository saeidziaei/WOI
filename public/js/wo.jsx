var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var WO = require('./components/wo.js');
var WoLookup = require('./components/woLookup.js');
var OperatorPicker = require('./components/operatorPicker.js');

// TODO: Maybe seperate these out
$(document).ready(function(){
	var woContainer = document.getElementById('wo-container');
	if (woContainer){
		ReactDOM.render(<WO standardItems={standardItems} data={woObject} />, woContainer);
	}

	var woLookupContainer = document.getElementById('wo-lookup-container');
	if (woLookupContainer){
		ReactDOM.render(<WoLookup  />, woLookupContainer);
	}
	
	var operatorsContainer = document.getElementById('operators-container');
	if (operatorsContainer){
		$.get("/api/operator/list-names", function(result){
			ReactDOM.render(<OperatorPicker onSelect={operatorSelected} data={result.operators}  />, operatorsContainer);
		});	
	}
});

