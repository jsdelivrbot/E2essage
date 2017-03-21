/**
 * Created by sergiuu on 20.03.2017.
 */
const connect = require("../utils/mongo_client");

const Messages = {
	collectionName: 'messages',
	get: function (callback) {
		connect.then(function (db) {
			const collection = db.collection(Messages.collectionName);
			collection.find({}).toArray().then(function (array) {
				callback(array);
			}, function (error) {
				callback(error);
			});
		});
	},
	insert: function (message, callback) {
		let status = "No execution";
		connect.then(function (db) {
			const collection = db.collection(Messages.collectionName);
			collection.insertOne(message).then(function () {
				callback(message);
			}, function (error) {
				callback(`Error: ${error}`);
			});
		});
		return status;
	}
};

module.exports = Messages;
