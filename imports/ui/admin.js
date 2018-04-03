import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Projects } from '../data/projects.js';

import './admin.html';

Template.admin.helpers({
	projectsList: function() {
		console.log("ABC");
		return Projects.find();
	}
});