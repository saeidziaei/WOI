var React = require('react');
var CustomerBox = require('./customerBox.js');

var CustomerBoxList = React.createClass({
	
	render: function(){
		var list = this.props.data.map(function(item){
			return <CustomerBox onSelect={this.customerSelected} key={item._id} data={item}/>
		}.bind(this));
		return (<div className="customer-box-list row margin-top">
				{list} 
			</div>);
	},
	customerSelected: function(customer){
		this.props.onSelect(customer);
	}
});

module.exports = CustomerBoxList;