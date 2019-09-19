var mongoose = require('mongoose');

var salesSchema = new mongoose.Schema({
	date: { type: Number, default: Date.now }, // When was it sold
	type: { type: String }, // Item type
	name: { type: String }, // Name of item
	price: { type: Number }, // cost
	currency: { type: String } // currency
}, { usePushEach: true });

mongoose.model('Sales', salesSchema);
