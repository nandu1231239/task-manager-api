// // src/server.js
// require('dotenv').config();
// const mongoose = require('mongoose');
// const app = require('./app');

// const PORT = process.env.PORT || 5000;

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected');

//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });

// src/server.js
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');
global.crypto = require('crypto');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    // IMPORTANT FIX: bind to 0.0.0.0
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });