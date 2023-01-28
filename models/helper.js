const mongoose = require('mongoose');

const Helper = mongoose.model('Helper', new mongoose.Schema({
    userid : String,
    hourly_rate : String,
    skills : [String],
    tagline :String,
    category :String,
    
}));

exports.Helper = Helper;