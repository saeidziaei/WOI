var React = require('react');
var CustomerBox = React.createClass({
	render: function(){
		var customer = this.props.data;
		return (
			<div className={this.props.className } onClick={this.boxClicked}>
				<div className='thumbnail' >
					<div className='caption'>
						<h3><span className='glyphicon glyphicon-user'/> {customer.name.first} {customer.name.last}</h3>
						<p>{customer.phone}</p>
						<p>{customer.email}</p>
						<p>{customer.billingAddress}</p>
					</div>
				</div> 
			</div>
		);
	},
	boxClicked: function(e){
		if (this.props.onSelect)
			this.props.onSelect(this.props.data);
	}
});

module.exports = CustomerBox 