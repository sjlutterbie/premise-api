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

// Server Launch Functions

let server;

function runServer(databaseUrl, port = PORT) {
  
  return new Promise((resolve, reject) => {
    const connectOpts = {useNewUrlParser: true};
    mongoose.connect(databaseUrl, connectOpts, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        return resolve({status: 'Connected to server'});
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close( err => {
        if (err) {
          return reject(err);
        }
        resolve({status: 'Successfully closed server'});
      });
    })
    .catch(err => {});
  });
}

// If server.js is called directly, launch the server
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.log(err));
}


module.exports = {
  app,
  runServer,
  closeServer
};