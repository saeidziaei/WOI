var React = require('react');


CommentBox = React.createClass({
	render: function(){
		var comments = this.state.comments;
		
		var existingComments = comments ? comments.map(function(c, i){
			return 	<li key={i}><strong>{c.createdBy.name.first}:</strong> {c.comment} </li>
		}) : null;
		return (<div>
			<textarea value={this.state.comment} onChange={this.commentChange} rows="3" placeholder="New comment" className="form-control">
			
			</textarea>
			<div onClick={this.addComment} className="btn btn-default">Add</div>
			<ul>
			{existingComments}
			</ul>	
		</div>);	
	}, 
	commentChange: function(e){
		this.setState({
			comment: e.target.value
		})	
	},
	addComment: function(){
		if (this.props.onAdd){
			var comment = this.state.comment;
			this.props.onAdd(comment, function(result){
				var comments = this.state.comments;
				comments.unshift(result.workorderactivity);
				this.setState({
					comments: comments,
					comment: ""
				});
			}.bind(this));
		}
	},
	getInitialState: function(){
		return({
			comment: "",
			comments: this.props.comments
		});
	}
});

module.exports = CommentBox 