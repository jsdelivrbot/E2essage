import {Button, ListView, StyleSheet, Text, TextInput, View} from "react-native";
import connect from "react-redux/es/connect/connect";
import React, {Component} from "react";
import Message from "./message";
import InvertibleScrollView from 'react-native-invertible-scroll-view';

class Mess extends Component {
	constructor(props) {
		super(props);
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
								 yours={row.text.length % 2 === 0}
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
