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

// app.use(express.static('views/CollaborativeClassroom'))
// app.set('view engine', 'html');
// app.engine('html', require('ejs').renderFile);

function Person(usn, socket_id, designation){
  this.usn = usn;
  this.socket_id = socket_id;
  this.designation = designation;
}

var activeUsers = new Array();

var teacherUser;

var routes = require('./routes/Routes'); //importing route
routes(app); //register the route

io.on("connection", socket => {
  // Log whenever a user connects
  console.log("user connected");
  // console.log(socket);

  // Log whenever a client disconnects from our websocket server
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  // When we receive a 'message' event from our client, print out
  // the contents of that message and then echo it back to our client
  // using `io.emit()`
  socket.on("message", message => {
    // console.log(message);
    // console.log(message.status);
    if(message.status!=undefined)
    {
      if((message.status == 0)&&(teacherUser))
      {
        console.log(teacherUser.socket_id)
        message.socket_id = socket.id;
        socket.broadcast.to(teacherUser.socket_id).emit("message", JSON.stringify(message));
      }
      else if((message.status == 1)&&(teacherUser))
      {
        console.log(message.socket_id);
        socket.broadcast.to(message.socket_id).emit("message", JSON.stringify(message));
      }
    }
    else
    {
      socket.broadcast.emit("message", JSON.stringify(message));
    }
  });

  socket.on("join", message => {
    // console.log(message);
    if(message.designation !== 'teacher')
    {
      var x = new Person(message.usn, socket.id, message.designation);
      activeUsers.push(x)
    }
    else
    {
      var x = new Person(message.usn, socket.id, message.designation);
      teacherUser = x;
    }
    // console.log(activeUsers);
    console.log(teacherUser);
  });

  socket.on('new-doubt', (message) => {
    io.emit('new-doubt', message);
  });

});

http.listen(port,function(){
  console.log('RESTful API server started on: ' + port);
});

