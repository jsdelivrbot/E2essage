/**
 * Created by sergiuu on 20.03.2017.
 */
const ws = require('ws');
const collections = require("../collections/collections");
const Sessions = collections.Sessions;
const _ = require('underscore');

const permittedHandlers = ['login', 'register'];


function errorType(type) {
	switch (type) {
		case 'authenticate':
			return 'authResponse';
		case 'addMessage':
			return 'receiveMessage';
		case 'getMessages':
			return 'messages';
		case 'newChat':
			return 'chatCreated';
		case 'getChats':
			return 'receiveChats';
		default:
			return type;
	}
}


class ChatSocketServer {
	constructor(server, messageHandlers) {
		const self = this;
		self.clients = [];
		self.messageHandlers = messageHandlers || {};
		self.server = server;
		self.connections = {};
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
					Sessions.findOne({sessionId: message.sessionId}, function (result) {
						if (!result && permittedHandlers.indexOf(type) === -1) {
							ws.send(JSON.stringify({
								type: errorType(type),
								data: {
									error: 'Invalid Session'
								}
							}));
							return;
						}
						delete message.sessionId;
						self.messageHandlers[type](ws, message, self);
					});
				}
			});
		});
	}

	onMessage(type, handler) {
		this.messageHandlers[type] = handler;
	};

	checkUser(client, users) {
		if (!users || !users.length) { return true }
		return client._userId && users.indexOf(client._username) > -1;
	}

	isUserOnline(username) {
		let foundClient = false;
		this.wss.clients.forEach((client) => {
			if (client._username === username) {
				foundClient = true;
			}
		});
		return foundClient;
	}

	broadcast(data, users) {
		this.wss.clients.forEach((client) => {
			if (client.readyState === ws.OPEN && this.checkUser(client, users)) {
					client.send(data);
			}
		})
	}
}

module.exports.ChatSocketServer = ChatSocketServer;


