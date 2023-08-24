const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        default: null
    },
    avatar_path: {
        type: String,
        required: true,
        default: "defaultAvatar.png"
    },
    gender: {
        type: Number,
        default: null
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    current_status: {
        // current status is the 
        type: [Number, String],
        required: true,
        default: [0, null]
    },
    signature: {
        type: String,
        default: null
    }
})

const UserModel = mongoose.model('User', UserSchema);
exports.Model = UserModel;