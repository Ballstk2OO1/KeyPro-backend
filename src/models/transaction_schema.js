const mongoose = require('mongoose');

const item_schema = mongoose.Schema({
    name: String,
    price_per_piece: Number,
    image: String
}, { _id : false});

const schema = mongoose.Schema({
    item: [item_schema],
    total: Number,
    ownerID: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('transactions', schema)
