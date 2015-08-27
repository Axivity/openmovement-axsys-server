/**
 * Created by Praveen on 27/08/2015.
 */

var deviceFinderBinding = require('../build/Release/devicefinder'),
    exports = module.exports;

var DeviceFinder = function(options) {
    // TODO: Use sensible defaults??
    if (!options.hasOwnProperty("idToMonitor")) {
        throw Error("Need an id (vid+pid) to monitor");
    }

    if (!options.hasOwnProperty("addedCallback")) {
        throw Error("Need a callback function to call when device is added");
    }

    if (!options.hasOwnProperty("idToMonitor")) {
        throw Error("Need a callback function to call when device is removed");
    }

    this.idToMonitor = options.idToMonitor;
    this.addedCallback = options.addedCallback;
    this.removedCallback = options.removedCallback;
    this.binding = deviceFinderBinding;
};

DeviceFinder.prototype.start = function() {
    this.binding.StartDeviceDiscovery(this.idToMonitor, this.addedCallback, this.removedCallback);
};

DeviceFinder.prototype.stop = function() {
    this.binding.StopDeviceDiscovery();
};


exports.DeviceFinder = DeviceFinder
