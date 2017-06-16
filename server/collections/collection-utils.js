/**
 * Created by sergiuu on 20.04.2017.
 */
const _ = require('underscore');
const connect = require("../utils/mongo_client");
const ObjectId = require('mongodb').ObjectID;

function checkAllowedFields(data, allowedFields) {
	let dataKeys;
	if (data instanceof Array) {
		dataKeys = [];
		_.each(data, function (object) {
			dataKeys = _.union(dataKeys, _.keys(object))
		});
	} else if (data instanceof Object) {
		dataKeys = _.keys(data);
	}
	return _.difference(dataKeys, allowedFields).length === 0;
}

class MongoCollection {
	constructor(collectionName, allowedFields) {
		const self = this;
		self.collectionName = collectionName;
		self.allowedFields = allowedFields;
		connect.then(function (db) {
			db.collection(self.collectionName);
		});
	}
	find(query, callback) {
		const self = this;
		if (query._id) {
			query._id = ObjectId(query._id);
		}
		connect.then(function (db) {
			const collection = db.collection(self.collectionName);
			collection.find(query).toArray().then(function (array) {
				callback(array, null);
			}, function (error) {
				callback(null, error);
			});
		});
	}
	findOne(query, callback) {
		const self = this;
		if (query._id) {
			query._id = ObjectId(query._id);
		}
		connect.then(function (db) {
			const collection = db.collection(self.collectionName);
			collection.findOne(query).then(function (document) {
				callback(document, null);
			}, function (error) {
				callback(null, error);
			});
		});
	}
	insert(data, callback) {
		const self = this;
		if (!checkAllowedFields(data, self.allowedFields)) {
			callback({ errorType: "validation", error: "invalidFieldsFound" });
			return;
		}
		connect.then(function (db) {
			const collection = db.collection(self.collectionName);
			let promise;
			if (data instanceof Array) {
				promise = collection.insertMany(data);
			} else if (data instanceof Object) {
				promise = collection.insertOne(data);
			}
			promise.then(function (result) {
				callback(_.extend({_id: result.insertedId}, data));
			}, function (error) {
				callback(error);
			});
		});
	}
}

module.exports.MongoCollection = MongoCollection;
module.exports.checkAllowedFields = checkAllowedFields;