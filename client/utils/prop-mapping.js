/**
 * Created by sergiuu on 13.06.2017.
 */

export const stateToProps = {
	login(state) {
		return {
			errorMessage: state.errorMessage
		};
	},
	messenger(state) {
		return {
			sessionId: state.sessionId,
			username: state.username,
			inputText: state.inputText,
			messages: state.messages,
			currentChatId: state.currentChatId
		};
	},
	router(state) {
		return {
			route: state.route
		};
	},
	chatThreads(state) {
		return {
			sessionId: state.sessionId,
			username: state.username,
			chatThreads: state.chatThreads,
			modalVisible: state.modalVisible,
		}
	}
};

export const dispatchToProps = {
	messenger(dispatch) {
		return {
			//TODO add server side values here
			addMessage(text, chatId) {
				dispatch({
					type: 'addMessage',
					message: {
						text,
						sender: 'Sergiu',
						sendDate: new Date()
					},
					chatId,
				});
			},
			setInputText(text) {
				dispatch({
					type: 'setInputText',
					text
				});
			},
			setMessages(messages) {
				dispatch({
					type: 'setMessages',
					messages
				});
			},
			setAutoScroll(scroll) {
				dispatch({
					type: 'setAutoScroll',
					scroll
				})
			}
		}
	},
	router(dispatch) {
		return {
			//TODO add server side values here
			setRoute(route) {
				dispatch({
					type: 'setRoute',
					route
				});
			}
		}
	},
	chatThreads(dispatch) {
		return {
			addChatThread(chatThread) {
				dispatch({
					type: 'addChatThread',
					chatThread
				})
			},
			toggleModal() {
				dispatch({
					type: 'toggleModal'
				})
			},
			setCurrentChatId(chatId) {
				dispatch({
					type: 'setCurrentChatId',
					chatId
				});
			}
		}
	}
};