/**
 * Created by sergiuu on 20.04.2017.
 */

const login = function (username, password) {
	return username === "uifi95" ? "Logged in" : "Wrong credentials";
};
const collections = require("../collections/collections");
const Messages = collections.Messages;
const Users = collections.Users;
const Chats = collections.Chats;

function createMessage(type, data) {
	return JSON.stringify({type, data});
}

const messageHandlers = {
	login: function (ws, message) {
		ws.send(login(message.username, message.password))
	},
	getMessages: function (ws, message) {
		Messages.find(message.query, (array, error) => {
			if (error){
				ws.send(createMessage('error', error));
			} else {
				console.log(array);
				ws.send(createMessage('messages', array));
			}
		});
	},
	addMessage: function (ws, message) {
		Messages.insert(message, (status) => {
			ws.send(JSON.stringify(status));
		});
	},
	newChat: function (ws, message) {
		Chats.insert(message, (status) => {
			ws.send(JSON.stringify(status));
		});
	},
	getUsers: function (ws, message) {
		Chats.findOne(message.query, (chat, error) => {
			ws.send(JSON.stringify(chat.users));
		});
	}
};

module.exports = messageHandlers;