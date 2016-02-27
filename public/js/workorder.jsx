var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var WorkOrderBoxList = require('./components/workorderBoxList') 

$(document).ready(function(){
	$.get('/api/workorder/list', function(result){
		
		ReactDOM.render(
			<WorkOrderBoxList data={result.workorders} />,
			document.getElementById('list-container')
		);
	});
}); 