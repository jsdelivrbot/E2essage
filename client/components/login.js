/**
 * Created by sergiuu on 11.06.2017.
 */

import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {Button, Text, TextInput, View} from "react-native";
import {stateToProps} from "../utils/prop-mapping";
import {chatSocket, createMessage} from "../communication/websocket-client";

class LoginComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			password: '',
		}
	}

	//TODO add server side authentication
	authenticate() {
		chatSocket.sendMessage(createMessage('login', {
			username: this.state.user,
			password: this.state.password
		}));
	}

	render(){
		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
			}}>
				<Text style={{
					textAlign: 'center',
					fontSize: 18,
					color: 'red'
				}}>{this.props.errorMessage}</Text>
				<TextInput
					ref="user"
					style={{textAlign: 'center', fontSize: 18}}
					value={this.state.user}
					placeholder="Username"
					returnKeyType={"next"}
					onChangeText={(user) => this.setState({...this.state, user})}
					blurOnSubmit={false}
					onSubmitEditing={() => {
						this.refs.password.focus();
					}}
				/>
				<TextInput
					ref="password"
					style={{textAlign: 'center', fontSize: 18}}
					value={this.state.password}
					placeholder="Password"
					secureTextEntry={true}
					onChangeText={(password) => this.setState({...this.state, password})}
					blurOnSubmit={false}
					onSubmitEditing={this.authenticate.bind(this)}
				/>
				<Button ref="login" onPress={this.authenticate.bind(this)} title="LOGIN"/>
			</View>
		);
	}
}

export const Login = connect(stateToProps.login)(LoginComponent);