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

io.on("connection", socket => {
  // Log whenever a user connects
  console.log("user connected");

  // Log whenever a client disconnects from our websocket server
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  // When we receive a 'message' event from our client, print out
  // the contents of that message and then echo it back to our client
  // using `io.emit()`
  socket.on("message", message => {
    io.emit("message", message);
  });
});

http.listen(port,function(){
  console.log('RESTful API server started on: ' + port);
});

