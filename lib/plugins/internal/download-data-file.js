/**
 * Created by Praveen on 13/12/2015.
 */


var fs = require('fs');
var progress = require('progress-stream');

var FILE_STORE_DIRECTORY = 'files-store';


process.on('message', function(options) {
    var processName = options.name;
    var args = options.args;


    var source = args[0];
    var destination = args[1];

    var stat = fs.statSync(source);
    var str = progress({
        length: stat.size,
        time: 100
    });

    str.on('progress', function(progress) {
        console.log('In child: ' + progress);
        process.send(progress);
    });

    fs.createReadStream(source)
        .pipe(str)
        .pipe(fs.createWriteStream(destination));

});