// Load .env for development environments
require('dotenv').load();

var keystone = require('keystone');

/**
 * Application Initialisation
 */

keystone.init({

	'name': 'Filantropic',
	'brand': 'Filantropic',

	'favicon': 'public/favicon.ico',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'jade',

	'emails': 'templates/emails',
	//'mandrill api key': 'lIesonC75Er7QxGjS-SRzQ',

	'auto update': true,
	'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/filantropic',

	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'filantropic',

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,

	'chartbeat property': process.env.CHARTBEAT_PROPERTY,
	'chartbeat domain': process.env.CHARTBEAT_DOMAIN,
	'port': 3003,

	//'logger': 'combined'

});

require('./models');

keystone.set('locals', {
	_: require('lodash'),
	moment: require('moment'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain'),
	chartbeat_property: keystone.get('chartbeat property'),
	chartbeat_domain: keystone.get('chartbeat domain')
});

keystone.set('routes', require('./routes'));

// keystone.set('nav', {
// 	'users': 'users',
// });

keystone.set('google api key', 'AIzaSyB7ky1lfXlpui2rqKeLue6-4Ez7ng7jlHc');
keystone.set('default region', 'mx');
keystone.set('cloudinary folders', true);

keystone.start();
