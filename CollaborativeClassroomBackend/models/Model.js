var mongoose = require('mongoose')
var Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/user')

var UserSchema = new mongoose.Schema({
    usn : {
        type : String ,
        required : true
    },
    email : {
        type : String ,
        required : true 
    } ,
    password :{
        type : String 
    },
    designation:{
        type : String,
        required : true
    }
})

module.exports = mongoose.model('User' ,UserSchema)