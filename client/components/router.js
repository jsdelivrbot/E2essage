/**
 * Created by sergiuu on 11.06.2017.
 */


import React, {Component} from "react";
import {View} from "react-native";
import {Messenger} from "./messenger";
import {Login} from "./login";
import connect from "react-redux/es/connect/connect";
import {dispatchToProps, stateToProps} from "../utils/prop-mapping";
import {ChatThreads} from "./chat-threads";
import {Register} from "./register";

class RouterComponent extends Component {
	constructor(props){
		super(props);
		this._routes = {
			login: (<Login/>),
			register: (<Register/>),
			chatThreads: (<ChatThreads/>),
			messages: (<Messenger/>),
		};
	}

	render() {
		const routes = this._routes;
		return (
			<View style={{
				flex: 1
			}}>
				{routes[this.props.route]}
			</View>
		);
	}
}

export const Router = connect(stateToProps.router, dispatchToProps.router)(RouterComponent);