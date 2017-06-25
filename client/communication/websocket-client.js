/**
 * Created by sergiuu on 14.06.2017.
 */
import {messageHandlers} from "../communication/message-handlers";
import {sessionValid} from "./message-handlers";

export function createMessage(type, data, sessionId) {
	return JSON.stringify({type, sessionId, ...data});
}

class ChatSocketClient {
	constructor(address, messageHandlers) {
		const self = this;
		self.ws = new WebSocket(address);
		self.messageHandlers = messageHandlers || {};
		self.ws.onmessage = function (message) {
			message = JSON.parse(message.data);
			const type = message.type;
			if (self.messageHandlers.hasOwnProperty(type) && sessionValid(message.data)) {
				delete message.error;
				delete message.type;
				self.messageHandlers[type](self.ws, message.data);
			}
		};
	}

	onMessage(type, handler) {
		this.messageHandlers[type] = handler;
	};

	initialMessage(handler) {
		this.ws.onopen = () => handler(this.ws)
	}

	sendMessage(message) {
		if (this.ws.readyState === this.ws.OPEN) {
			this.ws.send(message);
		}
	}
}

export const chatSocket = new ChatSocketClient('ws://192.168.0.108:3000/', messageHandlers);