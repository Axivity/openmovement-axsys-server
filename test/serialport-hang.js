/**
 * Created by Praveen on 09/10/2015.
 */

var s = require('serialport');
var ee = require('events');


s.list(function(err, ports) {
    console.log("Number of ports available: " + ports.length);

    ports.forEach(function(port) {
        var cName = port.comName,
            sp,
            count = 0;
        //console.log(cName);

        sp = new s.SerialPort(cName, {}
            //, false // This is to not open the port immediately
        );

        sp.open(function(err) {
            if(err) {
                console.error('Cannot open port');
                console.error(err);

            } else {
                if(sp.isOpen()) {
                    setTimeout(function tLed() {
                        console.log('The port name is ' + cName + ' count ' + count);
                        var c = count % 2 ? 1 : 2;

                        sp.write("LED=" + c + "\r\n", function(err) {
                            console.log('Written');

                            sp.drain(function(err) {
                                console.log('Drained');
                                if (err) {
                                    console.log("Cannot write to port");
                                    console.error(err);

                                } else {
                                    console.log("Written to port " + cName);
                                    count++;
                                    tLed();


                                }
                            });
                        });



                    }, 2000);
                    toggleLED(sp, cName, count);
                    count++;
                    //setInterval(function() {
                    //
                    //    count += 1;
                    //}, 2000);
                }

            }

        });



        //console.log("Is port open " + sp.isOpen());
        //setInterval(function() {
        //    toggleLED(sp, cName, count);
        //    count += 1;
        //}, 2000);

        //sp.close();
    });
});


function toggleLED(sp, cName, count) {
    //sp.once('data', function(data) {
    //    if (data) {
    //        console.log("Retrieved data " + data);
    //        console.log(count);
    //    }
    //
    //    sp.close();
    //});

    // Port is always open now - so no need to check
    //if(!sp.isOpen()) {
    //    sp.open(function(err) {
    //        if(err) {
    //            console.log("Port cannot be opened manually");
    //
    //        } else {
    //            console.log("Port has been opened " + cName);
    //            writeLED(sp, cName, count);
    //        }
    //
    //    });
    //
    //} else {
        //console.log("Port is already open " + cName);
        writeLED(sp, cName, count);
    //}
}


function writeLED(sp, cName, count) {
    console.log('The port name is ' + cName + ' count ' + count);
    var c = count % 2 ? 1 : 2;

    sp.write("LED=" + c + "\r\n", function(err) {
        console.log('Written');

        sp.drain(function(err) {
            console.log('Drained');
            if (err) {
                console.log("Cannot write to port");
                console.error(err);

            } else {
                console.log("Written to port " + cName);

            }
        });
    });

}