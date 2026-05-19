const Task = require('../models/Task');

// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    next(err); // <--- will work now
  }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const task = await Task.create({ title, description, user: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.user.toString() !== req.user.id)
      return res.status(403).json({ error: 'Not authorized' });

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// src/controllers/taskController.js

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Old: task.remove();
        await task.deleteOne(); // <-- updated

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };