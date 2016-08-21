const keystone = require('keystone');
const middleware = require('./middleware');
const importRoutes = keystone.importer(__dirname);

keystone.pre('routes', function(req, res, next) {
	res.locals.user = req.user;
	next();
});

keystone.pre('render', middleware.theme);
keystone.pre('render', middleware.flashMessages);
keystone.set('404', function(req, res, next) {
	res.status(404).render('errors/404');
});

// Load Routes
var routes = {
	api: importRoutes('./api'),
	download: importRoutes('./download'),
	views: importRoutes('./views'),
	auth: importRoutes('./auth')
};

exports = module.exports = function(app) {

	// Facebook authentication
	app.all('/auth/confirm', routes.auth.confirm);
	app.all('/auth/app', routes.auth.app);
	app.all('/auth/:service', routes.auth.service);

	// Session
	app.all('/signup', routes.views.session.join);
	app.all('/login', routes.views.session.signin);
	app.get('/logout', routes.views.session.signout);
	app.all('/forgot-password', routes.views.session['forgot-password']);
	app.all('/reset-password/:key', routes.views.session['reset-password']);
	app.all('/confirm-email/:key', routes.views.session['confirm-email']);

	// Public views
	app.get('/', routes.views.index);
	app.get('/campaign/:key', routes.views.campaign);

	// API
	app.all('/api/v1/cities', keystone.middleware.api, routes.api.city);
	app.all('/api/v1/campaigns', keystone.middleware.api, routes.api.campaigns);

	// User views

}
