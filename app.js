var express = require('express');
var bdy_parser = require('body-parser');
var session = require('express-session');
var db = require('./db_connection/db.js');
var mongoose = require('mongoose');
var route = require('./routes/routes.js');
var user = require('./routes/user.js');
var router = express.Router();
var chalk = require('chalk');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bdy_parser.json());
app.use(bdy_parser.urlencoded({extended:false}));

app.use(session({secret:'jdjadaldhkaagdhfjgfzfg', resave:true, saveUninitialized:true}));
app.get('/',route.index);
app.get('/login', route.login);
app.get('/register', route.register);
app.post('/creatUser', user.regUser);
app.post('/authenticate', user.validate);
app.post('/creatQuery', user.query);
app.get('/queries',user.displayQuery);
app.get('/ask', user.checkLogged);
app.post('/queries/:id',user.comment);
app.get('/logout',user.logout);
app.post('/search', user.search);

var port = process.env.PORT || 8080;

var server = app.listen(port, function(req,res){
  console.log('server starting on http://localhost:'+port);
});
