// // src/app.js
// require('dotenv').config();

// const express = require('express');
// const mongoose = require('mongoose');

// const authRoutes = require('./routes/authRoutes');
// const taskRoutes = require('./routes/taskRoutes');

// const app = express();

// // Middleware
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);

// // ================================
// // MongoDB Connection (SAFE)
// // ================================
// if (process.env.NODE_ENV !== 'test') {
//   mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));
// }

// // ================================
// // Start Server (SAFE)
// // ================================
// let server;

// if (process.env.NODE_ENV !== 'test') {
//   const PORT = process.env.PORT || 5000;

//   server = app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }

// // ================================
// // Export for testing
// // ================================
// module.exports = app;

// // Optional: export server for cleanup if needed
// module.exports.server = server;

// src/app.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// MongoDB connection ONLY
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = app;