/**
 * Created by Praveen on 18/11/2015.
 */

import moment from 'moment';

export function getCurrentTimeInMillis() {
    return moment().valueOf();
}
