/**
 * Created by Praveen on 14/09/2015.
 */

import { expect } from 'chai';

import { EventBus } from '../../lib/services/bus';
import * as constants from '../../lib/constants/event-name-constants';

describe('EventBus', () => {
    describe('on subscribe', () => {
        it('should add a callback to array of callbacks for an event', () => {
            let eventBus = new EventBus();
            eventBus.subscribe(constants.AX_DEVICE_ADDED, (payload) => {
                console.log(payload);
            });

            expect(eventBus.eventsWithCallbacks).to.be.an('object');
            expect(eventBus.eventsWithCallbacks[constants.AX_DEVICE_ADDED])
                .to
                .be
                .an('array');
        });

        it('should add multiple callbacks for same event when more than one is subscribed', () => {
            let eventBus = new EventBus();

            eventBus.subscribe(constants.AX_DEVICE_ADDED, (payload) => {
                console.log(payload);
            });

            eventBus.subscribe(constants.AX_DEVICE_ADDED, (payload) => {
                console.log(payload);
            });

            expect(eventBus.eventsWithCallbacks[constants.AX_DEVICE_ADDED])
                .to
                .be
                .an('array');

            expect(eventBus.eventsWithCallbacks[constants.AX_DEVICE_ADDED])
                .to
                .have
                .length(2);
        });
    });

    describe('on publish', () => {
        it('should invoke the callbacks for given event', () => {
            let samplePayLoad = {'sample': 'payload'};
            let eventBus = new EventBus();

            eventBus.subscribe(constants.AX_DEVICE_ADDED, (payload) => {
                console.log(payload);
                expect(payload).to.be.an('object');
                expect(payload).to.be.equal(samplePayLoad);
            });

            eventBus.subscribe(constants.AX_DEVICE_ADDED, (payload) => {
                console.log(payload);
                expect(payload).to.be.an('object');
                expect(payload).to.be.equal(samplePayLoad);
            });

            eventBus.publish(constants.AX_DEVICE_ADDED, samplePayLoad);

        });
    });

});