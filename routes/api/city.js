const keystone = require('keystone');
const	async = require('async');
const City = keystone.list('City');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res),
    locals = res.locals;

  locals.section = 'cards';
  locals.form = req.body;

  view.on('get', function(next) {

    City.model.find({state: req.query.state})
    .exec(function(err, cities) {

      if (err) console.log(err);

      if (cities) locals.cities = cities;

      next();

    })

  });

view.render(function(err) {
  if (err) return res.apiError('error', err);
  res.apiResponse({
    cities: locals.cities
  });
});

}
