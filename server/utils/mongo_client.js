/**
 * Created by sergiuu on 20.03.2017.
 */
const mongoClient = require('mongodb').MongoClient;
const config = require("../package.json");
const address = "localhost";
const url = `mongodb://${config.dbInfo.user}:${config.dbInfo.password}@${config.dbInfo.address}:${config.dbInfo.port}/${config.dbInfo.dbName}`;
const connection = mongoClient.connect(url);

module.exports = connection;

