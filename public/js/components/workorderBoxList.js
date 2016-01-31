var React = require('react');
var WorkorderBox = require('./workorderBox');

var Workorderist = React.createClass({
	render: function(){
		var list = this.props.data.map(function(item){
			return <WorkorderBox key={item._id} data={item}/>
		}.bind(this));
		return (<div className="workorder-box-list row margin-top">
				{list} 
			</div>);
	}
});

module.exports = Workorderist;
