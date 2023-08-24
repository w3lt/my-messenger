const mongoose = require('mongoose');

let FriendRequestSchema = new mongoose.Schema({
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
    },
    is_response: {
        type: Boolean,
        required: true,
        default: false
    }
})

FriendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const FriendRequestModel = mongoose.model('FriendRequest', FriendRequestSchema);
exports.Model = FriendRequestModel;