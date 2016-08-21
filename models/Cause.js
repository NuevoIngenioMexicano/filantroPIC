const keystone = require('keystone');
const Types = keystone.Field.Types;
const shortid = require('shortid');

var Cause = new keystone.List('Cause', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	},
});

Cause.add({
	causeID: {
		type: String,
		default: shortid.generate,
		unique: true
	},
	name: {
		type: String,
		default: ''
	},
	description: {
		type: String,
		default: ''
	}
});

/**
 * Relationships
 */

Cause.track = true;
Cause.register();
