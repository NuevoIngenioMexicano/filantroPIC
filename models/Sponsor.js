const keystone = require('keystone');
const Types = keystone.Field.Types;
const shortid = require('shortid');

var Sponsor = new keystone.List('Sponsor', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	},
});

Sponsor.add({
	sponsorID: {
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
	},
});

/**
 * Relationships
 */

Sponsor.relationship({ ref: 'Campaign', path: 'sponsors' });

Sponsor.track = true;
Sponsor.register();
