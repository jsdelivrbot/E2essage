/**
 * Created by sergiuu on 28.05.2017.
 */
import React, {Component} from "react";
import {Text, StyleSheet, View, TouchableHighlight} from "react-native";
import {formatMessageDate} from "../utils/date-utils";


export default class Message extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showDate: false,
			dateString: null,
		}
	}

	_toggleDate() {
		const dateString = this.state.showDate ? null : formatMessageDate(this.props.sendDate, new Date());
		this.setState({ showDate: !this.state.showDate, dateString});
	}

	render() {
		const showDate = this.state.showDate;
		const dateString = this.state.dateString;
		return (
			<TouchableHighlight
				onPress={this._toggleDate.bind(this)}>
				<View style={[styles.container, this.props.yours && styles.yourContainer]}>
					<Text style={styles.sender}>{showDate && dateString}</Text>
					<Text style={styles.text}>{this.props.text}</Text>
					<Text style={styles.sender}>{this.props.sender}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	text: {
		color: '#37474f',
		fontSize: 18,
	},
	sender: {
		color: '#37474f',
		fontSize: 12,
	},
	container: {
		paddingLeft: 8,
		paddingRight: 8,
		paddingBottom: 6,
		paddingTop: 6,
		backgroundColor: '#eceff1',
	},
	yourContainer: {
		alignItems: 'flex-end',
	}
});