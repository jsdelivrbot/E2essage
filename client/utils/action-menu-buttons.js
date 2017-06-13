/**
 * Created by sergiuu on 13.06.2017.
 */
import {ReduxRouter} from "../utils/router";
import {MessengerStore} from './redux-stores';

export const actioMenuButtons = {
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
			onPress: () => ReduxRouter.go('login'),
			icon: 'md-log-out'
		},
	]
};