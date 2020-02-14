var mongoose = require('mongoose'),
User = mongoose.model('User'),
crypto = require('crypto'),
langMap = require('../language')
lodash = require('lodash'),
lodashPick = require('lodash.pick'),
axios = require('axios'),
https = require('https'),
myLangMap = require('../language')

var jDoodleClientID = "fe0e6da657e816473e2dece16a3851ca";
var jDoodleClientSecret = "3cc1302bbda2100b2426ad3a05fa246ddca4cfab3282a9df6694ef254e1e611f";

exports.signUp = function (req, res) {

    var new_user = new User({
    email : req.body.email,
    usn : req.body.usn,
    password : req.body.password
    });
  
    // var re = /^[0-9A-Fa-f]{40}$/i;
    if(!(req.body.password)){
        console.log("password is not found")
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
    console.log(req.params);
    User.find()
        .then(user => {
        console.log(user);
        if(user.length!=1){
            console.log("Not Found");
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



exports.getLangs = function (req,res) {
    console.log(req);
    let langs = Array.from( langMap.keys() );
    console.log(langs);
    console.log({'langMap': langs});
    res.status(200).send({'langMap': langs});
}

exports.runCode = function(req,res) {
    var jDoodleEndPoint = "http://api.jdoodle.com/execute";
    // var body = _.pick(req.body, ['lang','program']);

    // try {
        var obj = myLangMap.get(req.body.lang.toString());
        console.log(obj);
        const runRequestBody = JSON.stringify({
            "script" : req.body.program,
            "language": obj.lang,
            "versionIndex": obj.versionIndex,
            "clientId": jDoodleClientID,
            "clientSecret": jDoodleClientSecret
        });
        const options = {
            hostname: 'api.jdoodle.com',
            port: 443,
            path: '/execute',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': runRequestBody.length
            }
          }

        const requ = https.request(options, (resp) => {
            //console.log(`statusCode: ${resp.statusCode}`)
        
            resp.on('data', (d) => {
            // process.stdout.write(d)
                //console.log(JSON.parse(d.toString()));
                let output = JSON.parse(d.toString());
                return res.status(200).send(output);
            })
        })
        
        requ.on('error', (error) => {
            console.error(error)
            return res.status(400).send();

        })
        
        requ.write(runRequestBody)
        requ.end()
                     
    }
 
        


// }