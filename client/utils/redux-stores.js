import {createStoreWithActions} from "./create-store";
import {MessagesAsyncStorage} from "./async-storage";


export const MessengerStore = createStoreWithActions(
	{
		inputText: '',
		messages: [],
		route: '',
		errorMessage: '',
		modalVisible: false,
		chatThreads: [],
		currentChatId: '',
		sessionId: '',
		username: '',
	},
	{
		addMessage: function (state, action) {
			const newMessages = [action.message, ...state.messages];
			MessagesAsyncStorage.setMessages(action.chatId, newMessages);
			return {
				...state,
				messages: newMessages,
			}
		},
		setInputText: function (state, action) {
			return {
				...state,
				inputText: action.text
			}
		},
		setErrorMessage: function (state, action) {
			return {
				...state,
				errorMessage: action.errorMessage
			}
		},
		setMessages: function (state, action) {
			MessagesAsyncStorage.setMessages(action.chatId, action.messages);
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
		},
		setCurrentChatId: function (state, action) {
			return {
				...state,
				currentChatId: action.chatId
			}
		},
		addChatThread: function (state, action) {
			return {
				...state,
				chatThreads: [action.chatThread, ...state.chatThreads]
			}
		},
		setChatThreads: function (state, action) {
			return {
				...state,
				chatThreads: action.chatThreads
			}
		},
		toggleModal: function (state, action) {
			return {
				...state,
				modalVisible: !state.modalVisible
			}
		},
		setSession: function(state, action) {
			return {
				...state,
				sessionId: action.sessionId,
				username: action.username,
			}
		}
	}
);