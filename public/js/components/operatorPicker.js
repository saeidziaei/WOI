var React = require('react');
var Operator = require('./operator');
var _ = require('underscore');

var OperatorPicker = React.createClass({
	render: function() {
	  var MAX_COUNT = 10;
	  var items = this.state.items;
	  if (!items){
		  return <div>No operator found</div>;
	  }
	  var searchBox = this.props.data && this.props.data.length > MAX_COUNT ?
			<div className='input-field'>
				<i className='material-icons prefix'>search</i>
				<input id='op-search' onChange={this.search}/>
			</div> : null;	  
	  
	  var ops = items.map(function(item){
		  return <Operator data={item} onClick={this.handleClick.bind(this, item)} key={item._id} />
	  }.bind(this));
	 
	  return (
	  <div className='operator-picker card-panel'>
	  	{searchBox}
		<div className='row'>
			{ops}
		</div>
	  </div>);
  	}	
	,handleClick: function(item){
		if (this.props.onSelect)
			this.props.onSelect(item);
  	},
	getInitialState: function(){
		return{
			items: this.props.data	
		};
	},
	search: function(e){
		var token = e.target.value.toLowerCase();
		var filtered = _.filter(this.props.data, function(item){
				return (item.name.first && item.name.first.toLowerCase().includes(token))
					|| (item.name.last && item.name.last.toLowerCase().includes(token))
		});
		this.setState({
			items: filtered
		})
	}
});


module.exports = OperatorPicker 