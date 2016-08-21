var keystone = require('keystone'),
	async = require('async'),
	// import from routes/mailgun.js
	mail = require('../../mailgun.js');
var http = require("http");
var request = require('request');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'session';
	locals.form = req.body;

	view.on('post', {
		action: 'join'
	}, function(next) {

		console.log(req.body);
		async.series([

			function(cb) {

				if (!req.body.name || !req.body.email || !req.body.password) {
					req.flash('error', 'Por favor especifica Nombre, correo electrónico y contraseña');
					return cb(true);
				}

				return cb();

			},

			function(cb) {

				keystone.list('User').model.findOne({
					email: req.body.email
				}, function(err, user) {

					if (err || user) {
						console.log('error', 'Ya existe un usuario con esa cuenta de correo electrónico');
						req.flash('error', 'Ya existe un usuario con esa cuenta de correo electrónico');
						return cb(true);
					}

					return cb();

				});

			},

			function(cb) {

				var userData = {
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
					referredBy: req.body.referredBy,
					creationDate: new Date()
				};

				var User = keystone.list('User').model,
					newUser = new User(userData);

				newUser.save(function(err) {
					console.log('Creando nuevo usuario');
					return cb(err);
				});

			}

		], function(err) {

			if (err) {
				console.log(err);
				return next();
			}

			var onSuccess = function() {

				var options = {
					method: 'POST',
					uri: 'https://hooks.slack.com/services/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',
					json: true,
					headers: {
						'Content-type': 'application/json',
					},
					body: {
						icon_url: "http://104.131.11.166:3003/images/marker.png",
						text: 'Se registró un nuevo usuario.\nNombre: ' + req.user.name + '\nEmail: ' + req.user.email + '\n<https://filantropic.mx/admin/user/' + req.user.id + '|Ver en admin>'
					},
				};

				function callback(error, response, body) {

					if (error) console.log(error);

					console.log('Here goes the response' + JSON.stringify(response.body));
					content = JSON.stringify(body);

					res.setHeader('Access-Control-Allow-Origin', '*');
					res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
					res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

					res.redirect(req.body.target || '/dashboard');
				}

					request(options, callback);

			}

			var onFail = function(e) {
				console.log('Not logged in');
				req.flash('error', 'Hubo un problema al iniciar sesión, por favor intenta otra vez.');
				return next();
			}

			keystone.session.signin({
				email: req.body.email,
				password: req.body.password
			}, req, res, onSuccess, onFail);

		});

	});

	view.render('session/join');

}
