/**
 * Created by Praveen on 27/08/2015.
 */

var expect = require('chai').expect;

describe('Devicefinder native addon', function() {
    describe('when required', function() {
        it('should load', function() {
            var addon = require('../../build/Release/devicefinder');
            expect(addon).to.be.an('object');

        });

    });
});

describe('DeviceFinder js module', function() {
    describe('when instantiated', function() {
        it('should create devicefinder object', function() {
            var deviceFinder = require('../../lib/devicefinder');
            expect(deviceFinder).to.be.an('object');
            new deviceFinder.DeviceFinder({
                idToMonitor: "0x04D80057", // AX3
                addedCallback: function() {},
                removedCallback: function() {}
            });
        });
    })
});