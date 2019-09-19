var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    date: {
        type: Number,
        default: Date.now
    },
    id: Number,
    name: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    model: {
        type: String,
        trim: true
    },
    price: {
        type: Number
    },
    currency: {
        type: String,
        default: 'USD'
    },
    description: {
        type: String,
        trim: true
    },
    stockcount: {
        type: Number,
        default: 0
    }
});

mongoose.model('Items', itemSchema);