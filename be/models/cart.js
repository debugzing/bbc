var mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
	date: {
		type: Number,
		default: Date.now
	},
	items: [{
		count: { type: Number, default: 1 },
		item: { type: mongoose.Schema.Types.ObjectId, ref: 'Items' }
	}]
}, { usePushEach: true });

mongoose.model('Cart', cartSchema);
