var express = require('express');//libraiie express.js
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var session = require('express-session');
var url = require('url');//appel à la librairie url qui permet de créer des adresses
var querystring = require('querystring');//permet de parser les paramètres de requêtes
var http = require('http');//node http lib


var app = express();
// utiliser le module de parsing pour créer une variable "body automatiquement"
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));



app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil');
});
//on recoit un post
app.post('/todo/add', function(req, res) {
	
	var dodo = req.body.todo;
	if(req.session.toDoList){
		
		req.session.toDoList.push(dodo);
		
	}else{
		req.session.toDoList=new Array();//array stocké dans une variabled de session, chaque user aura donc une liste différente
		req.session.toDoList.push(dodo);
	}
	res.redirect("/todo/");
	
	
});

app.get('/todo', function(req, res) {
	if(req.session.toDoList && req.session.toDoList.length > 0){
		res.render('todo.ejs',{todo:req.session.toDoList});
	}else{
		req.session.toDoList;
		res.render('todo.ejs');
    }
});

app.get('/todo/remove/:item', function(req, res) {
	//var params = querystring.parse(url.parse(req.url).query);
	var index = req.params.item;
	if (index > -1) {
		req.session.toDoList.splice(index, 1);
	}
	res.redirect("/todo/");
	
});



app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

app.listen(8080);