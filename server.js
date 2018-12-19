const express = require('express');
const app = express();

const mongoose = require('mongoose');
// Use ES6 Promises
mongoose.Promise = global.Promise;

// Load environment & config variables.
require('dotenv').config();
const { PORT, DATABASE_URL, JWT_SECRET } = require('./config');

const cors = require('cors');

app.use(
  cors({
    origin: "*"
  })
);

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};