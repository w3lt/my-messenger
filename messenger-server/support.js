const mongoose = require('mongoose');

const configs = require('./configs');

mongoose.connect(configs.db_server);

// Database model
const User = require('./dbModels/User');
const Conversation = require('./dbModels/Conversation');
const Notification = require('./dbModels/Notifications/Notification');


async function findUserByEmail(email) {
    const result = await User.Model.findOne({email: email});
    return result;
}
exports.findUserByEmail = findUserByEmail;



async function findUserByUsername(username) {
    const result = await User.Model.findOne({username: username});
    return result;
}
exports.findUserByUsername = findUserByUsername;



async function findInterlocutor(username) {
    const interlocutorInfor = await User.Model.findOne({username: username}).select(["-email", "-password", "-created_at", "-_id"]);
    return interlocutorInfor;
}
exports.findInterlocutor = findInterlocutor;

async function addMessage(sender, receiver, messageContent) {
    const conversation = await Conversation.Model.findOne({usernames: {$all: [sender, receiver]}});
    conversation.messages.push({sender: conversation.usernames.indexOf(sender), content: messageContent, sent_at: new Date()});
    await conversation.save();
    return conversation;
}
exports.addMessage = addMessage;

async function addConversation(username_1, username_2) {
    const newConversation = {
        usernames: [username_1, username_2],
    }
    const result = await Conversation.Model.insertMany([newConversation]);
    return result;
}
exports.addConversation = addConversation;

async function findFriendRequestNotifications(username) {
    const result = await Notification.Model.find({to: username, type: 0});
    return result;
}
exports.findFriendRequestNotifications = findFriendRequestNotifications;