var React = require('react');
var CustomerBox = require('./customerBox');
var CustomerLookup = require('./customerLookup');
var OperatorPicker = require('./operatorPicker');
var Operator = require('./operator');
var _ = require("underscore");
var async = require('async');
var $ = require('jquery');
var woState = require('./woState');

var WO = React.createClass({
	render: function(){
		var workorder = this.state.workorder;
		var customer = this.renderCustomer(workorder);	
		var service = this.renderService(workorder);
		var actions = this.renderActions(workorder);
		var activities = this.renderActivities(workorder);
		var stateClass = workorder.state == woState.IN_PROGRESS ? 'green white-text' : 
						 workorder.state == woState.REJECTED ? 'red white-text' : '';
		return <div>
		<h3>{workorder.jobNumber ? 'Job# ' + workorder.jobNumber : 'New'} <div className={stateClass + ' chip'}>{workorder.state}</div></h3>
			{customer}
			{service}
			{actions}
			{activities}
		</div>
	},
	renderCustomer: function(w){
		var c = w.customer;
		var key = c ? c._id : -1;
		var lookup = <CustomerLookup key={key} selectedCustomer={c} onChange={this.customerLookupChange} onNewCustomer={this.newCustomerChange}/>;	
			
		return (<div className='customer-section'>
			<h4 className='header'>Customer</h4>
			{lookup}
		</div>);
	},
	customerLookupChange: function(c){
		var w = this.state.workorder;
		w.customer = c;
		this.setState({
			workorder: w,
			createNewCustomer: false
		});
	},
	newCustomerChange : function(c){
		this.setState({	newCustomer: c, createNewCustomer: c != null });
	},
	renderService: function(w){
		var description = w.state == woState.DRAFT || this.state.editDescription ?  (
			<div className='input-field'>
				<i className='material-icons prefix'>mode_edit</i>
				<textarea  id='description' onChange={this.handleDescriptionChange} onBlur={this.descriptionChanged} className='materialize-textarea service-description' value={w.description} />
				<label htmlFor='description' className={w.description ? 'active' : ''}>Description of service</label>
			</div>
		) : (<div> 
				<h5>Description</h5>
				<div className='grey-text  service-description'>{w.description}</div>
				<div className='btn-flat blue-text small' onClick={this.makeEditable.bind(this, 'DESCRIPTION')}>Change</div>
			</div>)			
				;

		var serviceItems = null;
		if (w.state == woState.DRAFT || this.state.editItems)
		{ // display checkboxes
			var items = this.state.standardItems ? this.state.standardItems.map(function(item, item_i){
				var id = 'item' + item_i;
				var checked = w.items && _.contains(w.items, item)  ? 'checked' : '';

				return <div className='col s12 m6' key={id}>
					<input type='checkbox' id={id} checked={checked} onChange={this.handleServiceItemChange.bind(this, item)}/>
					<label htmlFor={id}>{item}</label>
				</div>
			}.bind(this)) : null;
			var btnSave = w.state != woState.DRAFT ?
				 <div className='btn-floating ' onClick={this.itemsChanged} title='Save'><i className='material-icons white green-text'>done</i></div>
				 :null;
			
			serviceItems =  <div>
								<div className='row'>
									{items}
								</div>
								<div className='row'>
									{btnSave}
								</div>
							</div>;
		} else {
			items = w.items && w.items.length ? w.items.map(function(item, item_i){
				var id = 'item' + item_i;
				return <li key={id} className='collection-item'> {item} </li>
			}) : <li className='collection-item'><em>no standard items assigned</em></li>;
			
		
			
			serviceItems = <div>
				<ul className='collection with-header'>
					<li className="collection-header"><h5>Service Items</h5></li>			
					{items}
					<li className='collection-item'><div className='btn-flat blue-text small' onClick={this.makeEditable.bind(this, 'ITEMS')}>Change</div></li>
				</ul>
				
			</div>
		}
		
		
		return (<div className='service-section'>
				<h4 className='header'>Service</h4>
				{description}
				{serviceItems}
			</div>)
	},
	descriptionChanged: function(){
		this.updateDatabase('DESCRIPTION');
		this.setState({editDescription: false});
	},
	itemsChanged: function(){
		this.setState({editItems: false});
	},
	updateDatabase : function(part){
		if (this.state.workorder.state == woState.DRAFT)
			return;
		alert('Update database ' + part);
		switch (part){
			case 'DESCRIPTION':
				break;
				
			case 'ITEMS':
				break;
		}
	},
	makeEditable: function(part){
		switch (part){
			case 'DESCRIPTION':
				this.setState({editDescription: true});
				break;
				
			case 'ITEMS':
				this.setState({editItems: true});
				break;
		}
	},
	handleServiceItemChange: function(item){
		w = this.state.workorder;
		if (_.contains(w.items, item)){
			w.items = _.without(w.items, item);			
		} else {
			w.items.push(item);
		}	
		this.setState({
			workorder: w
		});
	},
	handleDescriptionChange: function(e){
		w = this.state.workorder;
		w.description = e.target.value;
		this.setState({
			workorder: w
		});
	},
	renderActivities: function(w){
		return (<div className='activities-section'>
			<h4 className='header'>Activities</h4>
			<div className='row'>
				Coming Soon !!
			</div>
		</div>)
	},
	showError(msg){
		alert(msg);	
	},
	create: function(){
		try{
			var w = this.state.workorder;
			
			if (this.state.createNewCustomer){
				var newCustomer = this.state.newCustomer; 
				if (!newCustomer){
					showError("Customer is missing.");
					return;
				}
				if (!newCustomer.name){
					showError("Customer name is required.");
					return;
				}
				if (typeof newCustomer.name != "object"){
					newCustomer.name = this.getNameObject(newCustomer.name);
				}
			}
			if (!w.description && !w.items.length){
				showError("What work needs to be done?");
				return;
			}
			var dbCustomer = w.customer;
			var self = this;
			async.series([
				function(cb){
					if (self.state.createNewCustomer){
						self.saveCustomer(newCustomer, function(saved){
							console.log("customer saved: ", dbCustomer, saved);
							dbCustomer._id = saved.user._id;
							cb();
						});
					} else {
						cb();
					}
				},
				function(){
					w.customer = dbCustomer._id;
					self.saveWorkOrder(w, function(result){
						alert("All done!");
						console.log("/workorder/save", result);
						self.setState({workorder: result.workorder});
					});
				}
			]);
		}
		catch (e){
			console.log(e);
			alert("Ooops! someting is not working.");
		}
	},
	renderActions: function(w){
		var btnCreate = !w.jobNumber ? <div className='btn' onClick={this.create}>Create</div> : null;
		var btnStart  = w.state == woState.QUOTE || w.state == woState.WAIT_FOR_PART || w.state == woState.WAIT_FOR_CUSTOMER ?
				<div>
					<div className='btn' onClick={this.startProgress}>Start Progress</div>
					<em>* Customer has accepted the quote</em>
				</div> : null;
		var btnReject  = w.state == woState.QUOTE ?  <div className='btn red lighten-1' onClick={this.reject}>Reject</div> : null;
		var btnWaitForPart = w.state == woState.IN_PROGRESS ? <div className='btn grey lighten-3 blue-text' onClick={this.showActionDetails.bind(this, 'WAIT FOR PART')}>Wait For Part</div> : null;
		var btnWaitForCustomer = w.state == woState.IN_PROGRESS ? <div className='btn grey lighten-3 blue-text'  onClick={this.showActionDetails.bind(this, 'WAIT FOR CUSTOMER')}>Wait For Customer</div> : null;
		var assignee = w.assignee ? <div>
										 <span>Assigned to </span>
										 <Operator data={w.assignee}  />
										 <br/>
										 <div className='btn-flat blue-text small' onClick={this.assignTo}>Change</div>
									</div> : 
									w.state != woState.DRAFT ? 
									<div className='btn' onClick={this.assignTo}>Assign To ...</div> 
									: null;
		var operatorPicker = this.state.showOperatorPicker ? <OperatorPicker data={this.state.operators} onSelect={this.assigneeSelected} /> : null;
		var btnComplete = w.state == woState.IN_PROGRESS ? <div className='btn green lighten-1'  onClick={this.complete}>Complete</div> : null;
		var btnReopen = w.state == woState.COMPLETED ? <div className='btn'             onClick={this.showActionDetails.bind(this, 'REOPEN')}>Re Open</div> : null;
		var actionDetails = this.state.showActionDetail ?
					(<div className='row'>
						<div className='input-field col s12'>
							<textarea id='action-note' className='materialize-textarea' onChange={this.actionNoteChanged}>{this.state.actionNote}</textarea>
							<label htmlFor='action-note'>Comment</label>
						</div>
						<div className='btn' onClick={this.submitAction}>OK</div>
					</div>) : null;
	
		
		return (
			<div className='section-actions'>
				<hr/>
				{assignee}
				{btnCreate}
				{btnStart}
				{btnReject}
				{btnWaitForPart}
				{btnWaitForCustomer}
				{operatorPicker}
				{btnReopen}
				{btnComplete}
				{actionDetails}
			</div>
		);
	},
	assignTo: function(){
		if (this.state.operators){
			this.setState({	showOperatorPicker: true });	
		} else {
			$.get("/api/operator/list-names", function(result){
				this.setState({
					showOperatorPicker: true,
					operators: result.operators
				});	
			}.bind(this));
		}		
	},
	assigneeSelected: function(operator){
		var w = this.state.workorder;
		w.assignee = operator;
		this.setState({	
			showOperatorPicker: false,
			workorder: w
		});	
	},
	actionNoteChanged: function(e){
		this.setState({
		actionNote: e.target.value
		});
	},
	showActionDetails: function(actionType){
		this.setState({
			showActionDetail: true,
			actionType: actionType
		});
	},
	submitAction: function(){
		var note = this.state.actionNote;
		switch (this.state.actionType)
		{
			case 'WAIT FOR PART':
				$.post('/workorder/waitForPart', {note: note}, serverUpdate);
				break; 
	
			case 'WAIT FOR CUSTOMER':
				$.post('/workorder/waitForCustomer', {note: note}, serverUpdate);
				break; 
	
			case 'REOPEN':
				$.post('/workorder/reopen', {note: note}, serverUpdate);
				break; 
		}
	
		this.setState({
			showActionDetail: false,
			actionType: null,
			actionNote: null
		});
	},
	reject: function(){
		$.post('/workorder/reject', serverUpdate);
	},
	complete: function(){
		$.post('/workorder/complete', serverUpdate);
	},
	startProgress: function(){
		$.post('/workorder/startProgress', serverUpdate);
	},
	serverUpdate: function(err, result){
		if (err) showError(err);
		this.setState({
		workorder: result.workorder
		});
	},
	saveCustomer: function(customer, cb){
		$.post("/api/customer/create", customer, function(result){
			console.log("/customer/save", result);
			cb(result);
		});
	}
	,
	saveWorkOrder:function(workOrder, cb){
		$.post("/api/workorder/create", workOrder, function(result){
			cb(result);
		});
	}
	,
	getNameObject:function (name){
		if (!name) return null;
		
		var first, last, delimiterIndex = name.indexOf("-");
		if (delimiterIndex != -1){
			first = name.substring(0, delimiterIndex - 1).trim();
			last = name.substring(delimiterIndex + 1).trim();
		} else {
			// 'Paul Steve Panakkal'.split(' ').slice(0, -1).join(' '); // returns "Paul Steve"
			// 'Paul Steve Panakkal'.split(' ').slice(-1).join(' '); // returns "Panakkal"
			first = name.split(' ').slice(0, -1).join(' ');
			last = name.split(' ').slice(-1).join(' ');
		}
		return {first: first, last: last};
	},
	getInitialState : function(){
		return {
			workorder: this.props.data || {id : 0, state: woState.DRAFT, items:['c'], description:'Please do a lot of work', customer:{_id:1, name:{first:'Ali', last:'Akber'}, phone:'1234', email:'a@a.a'}},
			standardItems: this.props.standardItems || ['a', 'b', 'c', 'd'],
			newCustomer: null,
			createNewCustomer: false,
			editDescription: false,
			editItems: false,
			showOperatorPicker: false
		}
	},
});

module.exports = WO 
