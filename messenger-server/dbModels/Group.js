const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    members: {
        type: [{
            username: {
                type: String,
                ref: 'User',
                foreignField: 'username',
                required: true,
                unique: true
            },
            is_read: {
                type: Number,
                required: true,
                default: -1
            },
            joining_time: {
                type: Date,
                required: true,
                default: new Date()
            }
        }],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    visibility: { // 0 -> private, 1 -> public
        type: Number,
        required: true
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

const GroupModel = mongoose.model('Group', GroupSchema);
exports.Model = GroupModel;