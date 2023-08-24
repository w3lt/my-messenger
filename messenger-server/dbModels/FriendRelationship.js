const mongoose = require('mongoose');

const FriendRelationshipSchema = new mongoose.Schema({
    user_1: {
        type: String,
        required: true,
        ref: 'User',
        foreignField: 'username'
    },
    user_2: {
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

FriendRelationshipSchema.index({ user_1: 1, user_2: 1 }, { unique: true });

const FriendRelationshipModel = mongoose.model('FriendRelationship', FriendRelationshipSchema);
exports.Model = FriendRelationshipModel;