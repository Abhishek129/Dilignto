const mongoose = require('mongoose');

    const User = mongoose.model('User', new mongoose.Schema({
        fname: String,
        lname: String,
        username:String,
        email:String,
        password:String,
        type : String,
        desciption : String,
        Nationality:String,
        Address :String,
        City:String,
        dob:String,        
    }));
exports.User = User;