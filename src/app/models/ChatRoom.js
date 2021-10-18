const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatRoom = new Schema({
    idroom: { type: String, required: true },
    sender: { type: String },
    content: { type: String },
    sendername: { type: String },
    time: { type: String }
}, {
    timestamps: true
});


module.exports = mongoose.model('ChatRoom', ChatRoom);
