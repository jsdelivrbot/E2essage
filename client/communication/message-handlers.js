/**
 * Created by sergiuu on 14.06.2017.
 */
import {MessengerStore} from '../utils/redux-stores'

export const messageHandlers = {
	messages: function (ws, message) {
		const messagesToSet = message.data.map(function (message) {
			return {
				text: message.content,
				sender: message.username,
				sendDate: new Date(),
				yours: message.username === 'Sergiu'
			}
		});
		MessengerStore.dispatch({
			type: 'setMessages',
			messages: messagesToSet
		})
	}
};