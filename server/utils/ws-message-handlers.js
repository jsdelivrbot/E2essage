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
			if (error || !result) {
				ws.send(createMessage('loginResponse', response));
				return;
			}
			ws._userId = result._id;
			ws._username = username;
			response = {
				username,
				sessionId: ObjectId().toString(),
			};
			Sessions.insert(response, () => ws.send(createMessage('loginResponse', _.omit(response, (value, key) => key === '_id'))));
		});
	},
	logout(ws, message) {
		Sessions.remove(message.sessionToDelete, function (result, error) {
			if (error) {
				ws.send(createMessage('logoutResponse', {
					error: `Internal Server Error: ${error}`
				}));
				return;
			}
			if (result) {
				ws.send(createMessage('logoutResponse', {
					status: `success`
				}));
				return;
			}
		})
	},
	register(ws, message) {
		const username = message.username;
		const password = message.password;
		Users.findOne({ username: message.username}, function (result, error) {
			if (error) {
				ws.send(createMessage('registerResponse', {
					error: `Internal Server Error: ${error}`
				}));
				return;
			}
			if (result) {
				ws.send(createMessage('registerResponse', {
					error: `User already exists`
				}));
				return;
			}
			Users.insert({ username, password }, function (result) {
				if (!result) {
					ws.send(createMessage('registerResponse', {
						error: `Couldn't create account, try again`
					}));
					return
				}
				ws.send(createMessage('registerResponse', {
					status: 'success'
				}));
			})
		})
	},
	authenticate(ws, message) {
		const username = message.username;
		Users.findOne({username}, function (result, error) {
			if (error || !result) {
				ws.send(createMessage('authResponse', {
					error: 'Invalid credentials'
				}));
				return;
			}
			ws._userId = result._id;
			ws._username = username;
			ws.send(createMessage('authResponse', {
				authentication: true
			}));
		});
	},
	getMessages(ws, message) {
		Messages.find(message.query, (array, error) => {
			if (error){
				ws.send(createMessage('messages', error));
			} else {
				ws.send(createMessage('messages', array));
			}
		});
	},
	addMessage(ws, message, server) {
		Messages.insert(message, (message) => {
			server.broadcast(createMessage('receiveMessage', message), []);
		});
	},
	newChat(ws, message) {
		Users.findOne({username: message.username}, function (user, error) {
			if (error) {
				ws.send(createMessage('chatCreated', {error}));
				return;
			}
			if (!user) {
				ws.send(createMessage('chatCreated', {error: 'That user does not exist.'}));
				return;
			}
			Chats.insert({user1: ws._username, user2: user.username}, (chat) => {
				ws.send(createMessage('chatCreated', {
					chatId: chat._id,
					contact: user.username
				}));
			});
		});

	},
	getChats(ws, message) {
		Chats.find({$or: [{ user1: ws._username}, { user2: ws._username}]}, (chats, error) => {
			if (error) {
				ws.send(createMessage('receiveChats', {error}));
				return;
			}
			const mappedChats = chats.map(function (chat) {
				return {
					chatId: chat._id,
					contact: chat.user1 === ws._username ? chat.user2: chat.user1
				}
			});
			ws.send(createMessage('receiveChats', mappedChats));
		});
	}
};

module.exports = messageHandlers;
module.exports.createMessage = createMessage;