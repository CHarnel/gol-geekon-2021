const WebSocketServer = require('websocket').server,
    http = require('http'),
    fileSystem = require('fs'),
    path = require('path'),
    { handleMessage, handleDisconnect, eventsEmitter } = require('./manager');

WebSocketServer.getUniqueID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

const server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    switch (request.url) {
        case "/":
            console.log("sending index.html file...")
            const filePath = path.join(__dirname, "admin.html"),
                stat = fileSystem.statSync(filePath);
            response.writeHead(200,
                {
                    "Content-Type": "text/html",
                    "Content-Length": stat.size
                });
            fileSystem.createReadStream(filePath).pipe(response);
            break;

        default:
            response.writeHead(404);
            response.end();
            break;
    }
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    const connection = request.accept('echo-protocol', request.origin);
    connection.__gol_id = WebSocketServer.getUniqueID();

    connection.on('message', function(message) {
        try {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + JSON.stringify(message));
                // connection.sendUTF(message.utf8Data);
                handleMessage(JSON.parse(message.utf8Data), connection);
            }
            //  else if (message.type === 'binary') {
            //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            //     connection.sendBytes(message.binaryData);
            // }
        } catch (ex) {
            console.error(ex);
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        handleDisconnect(connection);
    });
});


