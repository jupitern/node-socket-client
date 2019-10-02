var desiredConnections = 50000;
var serverUrl = 'ws://142.93.131.241/chatserver';

var WebSocketClient = require('websocket').client;
var connectionsCount = 0;

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function connect() {
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

    if (desiredConnections > connectionsCount) {
        /*if (connectionsCount % 100 == 0) {
            sleep(200).then(() => {
                connect();
            });
        } else {
            connect();
        }*/
        connect();
    }

    });

    client.connect(serverUrl);

}

connect();
