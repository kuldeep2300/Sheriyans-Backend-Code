const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("./models/user");
const postModel = require("./models/post");
const upload = require("./config/multer");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// API TO GET HOME PAGE
app.get("/", (req, res) => {
  res.render("index");
});

// API FOR REGISTER FORM
app.post("/register", async (req, res) => {
  const { username, name, email, age, password } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(400).send("User already exists");
  }

  if (!username || !name || !email || !age || !password) {
    return res.status(400).send("All fields are required");
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, salt);

  const registerUser = await userModel.create({
    username,
    name,
    email,
    age,
    password: hashedPassword,
  });

  let token = jwt.sign({ email, userid: registerUser._id }, "secretkey");
  res.cookie("token", token);
  res.status(200).redirect("/profile");
});

// API TO GET LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login");
});

// API FOR LOGIN FORM
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });

  if (!user) {
    return res.redirect("/");
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ email, userid: user._id }, "secretkey");
      res.cookie("token", token);
      res.status(200).redirect("/profile");
    } else {
      res.redirect("/login");
    }
  });
});

// API TO GET PROFILE PAGE
app.get("/profile", isLoggedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  // console.log(user);
  res.render("profile", { user });
});

// API TO CREATE NEW POST
app.post("/post", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  let { content } = req.body;
  let post = await postModel.create({
    user: user._id,
    content,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

// API TO DELETE ANY POST
app.get("/delete/:postid", async (req, res) => {
  const { postid } = req.params;
  const deletePost = await postModel.findOneAndDelete({ _id: postid });
  // console.log(deletePost);
  res.redirect("/profile");
});

// API TO GET EDIT POST PAGE
app.get("/edit/:postid", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.postid });
  res.render("edit", { post });
});

// API FOR EDITING A POST
app.post("/edit/:postid", isLoggedIn, async (req, res) => {
  let post = await postModel.findOneAndUpdate(
    { _id: req.params.postid },
    { content: req.body.content },
    { new: true }
  );
  res.redirect("/profile");
});

// API FOR LIKE POST
app.get("/like/:postid", isLoggedIn, async (req, res) => {
  let post = await postModel
    .findOne({ _id: req.params.postid })
    .populate("user");
  let userId = req.user.userid;

  if (post.likes.indexOf(userId) === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(userId), 1);
  }

  await post.save();
  res.redirect("/profile");
});

// API TO GET UPLOAD FILE PAGE

app.get("/profile/upload", isLoggedIn, (req, res) => {
  res.render("profileUpload");
});

app.post("/upload", isLoggedIn, upload.single("image"), async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  user.profilePic = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

// API FOR LOGOUT FUNCTIONALITY
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

// MIDDLEWARE TO CHECK IF USER IS LOGGED IN
function isLoggedIn(req, res, next) {
  let token = req.cookies.token;
  if (token === "" || token === undefined) {
    res.redirect("/login");
  } else {
    const data = jwt.verify(token, "secretkey");
    req.user = data;
    next();
  }
}

// API TO GET TEST PAGE
app.get("/test", (req, res) => {
  res.render("test");
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
