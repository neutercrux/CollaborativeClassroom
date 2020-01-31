var mongoose = require('mongoose')
var Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/user')

var UserSchema = new mongoose.Schema({
    usn : {
        type : String ,
        required : true
    } ,
    email : {
        type : String ,
        required : true 
    } ,
    password :{
        type : String ,
    }
})
module.exports = mongoose.model('User' ,UserSchema)