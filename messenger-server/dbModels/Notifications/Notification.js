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
    created_at: {
        type: Date,
        default: new Date()
    }
})

const NotificationModel = mongoose.model('Notification', NotificationSchema);
exports.Model = NotificationModel;