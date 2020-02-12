var mongoose = require('mongoose'),
User = mongoose.model('User'),
crypto = require('crypto'),
langMap = require('../language')
lodash = require('lodash'),
lodashPick = require('lodash.pick'),
axios = require('axios'),
myLangMap = require('../language')

var jDoodleClientID = 'fe0e6da657e816473e2dece16a3851ca';
var jDoodleClientSecret = '3cc1302bbda2100b2426ad3a05fa246ddca4cfab3282a9df6694ef254e1e611f';

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
    var jDoodleEndPoint = "https://api.jdoodle.com/execute";
    var body = _.pick(req.body, ['lang','program']);

    try {
        var obj = myLangMap.get(body.lang);

        const runRequestBody = {
            script : body.program,
            language: body.lang,
            versionIndex: obj.version,
            clientId: jDoodleClientID,
            clientSecret: jDoodleClientSecret
        };

        axios
            .post(jDoodleEndPoint,runRequestBody)
            .on('error', (error) => { 
                console.log('request.post error', error);
                return res.status(400).send(error);  
            })
            .on('data', (data) => {
                // data is of Buffer type (array of bytes), need to be parsed to an object.
                const parsedData = JSON.parse(data.toString());
                if(parsedData.error) {
                    return res.status(400).send(parsedData);  
                } else {
                    return res.status(200).send({runResult: parsedData});
                }      
            })         
    }
    catch (error) {
        console.log('request fail');
        return res.status(400).send('request fail');
    }   
            //axios({   method: 'post',   url: '/login',   data: {     firstName: 'Finn',     lastName: 'Williams'   } });


}