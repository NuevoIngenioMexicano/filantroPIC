var keystone = require('keystone'),
	User = keystone.list('User');
var mail = require('../../mailgun.js');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;
	locals.section = 'session';

	view.on('init', function(next) {

		User.model.findOne().where('validateEmailKey', req.params.key).exec(function(err, user) {
			if (err) return next(err);

			if (!user) {
				req.flash('error', "Sorry, that key isn't valid.");
				return res.redirect('/forgot-password');
			}


			if (user) {
				console.log('user validado');

				user.hasEmail = true;
				user.save(function(err) {
					if (err) return next(err);
					req.flash('success', 'Tu email ha sido verificado');
					res.redirect('/login');
				});
			}
		});

	});

	view.render('session/signin');

}
