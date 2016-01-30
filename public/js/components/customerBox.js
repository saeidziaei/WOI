var React = require('react');
var CustomerBox = React.createClass({
	render: function(){
		var customer = this.props.data;
		return (
			<div className={this.props.className + ' col-xs-12 col-sm-6 col-md-4 customer-box'} onClick={this.boxClicked}>
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