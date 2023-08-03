const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    usernames: [{
        type: String,
        ref: 'User',
        foreignField: 'username'
    }],
    messages: {
        type: [{
            sender: Number,
            content: String,
            sent_at: Date
        }],
        default: []
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const ConversationModel = mongoose.model('Message', ConversationSchema);
exports.Model = ConversationModel;