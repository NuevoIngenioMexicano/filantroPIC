var keystone = require('keystone'),
	async = require('async');
const User = keystone.list('User');

exports = module.exports = function(req, res) {

	// if (req.user) {
	// 	return res.redirect(req.cookies.target || '/dashboard');
	// }

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'session';
	locals.form = req.body;

	view.on('init', function(next) {

		if (req.user) {
			return res.redirect('/dashboard');
		}

		if (req.query['target']) {
			locals.path = req.query['target']
		}

		return next();

	});

	view.on('post', { action: 'signin' }, function(next) {
		console.log(req.body.target);
		if (req.body.target && req.body.target != 'undefined') {
			res.cookie('target', req.body.target);
		}

		console.log(req.body);

		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Por favor indica tu usuario y contraseña.');
			console.log('error', 'Por favor indica tu usuario y contraseña.');
			return next();
		}

		var onSuccess = function() {
			// if (req.body.target && !/join|signin/.test(req.body.target)) {
				console.log('[signin] - Set target as [' + req.body.target + '].');
			// 	res.redirect(req.body.target);
			// } else {

			User.model.findOneAndUpdate({
				_id: req.user._id
			}, {
				$set: {
					lastActiveOn: Date.now()
				}
			}, function(err, success){
				if (err) {
					console.log(err);
				}
			});

			res.redirect('/');
			// }
		}

		var onFail = function() {
			console.log('error', 'La combinación de ese correo electrónico y contraseña es invalida, por favor intenta de nuevo.');
			req.flash('error', 'La combinación de ese correo electrónico y contraseña es invalida, por favor intenta de nuevo.');
			return next();
		}

		keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);

	});

	view.render('session/signin');

}
