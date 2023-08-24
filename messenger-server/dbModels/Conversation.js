const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    usernames: {
        type: [String, String],
        required: true,
        unique: true
    },
    is_read: {
        type: [Number, Number],
        required: true,
        default: [-1, -1]
    },
    messages: {
        type: [{
            sender: Number,
            content: String,
            sent_at: Date,
            message_type: Number
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