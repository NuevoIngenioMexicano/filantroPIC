var keystone = require('keystone'),
	async = require('async'),
	request = require('request'),
	_ = require('underscore'),
	User = keystone.list('User'),
	mail = require('../mailgun.js');

var http = require("http");
var request = require('request');


exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'profile';
	locals.form = req.body;
	locals.returnto = req.query.returnto;

	locals.authUser = req.session.auth;
	locals.existingUser = false;
	locals.url = false;

	// Reject request if no auth data is stored in session
	if (!locals.authUser) {
		console.log('[auth.confirm] - No auth data detected, redirecting to signin.');
		console.log('------------------------------------------------------------');
		return res.redirect('/login');
	}

	// Set existing user if already logged in
	if (req.user) {
		locals.existingUser = req.user;
	}


	// Function to handle signin
	var doSignIn = function() {

		console.log('[auth.confirm] - Signing in user...');
		console.log('------------------------------------------------------------');

		var onSuccess = function(user) {
			console.log('[auth.confirm] - Successfully signed in.');
			console.log('------------------------------------------------------------');
			console.log(locals.existingUser);

			return res.redirect(req.cookies.target || '/');
		}

		var onFail = function(err) {
			console.log('[auth.confirm] - Failed signing in.', err);
			console.log('------------------------------------------------------------');
			req.flash('error', 'Sorry, there was an issue signing you in, please try again.');
			return res.redirect('/');
		}

		keystone.session.signin(String(locals.existingUser._id), req, res, onSuccess, onFail);

	}

	// Function to check if a user already exists for this profile id (and sign them in)
	var checkExisting = function(next) {

		if (locals.existingUser) return checkAuth();

		console.log('[auth.confirm] - Searching for existing users via [' + locals.authUser.type + '] profile id...');
		console.log('------------------------------------------------------------');

		var query = User.model.findOne();
			query.where('services.' + locals.authUser.type + '.profileId', locals.authUser.profileId);
			query.exec(function(err, user) {
				if (err) {
					console.log('[auth.confirm] - Error finding existing user via profile id.', err);
					console.log('------------------------------------------------------------');
					return next({ message: 'Sorry, there was an error processing your information, please try again.' });
				}
				if (user) {
					console.log('[auth.confirm] - Found existing user via [' + locals.authUser.type + '] profile id...');
					console.log('------------------------------------------------------------');
					locals.existingUser = user;
					return doSignIn();
				}
				return checkAuth();
			});

	}

	// Function to handle data confirmation process
	var checkAuth = function() {

		async.series([

			// Check for user by email (only if not signed in)
			function(next) {

				if (locals.existingUser) return next();

				console.log('[auth.confirm] - Searching for existing users via [' + locals.authUser.email + '] email address...');
				console.log('------------------------------------------------------------');

				var query = User.model.findOne();
					query.where('email', locals.form.email);
					query.exec(function(err, user) {
						if (err) {
							console.log('[auth.confirm] - Error finding existing user via email.', err);
							console.log('------------------------------------------------------------');
							return next({ message: 'Sorry, there was an error processing your information, please try again.' });
						}
						if (user) {
							console.log('[auth.confirm] - Found existing user via email address...');
							console.log('------------------------------------------------------------');
							return next({ message: 'There\'s already an account with that email address, please sign-in instead.' });
						}
						return next();
					});

			},

			// Create or update user
			function(next) {

				if (locals.existingUser) {

					console.log('[auth.confirm] - Existing user found, updating...');
					console.log('------------------------------------------------------------');

					var userData = {
						state: 'enabled',

						services: locals.existingUser.services || {}
					};

					_.extend(userData.services[locals.authUser.type], {
						isConfigured: true,

						profileId: locals.authUser.profileId,

						username: locals.authUser.username,
						avatar: locals.authUser.avatar,

						accessToken: locals.authUser.accessToken,
						refreshToken: locals.authUser.refreshToken,

						tokenType: locals.authUser.token_type,
						publishableKey: locals.authUser.stripe_publishable_key,
						livemode: locals.authUser.livemode,
						scope: locals.authUser.scope
					});

					// console.log('[auth.confirm] - Existing user data:', userData);

					locals.existingUser.set(userData);

					locals.existingUser.save(function(err) {
						if (err) {
							console.log('[auth.confirm] - Error saving existing user.', err);
							console.log('------------------------------------------------------------');
							return next({ message: 'Sorry, there was an error processing your account, please try again.' });
						}
						console.log('[auth.confirm] - Saved existing user.');
						console.log('------------------------------------------------------------');
						return next();
					});

				} else {

					console.log('[auth.confirm] - Creating new user...');
					console.log('------------------------------------------------------------');

					var options = {
						method: 'POST',
						uri: 'https://hooks.slack.com/services/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',
						json: true,
						headers: {
				      'Content-type': 'application/json',
				    },
						body : {
								username: "SocialApp",
								text : 'Se registró un nuevo usuario a través de Facebook.\nNombre: ' + locals.authUser.name + '\nEmail: ' + locals.authUser.email
						},
					};

					function callback(error, response, body) {

				    if (error) console.log(error);

				      console.log('Here goes the response' + JSON.stringify(response.body));
				      content = JSON.stringify(body);
				      // console.log(content);
				      // console.log(res);
				      // console.log('llego aqui');
				      res.setHeader('Access-Control-Allow-Origin', '*');
				      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
				      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');


							var userData = {
								name: locals.authUser.name,
								email: locals.authUser.email,
								password: Math.random().toString(36).slice(-8),
								state: 'enabled',
								isVerified: true,
								services: {}
							};

							userData.services[locals.authUser.type] = {
								isConfigured: true,

								profileId: locals.authUser.profileId,

								username: locals.authUser.username,
								avatar: locals.authUser.avatar,

								accessToken: locals.authUser.accessToken,
								refreshToken: locals.authUser.refreshToken,

								tokenType: locals.authUser.token_type,
								publishableKey: locals.authUser.stripe_publishable_key,
								livemode: locals.authUser.livemode,
								scope: locals.authUser.scope
							}

							// console.log('[auth.confirm] - New user data:', userData );

							locals.existingUser = new User.model(userData);

							locals.existingUser.save(function(err) {
								if (err) {
									console.log('[auth.confirm] - Error saving new user.', err);
									console.log('------------------------------------------------------------');
									return next({ message: 'Sorry, there was an error processing your account, please try again.' });
								}

								locals.existingUser.validateEmail(function(err) {
									// if (err) return next(err);
									if (err) {
										console.error('===== ERROR sending reset password email =====');
										console.error(err);
									}
								});

								console.log('[auth.confirm] - Saved new user.');
								console.log('------------------------------------------------------------');
								return next();
							});

				  }

				  request(options, callback);

				}

			},

			// Session
			function() {
				if (req.user) {
					console.log('[auth.confirm] - Already signed in, skipping sign in.');
					console.log('------------------------------------------------------------');

					if (req.cookies.draw) {

						User.model.findOneAndUpdate(
							{_id: req.user._id},
							{$addToSet: {drawsEntered: req.cookies.draw}},
							function(err, user){
								if (err) console.log(err);
								if (user) console.log(user);
							}
						);

					}

					if (req.cookies.interested) {

						User.model.findOneAndUpdate(
							{_id: locals.existingUser._id},
							{$addToSet: {interestedIn: req.cookies.interested}},
							function(err, user){
								if (err) console.log(err);
								if (user) console.log(user);
							}
						);

					}

					return res.redirect(req.cookies.target);
				}
				return doSignIn();
			}

		], function(err) {
			if (err) {
				console.log('[auth.confirm] - Issue signing user in.', err);
				console.log('------------------------------------------------------------');
				req.flash('error', err.message || 'Sorry, there was an issue signing you in, please try again.');
				return res.redirect('/');
			}
		});

	}

	view.on('init', function(next) {
		return checkExisting(next);
	});

	view.on('post', { action: 'confirm.details' }, function(next) {
		if (!locals.form['name'] || !locals.form['name'] || !locals.form.email) {
			req.flash('error', 'Please enter a name & email.');
			return next();
		}
		return checkAuth();
	});

	view.render('auth/confirm');

}
