var React = require('react');
var CustomerBox = React.createClass({
	render: function(){
		var customer = this.props.data;
		var moreLink = customer && customer._id ?
			<p><a onClick={this.stopPropagation} target="_blank" href={'/customer/' + customer._id}>More ...</a></p> :
			null;
		return (
			<div className={this.props.className } onClick={this.boxClicked}>
				<div className='thumbnail' >
					<div className='caption'>
						<h3><span className='glyphicon glyphicon-user'/> {customer.name.first} {customer.name.last}</h3>
						<p>{customer.phone}</p>
						<p>{customer.email}</p>
						<p>{customer.billingAddress}</p>
						{moreLink}
					</div>
				</div> 
			</div>
		);
	},
	boxClicked: function(e){
		if (this.props.onSelect)
			this.props.onSelect(this.props.data);
	},
	stopPropagation: function(e){
		 e.stopPropagation();
	}
});

module.exports = CustomerBox 