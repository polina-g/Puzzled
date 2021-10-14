const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Puzzle = new Schema ({
    owner_user: {type: Schema.Types.ObjectId, ref: 'User'},
    borrowed_user: {type: String, default: null},
    title: String, 
    img: {type: String, default: 'https://i.imgur.com/hHjTONV.png'},
    description: String,
    exchangeable: {type: Boolean, default: false},
    isAvailable: {type: Boolean, default: true}
},
{timestamps: true}
)

module.exports = mongoose.model('Puzzle', Puzzle);