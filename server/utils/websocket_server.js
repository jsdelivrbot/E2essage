/**
 * Created by sergiuu on 20.03.2017.
 */
const ws = require('ws');
const collections = require("../collections/collections");
const Sessions = collections.Sessions;
const _ = require('underscore');

const permittedHandlers = ['login'];


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

	checkUserIds(client, userIds) {
		if (!userIds || !userIds.length) { return true }
		return client._userId && userIds.indexOf(client._userId) > -1;
	}

	broadcast(data, userIds) {
		this.wss.clients.forEach((client) => {
			if (client.readyState === ws.OPEN && this.checkUserIds(client, userIds)) {
				client.send(data);
			}
		})
	}
}

module.exports.ChatSocketServer = ChatSocketServer;


