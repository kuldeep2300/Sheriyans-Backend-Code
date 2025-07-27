const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    const cookie = jwt.sign({ email: "kuldeep.dev@gmail.com"}, "secretkey");
    res.cookie('token', cookie);
    res.send("Cookie has been set");
})

app.get('/read', (req, res) => {
  const data = jwt.verify(req.cookies.token, "secretkey");
  console.log(data);
})

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
