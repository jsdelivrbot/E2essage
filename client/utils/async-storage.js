/**
 * Created by sergiuu on 11.06.2017.
 */

import * as AsyncStorage from "react-native/Libraries/Storage/AsyncStorage";

export const MessagesAsyncStorage = {
	getMessages(asyncStorageId) {
		return AsyncStorage.getItem(asyncStorageId)
	},
	setMessages(asyncStorageId, messages) {
		AsyncStorage.setItem(asyncStorageId, JSON.stringify(messages));
	}
};
