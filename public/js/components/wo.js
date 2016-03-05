var React = require('react');
var CustomerBox = require('./customerBox');
var CustomerLookup = require('./customerLookup');
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
		
		return <div>
		<h3>{workorder.jobNumber ? 'Job# ' + workorder.jobNumber : 'Create New'} <div className='chip'>{workorder.state}</div></h3>
			{customer}
			{service}
			{actions}
			{activities}
			<div className='btn' onClick={this.save}>Save</div>
		</div>
	},
	renderCustomer: function(w){
		var c = w.customer;
		var currentCustomer = w.editable ? null /*coz we will show the lookup if it is editable*/  :
			c ? (<div> 
			<CustomerBox className='customer-box-selected col s12 m4' key={c._id} data={c} /> 
			<div className='btn-flat orange-text' onClick={this.changeSelection}>Change</div>
		</div>): null;

		var lookup = w.editable ? <CustomerLookup selectedCustomer={c} onChange={this.customerLookupChange}/> : null;	
			
		return (<div className='customer-section'>
			<h3 className='header'>Customer</h3>
			{currentCustomer}
			{lookup}
		</div>);
	},
	customerLookupChange: function(c){
		var w = this.state.workorder;
		w.customer = c;
		this.setState({
			workorder: w
		});
	},
	renderService: function(w){
		var description = w.editable ? (
			<div className='input-field'>
				<i className='material-icons prefix'>mode_edit</i>
				<textarea id='description' onChange={this.handleDescriptionChange} className='materialize-textarea' value={w.description} />
				<label htmlFor='description' className={w.description ? 'active' : ''}>Description of service</label>
			</div>
		) : <h2>{w.description}</h2>;

		var serviceItems = this.state.standardItems ? this.state.standardItems.map(function(item, item_i){
			var id = 'item' + item_i;
			var checked = w.items && _.contains(w.items, item)  ? 'checked' : '';

			return <div className='col s12 m6' key={id}>
				<input type='checkbox' id={id} checked={checked} onChange={this.handleServiceItemChange.bind(this, item)}/>
				<label htmlFor={id}>{item}</label>
			</div>
		}.bind(this)) : null;
		
		return (<div className='service-section'>
			<h3 className='header'>Service</h3>
			{description}
			<div className='row'>
				{serviceItems}
			</div>
		</div>)
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
			<h3 className='header'>Activities</h3>
			<div className='row'>
				Coming Soon !!
			</div>
		</div>)
	},
	showError(msg){
		alert(msg);	
	},
	save: function(){
		try{
			var w = this.state.workorder;
			// console.log(w);
			
			if (!w.customer){
				showError("Customer is missing.");
				return;
			}
			if (!w.description && !w.items.length){
				showError("What work needs to be done?");
				return;
			}
			var dbCustomer = w.customer;
			if (typeof dbCustomer.name != "object"){
				dbCustomer.name = getNameObject(customer.name);
			}
			var self = this;
			async.series([
				function(cb){
					if (!dbCustomer._id){
						self.saveCustomer(dbCustomer, function(saved){
							console.log("customer saved", dbCustomer, saved);
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
    var btnAssignTo = w.state != woState.DRAFT ? <div className='btn' onClick={this.assignTo}>Assign To</div> : null;
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
            {btnCreate}
            {btnStart}
            {btnReject}
            {btnWaitForPart}
            {btnWaitForCustomer}
            {btnAssignTo}
            {btnReopen}
            {btnComplete}
            {actionDetails}
        </div>
    );
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
			workorder: this.props.data || {id : 0, state: woState.IN_PROGRESS, editable: true, items:['c'], description:'Please do a lot of work', customer:{_id:1, name:{first:'Ali', last:'Akber'}, phone:'1234', email:'a@a.a'}},
			standardItems: this.props.standardItems || ['a', 'b', 'c', 'd']
		}
	},
});

module.exports = WO 
