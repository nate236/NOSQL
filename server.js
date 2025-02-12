const express = require('express');
const db = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Listen for errors on the database connection
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Start the server once the database connection is open
db.once('open', () => {
  console.log('MongoDB connection successful');
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});