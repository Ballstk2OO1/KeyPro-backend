const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: String,
    price_per_piece: Number,
    image: String,
    description: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('switches', schema)
