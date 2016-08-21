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

			Campaign.model.findOne({key: req.params.key})
      .exec(function(err, campaign) {

			if (err) {
				res.serverError(err);
			}

			if (!campaign) {
				res.notFound('Campaign no encontradas');
			}

			if (campaign) {
				console.log(campaign);
        locals.campaign = campaign;
				next();
			}

		});


	});

	view.render('campaign');

}
