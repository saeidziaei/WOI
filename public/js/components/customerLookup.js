var React = require('react');
var CustomerBox = require('./customerBox.js');
var CustomerBoxList = require('./customerBoxList.js');


var CustomerLookup = React.createClass({
  render: function() {
	// var msg = this.state.existingCustomerSelected ? <span className='existing-customer'>Existing Customer!</span> : null;
	var c = this.state.selectedCustomer;
	var customerBox = c ? 
		(<div> <CustomerBox className='customer-box-selected col-xs-12 col-sm-6 col-md-4 customer-box' key={c._id} data={c} onSelect={this.changeSelection}/> 
			<div className='btn btn-default' onClick={this.changeSelection}>Change</div>
		</div>): null;
	 
	var custdata = this.state.custdata;
	var matchedCustomers = null;
	if (custdata && custdata.length) {
		matchedCustomers = <CustomerBoxList data={custdata} onSelect={this.customerSelected}/>; 
	}
	var newCustomer = this.state.newCustomer; 
	// show extras if no customer is selected and
	// name has been entered and either 
	//					search has no result or
	//					email has been entered or
	//					phone has been entered
	var newCustomerExtraControls = 
					  !c && 
					  (newCustomer.name && 
					  	( newCustomer.phone || 
						  newCustomer.email || 
						  !matchedCustomers
						)
					  )
					  ?
			(<div>
			<div className="row margin-top">
				<div className="col-sm-12 col-xs-12">
					<textarea rows="4" className="form-control" placeholder="Address"/>
				</div>
			</div>
			<em className="margin-top">* New customer will be created.</em>
			</div>
			)
			:
			null;
	var newCustomerControls = !c ?
			(<div className="row">
				<form>
					<div className="input-field col s12 m4">
						<i className="material-icons prefix">account_circle</i>
						<input type="text" id="lookup-name" onChange={this.nameChanged} value={this.state.newCustomer.name}  />
						<label htmlFor="lookup-name">Name (first last)</label>
					</div>
					<div className="input-field col s12 m4">
						<i className="material-icons prefix">phone</i>
						<input type="text" id="customer-phone" type="text" onChange={this.phoneChanged} value={this.state.newCustomer.phone}  className="form-control"  />
						<label htmlFor="customer-phone">Phone</label>
					</div>
					<div className="input-field col s12 m4">
						<i className="material-icons prefix">email</i>
						<input type="text" id="customer-email" type="text" onChange={this.emailChanged} value={this.state.newCustomer.email}  className="form-control"  />
						<label htmlFor="customer-email">Email</label>
					</div>
				</form>
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
  newCustomerChanged: function(c){
	  this.search(c);
	  this.raiseChange(c);
  },
  raiseChange: function(c){
	  if (this.props.onChange){
		  this.props.onChange(c);
	  }
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
	  this.newCustomerChanged(newCustomer);
	  
	  
  },
  phoneChanged: function(e){
	  var phone = e.target.value;
	  var newCustomer = this.state.newCustomer;
	  newCustomer.phone = phone;
	  this.setState({newCustomer: newCustomer});
	  this.newCustomerChanged(newCustomer);
  },
  emailChanged: function(e){
	  var email = e.target.value;
	  var newCustomer = this.state.newCustomer;
	  newCustomer.email = email;
	  this.setState({newCustomer: newCustomer});
	  this.newCustomerChanged(newCustomer);
  },
  search: function(c){
	  if (c.name || c.phone || c.email){
		$.get('/api/customer/search?name=' + c.name + '&phone=' + c.phone + '&email=' + c.email, function(result){
			this.setState({
				custdata: result.customers
			});
		}.bind(this));
	  }	
  },
  customerSelected: function(customer){
	var custdataTemp = this.state.custdata;
	this.setState({
		selectedCustomer: customer,
		custdata: null, // customer get picked!, no need to keep the list of matched records
		custdataTemp: custdataTemp // save for change selection
	});
	this.raiseChange(customer);
  },
  changeSelection: function(){
  	this.setState({
		  selectedCustomer: null,
		  custdata: this.state.custdataTemp
	  });
  }
});

module.exports = CustomerLookup