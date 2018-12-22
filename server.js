const express = require('express');
const app = express();

const mongoose = require('mongoose');
// Use ES6 Promises
mongoose.Promise = global.Promise;

// Load environment & config variables.
require('dotenv').config();
const { PORT, DATABASE_URL, JWT_SECRET } = require('./config');


// MIDDLEWARE

const cors = require('cors');
const morgan = require('morgan');


// ROUTES
const { router: userRouter } = require('./user');
  app.use('/api/user', userRouter);
const { router: storyNetworkRouter } = require('./storyNetwork');
  app.use('/api/story-network', storyNetworkRouter);
const { router: momentRouter } = require('./moment');
  app.use('/api/moment', momentRouter);

app.use(
  cors({
    origin: "*"
  })
);

app.use(morgan('common'));

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

// SERVER LAUNCH FUNCTIONS

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
  
  return mongoose.disconnect()
    .then(() => {
      server.close(err => {
        if (err) {
          return err;
        }
      });
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