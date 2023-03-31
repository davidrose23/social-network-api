const express = require('express');
const mongoose = require('mongoose');
const routes = require('./api');
const { User, Thought } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/social-network-api';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define middleware
app.use(express.json());

// Load API routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
