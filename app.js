const express = require('express');
const mongoose = require("mongoose");

const app = express();

app.get('/', (req, res) => {
  res.send('It works!');
})


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});