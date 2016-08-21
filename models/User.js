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
