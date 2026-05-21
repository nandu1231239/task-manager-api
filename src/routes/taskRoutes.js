const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

// Apply auth middleware to all task routes
router.use(auth);

// CRUD routes for tasks
router.get('/', getTasks);           // Get all tasks
router.post('/', createTask);        // Create a new task
router.put('/:id', updateTask);      // Update a task by ID
router.delete('/:id', deleteTask);   // Delete a task by ID

module.exports = router;