/**
 * Created by Praveen on 09/09/2015.
 */

import { EventEmitter } from 'events';
import * as constants from './event-name-constants';


export class EventBus {

    constructor() {
        this.eventsWithCallbacks = {};
    }

    publish(eventName, payload) {
        if(!eventNameExistsInEventConstants(eventName)) {
            throw Error('Cannot identify event');
        }

        let { [eventName]: eventWithCallbacks } = this.eventsWithCallbacks;

        // get all callbacks associated with event and call them
        if(eventWithCallbacks === undefined) {
            console.warn('There are no callbacks registered for the event ' + eventName);

        } else {
            eventWithCallbacks.forEach((callback) => {
               callback(payload);
            });
        }
    }

    subscribe(eventName, callback) {
        if(!eventNameExistsInEventConstants(eventName)) {
            throw Error('Cannot identify event');
        }

        // add them to list of callbacks
        let { [eventName]: eventWithCallbacks } = this.eventsWithCallbacks;

        if(eventWithCallbacks === undefined) {
            this.eventsWithCallbacks[eventName] = [];
        }

        this.eventsWithCallbacks[eventName].push(callback);

    }
}

function eventNameExistsInEventConstants(eventName) {
    return (constants[eventName] === undefined);
}



