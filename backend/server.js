const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voicetasker';

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies

// Database Connection
// We use Mongoose to connect to MongoDB (Atlas or Local)
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- API Routes ---

/**
 * GET /api/tasks
 * Fetch all tasks, sorted by newest first.
 */
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: 'Failed to fetch tasks. Please try again later.' });
    }
});

/**
 * POST /api/tasks
 * Create a new task.
 * Required fields: title
 */
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        // Basic validation
        if (!title) {
            return res.status(400).json({ error: 'Title is required to create a task.' });
        }

        const newTask = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            createdAt: Date.now()
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(400).json({ error: 'Failed to create task. Please check your input.' });
    }
});

/**
 * PUT /api/tasks/:id
 * Update an existing task by ID.
 */
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Protect immutable fields
        delete updates.id;
        delete updates._id;

        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(400).json({ error: 'Failed to update task.' });
    }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task by ID.
 */
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(400).json({ error: 'Failed to delete task.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
