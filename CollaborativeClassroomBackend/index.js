var express = require('express'),
app = express(),
port = process.env.PORT || 3000,
mongoose = require('mongoose'),
User = require('./models/Model'), //created model loading here
bodyParser = require('body-parser');
  
app.use(bodyParser.urlencoded({limit : '50MB', extended: true }));
app.use(bodyParser.json({limit:'50MB'}));

app.use(function(req,res,next){
  //res.setHeader('Access-Control-Allow-Origin','http://18.213.37.179');
  res.setHeader('Access-Control-Allow-Methods','GET','PUT','POST','DELETE','OPTIONS');
  next();
});

var routes = require('./routes/Routes'); //importing route
routes(app); //register the route


app.listen(port);

console.log('RESTful API server started on: ' + port);