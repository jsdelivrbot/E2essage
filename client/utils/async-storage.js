/**
 * Created by sergiuu on 11.06.2017.
 */

import * as AsyncStorage from "react-native/Libraries/Storage/AsyncStorage";

export const MessagesAsyncStorage = {
	getMessages(chatId) {
		return AsyncStorage.getItem(`@Storage:messages#${chatId}`);
	},
	setMessages(chatId, messages) {
		AsyncStorage.setItem(`@Storage:messages#${chatId}`, JSON.stringify(messages));
	}
};

export const SessionAsyncStorage = {
	getSession() {
		return AsyncStorage.getItem('@Storage:session');
	},
	setSession(session) {
		AsyncStorage.setItem('@Storage:session', JSON.stringify(session));
	}
};
