var React = require('react');
var CustomerBox = require('./customerBox');
var CustomerLookup = require('./customerLookup');
var OperatorPicker = require('./operatorPicker');
var Operator = require('./operator');
var swal = require('sweetalert');
var numeral = require('numeral');

var _ = require("underscore");
var async = require('async');
var $ = require('jquery');
var woStatus = require('./woStatus');

var WO = React.createClass({


	render: function(){

		var workorder = this.state.workorder;

		var jobHeader = this.renderJobHeader(workorder);
		var customer = this.renderCustomer(workorder);
		var service = this.renderService(workorder);
		var actions = this.renderActions(workorder);
		var activities = this.renderActivities(workorder);

		return <div>
			{jobHeader}
			{customer}
			{service}
			{actions}
			{activities}
		</div>
	},
	renderPriceInfo: function(w){
		var price = w.status == woStatus.DRAFT ?
		(<div >
			<div className="input-field left">
    	      <i className="material-icons prefix">attach_moneyu</i>
        	  <input id="price-edit" type="text" className=" price" onChange={this.priceChange} value={w.price}/>
          	  <label htmlFor="price-edit" className="active">Price</label>
	       </div>
		</div>)
		: this.state.edit['PRICE'] ?  
		(<div >
			<div className="input-field left">
    	      <i className="material-icons prefix">attach_moneyu</i>
        	  <input id="price-edit" type="text" className=" price" onChange={this.editPriceChange} value={this.state.editPrice}/>
          	  <label htmlFor="price-edit" className="active">Price</label>
	       </div>
	       <div className='btn-floating ' onClick={this.editDone.bind(this, 'PRICE')} title='Save'><i className='material-icons white green-text'>done</i></div>
	       <div className='btn-floating ' onClick={this.editCancel} title='Cancel Edit'><i className='material-icons white red-text'>clear</i></div>
		   <div className='clearfix'/>
		</div>)
		:
		(<div >
			<div className="input-field left">
    	      <i className="material-icons prefix">attach_moneyu</i>
          	  <label htmlFor="price" className="active">Price</label>
        	  <input disabled id="price" type="text" className=" price" value={w.price ? numeral(w.price).format('0,0.00') : w.price}/>
	       </div>

			   <div className='btn-flat blue-text small margin-top' onClick={this.makeEditable.bind(this, 'PRICE')}>Change</div>
			   <div className='clearfix'/>
		 </div>)
		;

		return price;
	},
	editPriceChange: function(e){
		this.setState({	editPrice: e.target.value });
	},
	editDescriptionChange: function(e){
		this.setState({	editDescription: e.target.value });
	},
	priceChange: function(e){
		var w = this.state.workorder;
		w.price = e.target.value;
		this.setState({
			workorder: w
		});
	},
	renderService: function(w){

		var description = w.status == woStatus.DRAFT ?
			(<div className='row'>
				<div className='input-field left col s8'>
					<i className='material-icons prefix'>mode_edit</i>
					<textarea  id='description' onChange={this.handleDescriptionChange} className='materialize-textarea service-description' value={w.description} />
					<label htmlFor='description' className={w.description ? 'active' : ''}>Description of service</label>
				</div>
			</div>)
			: this.state.edit['DESCRIPTION'] ?   
			(<div className='row'>
				<div className='input-field left col s8'>
					<i className='material-icons prefix'>mode_edit</i>
					<textarea  id='description' onChange={this.editDescriptionChange} className='materialize-textarea service-description' value={this.state.editDescription} />
					<label htmlFor='description' className={w.description ? 'active' : ''}>Description of service</label>
				</div>
				<div className='btn-floating ' onClick={this.editDone.bind(this, 'DESCRIPTION')} title='Save'><i className='material-icons white green-text'>done</i></div>
	       		<div className='btn-floating ' onClick={this.editCancel} title='Cancel Edit'><i className='material-icons white red-text'>clear</i></div>
				<div className='clearfix'/>
			</div>)
			
			
			: (<div>
				<h5>Description</h5>
				<div className='grey-text  service-description left'>{w.description}</div>
				<div className='btn-flat blue-text small margin-top' onClick={this.makeEditable.bind(this, 'DESCRIPTION')}>Change</div>
				<div className='clearfix'/>
			</div>)
				;

		var serviceItems = null;
		if (w.status == woStatus.DRAFT)
		{ // display checkboxes
			var items = this.props.standardItems ? this.props.standardItems.map(function(item, item_i){
				var id = 'item' + item_i;
				var checked = w.items && _.contains(w.items, item)  ? 'checked' : '';

				return <div className='col s12 m6' key={id}>
					<input type='checkbox' id={id} checked={checked} onChange={this.handleServiceItemChange.bind(this, item)}/>
					<label htmlFor={id}>{item}</label>
				</div>
			}.bind(this)) : null;
			
			serviceItems =  <div>
								<div className='row'>
									{items}
								</div>
							</div>;
		}
		else if (this.state.edit['ITEMS']){
			var items = this.props.standardItems ? this.props.standardItems.map(function(item, item_i){
				var id = 'item' + item_i;
				var checked = this.state.editItems && _.contains(this.state.editItems, item)  ? 'checked' : '';

				return <div className='col s12 m6' key={id}>
					<input type='checkbox' id={id} checked={checked} onChange={this.editItemChange.bind(this, item)}/>
					<label htmlFor={id}>{item}</label>
				</div>
			}.bind(this)) : null;
			var buttons = <div>
	    			<div className='btn-floating ' onClick={this.editDone.bind(this, 'ITEMS')} title='Save'><i className='material-icons white green-text'>done</i></div>
            		<div className='btn-floating ' onClick={this.editCancel} title='Cancel Edit'><i className='material-icons white red-text'>clear</i></div> </div>
				 

			serviceItems =  <div>
								<div className='row margin-top'>
									{items}
								</div>
								<div className='row'>
									{buttons}
								</div>
							</div>;
		}
		 else {
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
	
	locationChange: function(e){
		var w = this.state.workorder;
		w.location = e.target.checked ? 'On Site' : 'In Store';
		this.setState({workorder: w});
		this.editDone('LOCATION');
	},
	editCancel: function(){
		this.setState({edit:[]});
	},
	editDone: function(part){
		var w = this.state.workorder;
		var params = {field: part, _id: w._id, };

		
		switch (part){
			case 'DESCRIPTION':
				params.description = w.description = this.state.editDescription; 
				break;

			case 'ITEMS':
				params.items = w.items = this.state.editItems; 
				break;

			case 'PRICE':
				params.price = w.price = this.state.editPrice;
				break;

			case 'ASSIGNEE':
				params.assignee = w.assignee._id;
				break;

			case 'LOCATION':
				params.location = w.location;
				break;
		}
	
		// update state
		this.setState({edit: [], workorder: w});
		// update database
		$.post('/api/workorder/updateField', params, this.serverUpdate).error(this.handleError);
	},
	makeEditable: function(part){
		var edit = [];
		edit[part] = true;
		var editPrice, editDescription, editItems;
			
		switch (part) {
			case 'PRICE':
				editPrice = this.state.workorder.price;
				break;
		
			case 'DESCRIPTION':
				editDescription = this.state.workorder.description;
				break;

			case 'ITEMS':
				editItems = this.state.workorder.items;
				break;
		}
		this.setState({
			edit: edit,
			editPrice: editPrice,
			editDescription: editDescription,
			editItems: editItems
		});
	},
	editItemChange: function(item){
		var editItems = this.state.editItems;
		if (_.contains(editItems, item)){
			editItems = _.without(editItems, item);
		} else {
			editItems.push(item);
		}
		this.setState({
			editItems: editItems
		});
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
	handleError: function(err){
		console.log(err, "err.responseJSON.error is going to be used");
		swal("Whoops! " + err.responseJSON.error, err.responseJSON.detail, "error");
	},
	showError: function(msg){
		swal(msg, "error", "error");
	},
	create: function(){
		try{
			var w = this.state.workorder;

			if (this.state.createNewCustomer){
				var newCustomer = this.state.newCustomer;
				if (!newCustomer){
					this.showError("Customer is missing.");
					return;
				}
				if (!newCustomer.name){
					this.showError("Customer name is required.");
					return;
				}
				if (typeof newCustomer.name != "object"){
					newCustomer.name = this.getNameObject(newCustomer.name);
				}
			} else {
				if (!w.customer){
					this.showError("Customer is missing.");
					return;
				}
			}
			if (!w.description && !w.items.length){
				this.showError("What work needs to be done?");
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
						swal("Job Number " + result.workorder.jobNumber, "New workorder saved.", "success");
						console.log("/workorder/save", result);
						self.setState({workorder: result.workorder});
					});
				}
			]);
		}
		catch (e){
			console.log(e);
			this.showError("Ooops! someting is not working.");
		}
	},
	assignTo: function(){
		if (this.state.operators){
			this.setState({	showOperatorPicker: !this.state.showOperatorPicker });
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
		this.editDone("ASSIGNEE")
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
	serverUpdate: function(result){
		// console.log("back from server", result);
		// In most cases we shouldn't need to refresh the state as it is already in sync
		swal({   title: "Success!",   text: "Job updated.", type: "success",  timer: 1000,   showConfirmButton: false, animation: "slide-from-top" });
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
	renderActions: function(w){
		var btnCreate = !w.jobNumber ? <div className='btn' onClick={this.create}>Create</div> : null;
		var btnStart  = w.status == woStatus.QUOTE || w.status == woStatus.WAIT_FOR_PART || w.status == woStatus.WAIT_FOR_CUSTOMER ?
				<div>
					<div className='btn' onClick={this.startProgress}>Start Progress</div>
					<em>* Customer has accepted the quote</em>
				</div> : null;
		var btnReject  = w.status == woStatus.QUOTE ?  <div className='btn red lighten-1' onClick={this.reject}>Reject</div> : null;
		var btnWaitForPart = w.status == woStatus.IN_PROGRESS ? <div className='btn grey lighten-3 blue-text' onClick={this.showActionDetails.bind(this, 'WAIT FOR PART')}>Wait For Part</div> : null;
		var btnWaitForCustomer = w.status == woStatus.IN_PROGRESS ? <div className='btn grey lighten-3 blue-text'  onClick={this.showActionDetails.bind(this, 'WAIT FOR CUSTOMER')}>Wait For Customer</div> : null;
		var assignee = w.assignee ? <div>
										 <span>Assigned to </span>
										 <Operator data={w.assignee}  />
										 <br/>
										 <div className='btn-flat blue-text small' onClick={this.assignTo}>Change</div>
									</div> :
									w.status != woStatus.DRAFT ?
									<div className='btn' onClick={this.assignTo}>Assign To ...</div>
									: null;
		var operatorPicker = this.state.showOperatorPicker ? <OperatorPicker data={this.state.operators} onSelect={this.assigneeSelected} /> : null;
		var btnComplete = w.status == woStatus.IN_PROGRESS ? <div className='btn green lighten-1'  onClick={this.complete}>Complete</div> : null;
		var btnReopen = w.status == woStatus.COMPLETED ? <div className='btn'             onClick={this.showActionDetails.bind(this, 'REOPEN')}>Re Open</div> : null;
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
				{assignee}{operatorPicker}
				{btnCreate}
				{btnStart}
				{btnReject}
				{btnWaitForPart}
				{btnWaitForCustomer}
				{btnReopen}
				{btnComplete}
				{actionDetails}
			</div>
		);
	},
	renderJobHeader: function(w){
		var priceInfo = this.renderPriceInfo(w);
		var statusClass = w.status == woStatus.IN_PROGRESS ? 'green white-text' :
						 w.status == woStatus.REJECTED ? 'red white-text' : '';
		return <div className='row '>
			<div className='col s12 m3 big-font'>
				{w.jobNumber ? 'Job# ' + w.jobNumber : 'New'} <div className={statusClass + ' chip'}>{w.status}</div>
			</div>

			<div className='col s12 m3 margin-top grey lighten-5'>
				<div className="switch margin">
					<label>
					In Store
					<input type="checkbox" onChange={this.locationChange} checked={w.location == 'On Site'} />
					<span className="lever"></span>
					On Site
					</label>
  				</div>
  			</div>

			<div className='col s12 m6'>
				{priceInfo}
			</div>
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
	getInitialState : function(){
		return {
			initialValues: {
				price: this.props.data.price,
				description: this.props.data.description,
				items: this.props.data.items
			},
			workorder: this.props.data,
			newCustomer: null,
			createNewCustomer: false,
			edit: [],
			editDescription: false,
			editItems: false,
			editPrice: null,
			showOperatorPicker: false
		}
	},
});

module.exports = WO
