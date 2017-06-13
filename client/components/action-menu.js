/**
 * Created by sergiuu on 13.06.2017.
 */
import React, {Component} from "react";
import {FlatList, StyleSheet} from "react-native";
import ActionButton from "react-native-action-button";
import Icon from 'react-native-vector-icons/Ionicons';

export class ActionMenu extends Component{
	render() {
		const renderButtons = this.props.buttons.map(function (button, index) {
			return (
				<ActionButton.Item key={index} buttonColor={button.buttonColor} title={button.title} onPress={button.onPress}>
					<Icon name={button.icon} style={styles.actionButtonIcon} />
				</ActionButton.Item>
			);
		});
		return (
			<ActionButton buttonColor="rgba(231,76,60,1)">
				{renderButtons}
			</ActionButton>
		);
	}
}

const styles = StyleSheet.create({
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white',
	},
});