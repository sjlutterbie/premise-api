const express = require('express');
const app = express();

const cors = require('cors');

app.use(
  cors({
    origin: "*"
  })
);

const PORT = process.env.PORT || 8080;

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};