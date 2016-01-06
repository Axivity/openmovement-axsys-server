/**
 * Created by Praveen on 05/01/2016.
 *
 * @flow
 */


import {Map} from 'immutable';

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

How to map the state changes back to which socket to use??
    -> State api can take some callbacks? Probably callbacks will have global, userSession (client token) or socketSession(socket id) scope.
       All the callbacks could be registered in WS-API, this will make it easier to lookup websocket based on userSession scope(using client token)
       or socket id for socket session scope.

    -> The client library for the API needs to consume data for user - what does the data look like? Do we send just patches of changes?
       Hmmmmmmmmmmmm.... we can use RFC-6902 but the client doesn't hold same "full" state, it should have only part it has access to. What
       to do for this use case...?? 

 */

export function createInitialState() {


}


