const express = require('express');

const configs = require('./configs');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with the allowed origin(s)
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
                                dob: null,
                                avatar: null,
                                gender: null,
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
            const results = await Conversation.Model.find({usernames: {$in: [myUsername]}});
            const myInterlocutorsInforPromise = results.map(async result => {
                const myInterlocutor = (result.usernames[0] === myUsername) ? result.usernames[1] : result.usernames[0];
                const interlocutorInforDoc = await support.findInterlocutor(myInterlocutor);
                const lastMessage = result.messages[result.messages.length-1];

                const interlocutorInfor = interlocutorInforDoc.toObject();

                interlocutorInfor.lastMessage = lastMessage.content;
                interlocutorInfor.receivingTime = lastMessage.sent_at;
                
                return interlocutorInfor;
            });

            const myInterlocutorsInfor = await Promise.all(myInterlocutorsInforPromise);
            res.send({interlocutor: myInterlocutorsInfor, conversations: results});
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

app.route('/conversation')
    .post(async (req, res) => {
        
    });

app.route('/notifications/:type')
    .get(async (req, res) => {
        const type = req.params.type;
        const username = req.session.username;
        if (username === undefined) res.send(getResultByStatus(1));
        else {
            let result;
            switch (type) {
                case "friend-requests":
                    result = await support.findFriendRequestNotifications(username);
                    break;
            }

            res.send({status: 0, data: result});
        }
        
    })

const PORT = configs.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})