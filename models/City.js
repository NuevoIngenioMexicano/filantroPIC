const keystone = require('keystone');
const Types = keystone.Field.Types;
const shortid = require('shortid');

var City = new keystone.List('City', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	},
});

City.add({
	cityID: {
		type: String,
		default: shortid.generate,
		unique: true
	},
	name: {
		type: String,
		default: ''
	},
	state: {
		type: Types.Relationship,
		ref: 'State'
	}
});

/**
 * Relationships
 */

City.track = true;
City.register();
