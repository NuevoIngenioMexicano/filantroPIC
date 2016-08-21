const keystone = require('keystone');
const async = require('async');
const Campaign = keystone.list('Campaign');
const State = keystone.list('State');
const Sponsor = keystone.list('Sponsor');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'home';
	locals.title = 'Filantropic';
	locals.description = '';

	view.on('init', function(next) {


		async.auto({

			campaigns: function(callback) {
				Campaign.model.find()
				.exec(callback);
			},

			states: function(callback) {
				State.model.find()
					.exec(callback);
			},

		}, function(err, results) {

			if (err) {
				res.serverError(err);
			}

			if (!results) {
				res.notFound('Reservaciones no encontradas');
			}

			if (results) {
				console.log(results);
				locals.campaigns = results.campaigns;
				locals.states = results.states;

				next();
			}

		});


	});

	view.render('index');

}
