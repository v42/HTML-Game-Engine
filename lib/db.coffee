mongoose = require 'mongoose'

# Fix $near with array queries.
#mongoose.SchemaTypes.Array::$conditionalHandlers['$near'] = (val) ->
#	return this.cast val

Schema = mongoose.Schema

User = new Schema
	name     : { type: String, index: { unique: true } }
	location : { name: String, geo: { type: Array } }
	joined   : { type: Date, default: Date.now }
	handles  :
		twitter    : String
		foursquare : String
	image    : String
	events   :
		creator     : [{ type: Schema.ObjectId, ref: 'Mob', unique: true }]
		participant : [{ type: Schema.ObjectId, ref: 'Mob', unique: true }]


Mob = new Schema
	name         : String
	description  : String
	date         : Date
	location     : { name: String, geo: { type: Array } }
	min          : Number
	confirmed    : Boolean
	slug         : String
	created_by   : String
	participants : [{ type: Schema.ObjectId, ref: 'User' }]

Mob.index { 'location.geo': '2d' }

module.exports =
	User : mongoose.model 'User', User
	Mob  : mongoose.model 'Mob', Mob
	use  : (dbname) ->
		mongoose.connect "mongodb://localhost/#{dbname}"
		return this