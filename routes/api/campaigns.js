const keystone = require('keystone');
const	async = require('async');
const Campaign = keystone.list('Campaign');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res),
    locals = res.locals;

  locals.section = 'cards';
  locals.form = req.body;

  view.on('get', function(next) {

    var query = Campaign.model.find();

    if (req.query.cause) {
      query.where('cause', req.query.cause)
    }

    if (req.query.state) {
      query.where('state', req.query.states)
    }

    if (req.query.city) {
      query.where('city', req.query.city);
    }

    query.exec(function(err, campaigns) {

      if (err) console.log(err);

      if (campaigns) locals.campaigns = campaigns;

      next();

    })

  });

view.render(function(err) {
  if (err) return res.apiError('error', err);
  res.apiResponse({
    campaigns: locals.campaigns
  });
});

}
