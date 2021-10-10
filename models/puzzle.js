const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Puzzle = new Schema ({
    owner_user: {type: Schema.Types.ObjectId, ref: 'User'},
    title: String, 
    img: {type: String, required: true},
    description: String,
    exchangeable: {type: Boolean, default: false},
    isAvailable: {type: Boolean, default: true}
},
{timestamps: true}
)

module.exports = mongoose.model('Puzzle', Puzzle);