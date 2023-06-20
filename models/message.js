const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, required: true, maxLength: 50 },
    text: { type: String, required: true, maxLength: 1500 },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, required: true },
});

module.exports = mongoose.model('Message', MessageSchema);