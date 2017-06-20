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

export const KeysAsyncStorage = {
	getKeys() {
		return AsyncStorage.getItem('@Storage:keys');
	},
	setKey(key) {
		AsyncStorage.getItem('@Storage:keys').then(function (keys) {
			const chatId = key.chatId;
			delete key.chatId;
			if (!keys) {
				keys = {}
			} else {
				keys = JSON.parse(keys);
			}
			keys[chatId] = key;
			AsyncStorage.setItem('@Storage:keys', JSON.stringify(keys));
		});
	}
};
