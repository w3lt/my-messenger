const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    usernames: {
        type: [String, String],
        required: true,
        unique: true
    },
    messages: {
        type: [{
            sender: Number,
            content: String,
            sent_at: Date,
            // type: Number // 0 -> message, 1 -> system notification
        }],
        default: []
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const ConversationModel = mongoose.model('Conversation', ConversationSchema);
exports.Model = ConversationModel;