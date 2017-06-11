/**
 * Created by sergiuu on 11.06.2017.
 */

import React, {Component} from "react";
import {ReduxRouter} from "../utils/router";
import {Button, Text, TextInput, View} from "react-native";

export class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			password: '',
			errorMessage: ''
		}
	}

	//TODO add server side authentication
	authenticate() {
		if (this.state.user === 'uifi95' && this.state.password === '1234') {
			this.setState({...this.state, errorMessage: ''});
			ReduxRouter.go('messages');
		} else {
			this.setState({...this.state, errorMessage: 'Invalid Login'})
		}
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
				}}>{this.state.errorMessage}</Text>
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