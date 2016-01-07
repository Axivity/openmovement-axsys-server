/**
 * Created by Praveen on 05/01/2016.
 *
 * @flow
 */


import T, {Map} from 'immutable';

import * as globalConstants from '../constants/global-constants';

/* NB: This state defines

 root -> Persistent & Transient
 Persistent -> Global & userSessionCache
 Transient -> Global & userSessionCache & socketSessionCache

 Following is just a list of nodes/subtrees that will be used with the initial state tree above.
 userSessionCache -> [dynamic client token (points to same user as long as same browser is used)]
 socketSessionCache -> [dynamic socket id for each websocket connection(multiple tabs open by same user) ]

 Device attributes state will be under "Transient -> Global"
 Process state could go under
 - "Persistent -> userSessionCache [CSV conversion/download?]"
 - "Transient -> userSessionCache [download?]"
 - "Transient -> socketSessionCache [Preview process]"
 File system watchers for
 - "device" will go under "Device attributes state"
 - "store" will go under "Transient -> socketSessionCache?"

WS-API [holds connectedusers(client-token) -> list of web sockets]
    -> devices: any time new device is added it should be published globally
    -> device-attribute query: any query should get data sent to the caller only (web socket). The value can be published by client back to server.
                               When data is published it's of global scope so all users get a copy of that data.
    -> files: directories should be watched for any file addition/removal. This applies for store/device mounted.
                -> For store: probably it should go under socket session.
                -> For device directories: probably watched state of directory should go under transient socketsession
                                           (no need to monitor a store if the user isn't connected to system also
                                            makes it possible for 1 user to monitor multiple dirs)
    -> processes: process are of different types - downloading files, analysis etc.
                -> For downloading files: It should go under userSession so that if user goes away and comes back he can start looking at progress straight away
                -> For Analysis: It might go under persistent userSession so that user can persist to db about status of the process (notify failed runs etc)

    extra properties are needed to map to this state
                -> need a scope property (userSession | socketSession | global),
                -> need a visibility property (transient or persistent),
                -> if socketSession | userSession then socketId | clientToken is needed to map
           All these properties should be set in respective APIs - Process API | FS API | Devices API for eg.


How to map the state changes back to which socket to use??
    -> State api can take some callbacks? Probably callbacks will have global, userSession (client token) or socketSession(socket id) scope.
       All the callbacks could be registered in WS-API, this will make it easier to lookup websocket based on userSession scope(using client token)
       or socket id for socket session scope.

    -> The client library for the API needs to consume data for user - what does the data look like? Do we send just patches of changes?
       Hmmmmmmmmmmmm.... we can use RFC-6902 but the client doesn't hold same "full" state, it should have only part it has access to. What
       to do for this use case...?? 

 */

export function createInitialState() {
    //
    // ({
    //    'persistent': { 'global': {}, 'userSessions': {} },
    //    'transient': { 'global': { 'deviceAttributes' : {} }, 'userSessions': {}, 'socketSessions': {} }
    // })
    // Below code expands to above structure - just handy without having to look at constants file
    //

    let initialState = {
        // persistent sub-tree
        [globalConstants.STATE_TREE_PERSISTENT_KEY]: {
            // global part of persistent sub-tree
            [globalConstants.STATE_TREE_GLOBAL_KEY]: {},

            // user session part of persistent sub-tree
            [globalConstants.STATE_TREE_USER_SESSION_KEY]: {}
        },

        // transient sub-tree
        [globalConstants.STATE_TREE_TRANSIENT_KEY]: {
            // global part of transisent sub-tree
            [globalConstants.STATE_TREE_GLOBAL_KEY]: {
                // transient global holds deviceAttributes
                [globalConstants.STATE_TREE_DEVICE_ATTRIBUTES_KEY]: {}
            },
            // user session part of transient sub-tree
            [globalConstants.STATE_TREE_USER_SESSION_KEY]: {},
            // socket session part of transient sub-tree
            [globalConstants.STATE_TREE_SOCKET_SESSION_KEY]: {}
        }

    };
    return T.fromJS(initialState);

}




