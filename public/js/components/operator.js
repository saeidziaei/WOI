var React = require('react');


var Operator = React.createClass({
	render: function() {
		var item = this.props.data;
	 
	 	return <div className='chip hoverable clickable margin-top margin-right' onClick={this.props.onClick} >
		      <img src='/images/profiles/default-op.png'/>
			  {item.name.first} {item.name.last}
		  </div>;
  	}	
});


module.exports = Operator 