/**
 * Created by sergiuu on 19.06.2017.
 */
/**
 * Created by sergiuu on 11.06.2017.
 */

import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {Button, Text, TextInput, View} from "react-native";
import {dispatchToProps, stateToProps} from "../utils/prop-mapping";
import {chatSocket, createMessage} from "../communication/websocket-client";
import {ReduxRouter} from "../utils/router";

class RegisterComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			password: '',
			confirmPassword: ''
		}
	}

	handleRegisterErrors() {
		if (!this.state.user.match(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+$/g)) {
			return 'Username not valid';
		}
		if (!this.state.password) {
			return 'Password not filled in';
		}
		if (!this.state.confirmPassword) {
			return 'Confirm Password not filled in';
		}
		if (this.state.confirmPassword !== this.state.password) {
			return 'Passwords do not match';
		}
		return null;
	}

	register() {
		const errorMessage = this.handleRegisterErrors();
		if (errorMessage) {
			this.props.setErrorMessage(errorMessage);
			return;
		}
		chatSocket.sendMessage(createMessage('register', {
			username: this.state.user,
			password: this.state.password,
		}));
	}

	componentWillMount() {
		this.props.setErrorMessage('');
	}

	render(){
		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				paddingLeft: 40,
				paddingRight: 40,
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
					onSubmitEditing={() => {
						this.refs.confirmPassword.focus();
					}}
				/>
				<TextInput
					ref="confirmPassword"
					style={{textAlign: 'center', fontSize: 18}}
					value={this.state.confirmPassword}
					placeholder="Confirm Password"
					secureTextEntry={true}
					onChangeText={(confirmPassword) => this.setState({...this.state, confirmPassword})}
					onSubmitEditing={this.register.bind(this)}
				/>
				<Button ref="register" onPress={this.register.bind(this)} title="REGISTER"/>
				<Text style={{
					marginTop: 15,
					textAlign: 'center',
					fontSize: 16,
					color: 'gray'
				}}
					  onPress={() => ReduxRouter.go('login')}
				>Already have an account? Log in</Text>
			</View>
		);
	}
}

export const Register = connect(stateToProps.register, dispatchToProps.register)(RegisterComponent);