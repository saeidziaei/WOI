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
		
		return (
			<div className='workorder-box s12 m6 l4 col' onClick={this.boxClicked}>
				<div className='card ' >
					<div className='card-content ' >
						<div className='card-title'>
							<span className="truncate"><i className="material-icons">assignment</i> {workorder.description}</span> 
						</div>
	
						<p>{workorder.status}</p>
						<p>{workorder.createdBy.name.first} {workorder.createdBy.name.last} </p>
						<p>{new Date(workorder.createdAt).toDateString()}</p>
						<ul>{list}</ul>
						<p className="clickable hoverable" onClick={this.toggleCustomer}>
							<span className='glyphicon glyphicon-user'/> {this.customerName(workorder)}
						</p>
						{customerBox}
						<div className="card-action">
							<div className="row">
								<div className="col s2"><a onClick={this.toggleComments} title={this.state.showComments ? "Hide Comments" : "Comments"}  className="btn-floating  waves-effect waves-light  "><i className="material-icons">comment</i></a></div>
								<div className="col s2"><a onClick={this.toggleComments} title="Done"  className="btn-floating  waves-effect waves-light "><i className="material-icons">done</i></a></div>
								<div className="col s8"><a onClick={this.toggleComments} title="Assign to me"  className="btn-flat  waves-effect waves-light  ">Assign to me</a></div>
							</div>
							
						
						</div>
						{commentBox}					
 					</div>
				</div> 
			</div>
		);
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
			showComments: false
		});
	},
	customerName: function(w){
		var c = w.customer;
		if (!c){
			return "Missing Customer";
		}
		var fullName = c.name.first + " " + c.name.last;
	    console.log(c);
		if (c.company){
			return c.company + " (" + fullName + ")";
		} else {
			return fullName;
		}
	}
});

module.exports = WorkorderBox 