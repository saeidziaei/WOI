var React = require('react');
var CustomerBox = require('./customerBox');
var CustomerLookup = require('./customerLookup');
var OperatorPicker = require('./operatorPicker');
var Operator = require('./operator');
var swal = require('sweetalert');
var numeral = require('numeral');

var dateFormat = require('dateformat');
var _ = require("underscore");
var async = require('async');
var $ = require('jquery');
var woStatus = require('./woStatus');
var Loader = require('react-loader');

var WO = React.createClass({


	render: function(){

		var workorder = this.state.workorder;

		var jobHeader = this.renderJobHeader(workorder);
		var customer = this.renderCustomer(workorder);
		var service = this.renderService(workorder);
		var actions = this.renderActions(workorder);
		var activities = this.renderActivities(workorder);
		var commentSection = this.renderCommentSection(workorder);
		return <div>
			{jobHeader}
			{customer}
			{service}
			{actions}
			{commentSection}
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
    	      <span>Price:</span> <span>{w.price ? '$ ' + numeral(w.price).format('0,0.00') : w.price}</span>
	       </div>

			   {this.props.isViewerOnly ? null : <div className='btn-flat blue-text small margin-top' onClick={this.makeEditable.bind(this, 'PRICE')}>Change</div>}
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
				
				<div className='  service-description left'>{w.description}</div>
				{this.props.isViewerOnly ? null : <div className='btn-flat blue-text small margin-top' onClick={this.makeEditable.bind(this, 'DESCRIPTION')}>Change</div>}
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
					<li className="collection-header"><div className='sub-header'>Service Items</div></li>
					{items}
					{this.props.isViewerOnly ? null :
						 <li className='collection-item'><div className='btn-flat blue-text small' onClick={this.makeEditable.bind(this, 'ITEMS')}>Change</div></li>}
				</ul>

			</div>
		}


		return (<div className='service-section'>
				<div className='header'>Service Description</div>
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
	renderCommentSection: function(w){
		return w._id ? <div className='comment-section'>
				<div className='header'>Add Comment</div>
				<div className='row'>
					<div className='input-field left col s8'>
						<i className='material-icons prefix'>chat_bubble_outline</i>
						<textarea  id='comment' onChange={this.commentChange} className='materialize-textarea' value={this.state.comment} />
					</div>
					<div className='btn warm-blue' onClick={this.saveComment} title='Save'>OK</div>
					<div className='clearfix'/>
				</div>
			</div> :
			null;
	},
	commentChange: function (e){
		this.setState({comment: e.target.value});	
	},
	saveComment: function(){
		$.post('/api/workorder/addComment', 
				{
					_id: this.state.workorder._id,
					comment: this.state.comment
				}, 
			this.serverUpdate)
			.error(this.handleError);
		
		this.setState({comment: ""});	
	},
	renderActivities: function(w){
		var toggleBtn = w._id ? 
			<a className='clickable ' onClick={this.toggleActivities}>{this.state.showActivities ? "Hide Activities" :  "Show Activities"}</a> :
			null;
			
		if (this.state.showActivities){
			var items = <div>no activities yet</div>;
			var activities = this.state.activities; 
			if (activities) {
				var filter = this.state.activitiesFilter; 
				if (filter){
					activities = _.filter(activities, function(a){
						return a.activityType == filter;
					})
				}
				items = _.sortBy(activities, 'createdAt').reverse()
					.map(function(item, i){
						
						var extraInfo = item.activityType == 'modify' ? (<span>from <strong>{item.modify.fromValue}</strong> to <strong>{item.modify.toValue}</strong></span>) :
										item.activityType == 'transition' && item.transition ? (<span>from <strong>{item.transition.fromStatus}</strong> to <strong>{item.transition.toStatus}</strong> {item.note}</span>) : 
										item.activityType == 'assignment' && item.assignedTo ? (<span>assigned to <strong>{this.getName(item.assignedTo)}</strong></span>) : 
										null;
						var activityColor = item.activityType == 'comment' ? 'blue' :
											item.activityType == 'modify' ? 'red' :
											item.activityType == 'transition' ? 'yellow' :
											item.activityType == 'assignment' ? 'green' : "";
						var op = item.createdBy ? this.getName(item.createdBy) : "";  
						return <div className='card activity-card'  key={item._id}> 
							<div className={'filler-child lighten-2 ' +  activityColor}/> {dateFormat(item.createdAt, 'fullDate')} <div className='chip'>{op}</div>  {item.comment}  {extraInfo} </div>
				}.bind(this))
				
			}
			  
			return (<div className='activities-section'>
				<div className='header'>Activities</div>
				{this.state.activitiesLoading ?
					<Loader />
				:
				<div className='row'>
					{toggleBtn}
					<div className='btn blue margin' onClick={this.filterActivities.bind(this, 'comment')}>Comments</div>
					<div className='btn red margin' onClick={this.filterActivities.bind(this, 'modify')}>Field Changes</div>
					<div className='btn yellow black-text margin' onClick={this.filterActivities.bind(this, 'transition')}>Status Changes</div>
					<div className='btn green margin' onClick={this.filterActivities.bind(this, 'assignment')}>Assignee Changes</div>
					<a className='clickable margin' onClick={this.filterActivities.bind(this, '')}>Show All</a>
					{items}
				</div>
				}
			</div>)
		} else {
			return toggleBtn;
		}
	},
	getName: function(o){
		return o.name ? o.name.first + " " + o.name.last : "";
	},
	filterActivities: function(type){
		this.setState({activitiesFilter: type});	
	},
	toggleActivities: function(){
		if (!this.state.activities){
			this.setState({activitiesLoading: true});
			var self = this;
			$.get("/api/workorder/getActivities/" +  self.state.workorder._id ,function(result){
				self.setState({
					activities: result.activities,
					showActivities : !self.state.showActivities
				});
			})
			.error(this.handleError)
			.always(function(){
				self.setState({activitiesLoading: false});
			});
		} else {
			this.setState({showActivities : !this.state.showActivities});
		}	
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
						var jn = result.workorder.jobNumber;
						swal({
								title:"Job Number " + jn, 
								text: "New workorder saved.", 
								type:"success"
							}, function () {
								window.location.replace("/wo/jn/" + jn);
							});
						console.log("/workorder/save", result);
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
	showActionDetails: function(newStatus){
		swal({   
			title: newStatus,   
			text: "Add more details:",   
			type: "input",   
			showCancelButton: true,   
			closeOnConfirm: false,   
			animation: "slide-from-top",   
			inputPlaceholder: "Notes" }, 
			function(inputValue){   
				if (inputValue === false) return false;      
				if (inputValue === "") {     swal.showInputError("You need to write something!");     return false   }      
				this.changeStatusWithNotes(newStatus, inputValue); 
			}.bind(this)
		);
		
	},
	changeStatus: function(newStatus){
		this.changeStatusWithNotes(newStatus, null);	
	},
	changeStatusWithNotes: function(newStatus, note){
		$.post('/api/workorder/changeStatus', 
			{
				_id : this.state.workorder._id,
				status: newStatus,
				note: note
			}, 
			function(result) {
				var w = this.state.workorder;
				w.status = newStatus;
				this.setState({workorder: w});
				
				this.serverUpdate(result);
			}.bind(this))
		.error(this.handleError);
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
		var btnDevStartOver  = <div className='btn orange lighten-1' onClick={this.changeStatus.bind(this, woStatus.QUOTE)}>Start Over From Quote</div>;
		
		
		var btnCreate = !w.jobNumber ? <div className='btn' onClick={this.create}>Create</div> : null;
		var btnStart  = w.status == woStatus.QUOTE || w.status == woStatus.WAIT_FOR_PART || w.status == woStatus.WAIT_FOR_CUSTOMER ?
					<div className='btn' onClick={this.changeStatus.bind(this, woStatus.IN_PROGRESS)}>Start Progress</div> : null;
		var btnReject  = w.status == woStatus.QUOTE ?  <div className='btn red lighten-1' onClick={this.changeStatus.bind(this, woStatus.REJECTED)}>Reject</div> : null;
		var btnWaitForPart = w.status == woStatus.IN_PROGRESS ? <div className='btn grey lighten-3 blue-text' onClick={this.showActionDetails.bind(this, 'WAIT FOR PART')}>Wait For Part</div> : null;
		var btnWaitForCustomer = w.status == woStatus.IN_PROGRESS ? <div className='btn grey lighten-3 blue-text'  onClick={this.showActionDetails.bind(this, 'WAIT FOR CUSTOMER')}>Wait For Customer</div> : null;
		var assignee = w.assignee ? <div>
										 <span>Assigned to </span>
										 <Operator data={w.assignee}  />
										 <br/>
										 {this.props.isViewerOnly ? null : <div className='btn-flat blue-text small' onClick={this.assignTo}>Change</div>}
									</div> :
									w.status != woStatus.DRAFT ?
									<div className='btn' onClick={this.assignTo}>Assign To ...</div>
									: null;
		var operatorPicker = this.state.showOperatorPicker ? <OperatorPicker data={this.state.operators} onSelect={this.assigneeSelected} /> : null;
		var btnComplete = w.status == woStatus.IN_PROGRESS ? <div className='btn green lighten-1'  onClick={this.changeStatus.bind(this, woStatus.COMPLETED)}>Complete</div> : null;
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
				{btnDevStartOver}
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
		var statusClass = 'status-' + w.status.toLowerCase().replace(/ /g,''); //remove all spaces 

		return <div className='row '>
			<div className='col s12 m3 big-font'>
				{w.jobNumber ? 'Job# ' + w.jobNumber : 'New'} <div className={'chip ' + statusClass}>{w.status}</div>
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
			<div className='header'>Customer</div>
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
			workorder: this.props.data,
			newCustomer: null,
			createNewCustomer: false,
			edit: [],
			editDescription: false,
			editItems: false,
			editPrice: null,
			showOperatorPicker: false,
			activities: null,
			showActivities: false,
			activitiesLoading: false,
			activitiesFilter: null,
			comment: ""
		}
	},
});

module.exports = WO
