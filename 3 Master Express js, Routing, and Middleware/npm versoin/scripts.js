const express = require("express");
const app = express();

// Middleware - Es server me sbse kuch bhi request aaye sbse phle middleware chalega
app.use((req, res, next) => {
    console.log("Phli bar middleware chala!");
    next(); // Ye next function call karega next middleware ko
});

app.use((req, res, next) => {
    console.log("Dusri bar middleware chala!");
    next(); // Ye next function call karega next middleware ko
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!"); 
});

app.get("/about", (req, res) => {
    res.send("This is the About Page!");
});

app.get("/contact", (req, res, next) => {
    // res.send("This is the Contact Page!");
    return next(new Error("Contact page not found!"));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong! Please try again later.");
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});