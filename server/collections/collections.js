/**
 * Created by sergiuu on 20.03.2017.
 */
const MongoCollection = require("./collection-utils").MongoCollection;

module.exports.Messages = new MongoCollection("messages", ["userId", "username", "content", "chatId", "sendDate"]);
module.exports.Users = new MongoCollection("users", ["username", "password", "phone"]);
module.exports.Sessions = new MongoCollection("sessions", ["username", "sessionId"]);
module.exports.Chats = new MongoCollection("chats", ["user1", "user2"]);
