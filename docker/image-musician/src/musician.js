/**
 * tentative d'implementation client UDP version 0.1
 */

let MULTICAST_ADDRESS = '239.255.36.36';
let UDP_PORT = 9236

import { createSocket } from "dgram";
import uuid from "uuid/v4";
let UUID = uuid();
let process;
let arg;
let message;

arg = process.argv[2];
var instrument = new Map();
instrument.set("piano", "ti-ta-ti");
instrument.set("trumpet", "pouet");
instrument.set("flute", "trulu");
instrument.set("violin", "gzi-gzi");
instrument.set("drum", "boum-boum");

function send(){
    let udp = createSocket("udp4");
    message = JSON.stringify({id : UUID, name : arg, sound : instrument.get(arg)})
    udp.send(message,0,message.length,UDP_PORT,MULTICAST_ADDRESS,function(err){
        if(err) throw err;
        udp.close;
    })
}

setInterval(send,1000);