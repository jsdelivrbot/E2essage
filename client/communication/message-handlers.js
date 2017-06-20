/**
 * Created by sergiuu on 14.06.2017.
 */
import {MessengerStore} from '../utils/redux-stores'
import {SessionAsyncStorage, KeysAsyncStorage, MessagesAsyncStorage} from "../utils/async-storage";
import {ReduxRouter} from "../utils/router";
import {CryptoTool} from "../encryption/crypto-tool";


function setSession(message) {
	const session = {
		sessionId: message.sessionId,
		username: message.username
	};
	SessionAsyncStorage.setSession(session);
	MessengerStore.dispatch({
		type: 'setSession',
		...session
	});
}

function setKey(key) {
	KeysAsyncStorage.setKey(key);
}

export function sessionValid(message) {
	if (message.error && message.error === 'Invalid Session') {
		setSession({});
		ReduxRouter.go('login');
		MessengerStore.dispatch({
			type: 'setErrorMessage',
			errorMessage: message.error
		});
		return false;
	}
	return true;
}

function moveSessionToHomePage() {
	SessionAsyncStorage.getSession().then(function (session) {
		session = JSON.parse(session);
		MessengerStore.dispatch({
			type: 'setSession',
			...session
		});
		ReduxRouter.go('chatThreads');
	});
}

export const messageHandlers = {
	messages(ws, message) {
		if (message.length) {
			const chatId = MessengerStore.getState().currentChatId;
			MessagesAsyncStorage.getMessages(chatId).then(function (messages){
				messages = JSON.parse(messages) || [];
				let i = 0;
				const alreadyDecrypted = [];
				while (i < messages.length) {
					const local = messages[messages.length - i - 1];
					const remote = message[0];
					if (local.sender !== remote.sender && local.sendDate !== remote.sendDate) { break; }
					message.splice(0, 1);
					alreadyDecrypted.splice(0, 0, local);
					i++;
				}
				MessengerStore.dispatch({
					type: 'setMessages',
					messages: alreadyDecrypted,
				});
				message.forEach(function (message) {
					const privateKey = MessengerStore.getState().privateKey;
					CryptoTool.decrypt(message.content, privateKey).then(function (text) {
						const messageToAdd = {
							text: text.data,
							sender: message.username,
							sendDate: new Date(message.sendDate),
						};
						MessengerStore.dispatch({
							type: 'addMessage',
							message: messageToAdd,
							chatId
						});
					});
				});
			});
		}
	},
	receiveMessage(ws, message) {
		const state = MessengerStore.getState();
		const privateKey = state.privateKey;
		const chatId = state.currentChatId;
		CryptoTool.decrypt(message.content, privateKey).then(function (text) {
			const messageToAdd = {
				text: text.data,
				sender: message.username,
				sendDate: new Date(message.sendDate),
			};
			MessengerStore.dispatch({
				type: 'addMessage',
				message: messageToAdd,
				chatId
			});
		});
	},
	loginResponse(ws, message) {
		if (message.error) {
			MessengerStore.dispatch({
				type: 'setErrorMessage',
				errorMessage: message.error
			});
			return;
		}
		setSession(message);
		ReduxRouter.go('chatThreads');
	},
	registerResponse(ws, message) {
		if (message.error) {
			MessengerStore.dispatch({
				type: 'setErrorMessage',
				errorMessage: message.error
			});
			return;
		}
		if (message.status === 'success') {
			MessengerStore.dispatch({
				type: 'setErrorMessage',
				errorMessage: ''
			});
			ReduxRouter.go('login');
		}
	},
	logoutResponse(ws, message) {
		if (message.error) {
			alert(message.error);
			return;
		}
		if (message.status !== 'success') { return }
		setSession({});
		MessengerStore.dispatch({
			type: 'setErrorMessage',
			errorMessage: ''
		});
		ReduxRouter.go('login');
	},
	authResponse(ws, message) {
		moveSessionToHomePage();
	},
	receiveChats(ws, message) {
		MessengerStore.dispatch({
			type: 'setChatThreads',
			chatThreads: message
		});
	},
	chatCreated(ws, message) {
		if (message.error) {
			MessengerStore.dispatch({
				type: 'setErrorMessage',
				errorMessage: message.error
			});
			return;
		}
		MessengerStore.dispatch({
			type: 'addChatThread',
			chatThread: message
		});
		if (MessengerStore.getState().modalVisible) {
			MessengerStore.dispatch({
				type: 'toggleModal',
			});
		}
	},
	receiveKey(ws, message) {
		setKey(message);
	}
};