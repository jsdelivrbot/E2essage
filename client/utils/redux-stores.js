import {createStoreWithActions} from "./create-store";
import {MessagesAsyncStorage} from "./async-storage";


export const MessengerStore = createStoreWithActions(
	{
		inputText: '',
		messages: [],
		route: 'chatThreads',
		modalVisible: false,
		chatThreads: [
			{
				chatId: 'one',
				text: 'Chira'
			},
			{
				chatId: 'two',
				text: 'Laura'
			},
		],
		currentChatId: '',
	},
	{
		addMessage: function (state, action) {
			const newMessages = [action.message, ...state.messages];
			MessagesAsyncStorage.setMessages(`@Storage:messages#${action.chatId}`, newMessages);
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
		}
	}
);