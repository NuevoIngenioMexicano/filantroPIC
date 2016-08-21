var Mailgun = require('mailgun-js');
var exports = module.exports = {};

// this is the credentials used in filantropic api v1.5
var credentials = {
	api_key: 'key-697f5572cf92aecb17de748c70b09006',
	domain: 'sandboxb2e9bd5c851c4ddbb9e33e896c7aa332.mailgun.org',
};

exports.mailgun = new Mailgun({apiKey: credentials.api_key, domain: credentials.domain});
