var mongoose = require('mongoose'),
User = mongoose.model('User'),
crypto = require('crypto'),
langMap = require('../language')
lodash = require('lodash'),
lodashPick = require('lodash.pick'),
axios = require('axios'),
https = require('https'),
os = require('os'),
//client = require('../socket'),
myLangMap = require('../language')

var jDoodleClientID = "fe0e6da657e816473e2dece16a3851ca";
var jDoodleClientSecret = "3cc1302bbda2100b2426ad3a05fa246ddca4cfab3282a9df6694ef254e1e611f";

exports.signUp = function (req, res) {
    var desig;
    var re = /(a|b)*abb/i;

    // console.log(re.test(req.body.usn))
    if(re.test(req.body.usn))
        desig = "teacher"
    else
        desig = "student"

    var new_user = new User({
    email : req.body.email,
    usn : req.body.usn,
    password : req.body.password,
    designation: desig
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
    console.log(req.body);
    User.find({usn : req.body.usn, password : req.body.password})
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
    // console.log(req);
    let langs = Array.from( langMap.keys() );
    // console.log(langs);
    // console.log({'langMap': langs});
    res.status(200).send({'langMap': langs});
}

exports.runCode = function(req,res) {
    var jDoodleEndPoint = "http://api.jdoodle.com/execute";
    // var body = _.pick(req.body, ['lang','program']);

    // try {
        var obj = myLangMap.get(req.body.lang.toString());
        // console.log(obj);
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

exports.getIpAdd = function(req,res){
    var ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
            }

            if (alias >= 1 && ifname=="wlp19s0") {
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, iface.address);
                return res.status(200).send({'ifname':ifname,'address':iface.address})
            } else {
            // this interface has only one ipv4 adress
            console.log(ifname, iface.address);
            return res.status(200).send({'ifname':ifname,'address':iface.address})
            }
            ++alias;
        });
    });
}
        