const { User } = require('../models/user');
const { Task } = require('../models/helper');
const express = require('express');
const router = express.Router();

router.post('/post-task', async (req, res) => {
    if (req.session.user) {
        print("TEst")
        current = 'dashboard';
        active = 'dashboard';
        print("id : ",req.session.user._id)
        print("name : ",req.body.task_name)
        print("location : ",req.body.location)
        // const task = new Task({
        //     userid : req.session.user._id,
        //     task_name:req.body.task_name,
        //     // category :String,
        //     location :req.body.location,
        //     // min_budget : String,
        //     // max_budget : String,
        //     // skills : [String],
        //     // description : String
        // })
        res.render("dashboard", { current: current, user: req.session.user });
    }
    else {
        res.redirect("/");
    }
    // let user = await User.findOne({ username: req.body.register_username });
    // if (user) {
    //     msg = 'User already exisits!';
    //     res.redirect("/error");
    // } else {
    //     // Insert the new user if they do not exist yet
    //     if(req.body.usertype==''){
    //         var type = 'helper'
    //     }else{
    //         var type = req.body.usertype;
    //     }
    //     const user = new User({
    //         username: req.body.register_username,
    //         password: req.body.register_password,
    //         type: type
    //     });
    //     await user.save();
    //     req.session.user_register = 1;
    //     res.redirect("/");
    //     msg = '';
    // }
});

module.exports = router;