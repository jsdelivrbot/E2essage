import {createStoreWithActions} from "./create-store";
import * as AsyncStorage from "react-native/Libraries/Storage/AsyncStorage";


export const MessengerStore = createStoreWithActions(
	{
		inputText: '',
		messages: [],
		autoScroll: false,
	},
	{
		addMessage: function (state, action) {
			AsyncStorage.setItem('@Storage:messages', JSON.stringify([...state.messages, action.message]));
			return {
				...state,
				messages: [...state.messages, action.message],
			}
		},
		setInputText: function (state, action) {
			return {
				...state,
				inputText: action.text
			}
		},
		setMessages: function (state, action) {
			return {
				...state,
				messages: action.messages
			}
		},
		setAutoScroll: function (state, action) {
			return {
				...state,
				currentScroll: action.scroll,
			}
		}
	}
);