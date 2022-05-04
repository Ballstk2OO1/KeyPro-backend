const mongoose = require('mongoose');

const schema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: {
        firstname: String,
        lastname: String
    },
    created: { type: Date, default: Date.now }
});

schema.index({ username: 1, email: 3}, { unique: true, unique: true });
module.exports = mongoose.model('users', schema)
