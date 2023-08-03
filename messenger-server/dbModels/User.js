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
    dob: Date,
    avatar: String,
    gender: String,
    created_at: {
        type: Date,
        default: new Date()
    }
})

const UserModel = mongoose.model('User', UserSchema);
exports.Model = UserModel;