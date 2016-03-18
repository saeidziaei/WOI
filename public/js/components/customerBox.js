var React = require('react');
var CustomerBox = React.createClass({
	render: function(){
		var customer = this.props.data;
		var displayName = this.customerName(customer);
		var moreLink = !this.props.isCompact && customer && customer._id ?
			<div className="card-action">
					<a onClick={this.stopPropagation} target="_blank" href={'/customer/' + customer._id}>Edit</a>
			</div> :
			null;
		var info = this.props.isCompact ? null :
			<div className='info'>
				<p><a href={'tel:'+ customer.phone}> {customer.phone} </a></p>
				<p><a href={'mailto:' + customer.email}> {customer.email} </a></p>
				<p>{customer.billingAddress}</p>
			</div>
		return (
			<div className={this.props.className } onClick={this.boxClicked} >
				<div className='card hoverable clickable grey lighten-4' >
					<div className='card-content' >
						<span className="card-title"><i className="material-icons">account_circle</i>  {displayName}</span>
						{info}
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