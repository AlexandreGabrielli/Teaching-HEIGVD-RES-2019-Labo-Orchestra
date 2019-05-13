var HOST = '0.0.0.0';
var MULTICAST_ADDRESS = '239.255.36.36';
var UDP_PORT = 8888;
var TCP_PORT = 2205;

var dgram = require("dgram");
var moment = require("moment");
var upd_server = dgram.createSocket("udp4");
var net = require('net');

Musiciens = new Map();

class Musicien {
    constructor(uuid, instrument, activeSince) {
        this.uuid = uuid;
        this.instrument = instrument;
        this.activeSince = activeSince;
    }
}

/**
 * TCP server
 */

tcp_server = net.createServer(onClientConnected);
tcp_server.listen(TCP_PORT, HOST);

function onClientConnected(socket){
    var musicienArray = []

    for([key,value] of Musiciens){
        musicienArray.push(value);
    }

    socket.write(JSON.stringify(musicienArray));
    socket.destroy();
}

/**
 * UDP server
 */

 upd_server.bind(UDP_PORT,function(){
     upd_server.addMembership(MULTICAST_ADDRESS);
 });


 upd_server.on('message',function(message,remote){
     var json = JSON.parse(message.toString());
     Musiciens.set(json.id,new Musicien(json.id,json.name,moment().format("YYYY-MM-DD HH:mm:ss")));
 })

 function check(){
     for(var [key,value] of Musiciens){
         var now = moment();
         var rec = moment(value.activeSince);

         var diff = moment.duration(now.diff(rec)).as("seconds");

         if(diff > 5){
             Musiciens.delete(key);
         }
     }
 }

 setInterval(check,1000);