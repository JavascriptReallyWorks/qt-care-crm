'use strict';

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

module.exports = app => {
    class driverService extends app.Service {

        watchDriverServer() {
            console.log(new Date().toLocaleTimeString(), ":start connection 8080");

            wss.on('connection', function connection(ws, req) {
                console.log(new Date().toLocaleTimeString(), ":ws connection 8080");
                ws.on('message', function incoming(message) {
                    console.log('received: %s', JSON.stringify(message));
                    //TODO 根据请求信息，调用业务逻辑
                    ws.send('roger that: ' + JSON.stringify(message));
                });

            });
        }

        testSendToDriver() {
            wss.clients.forEach(function each(client) {

                if (client.readyState === WebSocket.OPEN) {
                    conosle.log("send client")
                    client.send('data from QTC');
                }
            });
        }

        sendDataToClient(strData) {
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(strData);
                }
            });
        }
    }

    return driverService;
};