import { Button, ListView, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import connect from "react-redux/es/connect/connect";
import * as AsyncStorage from "react-native/Libraries/Storage/AsyncStorage";
import React, {Component} from "react";

class Mess extends Component {
	constructor(props) {
		super(props);
		const self = this;
		AsyncStorage.getItem('@Storage:messages').then(function (messages) {
			self.props.setMessages(JSON.parse(messages) || []);
		});
		this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.text !== r2.text});
	};

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
						dataSource={this.dataSource.cloneWithRows(this.props.messages)}
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
						onChangeText={(text) => this.props.setInputText(text)}
					/>
					<Button
						style={{height: 40, flex: 1}}
						title="Send"
						onPress={() => {
							this.props.inputText && this.props.addMessage(this.props.inputText);
						}}
					/>
				</View>
			</View>
		)
	}
}

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

function mapStateToProps(state) {
	return {
		inputText: state.inputText,
		messages: state.messages
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addMessage(text) {
			dispatch({
				type: 'addMessage',
				message: {
					text,
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
		}
	}
}

export const Messenger = connect(mapStateToProps, mapDispatchToProps)(Mess);
