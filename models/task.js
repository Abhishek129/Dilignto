const mongoose = require('mongoose');

const Task = mongoose.model('Task', new mongoose.Schema({
    userid : String,
    task_name:String,
    category :String,
    location :String,
    min_budget : String,
    max_budget : String,
    type_of_project : String,
    attachment:String,
    description : String
    
}));

exports.Task = Task;