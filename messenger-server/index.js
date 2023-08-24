const express = require('express');

const configs = require('./configs');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const support = require('./support');


const getResultByStatus = require('./result').getResultByStatus;

mongoose.connect(configs.db_server);

// Database model
const User = require('./dbModels/User');
const Conversation = require('./dbModels/Conversation');

const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'Giang Lake ngok ngech',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}))

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.Model.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    {
      usernameField: 'accountID',
      passwordField: 'password'
    },
    (accountID, password, done) => {
      const requestedUser = {accountID: accountID, password: password};
      return done(null, requestedUser);
    }
  ));
  

// Cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://10.101.2.81:3000'); // Replace with the allowed origin(s)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.route('/check-session')
    .get((req, res) => {
        if (req.session.username === undefined) {
            res.send({status: 0, result: false})
        } else {
            res.send({status: 0, result: true})
        }
    })

// Auth
app.route('/auth')
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                // Handle any error that occurred during authentication
                console.log(err);
                return res.status(500).json({ error: 'An error occurred during authentication.' });
            }

            const accountID = user.accountID;
            const password = user.password;

            let loginQuery = null;

            if (accountID.includes('@')) {
                loginQuery = {email: accountID};
            } else {
                loginQuery = {username: accountID};
            }
            User.Model.find(loginQuery)
                .then(results => {
                    if (results === null) res.send(getResultByStatus(-1));
                    else {
                        const result = results[0];
                        const username = result.username;
                        bcrypt.compare(password, result.password)
                            .then(result => {
                                if (result) {
                                    req.session.username = username;
                                    res.send({status: 0});
                                } else {
                                    res.send(getResultByStatus(-1));
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                res.send(getResultByStatus(2));
                            });
                    }
                })
                .catch(error => {
                    console.log(error);
                    res.send(getResultByStatus(2));
                });
        }) (req, res, next);
    });

// Register
app.route('/register')
    .post((req, res) => {
        // Check if user can register
        // If yes => create new user and send back the result
        // If no => send back the error
        const password = req.body.password;
        const email = req.body.email;
        const username = req.body.username;
        
        User.Model.findOne({username: username})
            .then(result => {
                if (result === null) {
                    // Can register
                    bcrypt.hash(password, 10)
                        .then(hashedPass => {
                            const newUser = {
                                email: email,
                                username: username,
                                password: hashedPass,
                            }
                            User.Model.insertMany([newUser])
                                .then(docs => {
                                    req.session.username = username;
                                    res.send(getResultByStatus(0));
                                })
                                .catch(err => res.send(getResultByStatus(2)))
                        })
                        .catch(err => res.send(getResultByStatus(2)))
                } else {
                    res.send(getResultByStatus(3));
                }
            })
    })

// Logout
app.route('/logout')
    .post((req, res) => {
        // Clear the user's session and log them out
        req.logout(err => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'An error occurred during logout.' });
            } else {
                // This function is provided by Passport.js to clear the session
                req.session.destroy((err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: 'An error occurred during logout.' });
                    } else {
                        res.send({status: 0});
                    }
                });
            }
        }); 
        
    });

// my contacts
app.route('/my-contacts')
    .get(async (req, res) => {
        const myUsername = req.session.username;
        if (myUsername === undefined) res.send(getResultByStatus(1));
        else {
            try {
                const results = await Conversation.Model.find({usernames: {$in: [myUsername]}});
                const myInterlocutorsInfor = await Promise.all(results.map(async result => {
                    const messagesLength = result.messages.length;
                    const myInterlocutor = (result.usernames[0] === myUsername) ? result.usernames[1] : result.usernames[0];
                    const interlocutorInfor = await support.findInterlocutor(myInterlocutor);
                    const lastMessage = (messagesLength !== 0) ? result.messages[messagesLength-1] : {content: null, sent_at: null};

                    interlocutorInfor.lastMessage = lastMessage.content;
                    interlocutorInfor.lastMessageSender = (messagesLength === 0) ? null : ((myInterlocutor === result.usernames[lastMessage.sender]) ? 1 : 0);
                    interlocutorInfor.receivingTime = lastMessage.sent_at;
                    
                    return interlocutorInfor;
                }));

                res.send({interlocutor: myInterlocutorsInfor, conversations: results});
            } catch (error) {
                console.log(error);
                res.send(getResultByStatus(2));
            }            
        }
    })

app.route('/message')
    .post(async (req, res) => {
        // console.log(req.body);
        const sender = req.body.sender;
        const receiver = req.body.receiver;
        const messageContent = req.body.content;
        const conversation = await support.addMessage(sender, receiver, messageContent);
        res.send(conversation);
    })

// app.route('/conversation')
//     .post(async (req, res) => {
        
//     });

app.route('/notifications')
    .get(async (req, res) => {
        const username = req.session.username;
        if (username === undefined) res.send(getResultByStatus(1));
        else {
            try {
                const numberUnreadNotification = await support.countNotification(username);
                res.send({status:0, numberUnreadNotification: numberUnreadNotification});
            } catch(error) {

                res.send(getResultByStatus(2));
            }
        }
    })

app.route('/notifications/:type')
    .get(async (req, res) => {
        const username = req.session.username;
        if (username === undefined) res.send(getResultByStatus(1));
        else {
            const type = req.params.type;
            try {
                let result;
                switch (type) {
                    case "friend-requests":
                        result = await support.findFriendRequestNotifications(username);
                        break;
                }

                res.send({status: 0, data: result});
            } catch (error) {
                console.log(error);
                res.send(getResultByStatus(2));
            }
            
        }
    })
    .post(async (req, res) => {
        const username = req.session.username;
        if (username === undefined) res.send(getResultByStatus(1));
        else {
            const type = req.params.type;
            try {
                let result;
                switch (type) {
                    case "friend-requests":
                        result = await support.readNotifications(username, 0);
                        break;
                }
                res.send(getResultByStatus(0));
            } catch (error) {
                res.send(getResultByStatus(2));
            }
            
        }
    })

app.route('/people/:searchingPeople')
    .get(async (req, res) => {
        const username = req.session.username;
        if (username === undefined) res.send(getResultByStatus(1));
        else {
            const searchingPeople = req.params.searchingPeople;
            const tmpResults = await support.searchPeople(searchingPeople, username);

            // The base path of avatars dir
            const avatarBasePath = "assets/avatars";

            const finalResults = await Promise.all(tmpResults.map(async result => {  
                const avatarPath = `${__dirname}/${avatarBasePath}/${result.avatarPath}`;
                try {
                    const avatar = support.base64Encode(avatarPath);
                    delete result.avatarPath;
                    result.avatar = avatar;
                } catch (error) {
                    console.log(error);
                }
                return result;
            }))

            res.send({status: 0, data: finalResults});
        }
    })

app.route('/friends')
    .post(async (req, res) => {
        const username = req.session.username;
        if (username === undefined) res.send(getResultByStatus(1));
        else {
            try {
                const receiver = req.body.receiver;
                const result = await support.addFriendRequest(username, receiver);
                if (result === 0) res.send({status: 0});
            } catch (error) {
                res.send(getResultByStatus(2));
            }
        }
    });

app.route('/friend-request')
    .post(async (req, res) => {
        const username = req.session.username;
        if (username === undefined) res.send(getResultByStatus(1));
        else {
            const sender = req.body.sender;
            const type = req.body.type;
            try {
                console.log(sender);
                console.log(type);
                const result = await support.handleFriendRequest(username, sender, type);
                if (result === 0) res.send({status: 0});
            } catch (error) {
                console.log(error);
                res.send(getResultByStatus(2))
            }   
        }
    })

app.route('/group')
    .post(async (req, res) => {
        const username = req.session.username;
        if (username === undefined) res.send(getResultByStatus(1));
        else {
            const groupName = req.body.groupName;
            const visibility = req.body.visibility;

            try {
                const result = await support.createGroup(groupName, username, visibility);
                res.send({status: 0, result: result});
            } catch (error) {
                console.log(error);
                res.send(getResultByStatus(2));
            }
        }
        
    })

const PORT = configs.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})