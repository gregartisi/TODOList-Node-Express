var express = require('express');//libraiie express.js
var jquery = require('jquery');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var session = require('express-session');
var url = require('url');//appel à la librairie url qui permet de créer des adresses
var querystring = require('querystring');//permet de parser les paramètres de requêtes
var http = require('http');//node http lib


var app = express();
var server = require('http').createServer(app);//création d'un server à partir de l'app express
// Chargement de socket.io
var io = require('socket.io').listen(server);
//todo list
var todoList= new Map();
var sizeList =0;

// utiliser le module de parsing pour créer une variable "body automatiquement", cette variable permet de récupérer les paramètres de requête
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(express.static('public'))


app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil');
});

app.get('/todo', function(req, res) {
	
		res.render('todo.ejs',{todo:todoList});
	
});


// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log("conexion d'un client");
	
	/*edit d'une task*/
	socket.on('edit', function (task) {
        todoList[task.task]=task.textT;
		socket.emit('todoList',todoList);
		socket.broadcast.emit('todoList',todoList); // Send message to everyone BUT sender
		
    });	
	/*ajout d'une task renvoyé vers tous les clients*/
	socket.on('add', function (task) {
        console.log(task);
		todoList.set(sizeList,task);
		num = sizeList;
		 
		console.log(task+"  "+num);
		socket.emit('task',{'texte':task,'num':num});
		socket.broadcast.emit('task',{'texte':task,'num':num}); // Send message to everyone BUT sender
		sizeList ++;
    });	
	
	socket.on('remove', function (task) {
        console.log(task);
		todoList.delete(task);
		
		socket.emit('del',task);
		socket.broadcast.emit('del',task); // Send message to everyone BUT sender
		
    });	
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

server.listen(8080, "127.0.0.1");