/**
 * Created by sergiuu on 11.06.2017.
 */


import React, {Component} from "react";
import {View} from "react-native";
import {Messenger} from "./messenger";
import {MessagesAsyncStorage} from "../utils/async-storage";
import {MessengerStore} from "../utils/redux-stores";
import {Login} from "./login";
import connect from "react-redux/es/connect/connect";

class RouterComponent extends Component {
	constructor(props){
		super(props);
		this._routes = {
			login: (<Login/>),
			messages: (<Messenger/>),
		};
	}

	render() {
		const routes = this._routes;
		MessagesAsyncStorage.getMessages('@Storage:messages').then((messages) => {
			MessengerStore.dispatch({
				type: 'setMessages',
				messages: JSON.parse(messages) || []
			});
		});
		return (
			<View style={{
				flex: 1
			}}>
				{routes[this.props.route]}
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		route: state.route
	};
}

function mapDispatchToProps(dispatch) {
	return {
		//TODO add server side values here
		setRoute(route) {
			dispatch({
				type: 'setRoute',
				route
			});
		}
	}
}

export const Router = connect(mapStateToProps, mapDispatchToProps)(RouterComponent);