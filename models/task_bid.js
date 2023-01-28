const mongoose = require('mongoose');

const Task_Bid = mongoose.model('Task_Bid', new mongoose.Schema({
    userid : String,
    taskid : String,
    bid_rate: String,
    delivery_time : String,
    
}));

exports.Task_Bid = Task_Bid;