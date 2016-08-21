const keystone = require('keystone');
const async = require('async');
const Campaign = keystone.list('Campaign');
const State = keystone.list('State');
const Sponsor = keystone.list('Sponsor');
const User = keystone.list('User');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'home';
	locals.title = 'Filantropic';
	locals.description = '';

	view.on('init', function(next) {

		if (!req.user) {
			res.redirect('/')
		}

		User.model.findOne({_id: req.user._id})
		.populate('campaigns')
		.exec(function(err, currentUser) {

			if (err) {
				res.serverError(err);
			}

			if (!currentUser) {
				res.notFound('currentUser no encontrado');
			}

			if (currentUser) {
				console.log(currentUser);
				locals.campaigns = currentUser.campaigns;
				next();
			}

		});

	});

	view.render('account');

}
