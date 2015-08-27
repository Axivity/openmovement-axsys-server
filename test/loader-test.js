/**
 * Created by Praveen on 27/08/2015.
 */

var expect = require('chai').expect;

describe('Devicefinder addon', function() {
    describe('when required', function() {
        it('should load', function() {
            var addon = require('../build/Release/devicefinder');
            expect(addon).to.be.an('object');

        });

    });
});