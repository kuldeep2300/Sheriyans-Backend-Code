const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/mongoPractice");

let userSchema = mongoose.Schema({
  name: "String",
  email: "String",
  username: "String",
});

module.exports = mongoose.model("user", userSchema);
