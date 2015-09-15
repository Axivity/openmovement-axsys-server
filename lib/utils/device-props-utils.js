/**
 * Created by Praveen on 14/09/2015.
 */

export function generateId(device) {
    let portName = cleanPortName(device.port);
    return "serial://" + portName + '/';
}

function cleanSerialString(serialString) {
    // serialString: CWA17_15425
    if (serialString.indexOf('_') < 0) {
        return null;
    }
    return serialString.split('_')[1];
}

export function cleanPortName(port) {
    // port: \\.\COM8
    if (port.indexOf('\\') < 0) {
        return null;
    }

    if (port.indexOf('.') < 0) {
        return null;
    }
    return port.split('\\')[3].replace('.', '');
}