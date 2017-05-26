/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from "react";
import {AppRegistry, Button, ListView, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {createStore} from "redux";
import Provider from "react-redux/es/components/Provider";
import connect from "react-redux/es/connect/connect";

const actions = {
	addMessage: function (state, action) {
		return {
			...state,
			blinks: [...state.blinks, action.message]
		}
	},
	setInputText: function (state, action) {
		return {
			...state,
			inputText: action.text
		}
	}
};

const initialState = {
	inputText: '',
	blinks: []
};

function messenger(state = initialState, action) {
	const operation = actions[action.type];
	return operation ? operation(state, action) : state;
}

function mapStateToProps(state) {
	return state;
}

const store = createStore(messenger);

export default class E2essage extends Component {
	render() {
		return (
			<Provider store={store}>
				<Messenger/>
			</Provider>
		);
	}
}

class Mess extends Component {
	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.text !== r2.text});
	};

	addMessage(text) {
		store.dispatch({
			type: 'addMessage',
			message: {
				text,
				style: styles.bigRed
			}
		});
		this.refs.messageInput.setNativeProps({text: ''});
		this.setInputText('');
	}

	setInputText(text) {
		store.dispatch({
			type: 'setInputText',
			text
		})
	}

	render() {
		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
			}}>
				<Text style={styles.bigRed}>Messages</Text>
				<ScrollView
					ref='messages'
					keyboardShouldPersistTaps='always'
					onContentSizeChange={(contentWidth, contentHeight) =>
					{this.refs.messages.scrollTo({y: contentHeight});
					}}
				>
					<ListView
						enableEmptySections={true}
						styles={{flex: 1}}
						dataSource={this.ds.cloneWithRows(this.props.blinks)}
						renderRow={(row) => <Text style={row.style}>{row.text}</Text>}
					/>
				</ScrollView>
				<View style={{
					flexDirection: 'row',
				}}>
					<TextInput
						ref="messageInput"
						style={{height: 40, flex: 3}}
						placeholder="What do you want to say?"
						onChangeText={(text) => this.setInputText(text)}
					/>
					<Button
						style={{height: 40, flex: 1}}
						title="Send"
						onPress={() => {
							this.props.inputText && this.addMessage(this.props.inputText);
						}}
					/>
				</View>
			</View>
		)
	}
}

const Messenger = connect(mapStateToProps)(Mess);

const styles = StyleSheet.create({
	bigRed: {
		color: 'red',
		fontWeight: 'bold',
		fontSize: 30,
	},
	blue: {
		color: 'blue',
	}
});


AppRegistry.registerComponent('client', () => E2essage);
