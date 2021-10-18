const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

const Room = new Schema({
    name: { type: String, required: true },
    usercreate: { type: String, required: true },
    slug: { type: String, slug: "name", unique: true },
}, {
    timestamps: true
});

mongoose.plugin(slug);

module.exports = mongoose.model('Room', Room);
