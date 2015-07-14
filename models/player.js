// app/models/player.js
var item = require('./item.js');
var role = require('./role.js');
var group = require('./group.js');
var resource = require('./resource.js');
var properties = require('./properties.js');

// define the schema for player model
var playerSchema = mongoose.Schema({

	inventar		:{
		enabled		:{
			type:Boolean,
			default: true
		},
		slot	:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Item'
		}]
	},

	role			:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Role'
	}],

	position		:{
		x:Number, //GPS postion
		y: Number,
		z: Number 
	},
	resource		:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Resource'
	}],
	groups			:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Group'
	}],
	properties		: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'ObjectProperty'
	}]
});

// methods ======================
playerSchema.pre("remove", function(next) {
	for (var k= 0; k < this.properties.length; k++) {
		var property = this.properties[k];
		property.remove();
	}
	
	for (var k=0; k < this.groups.length; k++) {
		var group = this.groups[k];
		group.remove();
	}
	next();
});
// create the model for player
module.exports = mongoose.model('Player', playerSchema);