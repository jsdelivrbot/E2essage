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

export default class E2essage extends Component {
	constructor(props) {
		super(props);
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
