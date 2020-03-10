var express = require('express'),
app = express(),
port = process.env.PORT || 3000,
mongoose = require('mongoose'),
User = require('./models/Model'), //created model loading here
bodyParser = require('body-parser'),
http = require('http').Server(app),
io = require('socket.io')(http),
langMap = require('./language');
  
app.use(bodyParser.urlencoded({limit : '50MB', extended: true }));
app.use(bodyParser.json({limit:'50MB'}));

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin','*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods','GET','PUT','POST','DELETE','OPTIONS');
  next();
});

var routes = require('./routes/Routes'); //importing route
routes(app); //register the route

io.on('connection',function(socket){
  console.log('connected')
  
})

http.listen(port,function(){
  console.log('RESTful API server started on: ' + port);
});

