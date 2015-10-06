/**
 * Created by Praveen on 09/09/2015.
 *
 * Event names in this module are shared between client and server.
 *
 */



export const AX_DEVICE_ADDED   = 'ax-device-added';

export const AX_DEVICE_REMOVED = 'ax-device-removed';

export const AX_CLIENT_REGISTER = 'ax-register';

export const AX_CLIENT_DEVICES_GET_ALL = 'ax-devices:getAll';

export const AX_CLIENT_OR_SERVER_DISCONNECT = 'disconnect';

export const AX_CLIENT_OR_SERVER_CONNECT = 'ax-connect';

export const AX_DEVICE_CONNECT = 'ax-device-connect';

export const AX_DEVICE_DISCONNECT = 'ax-device-disconnect';

export const AX_DEVICE_WRITE = 'ax-device-write';

export const AX_DEVICE_CONNECT_SUCCESS = 'ax-device-connect-success';

export const AX_DEVICE_CONNECT_FAILURE = 'ax-device-connect-failure';

// This event is used to send all sorts of data. It is the responsibility of clients to
// open the data and understand it.
export const AX_ON_DATA = 'ax-data';

export const AX_CLIENT_DATA = 'ax-client-data';
