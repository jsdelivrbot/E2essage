/**
 * Created by sergiuu on 13.06.2017.
 */

export const stateToProps = {
	login(state) {
		return {
			errorMessage: state.errorMessage
		};
	},
	register(state) {
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
			currentChatId: state.currentChatId,
			publicKey: state.publicKey
		};
	},
	router(state) {
		return {
			route: state.route
		};
	},
	chatThreads(state) {
		return {
			errorMessage: state.errorMessage,
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
			addMessage(message, chatId) {
				dispatch({
					type: 'addMessage',
					message,
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
	register(dispatch) {
		return {
			setErrorMessage(errorMessage) {
				dispatch({
					type: 'setErrorMessage',
					errorMessage
				})
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
			setKeys(keyObject) {
				dispatch({
					type: 'setKeys',
					keyObject
				});
			},
			setErrorMessage(errorMessage) {
				dispatch({
					type: 'setErrorMessage',
					errorMessage
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