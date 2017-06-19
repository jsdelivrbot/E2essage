/**
 * Created by sergiuu on 13.06.2017.
 */
import React, {Component} from "react";
import {Text, TouchableHighlight, View, StyleSheet} from "react-native";
import ActionButton from "react-native-action-button";


export class ChatThread extends Component {
	render() {
		return (
			<TouchableHighlight
				onPress={this.props.onPress}>
				<View style={styles.container}>
					<View style={styles.bubble}>
						<Text style={{fontSize: 40}}>{this.props.contact.charAt(0).toUpperCase()}</Text>
					</View>
					<Text style={styles.text}>{this.props.contact}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	text: {
		color: '#37474f',
		fontSize: 30,
	},
	bubble: {
		borderRadius: 50,
		width: 80,
		height: 80,
		backgroundColor: '#f5f5f5',
		marginRight: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	container: {
		flex: 1,
		flexDirection: 'row',
		paddingLeft: 8,
		paddingRight: 8,
		paddingBottom: 6,
		paddingTop: 6,
		backgroundColor: '#eceff1',
		alignItems: 'center',
	},
});