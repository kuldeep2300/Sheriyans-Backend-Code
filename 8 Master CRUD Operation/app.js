const express = require("express");
const app = express();

const userModel = require("./usermodel");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/create", async (req, res) => {
  let createdUser = await userModel.create({
    name: "Kushagra Verma",
    email: "kushagra.dev@gmail.com",
    username: "kushagra_dev",
  });

  res.send(createdUser);
});

app.get('/read', async (req, res) => {
   let users = await userModel.find();
   res.send(users);
})

app.get('/update', async (req, res) => {
    let updatedUser = await userModel.findOneAndUpdate({username: "kuldeepdev"}, {name: "Kushagra Verma"}, {new: true});
    res.send(updatedUser);
});

app.get('/delete', async (req, res) => {
    let deleteUser = await userModel.findOneAndDelete({_id: "6880cf94a01593415e365fc0"});
    res.send(deleteUser);
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
