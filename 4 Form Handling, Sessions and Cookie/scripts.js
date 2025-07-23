const express = require('express');
const app = express();

app.use(express.json()); // Read JSON format data use this middleware
app.use(express.urlencoded({ extended: true })); // Read form URL Encoded data