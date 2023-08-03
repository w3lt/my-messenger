const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
        ref: 'User',
        foreignField: 'username'
    },
    receiver: {
        type: String,
        required: true,
        ref: 'User',
        foreignField: 'username'
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const FriendRequestModel = mongoose.model('FriendRequest', FriendRequestSchema);
exports.Model = FriendRequestModel;