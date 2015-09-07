
import eio from 'express.io';

import * as register_module from './lib/register-client';

let app = eio();
app.http().io();

//app.io.route('ax-register', function(req) {
//    console.log(req);
//    var key = req.data.key;
//    console.log(key);
//});
register_module.register(app);

app.listen(9693);
