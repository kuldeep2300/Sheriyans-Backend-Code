const express = require('express');
const app = express();
const path = require('path');

// Parsers setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setting up public static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/profile/:username', (req, res) => {
    res.send(`Profile page of ${req.params.username}`);
})

app.get('/profile/:username/:age', (req, res) => {
    res.send(`Welcome ${req.params.username}, you are ${req.params.age} years old!`);
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});