var React = require('react');
var CustomerBox = require('./customerBox');
var CommentBox = require('./commentBox');
var Operator = require('./operator');
var _ = require('underscore');

var WoCompact = React.createClass({
	render: function(){
		
		var wo = this.props.data;
		var customer = wo.customer ? <CustomerBox data={wo.customer}  isCompact={this.state.isCustomerCompact} onSelect={this.toggleCustomerCompact} /> : null;
		var operator = wo.assignee ? <Operator data={wo.assignee}/> : null;
		var list = wo.items.map(function(item, i){
			return <li className='collection-item' key={i}>{item}</li>
		}.bind(this));
		
		return (
		<div className="wo-comapct">
        <div className="col s12 m6">
          <div className="card ">
            <div className="card-content">
              <span className="card-title">JOB# {wo.jobNumber} <span className='chip right'>{wo.status}</span></span>
              <p className='truncate'>{wo.description}</p>
			  <ul className='collection'>
			  {list}
			  </ul>
            </div>
            <div className="card-action">
              {customer}
			  {operator}
			  <a href={'/wo/jn/' + wo.jobNumber} className='right ' >Details</a>
            </div>
          </div>
        </div>
      </div>
            	
		);
		
		
	},
	toggleCustomerCompact: function(){
		this.setState({isCustomerCompact: !this.state.isCustomerCompact});	
	},
	getInitialState: function() {
		return {isCustomerCompact: true};
	},
});

module.exports = WoCompact 