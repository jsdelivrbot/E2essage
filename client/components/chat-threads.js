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


class Threads extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newChatText: ''
		}
	};

	openChatThread(chatId) {
		this.props.setCurrentChatId(chatId);
		ReduxRouter.go('messages');
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<Modal
					animationType={"slide"}
					transparent={true}
					visible={this.props.modalVisible}
					onRequestClose={() => {alert("Modal has been closed.")}}
				>
					<View style={{
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
						<TextInput
							ref="messageInput"
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
									if (this.state.newChatText.length) {
										this.props.addChatThread({
											text: this.state.newChatText,
											//TODO add server side guid generation
											chatId: this.state.newChatText
										});
										this.setState({newChatText: ''});
									}
									this.props.toggleModal()
								}}/>
							</View>
							<View
								style={{margin: 10}}
							>
								<Button title="Cancel" onPress={() => this.props.toggleModal()}/>
							</View>
						</View>
					</View>
				</Modal>
				<FlatList
					data={this.props.chatThreads}
					keyExtractor={(item) => item.chatId}
					ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
					renderItem={({item}) => (
						<ChatThread text={item.text} onPress={() => this.openChatThread(item.chatId)}/>
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