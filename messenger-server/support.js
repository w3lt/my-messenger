const mongoose = require('mongoose');
const fs = require('fs');


const configs = require('./configs');

mongoose.connect(configs.db_server);

// Database model
const User = require('./dbModels/User');
const Conversation = require('./dbModels/Conversation');
const Notification = require('./dbModels/Notifications/Notification');
const FriendRequest = require('./dbModels/Notifications/FriendRequest');
const FriendRelationship = require('./dbModels/FriendRelationship');

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

async function findFriendRelationship(username_1, username_2) {
    try {
        const relationship = await FriendRelationship.Model.findOne({
            $or: [
                { user_1: username_1, user_2: username_2 },
                { user_1: username_2, user_2: username_1 }
            ]
        });

        return relationship;
    } catch (error) {
        throw error;
    }
}
exports.findFriendRelationship = findFriendRelationship;

async function findInterlocutor(username) {
    const interlocutorInfor = (await User.Model.findOne({username: username}).select(["-email", "-password", "-created_at", "-_id"])).toObject();
    interlocutorInfor.avatar = convertPath2Avatar(interlocutorInfor.avatar_path);
    delete interlocutorInfor.avatar_path;
    return interlocutorInfor;
}
exports.findInterlocutor = findInterlocutor;

async function addMessage(sender, receiver, messageContent) {
    const conversation = await Conversation.Model.findOne({usernames: {$all: [sender, receiver]}});
    conversation.messages.push({sender: conversation.usernames.indexOf(sender), content: messageContent, sent_at: new Date()});
    console.log(conversation.messages);
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
    const results = await Notification.Model.find({to: username, type: 0});
    const finalResults = Promise.all(results.map(async result => {
        const is_response = (await FriendRequest.Model.findOne({sender: result.content.title, receiver: username})).is_response;
        const finalResult = {
            content: result.content,
            avatar: base64Encode(fetchRealAvatarPath(result.avatar_path)),
            created_at: result.created_at,
            is_response: is_response
        }
        return finalResult;
    }))
    return finalResults;
}
exports.findFriendRequestNotifications = findFriendRequestNotifications;

async function searchPeople(searchingPeople, username) {
    try {
        // Use a regular expression to match usernames containing the substring
        const searchRegex = new RegExp(searchingPeople, 'i'); // 'i' flag for case-insensitive matching

        const tmpSearchResults = await User.Model.find({ username: searchRegex });
        const searchResults = tmpSearchResults.filter(result => (result.username !== username));
        return Promise.all(searchResults.map(async rawResult => {
            let status;
            const friendRelationship = await findFriendRelationship(username, rawResult.username);
            if (friendRelationship) {status = "Friend"}
            else {
                const friendRequest = await FriendRequest.Model.countDocuments({sender: username, receiver: rawResult.username});
                if (friendRequest !== 0) status = "Requested";
                else status = null;
            }
            
            let finalResult = {
                username: rawResult.username,
                avatarPath: rawResult.avatar_path,
                currentStatus: rawResult.current_status,
                signature: rawResult.signature,
                status: status
            }
            return finalResult;
        }));
    } catch (error) {
        console.error('Error searching people: ', error);
        throw new Error(error);
    }
}
exports.searchPeople = searchPeople;

async function addFriendRequest(sender, receiver) {
    try {
        const newRequest = {
            sender: sender,
            receiver: receiver
        }

        const result = await FriendRequest.Model.insertMany([newRequest]);
        if (result) {

            const avatar_path = (await findUserByUsername(sender)).avatar_path;

            const newNotification = {
                type: 0,
                to: receiver,
                content: {
                    title: sender,
                    body: "has sent friend request"
                },
                avatar_path: avatar_path
            };

            await Notification.Model.insertMany([newNotification]);
            return 0;
        }
    } catch (error) {
        throw new Error(error);
    }
}
exports.addFriendRequest = addFriendRequest;

async function cancelFriendRequest(sender, receiver) {
    try {
        const result = await FriendRequest.Model.deleteMany({sender: receiver, receiver: sender});

        console.log(result);
    } catch (error) {
        throw error;
    }
}
exports.cancelFriendRequest = cancelFriendRequest;

async function handleFriendRequest(handler, sender, type) {
    try {
        if (type === 0) {
            // type = 0 => accept the request
            const newRelationship = {
                user_1: handler,
                user_2: sender
            };
            const result = await FriendRelationship.Model.insertMany([newRelationship]);
            if (result) {
                await FriendRequest.Model.updateOne({sender: sender, receiver: handler}, {$set: {is_response: true}});
                const addConversationResult = await addConversation(handler, sender);
                if (addConversationResult) return 0;
            }
        }
    } catch (error) {
        throw new Error(error);
    }
}
exports.handleFriendRequest = handleFriendRequest;

async function countNotification(username) {
    try {
        const numberNotification = await Notification.Model.countDocuments({to: username, is_read: false});
        return numberNotification;
    } catch (error) {
        throw new Error(error);
    }
}
exports.countNotification = countNotification;

async function readNotifications(username, type) {
    try {
        const result = await Notification.Model.updateMany({to: username, type: type}, {"$set": {is_read: true}});
        if (result.acknowledged) {
            return 0;
        } else {
            throw new Error("Internal Error");
        }
    } catch (error) {
        throw new Error(error);
    }
}
exports.readNotifications = readNotifications;

// function to encode file data to base64 encoded string
function base64Encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}
exports.base64Encode = base64Encode;

function fetchRealAvatarPath(tmpPath) {
    const avatarBasePath = "assets/avatars";
    const avatarPath = `${__dirname}/${avatarBasePath}/${tmpPath}`;
    return avatarPath;
}
exports.fetchRealAvatarPath = fetchRealAvatarPath;

function convertPath2Avatar(path) {
    return base64Encode(fetchRealAvatarPath(path));
}