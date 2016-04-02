var React = require('react');
var WoList = require('./wolist.js');


var WoLookup = React.createClass({
  render: function() {
	  var matchedItems = this.renderMatchdItems();
	  return <div className='wo-lookup'>
	  		<div className='row'>
				<div className="input-field col s6">
					<input id="search_token" type="text" className="validate" value={this.state.search_token} onChange={this.searchTokenChanged}/>
					<label htmlFor="search_token">Search</label>
				</div>
			</div>
			{matchedItems}
	  </div>
  },
  renderMatchdItems: function() {
	  return this.state.searchResult ? 
	  	<WoList data={this.state.searchResult} onSelect={this.woSelect}/> 
		  :
		  <div>-</div>
  },
  woSelect: function(wo) {
	  alert('redierct');
	  console.log(wo);
  },
  searchTokenChanged: function(e){
	  var token = e.target.value;
	  if (token && token.length > 2){
		$.get('/api/workorder/search?token=' + token, function(result){
			this.setState({	searchResult: result.workorders });
		}.bind(this));
	  }	
	  this.setState({search_token: token});
  },
  
  getInitialState: function(){
	  console.log(this.props.data);
	  return {
		  searchResult: this.props.data,
		  search_token: ''
	  };
  }
  
});



module.exports = WoLookup
