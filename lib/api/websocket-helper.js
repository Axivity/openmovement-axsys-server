/**
 * Created by Praveen on 06/01/2016.
 *
 * @flow
 */

type clientToken = string;
type webSocketObj = Array<Object>;

export class WebSocketHelper {

    connectedUsers: Object<clientToken, webSocketObj>;

    constructor() {
        // will map user to websocket connections. 1 user can hold many WS connections.
        this.connectedUsers = {};

    }


}