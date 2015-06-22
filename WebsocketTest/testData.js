var express = require('express');

var app = express();
var port=3035;

var files = require("fs");
var server=require("http").createServer(app);
server.listen(port);

console.log("Server gestarted");
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname));
io = require('socket.io').listen(server);

var clients={};
interval={};
jsonO={};
io.on('connection', function (socket) {
    
socket.on('JSONFile', function (data) {		
files.readFile(__dirname+'/JSON/'+data+".json","utf8",function(err,file){
socket.emit('JSONFile', file);
              });
	});

socket.on('addClient', function (data) {
    for(i in interval[data.clientName]){
	clearInterval(interval[data.clientName][i]);
    }
clients[data.clientName]=socket.id;
interval[data.clientName]={};
jsonO[data.clientName]={};

function readFile(fileName){
    files.readFile(__dirname+'/JSON/'+fileName,"utf8",function(err,file){	       
               if(fileName.search("~")==-1){
               console.log(fileName);
	       var fileN=fileName.split(".");
	       var nameC=fileN[0];
	       jsonO[data.clientName][nameC]=JSON.parse(file);	
}        
		                 });
}

files.readdirSync(__dirname+'/JSON/').forEach(function(fileName) {
    readFile(fileName);
});
for (index in channel){
    channel[index](data.clientName,index);
}
    
  	}
);
});

getKeys=function(clientName,name){
  var  keys=[];
   for (var n in jsonO[clientName]){
       if (n.search(name)!=-1){
	   keys.push(n);
      }
   }
   return keys;
};

interval=function (clientName,channel){
var toogle=function (){
    var keys=getKeys(clientName,channel);
    var length=keys.length;
    var key=parseInt(Math.random()*length);
    io.to(clients[clientName]).emit(channel,jsonO[clientName][keys[key]]); 
};
interval[clientName][channel]= setInterval(toogle,1000);
 
};




channel={"Groups":interval,"InventarItems":interval,"MapItems":interval,"Player":interval,"Quests":interval,"Roles":interval,"Sequences":interval};

