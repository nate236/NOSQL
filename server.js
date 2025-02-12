// server.js
const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('MongoDB connection successful');
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
