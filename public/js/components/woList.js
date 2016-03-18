var React = require('react');
var WoCompact = require('./woCompact');

var WoList = React.createClass({
	render: function(){
		var list = this.props.data ? this.props.data.map(function(item){
			return <WoCompact key={item._id} data={item} onSelect={this.itemSelect}/>
		}.bind(this)) : null;
		return (<div className="workorder-box-list row margin-top">
				{list} 
			</div>);
	},
	itemSelect: function(wo){
		if (this.props.onSelect){
			this.props.onSelect(wo);
		}
	}
});

module.exports = WoList;
