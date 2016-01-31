var React = require('react');
var CustomerBox = require('./customerBox');

var WorkorderBox = React.createClass({
	render: function(){
		var workorder = this.props.data;
		var customerBox = this.state.showCustomer ? <CustomerBox onSelect={this.toggleCustomer} data={workorder.customer}/> : null;
		var commentBox = this.state.showComments ? 
		<div>
			<textarea rows="3" placeholder="New comment" className="form-control" />
			<div onClick={this.addComment} className="btn btn-default">Add</div>	
		</div> : null;
		var list = workorder.items.map(function(item, i){
			return <li key={i}>{item}</li>
		}.bind(this));
		return (
			<div className='col-xs-12 col-sm-6 col-md-4 workorder-box' onClick={this.boxClicked}>
				<div className='thumbnail' >
					<div className='caption'>
						<h3><span className='glyphicon glyphicon-list-alt'/> {workorder.description} </h3>
						<p>{workorder.status}</p>
						<p>{workorder.createdBy.name.first} {workorder.createdBy.name.last} </p>
						<p>{new Date(workorder.createdAt).toDateString()}</p>
						<ul>{list}</ul>
						<p className="clickable" onClick={this.toggleCustomer}>
							<span className='glyphicon glyphicon-user'/> {workorder.customer.name.first} {workorder.customer.name.last}
						</p>
						{customerBox}
						<div onClick={this.toggleComments} className="btn btn-default ">{this.state.showComments ? "Hide" : "Comments"}</div>	
						<div onClick={this.toggleComments} className="btn btn-default ">Assign to me</div>	
						<div onClick={this.toggleComments} className="btn btn-default ">Close</div>	
						{commentBox}					
 					</div>
				</div> 
			</div>
		);
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
	}
});

module.exports = WorkorderBox 