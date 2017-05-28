import {createStoreWithActions} from "./create-store";


export const MessengerStore = createStoreWithActions(
	{
		inputText: '',
		messages: [],
	},
	{
		addMessage: function (state, action) {
			AsyncStorage.setItem('@Storage:messages', JSON.stringify([...state.messages, action.message]));
			return {
				...state,
				messages: [...state.messages, action.message]
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
		}
	}
);