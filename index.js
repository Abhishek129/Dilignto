const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');
const users = require('./routes/users');
const task = require('./routes/task');
const app = express();
var session = require('express-session');

app.set('view engine', "ejs")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0",{useNewUrlParser:true});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use('/', users);

// app.use('/seller-post-task', task)

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server has started successfully.");
})