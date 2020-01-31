var mongoose = require('mongoose'),
User = mongoose.model('User'),
crypto = require('crypto')

exports.signUp = function (req, res) {

    var new_user = new User({
    email : req.body.email,
    usn : req.body.usn,
    password : req.body.password
    });
  
    var re = /^[0-9A-Fa-f]{40}$/i;
    if(!re.test(req.body.password)){
        console.log("password is not sha1")
        res.status(400).send({});
    }
    else{
        User.find({usn : req.body.usn})
        .then(data => {
            if(data.length!=0){
                console.log("USN Exists!")
                res.status(400).send({});
            }
            else{
            new_user.save()
                .then(user => {
                    res.status(201).send({});
                    console.log('Student added successfully')
                })
                .catch(err => {
                    console.log("Bad Request");
                    res.status(400).send({});
                });
            }
        })
        .catch(err => {
            console.log("Bad Request");
            res.status(400).send({});
        })
    }
};

exports.loginUser = function (req,res) {
    User.find({usn : req.body.usn, password : req.body.password})
        .then(user => {
        console.log(user);
        if(user.length!=1){
            console.log("No Found");
            res.status(204).send({});
        }
        else{
            console.log("user found")
            res.status(200).json(user);
        }
    })
    .catch(err => {
        console.log("Error in finding user in DB");
        res.status(400).send({});
    })
  };