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
			<div className='col-xs-12 col-sm-6 col-md-4 customer-box' onClick={this.boxClicked}>
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
		(<div> <CustomerBox key={c._id} data={c} onSelect={this.changeSelection}/> 
			<div className='btn btn-default' onClick={this.changeSelection}>Change</div>
		</div>): null;
	 
	var custdata = this.state.custdata;
	var matchedCustomers = null;
	if (custdata && custdata.length) {
		matchedCustomers = <CustomerBoxList data={custdata} onSelect={this.customerSelected}/>; 
	}
	var newCustomer = this.state.newCustomer;
	var newCustomerExtraControls = !c && newCustomer.name && (newCustomer.phone || newCustomer.email) ? 
			(<div>
			<div className="row margin-top">
				<div className="col-sm-12 col-xs-12">
					<textarea rows="4" className="form-control" placeholder="Address"/>
				</div>
			</div>
			<div className="alert alert-success margin-top-sm">New <strong>customer</strong> will be created.</div>
			</div>
			)
			:
			null;
	var newCustomerControls = !c ?
			(<div className="row">
				<div className="col-sm-4 col-xs-12">
					<input name="lookup-name" onChange={this.nameChanged} value={this.state.newCustomer.name} placeholder="Name" className="form-control margin-top-sm"/>
				</div>
				<div className="col-sm-4 col-xs-12">
					<div className="input-group margin-top-sm">
						<div className="input-group-addon" ><span className="glyphicon glyphicon-earphone"/> </div>
						<input name="customer-phone" type="text" onChange={this.phoneChanged} value={this.state.newCustomer.phone}  className="form-control" placeholder="Phone" />
					</div>
				</div>
				<div className="col-sm-4 col-xs-12">
					<div className="input-group margin-top-sm">
						<span className="input-group-addon" >@</span>
						<input name="customer-email" type="text" onChange={this.emailChanged} value={this.state.newCustomer.email}  className="form-control" placeholder="Email" />
					</div>
				</div>
			</div>)
			: null;
	
    return (
	<div>
		{customerBox}
		{newCustomerControls}
		{newCustomerExtraControls}
		{matchedCustomers}
	</div>);
  },
  getInitialState: function(){
	return({
		custdata: null,
		custdataTemp: null,
		selectedCustomer: null,
		newCustomer: {name:"", email:"", phone:""}
	});  
  },
  nameChanged: function(e){
	  var name = e.target.value;
	  var newCustomer = this.state.newCustomer;
	  newCustomer.name = name;
	  this.setState({newCustomer: newCustomer});
	  this.search(newCustomer);
  },
  phoneChanged: function(e){
	  var phone = e.target.value;
	  var newCustomer = this.state.newCustomer;
	  newCustomer.phone = phone;
	  this.setState({newCustomer: newCustomer});
	  this.search(newCustomer);
  },
  emailChanged: function(e){
	  var email = e.target.value;
	  var newCustomer = this.state.newCustomer;
	  newCustomer.email = email;
	  this.setState({newCustomer: newCustomer});
	  this.search(newCustomer);
  },
  search: function(c){
	  if (c.name || c.phone || c.email){
		$.get('/custdata?name=' + c.name + '&phone=' + c.phone + '&email=' + c.email, function(result){
			this.setState({
				custdata: result.customers
			});
		}.bind(this));
	  }	
  },
  customerSelected: function(customer){
	var custdata = this.state.custdata;
	this.setState({
		selectedCustomer: customer,
		custdata: null, // customer get picked!, no need to keep the list of matched records
		custdataTemp: custdata // in case the user changes mind
	});
  },
  changeSelection: function(){
  	this.setState({
		  selectedCustomer: null,
		  custdata: this.state.custdataTemp
	  });
  }
});

