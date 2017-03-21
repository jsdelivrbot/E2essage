/**
 * Created by sergiuu on 20.03.2017.
 */
const webSocket = require('ws');
const webSocketServer = new webSocket.Server({server: app});

const broadcast = function (data) {
	webSocketServer.clients.forEach((client) => {
		console.log(client);
	})
};
