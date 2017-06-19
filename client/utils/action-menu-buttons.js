/**
 * Created by sergiuu on 13.06.2017.
 */
import {MessengerStore} from "./redux-stores";
import {chatSocket, createMessage} from "../communication/websocket-client";


export const actionMenuButtons = {
	chatThreads: [
		{
			buttonColor: '#9b59b6',
			title: 'New Conversation',
			onPress: () => MessengerStore.dispatch({type: 'toggleModal'}),
			icon: 'md-create'
		},
		{
			buttonColor: '#3498db',
			title: 'Log Out',
			onPress() {
				const state = MessengerStore.getState();
				chatSocket.sendMessage(createMessage('logout', {
					sessionToDelete: {
						sessionId: state.sessionId,
						username: state.username,
					}
				}, state.sessionId))
			},
			icon: 'md-log-out'
		},
	]
};