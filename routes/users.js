const { User } = require('../models/user');
const { Helper } = require('../models/helper');
const { Task } = require('../models/task');
const { Task_Bid } = require('../models/task_bid');
const express = require('express');
const router = express.Router();
const session = require('express-session')
const multer = require("multer");
const path = require('path');
const fs = require("fs");

const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.set("view engine","ejs");
 
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}${file.originalname}`);
    }
  })
 
var upload = multer({ storage: storage })

var msg = "";
var current = "";

router.get('/', async (req, res) => {

    res.render("home", { user_register: req.session.user_register, user: req.session.user });
    req.session.user_register = 0;
    req.session.save()
})

router.get('/dashboard', async (req, res) => {
    if (req.session.user) {
        current = 'dashboard';
        active = 'dashboard';
        if (req.session.user.type == 'helper') {
            res.render("dashboard", { current: current, user: req.session.user });
        } else {
            res.render("seller-dashboard", { current: current, active: active, user: req.session.user });
        }
    } else {
        res.redirect("/");
    }

})

router.get('/dashboard-settings', async (req, res) => {

    if (req.session.user) {
        var user = await User.findOne({ _id: req.session.user._id });
        if (user) {
            req.session.user = user;
            var helper = await Helper.findOne({ userid: req.session.user._id });
            req.session.helper = helper;
            current = 'dashboard'

            res.render("dashboard-settings", { user_updated: req.session.notify_user_updated, current: current, user: req.session.user, helper: req.session.helper })
            req.session.notify_user_updated = 0;
            req.session.save()
        }
    } else {
        res.redirect("/");
    }


})
router.get('/tasks-list', async (req, res) => {
    if (req.session.user) {
        current = 'task';
        var task = await Task.find({ userid: req.session.user._id });
        var task_bid = await Task_Bid.find({ userid: req.session.user._id });
        if(task){
            res.render("tasks-list", { current: current, user: req.session.user, task: task ,task_bid:task_bid})
        }
    }
    else {
        res.redirect("/");
    }
})

router.get('/single-tasks-list/:id', async (req, res) => {
    if (req.session.user) {
        current = 'task';
        var id = req.params['id']
        req.session.task = await Task.findOne({ _id: id });
        res.redirect("/single-tasks-details");
        // res.render("single-task-page", { current: current, user: req.session.user });
    }
    else {
        res.redirect("/");
    }
})
router.get('/single-tasks-details', async (req, res) => {
    if (req.session.user) {
        current = 'task';
        res.render("single-task-page", { current: current, user: req.session.user,task:req.session.task });
    }
    else {
        res.redirect("/");
    }
})

router.get('/freelancers-list', async (req, res) => {
    if (req.session.user) {
        current = 'freelancer';
        active = 'freelancer';
        res.render("freelancers-list", { current: current, active: active, user: req.session.user });
    }
    else {
        res.redirect("/");
    }
})
router.get('/seller-manage-tasks', async (req, res) => {
    if (req.session.user) {
        current = 'tasks';
        active = 'managetask';
        var task = await Task.find({ userid: req.session.user._id });
        if(task){
            res.render("manage-tasks", { current: current, user: req.session.user, task: task })
        }
    }
    else {
        res.redirect("/");
    }
})
router.get('/seller-manage-bidders', async (req, res) => {
    if (req.session.user) {
        current = 'tasks';
        active = 'managetask';
        res.render("manage-bidders", { current: current, active: active, user: req.session.user });
    }
    else {
        res.redirect("/");
    }
})
router.get('/seller-active-bids', async (req, res) => {
    if (req.session.user) {
        current = 'tasks';
        active = 'activebid';
        var active_bid_list = await Task_Bid.find({ userid: req.session.user._id });
        var task = await Task.find({ userid: req.session.user._id });
        if(active_bid_list){
            res.render("seller-active-bids", { current: current, active: active, user: req.session.user,active_bid_list: active_bid_list,task: task });
        }
        
    }
    else {
        res.redirect("/");
    }
})
router.get('/seller-post-task', async (req, res) => {
    if (req.session.user) {
        current = 'tasks';
        active = 'posttask';
        res.render("post-task", { current: current, active: active, user: req.session.user, skills: req.session.skillarray });
    }
    else {
        res.redirect("/");
    }
})

router.get('/error', async (req, res) => {
    res.render("error", { msg: msg });
})
router.get('/register-success', async (req, res) => {
    res.render("register-success", { msg: msg });
})

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect("/");
})
router.post('/skillsadd', async (req, res) => {
    // console.log("1:"+req.body.skills);
    Helper.updateOne(
        { userid: req.session.user._id },
        { $push: { skills: req.body.skills } },
        function (err, foundList) {
            res.redirect("/dashboard-settings");
        })

})
router.get('/skillsremove/:skill', async (req, res) => {
    var skill = req.params['skill']
    Helper.updateOne(
        { userid: req.session.user._id },
        { $pull: { skills: skill } },
        function (err, foundList) {
            res.redirect("/dashboard-settings");
        })

})
router.post('/userProfile', async (req, res) => {
    if (req.session.user) {
        User.updateOne(
            { _id: req.session.user._id },
            {
                $set: { fname: req.body.fname, lname: req.body.lname, username: req.body.username, email: req.body.email, type: req.body.usertype, desciption: req.body.desciption, Nationality: req.body.nationality, Address: req.body.address, City: req.body.city, dob: req.body.dob }
            },

            function (err, foundList) {
                if (!err) {
                    Helper.updateOne(
                        { userid: req.session.user._id },
                        { $set: { hourly_rate: req.body.hourly_rate, tagline: req.body.tagline, category: req.body.category } },
                        function (err, foundList) {
                            if (!err) {
                                req.session.notify_user_updated = 1;
                                res.redirect("/dashboard-settings");
                            }
                        }
                    )
                }
            }
        )

    } else {
        res.redirect("/");
    }
});

router.post('/authorize', async (req, res) => {
    // Check if this user details are correct
    var user = await User.findOne({ username: req.body.login_username, password: req.body.login_password });
    if (user) {
        req.session.user = user;
        req.session.helper = helper;
        var helper = await Helper.findOne({ userid: user._id });

        if (!helper) {
            const helper = new Helper({
                userid: user._id
            });
            await helper.save();
            var helper_session = await Helper.findOne({ userid: user._id });
            if (helper_session) {
                req.session.helper = helper_session;
            }
        }
        req.session.helper = helper;
        if (user.fname == '' || user.lname == '' || user.email == '') {
            res.redirect("/dashboard-settings");
        } else {
            res.redirect("/dashboard");
        }
    }
    else {
        msg = 'Username or Password is incorrect !';
        res.redirect("/error");
    }
});

router.post('/post-task',upload.single('file_upload'), async (req, res) => {
    if (req.session.user) {
        // current = 'dashboard';
        // active = 'dashboard';

        const task = new Task({
            userid: req.session.user._id,
            task_name: req.body.task_name,
            category: req.body.category,
            location: req.body.location,
            min_budget: req.body.min_budget,
            max_budget: req.body.max_budget,
            type_of_project: req.body.project_type,
            attachment:req.file.path,
            description: req.body.description
        })
        await task.save();
        res.redirect("/seller-manage-tasks");
    }
    else {
        res.redirect("/");
    }
});

router.post('/auth', async (req, res) => {
    // Check if this user already exisits
    let user = await User.findOne({ username: req.body.register_username });
    if (user) {
        msg = 'User already exisits!';
        res.redirect("/error");
    }
    else {
        // Insert the new user if they do not exist yet
        if (req.body.usertype == '') {
            var type = 'helper'
        } else {
            var type = req.body.usertype;
        }
        const user = new User({
            username: req.body.register_username,
            password: req.body.register_password,
            type: type
        });
        await user.save();
        req.session.user_register = 1;
        res.redirect("/");
        msg = '';
    }
});

router.post('/bid-task/', async (req, res) => {
    if (req.session.user) {
        // current = 'dashboard';
        // active = 'dashboard';

        const bid_task = new Task_Bid({
            userid: req.body.userid,
            taskid: req.body.taskid,
            bid_rate: req.body.bid_value,
            delivery_time : req.body.delivery_number +' '+req.body.delivery_type
        })
        await bid_task.save();
        res.redirect("/dashboard");
    }
    else {
        res.redirect("/");
    }
});


module.exports = router;