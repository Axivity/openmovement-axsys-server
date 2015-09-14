/**
 * Created by Praveen on 08/09/2015.
 */

import * as io from 'socket.io-client';

var AX = window.AX || {};

function API(clientKey) {
    clientKey = clientKey || "Booo";
    var sock = io.connect("http://localhost:9693");
    // TODO: Find a sensible place to put key (may be a config file?)
    sock.emit('ax-register', { "key": clientKey } );

    /*
    * */
    this.getDevices = (callback) => {
        sock.emit('ax-devices:getAll', (devices) => {
            callback(devices);
        });
    }

}

// export API
AX.API = API;

// attach it to global window
window.AX = AX;


