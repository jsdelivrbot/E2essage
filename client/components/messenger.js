import {Button, ListView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import connect from "react-redux/es/connect/connect";
import * as AsyncStorage from "react-native/Libraries/Storage/AsyncStorage";
import React, {Component} from "react";
import Message from "./message";

class Mess extends Component {
	constructor(props) {
		super(props);
		const self = this;
		AsyncStorage.getItem('@Storage:messages').then(function (messages) {
			self.props.setMessages(JSON.parse(messages) || []);
		});
		this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.text !== r2.text});
	};

	_clearInput() {
		this.refs.messageInput.setNativeProps({text: ''});
		this.props.setInputText('');
	}

	_addMessage(text) {
		this.props.addMessage(text);
		this._clearInput();
	}

	_isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
		return layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
	};

	render() {
		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
			}}>
				<Text style={styles.title}>Messages</Text>
				<ScrollView
					ref='scroller'
					style={{
						flex: 1,
					}}
					keyboardShouldPersistTaps='always'
					onScroll={(event) => {
						this.props.setAutoScroll(this._isCloseToBottom(event.nativeEvent))}
					}
					scrollEventThrottle={10}
					onContentSizeChange={(contentWidth, contentHeight) => {
						this._scrollToBottom = () => this.refs.scroller.scrollTo({y: contentHeight});
						if (this.props.autoScroll) {
							this._scrollToBottom();
						}
					}}
				>
					<ListView
						enableEmptySections={true}
						style={{flex: 1}}
						dataSource={this.dataSource.cloneWithRows(this.props.messages)}
						renderRow={(row) =>
							<Message text={row.text}
									 yours={row.text.length % 2 === 0}
									 sender={row.sender}
									 sendDate={new Date(row.sendDate)}
							/>}
					/>
				</ScrollView>

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
	}
});

function mapStateToProps(state) {
	return {
		inputText: state.inputText,
		messages: state.messages,
		autoScroll: state.autoScroll
	};
}

function mapDispatchToProps(dispatch) {
	return {
		//TODO add server side values here
		addMessage(text) {
			dispatch({
				type: 'addMessage',
				message: {
					text,
					sender: 'Sergiu',
					sendDate: new Date()
				}
			});
		},
		setInputText(text) {
			dispatch({
				type: 'setInputText',
				text
			});
		},
		setMessages(messages) {
			dispatch({
				type: 'setMessages',
				messages
			});
		},
		setAutoScroll(scroll) {
			dispatch({
				type: 'setAutoScroll',
				scroll
			})
		}
	}
}

export const Messenger = connect(mapStateToProps, mapDispatchToProps)(Mess);
