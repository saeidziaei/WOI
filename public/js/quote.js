var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

$(document).ready(function(){
	ReactDOM.render(
  <CustomerLookup />,
  $('#customer-lookup-container')[0]
);

})
// test git
var CustomerBoxList = React.createClass({
	render: function(){
		var list = this.props.data.map(function(item){
			return <div key={item._id}>{item.name.first} - {item.name.last}</div>
		});
		return (<div className="customer-box-list">
				{list} 
			</div>);
	}
});
var CustomerLookup = React.createClass({
  render: function() {
	var msg = this.state.existingCustomerSelected ? <span className='existing-customer'>Existing Customer!</span> : null;
	var matchedCustomersList = null;
	var custdata = this.state.custdata;
	if (custdata && custdata.length){
		matchedCustomersList = <CustomerBoxList data={custdata}/>;
	}
    return (
	<div>
		{msg}
		<div className="row">
			<div className="col-sm-6 col-xs-12">
				<input name="lookup-name" onChange={this.nameChanged} placeholder="Name" className="form-control"/>
			</div>
			<div className="col-sm-6 col-xs-12">
				<input name="lookup-phone" placeholder="Phone" className="form-control"/>
			</div>
		</div>
		{matchedCustomersList}
	</div>);
  },
  getInitialState: function(){
	return({
		existingCustomerSelected: false,
		custdata: null
	});  
  },
  nameChanged: function(e){
	  var token = e.target.value;
	  if (token){
		$.get('/cusdata/' + token, function(result){
			console.log("custdata", result);
			this.setState({
				custdata: result.customers
			});
		}.bind(this));
	  }
  }
});

