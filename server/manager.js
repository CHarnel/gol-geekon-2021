const admins = [],
    players = {},
    EventEmitter = require('events');

class MyEmitter extends EventEmitter { };

module.exports.handleMessage = (message, connection) => {
    // console.log("handleMessage", message);
    switch (message.eventName) {
        case "admin-enter":
            console.log("NEW ADMIN");
            connection.__gol_isAdmin = true;
            admins.push(connection);
            break;

        default:
            break;
    }
};

module.exports.handleDisconnect = (connection) => {
    if (connection.__gol_isAdmin) {
        let i = admins.indexOf(connection);
        if (i !== -1) {
            console.log(`remove admin ${connection.__gol_id}`);
            admins.splice(i, 1);
        }
    }
}

module.exports.eventsEmitter = new MyEmitter();

setInterval(() => {
    sendAllAdmins({ yuki: 1 })
}, 3000);

const sendAllAdmins = (data) => {
    admins.forEach(admin => {
        admin.send(JSON.stringify(data));
    });
}
