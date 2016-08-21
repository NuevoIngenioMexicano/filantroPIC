const _ = require('lodash');
const keystone = require('keystone');
const Types = keystone.Field.Types;
const mail = require('../routes/mailgun.js');

/**
 * Users
 * =====
 */

var User = new keystone.List('User', {
	// use nodelete to prevent people from deleting the demo admin user
});

var deps = {
	facebook: {
		'services.facebook.isConfigured': true
	}
};

User.add({
	name: {
		type: String,
		required: true,
		index: true
	},
	email: {
		type: Types.Email,
		initial: true,
		required: true,
		index: true
	},
	password: {
		type: Types.Password,
		initial: true,
		required: false
	},
	resetPasswordKey: {
		type: String,
		hidden: true
	},
	creationDate: {
		type: Date
	},
	campaigns: {
		type: Types.Relationship,
		ref: 'Campaign',
		many: true
	}
}, 'Permissions', {
	isAdmin: {
		type: Boolean,
		label: 'Can access Keystone'
	},
}, 'Services', {
	services: {
		facebook: {
			isConfigured: {
				type: Boolean,
				label: 'Facebook has been authenticated'
			},

			profileId: {
				type: String,
				label: 'Profile ID',
				dependsOn: deps.facebook
			},

			username: {
				type: String,
				label: 'Username',
				dependsOn: deps.facebook
			},
			avatar: {
				type: String,
				label: 'Image',
				dependsOn: deps.facebook
			},

			location: {
				type: String,
				label: 'Location',
				dependsOn: deps.facebook
			},

			accessToken: {
				type: String,
				label: 'Access Token',
				dependsOn: deps.facebook
			},
			refreshToken: {
				type: String,
				label: 'Refresh Token',
				dependsOn: deps.facebook
			}
		}
	}
});

User.schema.add({
	music: [],
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

// User.relationship({ ref: 'Post', path: 'author' });


/**
	Methods
	=======
*/

User.schema.methods.wasActive = function() {
	this.lastActiveOn = new Date();
	return this;
};

User.schema.methods.resetPassword = function(callback) {

	var user = this;

	user.resetPasswordKey = keystone.utils.randomString([16, 24]);

	user.save(function(err) {

		if (err) return callback(err);

		var template = '<table style="height:100%;margin:0;padding:0;width:100%;background-color:#fff" height="100%" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="border-collapse:collapse;padding:30px" align="center" valign="top"><table style="color:#333;font-family:Helvetica,Arial,sans-serif;line-height:130%;text-align:left;font-size:16px;width:620px" border="0" cellpadding="0" cellspacing="0" width="660"><tbody><tr><td style="border-collapse:collapse;line-height:0;text-align:center;padding-left:30px;padding-right:30px" valign="middle"><div style="padding-bottom:30px"><a href="http://mandrillapp.com/track/click/30485346/www.filantropic.mx?p=eyJzIjoiNFFMZlBDd3I0UFQxTkMySUtPT2hkcS1PdDlnIiwidiI6MSwicCI6IntcInVcIjozMDQ4NTM0NixcInZcIjoxLFwidXJsXCI6XCJodHRwOlxcXC9cXFwvd3d3LnBhcmtlby5teFxcXC9cIixcImlkXCI6XCJjYjZmNGZkYTkxNzk0ODhiOWY5NmY0ZDk1MWJhZWIyYlwiLFwidXJsX2lkc1wiOltcImM0ZTY1ZTYzODE0ZWE0MWY3MTliNzdkYmE4ZmQwZmViN2YwNWQ2MWZcIl19In0" style="color:#348dd9;font-weight:inherit;text-decoration:underline" target="_blank"><img src="https://ci4.googleusercontent.com/proxy/8n51ZWWofrLcsSleYVkkFQM8A7AKJiu29jBdZ5sUyxs8Yt88VNYY-nPWpSHE897Jd-zUghC_OQllgMwvVVM=s0-d-e1-ft#http://45.55.236.89:3003/images/logo.png" alt="filantropic" style="border:0;min-height:auto;line-height:130%;outline:none;text-decoration:none;display:inline" height="50" width="111" class="CToWUd"></a></div></td></tr><tr><td style="border-collapse:collapse;background-color:#ffffff;border:1px solid #13b95b;border-radius:5px" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="border-collapse:collapse;padding-top:30px" valign="top"><p></p><h1 style="color:#2e4255;display:block;font-family:Helvetica,Arial,sans-serif;font-size:25px;line-height:2;margin-top:0;margin-right:0;margin-bottom:10px;margin-left:0;text-align:center;font-weight:normal">¿No recuerdas tu contraseña?</h1><p style="text-align:center;line-height:1.5;font-size:16px;color:#7c888d;padding:0px 100px">¡No hay problema!</p><p style="text-align:center;line-height:1.5;font-size:16px;color:#7c888d;padding:0px 100px">Puedes crear una nueva siguiendo este link:</p><p style="margin-top:45px;text-align:center"><a href="https://filantropic.mx/reset-password/' + user.resetPasswordKey + '" style="background:#13b95b;color:#fff;border-radius:30px;line-height:2;display:block;margin:auto;width:142px;min-height:32px;text-decoration:none;font-size:15px;padding:2px 15px;display:inline-block" target="_blank">Click aquí</a></p><table><tbody><tr><td style="font-size:18px;padding:30px 50px 0 50px;border-collapse:collapse" align="center" valign="top"></td></tr><tr><td style="border-collapse:collapse" align="center" valign="top"><table border="0" cellpadding="10" cellspacing="0" width="100%"><tbody><tr><td style="border-collapse:collapse;padding:0;" align="center" valign="top"><div class="a6S" dir="ltr" style="opacity: 1; left: 941.5px; top: 672px;"><div id=":1r4" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " data-tooltip-class="a1V" data-tooltip="Download"><div class="aSK J-J5-Ji aYr"></div></div></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td><table style="color:#333;font-family:Helvetica,Arial,sans-serif;line-height:130%;text-align:left;font-size:16px;width:620px" border="0" cellpadding="0" cellspacing="0" width="660"><tbody><tr><td><p style="text-align:center;font-size:11px;color:#7c888d;margin-top:75px;line-height:1.5">Copyright © 2015 <span class="il">filantropic</span> <br>Sierra Mojada 447, Col. Lomas de Chapultepec, Miguel Hidalgo, México D.F</p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>'

		var data = {
			from: 'filantropic <no-reply@filantropic.mx>',
			to: user.email,
			subject: 'Recupera tu contraseña',
			html: template
		};

		mail.mailgun.messages().send(data, callback);

	});

};


User.schema.methods.validateEmail = function(callback) {

	var user = this;

	user.validateEmailKey = keystone.utils.randomString([16, 24]);

	user.save(function(err) {

		if (err) return callback(err);

		var welcome = '<meta charset="utf-8"><table style="height:100%;margin:0;padding:0;width:100%;background-color:#F8FBFF" height="100%" border="0" cellpadding="0" cellspacing="0" width="100%"> <tbody> <tr> <td style="border-collapse:collapse;padding:30px" align="center" valign="top"> <table style="color:#333;font-family:Helvetica,Arial,sans-serif;line-height:130%;text-align:left;font-size:16px;width:745px" border="0" cellpadding="0" cellspacing="0" width="745"> <tbody> <tr> <td style="background-color:#194988;border-collapse:collapse;line-height:0;text-align:center;padding-left:30px;padding-right:30px" valign="middle"> <div style="padding-bottom:30px"> <a href="http://mandrillapp.com/track/click/30485346/www.filantropic.mx?p=eyJzIjoiNFFMZlBDd3I0UFQxTkMySUtPT2hkcS1PdDlnIiwidiI6MSwicCI6IntcInVcIjozMDQ4NTM0NixcInZcIjoxLFwidXJsXCI6XCJodHRwOlxcXC9cXFwvd3d3LnBhcmtlby5teFxcXC9cIixcImlkXCI6XCJjYjZmNGZkYTkxNzk0ODhiOWY5NmY0ZDk1MWJhZWIyYlwiLFwidXJsX2lkc1wiOltcImM0ZTY1ZTYzODE0ZWE0MWY3MTliNzdkYmE4ZmQwZmViN2YwNWQ2MWZcIl19In0" style="color:#348dd9;font-weight:inherit;text-decoration:underline" target="_blank"> <img src="http://45.55.236.89:3003/images/logo_white.png" alt="filantropic" style="border:0;min-height:auto;line-height:130%;outline:none;text-decoration:none;display:block;margin-left:-20px;margin-top:20px;" height="50" width="111" class="CToWUd"> </a> </div></td></tr><tr> <td style="background-color:#194988;text-align:center;color:#fff;font-size:30px;"> <p>¡Bienvenido a filantropic!</p></td></tr><tr> <td style="background-color:#194988;color:#fff;padding-top:40px;"> <p style="text-align:center;width:430px;margin:auto;line-height:2;font-weight:lighter;font-size:14px;"> Para seguir con filantropic necesitamos que confirmes este e-mail dando click en el siguiente boton: </p></td></tr><tr> <td style="background:#194988;text-align:center;"> <img src="http://45.55.236.89:3003/images/park_02.png" alt=""> </td></tr><tr> <td style="background-color:#194988;text-align:center;padding-top:20px;padding-bottom:20px;"> <a style="text-decoration:none;color:#fff;font-weight:lighter;background:#F5A623;border-radius:25px;line-height:3;text-transform:uppercase;padding:15px 48px;font-size:14px;letter-spacing:1.7px;" href="https://filantropic.mx/confirm-email/' + user.validateEmailKey + '" target="_blank">Activar mi cuenta</a> </td></tr><tr> <td style="border-collapse:collapse;background:#fff;" valign="top"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tbody> <tr> <td style="padding:20px 40px;text-align:center;height:200px;width:200px"> <img src="http://45.55.236.89:3003/images/pin.png" alt=""> </td><td> <h2 style="color:#525252;font-weight:lighter">¿Tienes un lugar disponible?</h2> <p style="color:#7F7F7F;font-weight:lighter;line-height:1.5;"> Si tu estacionamiento tiene horas donde nadie lo ocupa, podrías rentarlo y así tener un ingreso extra súper fácil. </p></td></tr><tr> <td style="padding:20px 40px;text-align:center;height:200px;width:200px"> <img src="http://45.55.236.89:3003/images/car.png" alt=""> </td><td> <h2 style="color:#525252;font-weight:lighter">¿Estas buscando estacionamiento?</h2> <p style="color:#7F7F7F;font-weight:lighter;line-height:1.5;"> Nada mejor que como en tu casa. Con filantropic encuentra estacionamientos en casa de alguien más con todas las comodidades que esto implica. </p></td></tr><tr> <td colspan="2" style="padding: 0px 40px;"> <div style="width:100%;height:1px;background:#D8D8D8"></div></td></tr><tr> <td colspan="2" style="text-align:center"> <a style="line-height:5;font-size:13px;text-decoration:none;color:#79828B;font-weight:lighter" href="#" target="_blank">Soporte: hola@filantropic.mx</a> </td></tr></tbody> </table> </td></tr><tr> <td> <table style="color:#333;font-family:Helvetica,Arial,sans-serif;line-height:130%;text-align:left;font-size:16px;width:100%" border="0" cellpadding="0" cellspacing="0" width="660"> <tbody> <tr> <td> <p style="text-align:center;font-size:11px;color:#7c888d;margin-top:75px;line-height:1.5">Copyright © 2016 <span class="il">filantropic</span> <br>Sierra Mojada 447, Col. Lomas de Chapultepec, Miguel Hidalgo, México D.F</p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody></table>';

		var data = {
			from: 'filantropic <no-reply@filantropic.mx>',
			to: user.email,
			subject: 'Por favor verifica tu email',
			html: welcome
		};

		mail.mailgun.messages().send(data, callback);

	});

};




/**
 * PROTECTING THE DEMO USER
 * The following hooks prevent anyone from editing the main demo user itself,
 * and breaking access to the website cms.
 */

// var protect = function(path) {
// 	var user = this;
// 	User.schema.path(path).set(function(value) {
// 		return (user.isProtected) ? user.get(path) : value;
// 	});
// }
//
// _.each(['name.first', 'name.last', 'email', 'isAdmin'], protect);
//
// User.schema.path('password').set(function(value) {
// 	return (this.isProtected) ? '$2a$10$b4vkksMQaQwKKlSQSfxRwO/9JI7Fclw6SKMv92qfaNJB9PlclaONK' : value;
// });


/**
 * Registration
 */

User.track = true;
User.defaultColumns = 'name, email, userType';
User.register();
