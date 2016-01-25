var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

$(document).ready(function(){
	ReactDOM.render(
  <CustomerLookup />,
  $('#customer-lookup-container')[0]
);

})
var CustomerBox = React.createClass({
	
	render: function(){
		var customer = this.props.data;
		return (
			<div className='col-xs-6 col-sm-3 customer-box' onClick={this.boxClicked}>
				<div className='thumbnail' >
					<div className='caption'>
						<h3>{customer.name.first} {customer.name.last}</h3>
						<p>{customer.phone}</p>
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
var CustomerLookup = React.createClass({
  render: function() {
	// var msg = this.state.existingCustomerSelected ? <span className='existing-customer'>Existing Customer!</span> : null;
	var c = this.state.selectedCustomer;
	var customerBox = c ? 
		(<div> <CustomerBox key={c._id} data={c}/> 
			<div className='btn btn-primary' onClick={this.changeSelection}>Change</div>
		</div>): null;
	 
	var custdata = this.state.custdata;
	var matchedCustomers = null;
	if (custdata && custdata.length) {
		matchedCustomers = <CustomerBoxList data={custdata} onSelect={this.customerSelected}/>; 
	}
	
	var newCustomerControls = !c ?
			(<div className="row">
				<div className="col-sm-6 col-xs-12">
					<input name="lookup-name" onChange={this.nameChanged} placeholder="Name" className="form-control"/>
				</div>
				<div className="col-sm-6 col-xs-12">
					<input name="lookup-phone" placeholder="Phone" className="form-control"/>
				</div>
			</div>)
			: null;
	
    return (
	<div>
		{customerBox}
		{newCustomerControls}
		{matchedCustomers}
	</div>);
  },
  getInitialState: function(){
	return({
		custdata: null,
		selectedCustomer: null
	});  
  },
  nameChanged: function(e){
	  var token = e.target.value;
	  if (token){
		$.get('/custdata/' + token, function(result){
			this.setState({
				custdata: result.customers
			});
		}.bind(this));
	  }	
  },
  customerSelected: function(customer){
	this.setState({
		selectedCustomer: customer,
		custdata: null // customer get picked!, no need to keep the list of matched records
	});
  },
  changeSelection: function(){
  	this.setState({
		  selectedCustomer: null
	  });
  }
});

