//client
try {

    const WebSocket = require('ws');

    const ws = new WebSocket('ws://127.0.0.1:8080');

    ws.on('open', function open() {
            console.log('ws connected');
            ws.send(JSON.stringify({
                from: 'qt-server',
                message: 'hello'
            }));

            ws.send(JSON.stringify({
                from: 'qt-server',
                message: 'world'
            }));
        });

        ws.on('message', function incoming(data) {
            console.log(data);
        });

} catch (e) {
    console.log(e);
};