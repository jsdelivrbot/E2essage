import {Button, FlatList, ListView, StyleSheet, Text, TextInput, View} from "react-native";
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
import {CryptoTool} from "../encryption/crypto-tool";


class Mess extends Component {
	constructor(props) {
		super(props);
		this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.text !== r2.text});
	};

	componentWillMount(){
		this.props.setMessages([]);
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
		const self = this;
		const sendDate = new Date().toISOString();
		this.props.addMessage({
			text,
			sender: self.props.username,
			sendDate: new Date(sendDate)
		}, self.props.currentChatId);
		self._clearInput();
		CryptoTool.encrypt(text, this.props.publicKey).then(function (ciphertext) {
			chatSocket.sendMessage(createMessage('addMessage', {
				content: ciphertext.data,
				username: self.props.username,
				chatId: self.props.currentChatId,
				sendDate
			}, self.props.sessionId));
		});

	}

	render() {
		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
			}}>
				<Text style={styles.title}>Messages</Text>
				<FlatList
					ref='scroller'
					keyboardShouldPersistTaps='always'
					enableEmptySections={true}
					style={{flex: 1}}
					data={this.props.messages}
					keyExtractor={(item, index) => index}
					ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
					renderScrollComponent={props => <InvertibleScrollView {...props} inverted/>}
					renderItem={({item}) =>
						<Message text={item.text}
								 yours={item.sender === this.props.username}
								 sender={item.sender}
								 sendDate={new Date(item.sendDate)}
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
