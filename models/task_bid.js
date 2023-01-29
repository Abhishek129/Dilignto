const mongoose = require('mongoose');

const Task_Bid = mongoose.model('Task_Bid', new mongoose.Schema({
    sellerid : String,
    helperid:String,
    taskid : String,
    rate: String,
    delivery_time : String,
    status : String
    
}));

exports.Task_Bid = Task_Bid;