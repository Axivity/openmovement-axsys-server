/**
 * Created by Praveen on 07/09/2015.
 */

import console from 'console';

export function register(app) {
    'use strict';
    app.io.route('ax-register', (req) => {
        let data    = req.data;
        let key     = data.key;
        console.log(key);
    });
}


