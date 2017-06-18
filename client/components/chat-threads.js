/**
 * Created by sergiuu on 13.06.2017.
 */
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableHighlight, View} from "react-native";
import {dispatchToProps, stateToProps} from "../utils/prop-mapping";
import {ActionMenu} from "./action-menu";
import {actioMenuButtons as actionMenuButtons} from "../utils/action-menu-buttons";
import {ChatThread} from "./chat-thread";
import {ReduxRouter} from "../utils/router";
import {chatSocket, createMessage} from "../communication/websocket-client";


class Threads extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newChatText: ''
		}
	};

	componentWillMount() {
		this.props.setErrorMessage('');
		chatSocket.sendMessage(createMessage('getChats', {}, this.props.sessionId))
	}

	openChatThread(chatId) {
		this.props.setCurrentChatId(chatId);
		ReduxRouter.go('messages');
	}

	chatAlreadyExists() {
		return this.props.chatThreads.filter((chat) => chat.contact === this.state.newChatText).length > 0;
	}

	modalTemplate() {
		return (<View style={{
			alignItems: 'center',
			justifyContent: 'center',
			margin: 25,
			marginTop: 'auto',
			marginBottom: 'auto',
			backgroundColor: 'white',
			elevation: 10
		}}>
			<Text
				style={{
					fontSize: 20,
					color: '#607d8b',
					margin: 15,
				}}
			>Start a new conversation</Text>
			<Text style={{
				textAlign: 'center',
				fontSize: 18,
				color: 'red'
			}}>{this.props.errorMessage}</Text>
			<TextInput
				ref="contactName"
				style={{
					height: 40,
					fontSize: 18,
					marginRight: 20,
					marginLeft: 20,
					textAlign: 'center',
					alignSelf: 'stretch'
				}}
				placeholder="Contact"
				value={this.state.newChatText}
				onChangeText={(text) => this.setState({newChatText: text})}
			/>
			<View style={{
				flexDirection: 'row',
				justifyContent: 'space-between'
			}}>
				<View
					style={{margin: 10}}
				>
					<Button title="OK" onPress={() => {
						if (this.chatAlreadyExists.call(this)) {
							this.props.setErrorMessage('Chat already exists');
							this.setState({newChatText: ''});
							return;
						}
						if (this.state.newChatText.length) {
							chatSocket.sendMessage(createMessage(
								'newChat',
								{username: this.state.newChatText},
								this.props.sessionId));
							this.setState({newChatText: ''});
						}
					}}/>
				</View>
				<View
					style={{margin: 10}}
				>
					<Button title="Cancel" onPress={() =>{
						this.setState({newChatText: ''});
						this.props.toggleModal()
					}}/>
				</View>
			</View>
		</View>);
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<Modal
					animationType={"slide"}
					transparent={true}
					visible={this.props.modalVisible}
					onRequestClose={() => {alert("Modal has been closed.")}}
				>{this.modalTemplate.call(this)}</Modal>

				<FlatList
					data={this.props.chatThreads}
					keyExtractor={(item) => item.chatId}
					ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
					renderItem={({item}) => (
						<ChatThread contact={item.contact} onPress={() => this.openChatThread(item.chatId)}/>
					)}
				/>
				<ActionMenu
					buttons={actionMenuButtons.chatThreads}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white',
	},
	separator: {
		flex: 1,
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#8E8E8E',
	}
});

export const ChatThreads = connect(stateToProps.chatThreads, dispatchToProps.chatThreads)(Threads);