import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Projects } from '../data/projects.js';
import { Products } from '../data/projects.js';
import { Session } from 'meteor/session';
import { ProjectFactory } from '../data/projectFactory.js';
import { projectABI } from '../data/projectABI.js';

import './body.html';
import './admin.js';

Router.route('/', function () {
  this.layout('applicationLayout');
});
Router.route('/createProject', function () {
  this.layout('createProjectLayout');
});
Router.route('/projectInfo', function () {
  this.layout('projectInfoLayout');
});
Router.route('/sell', function () {
  this.layout('sellLayout');
});
Router.route('/buy', function () {
  this.layout('buyLayout');
});

Router.route('/admin', function () {
  this.layout('admin');
});

Template.createProjectForm.events({
	'submit form': function(event) {
		event.preventDefault();
		var title = event.target.projectTitle.value;
		var description = event.target.projectDescription.value;
		var minimumContribution = event.target.minimumContribution.value;
		ProjectFactory.createProject.call(minimumContribution, function(err, res) {
			Projects.insert({
				address: res,
				title,
				minAmount: minimumContribution,
				description,
			});
		});

		ProjectFactory.createProject(minimumContribution, function(err, res) {
			if(err){
				console.log(err);
			} 
		});
	}
});

Template.showCase.helpers({
	projects: function() {
		return Projects.find();
	}
});

Template.projectCard.events({
	'click #viewProject': function() {
		Session.setPersistent('projectId', this._id);
		Session.setPersistent('Address', this.address);
	}
});

Template.projectInfo.helpers({
	projectDetails: function() {
		ProjectContract = web3.eth.contract(projectABI).at(Session.get('Address'));
		ProjectContract.getSummary(function(err, res) {
			$('#balance').text(res[1]);
			$('#noOfContributer').text(res[3]);
		});
		return Projects.find({ _id: Session.get('projectId') });
	}
});

Template.projectInfo.events({
	'submit form': function(event) {
		event.preventDefault();
		Projects.find({ _id: Session.get('projectId') });
		ProjectContract = web3.eth.contract(projectABI).at(this.address);
		var minimumContribution = event.target.minimumContribution.value;
		ProjectContract.contribute({ value: minimumContribution }, function(err, res){
			if(err) {
				console.log(err);
			}
		});
	}
});

Template.createProductListing.events({
	'submit form': function(event) {
		event.preventDefault();
		var name = event.target.productName.value;
		var price = event.target.productPrice.value;
		var description = event.target.productDescription.value;
		Projects.insert({
			name,
			pprice,
			description
		});
	}
});