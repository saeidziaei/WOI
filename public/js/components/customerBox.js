var React = require('react');
var CustomerBox = React.createClass({
	render: function(){
		var customer = this.props.data;
		var displayName = this.customerName(customer);
		var moreLink = customer && customer._id ?
			<div className="card-action">
					<a onClick={this.stopPropagation} target="_blank" href={'/customer/' + customer._id}>Edit</a>
			</div> :
			null;
		return (
			<div className={this.props.className } onClick={this.boxClicked} >
				<div className='card hoverable clickable light-blue lighten-5' >
					<div className='card-content' >
						<span className="card-title"><i className="material-icons">account_circle</i>  {displayName}</span>
						<p>{customer.phone}</p>
						<p>{customer.email}</p>
						<p>{customer.billingAddress}</p>
					</div>
					{moreLink}
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
	},
	customerName: function(c){
		var fullName = c.name.first + " " + c.name.last;
	
		if (c.company){
			return c.company + " (" + fullName + ")";
		} else {
			return fullName;
		}
	}
});

module.exports = CustomerBox 