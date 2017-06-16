/**
 * Created by sergiuu on 20.04.2017.
 */
const _ = require('underscore');
const collections = require("../collections/collections");
const Messages = collections.Messages;
const Users = collections.Users;
const Chats = collections.Chats;
const Sessions = collections.Sessions;
const ObjectId = require('mongodb').ObjectID;


function createMessage(type, data) {
	return JSON.stringify({type, data});
}

const messageHandlers = {
	login: function (ws, message) {
		let response = {
			error: 'Invalid credentials'
		};
		const username = message.username;
		const password = message.password;

		Users.findOne({username, password}, function (result, error) {
			if (error) {
				ws.send(createMessage('loginResponse', response));
				return;
			}
			ws._userId = result._id;
			response = {
				username,
				sessionId: ObjectId().toString(),
			};
			Sessions.insert(response, () => ws.send(createMessage('loginResponse', _.omit(response, (value, key) => key === '_id'))));
		});
	},
	getMessages: function (ws, message) {
		Messages.find(message.query, (array, error) => {
			if (error){
				ws.send(createMessage('error', error));
			} else {
				ws.send(createMessage('messages', array));
			}
		});
	},
	addMessage: function (ws, message, server) {
		Messages.insert(message, (message) => {
			server.broadcast(createMessage('receiveMessage', message), []);
		});
	},
	newChat: function (ws, message) {
		Chats.insert(message, (status) => {
			ws.send(JSON.stringify(status));
		});
	},
	getChats: function (ws, message) {
		Chats.find(message.query, (chat, error) => {
			ws.send(JSON.stringify(chat));
		});
	}
};

module.exports = messageHandlers;
module.exports.createMessage = createMessage;