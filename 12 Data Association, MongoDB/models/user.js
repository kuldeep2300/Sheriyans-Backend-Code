const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/testingDB");

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  age: Number,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post", // Reference to the post model
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
