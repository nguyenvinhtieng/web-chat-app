const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chat = new Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    content: { type: String },
    delete: { type: String, default: null },
    time: { type: String }
}, {
    timestamps: true
});


module.exports = mongoose.model('Chat', Chat);
