const express = require('express');

const configs = require('./configs');
const session = require('express-session');
const mongoose = require('mongoose');

mongoose.connect(configs.db_server);


const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'Giang Lake ngok ngech',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

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

app.route('/login')
    .post((req, res) => {

    })




const PORT = configs.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})