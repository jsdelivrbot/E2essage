/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from "react";
import {AppRegistry} from "react-native";
import {Router} from "./components/router";
import Provider from "react-redux/es/components/Provider";
import {MessengerStore} from "./utils/redux-stores";
import {chatSocket, createMessage} from "./communication/websocket-client";
import {SessionAsyncStorage} from "./utils/async-storage";
import {ReduxRouter} from "./utils/router";

export default class E2essage extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		SessionAsyncStorage.getSession().then(function (session) {
			session = JSON.parse(session);
			if (!session || !Object.keys(session).length) {
				ReduxRouter.go('login');
				return;
			}
			chatSocket.sendMessage(createMessage('authenticate', session))
		});
	}

	render() {
		return (
			<Provider store={MessengerStore}>
				<Router/>
			</Provider>
		);
	}
}

AppRegistry.registerComponent('client', () => E2essage);
