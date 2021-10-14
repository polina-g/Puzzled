const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema ({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    exchange_inventory: Array
});

module.exports = mongoose.model('User', User);