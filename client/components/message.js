/**
 * Created by sergiuu on 28.05.2017.
 */
import React, {Component} from "react";
import {Text, StyleSheet, View} from "react-native";

export default class Message extends Component {
	render() {
		return (
			<View
				style={styles.container}
			>
				<Text style={this.props.yours ? styles.text : styles.yourText}>{this.props.text}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	text: {
		color: 'red',
		fontSize: 20,
	},
	yourText: {
		color: '#37474f',
		fontSize: 20,
	},
	container: {
		height: 60,
		paddingLeft: 8,
		paddingRight: 8,
		paddingBottom: 6,
		paddingTop: 6,
		backgroundColor: '#eceff1',
		borderBottomColor: '#37474f',
		borderBottomWidth: 1,
	}
});