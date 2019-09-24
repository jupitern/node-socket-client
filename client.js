var WebSocketClient = require('websocket').client;

var connectionsCount = 0;

for (var i=0; i<6000; ++i) {

    var client = new WebSocketClient();

    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', function(connection) {
        console.log('Client Connected. total = '+ connectionsCount);
        connectionsCount++;

        connection.on('error', function(error) {
            connectionsCount--;
            connection.disconnect();
            console.log("Connection Error: " + error.toString()+' total = '+ connectionsCount);
        });

        connection.on('close', function() {
            connectionsCount--;
            console.log("Connection Closed. total = "+ connectionsCount);
        });

        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
            }
        });

        // function sendNumber() {
        //     if (connection.connected) {
        //         var number = Math.round(Math.random() * 0xFFFFFF);
        //         connection.sendUTF(number.toString());
        //         setTimeout(sendNumber, 1000);
        //     }
        // }
        // sendNumber();
    });

    client.connect('ws://68.183.8.119:8081/');
}
