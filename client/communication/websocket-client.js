/**
 * Created by sergiuu on 14.06.2017.
 */
import {messageHandlers} from "../communication/message-handlers";

export function createMessage(type, data) {
	return JSON.stringify({type, ...data});
}

export class ChatSocketClient {
	constructor(address, messageHandlers) {
		const self = this;
		self.ws = new WebSocket(address);
		self.messageHandlers = messageHandlers || {};
		self.ws.onmessage = function (message) {
			message = JSON.parse(message.data);
			const type = message.type;
			if (self.messageHandlers.hasOwnProperty(type)) {
				delete message.type;
				self.messageHandlers[type](self.ws, message);
			}
		};
	}

	onMessage(type, handler) {
		this.messageHandlers[type] = handler;
	};

	sendMessage(message) {
		if (this.ws.readyState === this.ws.OPEN) {
			this.ws.send(message);
		}
	}
}

export const chatSocket = new ChatSocketClient('ws://192.168.0.108:3000/', messageHandlers);