const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    // console.log(files);
    res.render("index", { files: files });
  }); 
});

app.post("/create", (req, res) => {
  const filePath = `./files/${req.body.title.split(" ").join("")}.txt`;
  fs.writeFile(filePath, req.body.details, (err) => {
    res.redirect("/");
  });
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
    res.render("show", { fileName: req.params.filename, data: data });
  });
});

app.get("/edit/:filename", (req, res) => {
  res.render("edit", { filename: req.params.filename });
});

app.post("/edit", (req, res) => {
  const PrevfilePath = `./files/${req.body.previousTitle}`;
  const NewfilePath = `./files/${req.body.newTitle}`;
  fs.rename(PrevfilePath, NewfilePath, (err) => {
    console.log(req.body);
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
