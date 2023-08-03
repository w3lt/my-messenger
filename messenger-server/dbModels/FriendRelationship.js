const mongoose = require('mongoose');

const FriendRelationshipSchema = new mongoose.Schema({
    id1: {
        type: String,
        required: true,
        ref: 'User',
        foreignField: 'username'
    },
    id2: {
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

const FriendRelationshipModel = mongoose.model('FriendRelationship', FriendRelationshipSchema);
exports.Model = FriendRelationshipModel;