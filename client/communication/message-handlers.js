/**
 * Created by sergiuu on 14.06.2017.
 */
import {MessengerStore} from '../utils/redux-stores'
import {SessionAsyncStorage} from "../utils/async-storage";
import {ReduxRouter} from "../utils/router";


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
	messages: function (ws, message) {
		const messagesToSet = message.map(function (message) {
			return {
				text: message.content,
				sender: message.username,
				sendDate: new Date(),
			}
		});
		MessengerStore.dispatch({
			type: 'setMessages',
			messages: messagesToSet.reverse()
		})
	},
	receiveMessage: function (ws, message) {
		const messageToAdd = {
			text: message.content,
			sender: message.username,
			sendDate: new Date(),
		};
		MessengerStore.dispatch({
			type: 'addMessage',
			message: messageToAdd
		});
	},
	loginResponse: function (ws, message) {
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
	authResponse: function (ws, message) {
		if (message.error) {
			setSession({});
			ReduxRouter.go('login');
			MessengerStore.dispatch({
				type: 'setErrorMessage',
				errorMessage: message.error
			});
			return;
		}
		moveSessionToHomePage();
	}
};