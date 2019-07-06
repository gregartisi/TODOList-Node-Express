var express = require('express');//libraiie express.js
var jquery = require('jquery');
var bodyParser = require("body-parser");
var url = require('url');//appel à la librairie url qui permet de créer des adresses
var querystring = require('querystring');//permet de parser les paramètres de requêtes
var http = require('http');//node http lib


var app = express();
var server = require('http').createServer(app);//création d'un server à partir de l'app express

// Chargement de socket.io
var io = require('socket.io').listen(server);


//todo list sous forme de map clé/valeur(ES6)
var todoList= new Map();
var sizeList =0; //clé, numéro unique incrémenté à chaque ajout

// utiliser le module de parsing pour créer une variable "body automatiquement", cette variable permet de récupérer les paramètres de requête
app.use(bodyParser.urlencoded({ extended: true }));
//initialisation d'un dossier public ou se trouve des librairies js et css
app.use(express.static('public'))

//routage express
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
		socket.emit('task',{'texte':task,'num':num, 'count':todoList.size});
		socket.broadcast.emit('task',{'texte':task,'num':num, 'count':todoList.size}); // Send message to everyone BUT sender
		sizeList ++;
    });	
	
	socket.on('remove', function (task) {
        console.log(task);
		todoList.delete(task);
		
		socket.emit('del',{'task':task,'count':todoList.size});
		socket.broadcast.emit('del',{'task':task,'count':todoList.size}); // Send message to everyone BUT sender
		
    });	
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

server.listen(8080, "127.0.0.1");