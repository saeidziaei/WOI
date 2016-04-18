// this is a copy paste from keystone signin
// the only reason I need to create this is 
// renderView function always renders 'signin' and at 
// the moment keystone hasn't implemented extensions yet
var keystone = require('keystone');
var session = keystone.session;

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
    var locals = res.locals;
	function renderView() {
		locals.csrf_token_key = keystone.security.csrf.TOKEN_KEY;
		locals.csrf_token_value = keystone.security.csrf.getToken(req, res);
		
		view.render('signin', {
			submitted: req.body,
			from: req.query.from,
			logo: keystone.get('signin logo')
		});
	}

	// If a form was submitted, process the login attempt
	if (req.method === 'POST') {

		if (!keystone.security.csrf.validate(req)) {
			req.flash('error', 'There was an error with your request, please try again.');
			return renderView();
		}

		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your email address and password.');
			return renderView();
		}

		var onSuccess = function (user) {

			if (req.query.from && req.query.from.match(/^(?!http|\/\/|javascript).+/)) {
				res.redirect(req.query.from);
			} else if ('string' === typeof keystone.get('signin redirect')) {
				res.redirect(keystone.get('signin redirect'));
			} else if ('function' === typeof keystone.get('signin redirect')) {
				keystone.get('signin redirect')(user, req, res);
			} else {
				res.redirect('/keystone');
			}

		};

		var onFail = function (err) {
			var message = (err && err.message) ? err.message : 'Sorry, that email and password combo are not valid.';
			req.flash('error', message );
			renderView();
		};

		session.signin(req.body, req, res, onSuccess, onFail);

	} else {
		renderView();
	}

};
