const keystone = require('keystone');
const Types = keystone.Field.Types;
const shortid = require('shortid');

var State = new keystone.List('State', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	},
});

State.add({
	stateID: {
		type: String,
		default: shortid.generate,
		unique: true
	},
	name: {
		type: String,
		default: ''
	}
});

/**
 * Relationships
 */

State.track = true;
State.register();
