var express = require('express');

var app = express();
var port=3036;

var files = require("fs");
var server=require("http").createServer(app);
server.listen(port);

console.log("Server gestarted");


io = require('socket.io').listen(server);

var clients={};

io.on('connection', function (socket) {
    socket.on('addClient', function (data) {
	for(i in interval[data.clientName]){
	    clearInterval(interval[data.clientName][i]);
	}
	clients[data.clientName]=socket.id;

    });
});






channel={"Groups":interval,"InventarItems":interval,"MapItems":interval,"Player":interval,"Quests":interval,"Roles":interval,"Sequences":interval};

