const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user");
const user = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/read", async (req, res) => {
  let users = await userModel.find();
  res.render("read", { users });
});

app.post("/create", async (req, res) => {
  const { name, email, image } = req.body;
  let createdUser = await userModel.create({
    image,
    email,
    name,
  });

  res.redirect("/read");
});

app.get("/edit/:userId", async (req, res) => {
  const { userId } = req.params;
  let user = await userModel.findOne({ _id: userId });
  res.render("edit", { user });
});

app.post("/update/:userId", async (req, res) => {
  const { userId } = req.params;
  const { image, email, name } = req.body;
  let updateUser = await userModel.findOneAndUpdate(
    { _id: userId },
    { image, email, name },
    { new: true }
  );
  res.redirect("/read");
});

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  let users = await userModel.findOneAndDelete({ _id: id });
  res.redirect("/read");
});

app.listen(3000, () => {
  console.log(`Server started at http://localhost:3000`);
});
