const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {
  const { username, email, password, age } = req.body;

  // Generate Salt
  const salt = await bcrypt.genSalt(10);

  // Hash Password
  const hashedPasswod = await bcrypt.hash(password, salt);

  let createdUser = await userModel.create({
    username,
    email,
    password: hashedPasswod,
    age,
  });

  const token = jwt.sign({ email }, "secretkey");
  res.cookie("token", token);
  res.send(createdUser);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  console.log(user);
  if (!user) {
    return res.status(400).send("User not found");
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = jwt.sign({ email }, "secretkey");
      res.cookie("token", token);
      res.send("Login successfully");
    } else {
      return res.status(400).send("Invalid password");
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.listen(3000, () => {
  console.log(`Server is ruuning on http://localhost:3000`);
});
