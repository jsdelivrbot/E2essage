/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from "react";
import {AppRegistry} from "react-native";
import Provider from "react-redux/es/components/Provider";
import {Messenger} from "./components/messenger";
import {MessengerStore} from "./utils/redux-stores";

export default class E2essage extends Component {
	render() {
		return (
			<Provider store={MessengerStore}>
				<Messenger/>
			</Provider>
		);
	}
}

AppRegistry.registerComponent('client', () => E2essage);
