var React = require('react');
var CustomerBox = require('./customerBox');
var CommentBox = require('./commentBox');
var _ = require('underscore');

var WorkorderBox = React.createClass({
	render: function(){
		var workorder = this.props.data;
		
		var customerBox = this.state.showCustomer ?	<CustomerBox onSelect={this.toggleCustomer} 
						data={workorder.customer}/> : null;
		
		var act = workorder.activities;
		act = _.sortBy(act, "createdAt").reverse();
		var commentBox = this.state.showComments ? <CommentBox onAdd={this.onAddComment} 
							comments={act} 
							/> : null;
		var list = workorder.items.map(function(item, i){
			return <li key={i}>{item}</li>
		}.bind(this));
		var c = this.state.isMaximized ? "col-md-12" : "col-xs-12 col-sm-6 col-md-4";
		return (
			<div className={c + ' workorder-box'} onClick={this.boxClicked}>
				<div className='thumbnail' >
					<div className='caption'>
						<h3><span className='glyphicon glyphicon-list-alt'/> {workorder.description} 
						<div onClick={this.toggleSize} className="btn btn-primary pull-right">O</div>
						</h3>
						<p>{workorder.status}</p>
						<p>{workorder.createdBy.name.first} {workorder.createdBy.name.last} </p>
						<p>{new Date(workorder.createdAt).toDateString()}</p>
						<ul>{list}</ul>
						<p className="clickable" onClick={this.toggleCustomer}>
							<span className='glyphicon glyphicon-user'/> {workorder.customer.name.first} {workorder.customer.name.last}
						</p>
						{customerBox}
						<div onClick={this.toggleComments} className="btn btn-default ">{this.state.showComments ? "Hide Comments" : "Comments"}</div>	
						<div onClick={this.toggleComments} className="btn btn-default ">Assign to me</div>	
						<div onClick={this.toggleComments} className="btn btn-default ">Close</div>	
						{commentBox}					
 					</div>
				</div> 
			</div>
		);
	},
	toggleSize: function(){
		this.setState({
			isMaximized: !this.state.isMaximized
		});
	},
	onAddComment: function(comment, cb){
		var self = this;
		$.post('/api/workorderactivity/create', 
			{
				workorder: this.props.data._id,
				comment: comment
			}, function(ret){
				cb(ret);
			});
	},
	boxClicked: function(e){
	},
	toggleCustomer: function(){
		this.setState({
			showCustomer: !this.state.showCustomer
		});
	},
	toggleComments: function(){
		this.setState({
			showComments: !this.state.showComments
		});
	},
	getInitialState: function(){
		return({
			showCustomer: false,
			showComments: false,
			isMaximized: false
		});
	}
});

module.exports = WorkorderBox 