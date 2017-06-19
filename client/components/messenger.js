import {Button, ListView, StyleSheet, Text, TextInput, View} from "react-native";
import connect from "react-redux/es/connect/connect";
import React, {Component} from "react";
import Message from "./message";
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import {dispatchToProps, stateToProps} from "../utils/prop-mapping";
import {MessagesAsyncStorage} from "../utils/async-storage";
import {MessengerStore} from "../utils/redux-stores";
import {ReduxRouter} from "../utils/router";
import * as BackHandler from "react-native/Libraries/Utilities/BackHandler.android";
import {chatSocket, createMessage} from "../communication/websocket-client";


class Mess extends Component {
	constructor(props) {
		super(props);
		// MessagesAsyncStorage.getMessages(`@Storage:messages#${this.props.currentChatId}`).then((messages) => {
		// 	MessengerStore.dispatch({
		// 		type: 'setMessages',
		// 		messages: JSON.parse(messages) || []
		// 	});
		// });
		this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.text !== r2.text});
	};

	componentWillMount(){
		chatSocket.sendMessage(createMessage('getMessages', {query: { chatId: this.props.currentChatId}}, this.props.sessionId));
	}

	componentDidMount() {
		BackHandler.addEventListener('backPress', () => {
			ReduxRouter.go('chatThreads');
			return true;
		});
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('backPress');
	}

	_clearInput() {
		this.refs.messageInput.setNativeProps({text: ''});
		this.props.setInputText('');
	}

	_addMessage(text) {
		chatSocket.sendMessage(createMessage('addMessage', {
			content: text,
			username: this.props.username,
			chatId: this.props.currentChatId,
			sendDate: new Date().toISOString()
		}, this.props.sessionId));
		this._clearInput();
	}

	render() {
		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
			}}>
				<Text style={styles.title}>Messages</Text>
				<ListView
					ref='scroller'
					keyboardShouldPersistTaps='always'
					enableEmptySections={true}
					style={{flex: 1}}
					dataSource={this.dataSource.cloneWithRows(this.props.messages)}
					renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
					renderScrollComponent={props => <InvertibleScrollView {...props} inverted/>}
					renderRow={(row) =>
						<Message text={row.text}
								 yours={row.sender === this.props.username}
								 sender={row.sender}
								 sendDate={new Date(row.sendDate)}
						/>}
				/>
				<View style={{
					height: 40,
					flexDirection: 'row',
				}}>
					<TextInput
						ref="messageInput"
						style={{height: 40, flex: 5, fontSize: 18}}
						placeholder="What do you want to say?"
						onChangeText={(text) => this.props.setInputText(text)}
					/>
					<Button
						style={[styles.sendButton, {height: 40, flex: 2}]}
						title="SEND"
						color='#37474f'
						onPress={() => {
							this.props.inputText && this._addMessage(this.props.inputText);
						}}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	title: {
		color: 'white',
		padding: 10,
		backgroundColor: '#37474f',
		fontWeight: 'bold',
		fontSize: 30,
	},
	sendButton: {
		color: '#eceff1',
	},
	separator: {
		flex: 1,
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#8E8E8E',
	},
});

export const Messenger = connect(stateToProps.messenger, dispatchToProps.messenger)(Mess);
