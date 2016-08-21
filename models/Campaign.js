const keystone = require('keystone');
const Types = keystone.Field.Types;
const shortid = require('shortid');

var Campaign = new keystone.List('Campaign', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	},
});

Campaign.add({
	campaignID: {
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
	cause: {
		type: Types.Relationship,
		ref: 'Cause'
	},
	state: {
		type: Types.Relationship,
		ref: 'State'
	},
	city: {
		type: Types.Relationship,
		ref: 'City'
	},
	sponsors: {
		type: Types.Relationship,
		ref: 'Sponsor',
		many: true
	},
	photo: {
		type: Types.CloudinaryImage
	},
});

/**
 * Relationships
 */

Campaign.track = true;
Campaign.register();
