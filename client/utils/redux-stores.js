import {createStoreWithActions} from "./create-store";
import {MessagesAsyncStorage} from "./async-storage";


export const MessengerStore = createStoreWithActions(
	{
		inputText: '',
		messages: [],
		route: 'login'
	},
	{
		addMessage: function (state, action) {
			const newMessages = [action.message, ...state.messages];
			MessagesAsyncStorage.setMessages('@Storage:messages', newMessages);
			return {
				...state,
				messages: [action.message, ...state.messages],
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
		setRoute: function (state, action) {
			return {
				...state,
				route: action.route
			}
		}
	}
);