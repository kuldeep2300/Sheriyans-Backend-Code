const express = require("express");
const app = express();

const userModel = require("./models/user");
const postModel = require("./models/post");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/create", async (req, res) => {
  let user = await userModel.create({
    username: "kuldeep_10",
    email: "kuldeep.dev@gmail.com",
    age: 21,
  });

  res.send(user);
});

app.get("/post/create", async (req, res) => {
  let post = await postModel.create({
    postdata: "This is a post-2",
    user: "68849f8440ea6b6712d452d4",
  });

  // Also user model ko bhi pata hona chaiye post ki id jaise post model ko user ki id pata hai
  let user = await userModel.findOne({_id: "68849f8440ea6b6712d452d4"});
  user.posts.push(post._id);
  await user.save();
  res.send({
    post, 
    user
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
