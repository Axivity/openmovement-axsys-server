/**
 * Created by Praveen on 08/09/2015.
 */

import * as io from 'socket.io-client';

function setup() {
    console.log(io);
    var sock = io.connect("http://localhost:9693");
    console.log(sock);
    console.log("sock");

    // TODO: Find a sensible place to put key (may be a config file?)
    sock.emit('ax-register', { "key": "Booo"});
}

setup();

