var express = require('express');

var app = express();
var port=3036;

var files = require("fs");
var server=require("http").createServer(app);
server.listen(port);
exports=module.exports={};
console.log("Server gestarted");


 io = require('socket.io').listen(server);

 clients={};

io.on('connection', function (socket) {
    socket.on('addClient', function (data) {
	//console.log('client angemeldet',data.clientName)
	clients[data.clientName]=socket.id;

    });
});
exports.io=io;





channel={"Groups":"Groups","InventarItems":"InventarItems","MapItems":"MapItems","Player":"Player","quest":"Quests","Roles":"Roles","Sequences":"Sequences"};

