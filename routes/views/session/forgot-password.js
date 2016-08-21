var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;
		locals.section = 'session';
	view.on('post', { action: 'forgot-password' }, function(next) {

		if (!req.body.email) {
			req.flash('error', "Please enter an email address.");
			return next();
		}

		User.model.findOne().where('email', req.body.email).exec(function(err, user) {
			if (err) console.log(err);
			if (!user) {
				req.flash('error', "Sorry, we don't recognise that email address.");
				return next();
			}
			user.resetPassword(function(err) {
				// if (err) return next(err);
				if (err) {
					console.error('===== ERROR sending reset password email =====');
					console.error(err);
					req.flash('error', 'Error al enviar el link. Por favor <a href="mailto:hector@pagoteca.com" class="alert-link">contáctanos</a> para arreglar el error.');
					next();
				} else {
					req.flash('success', 'Te hemos enviado un link para recuperar tu contraseña');
					res.redirect('/login');
				}
			});
		});

	});

	view.render('session/forgot-password');

}
