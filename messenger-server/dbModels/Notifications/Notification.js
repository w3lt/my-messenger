const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    // type 0 -> friend request
    type: Number,
    to: {
        type: String,
        required: true,
        ref: 'User',
        foreignField: 'username'
    },
    content: {
        title: String,
        body: String
    },
    avatar_path: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    is_read: {
        type: Boolean,
        required: true,
        default: false
    }
})

const NotificationModel = mongoose.model('Notification', NotificationSchema);
exports.Model = NotificationModel;