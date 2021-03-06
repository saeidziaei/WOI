/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore');
const SIGIN_URL = '/signin'; //'/keystone/signin'

/**
	Initialises the standard view locals
	
	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;
	
	locals.navLinks = [
		{ label: 'Home',		key: 'home',		href: '/' },
		
		/*
		{ label: 'Blog',		key: 'blog',		href: '/blog' },
		{ label: 'Gallery',		key: 'gallery',		href: '/gallery' },
		{ label: 'Contact',		key: 'contact',		href: '/contact' }
		*/
	];
	if (req.user && req.user.isManager){
		locals.navLinks.push({ label: 'Operators',	key: 'operators',	href: '/operators' });
	}
	locals.user = req.user;
	
	next();
	
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect(SIGIN_URL);
	} else {
		next();
	}
	
};

exports.requireStaff = function(req, res, next) {
	var user = req.user;
	if (!user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect(SIGIN_URL);
	} else {
		if (user.isManager || user.isOperator){
			next();
		} else {
			req.flash('error', 'You do not have permission.');
			res.redirect('/');
		}
	}
	
};


exports.requireManager = function(req, res, next) {
	var user = req.user;
	if (!user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		if (user.isManager){
			next();
		} else {
			req.flash('error', 'You do not have permission.');
			res.redirect('/');
		}
	}
	
};
