/**
 * Created by sergiuu on 20.03.2017.
 */
const ws = require('ws');

class ChatSocketServer {
	constructor(server, messageHandlers) {
		const self = this;
		self.clients = [];
		self.messageHandlers = messageHandlers || {};
		self.server = server
	}

	start() {
		const self = this;
		self.wss = new ws.Server({ server: this.server });
		self.wss.on('connection', function (ws) {
			ws.on("message", function (message) {
				console.log(`parsing message: ${message}`);
				message = JSON.parse(message);
				const type = message.type;
				if (self.messageHandlers.hasOwnProperty(type)) {
					delete message.type;
					self.messageHandlers[type](ws, message, self);
				}
			});
		});
	}

	onMessage(type, handler) {
		this.messageHandlers[type] = handler;
	};

	broadcast(data) {
		this.wss.clients.forEach((client) => {
			if (client.readyState === ws.OPEN) {
				client.send(data);
			}
		})
	}
}

module.exports.ChatSocketServer = ChatSocketServer;


