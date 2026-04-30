const db = require('../config/database');

const getAllTasks = (req, res) => {
    const userId = req.user.id;
    const query = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC';

    db.all(query, [userId], (err, tasks) => {
        if (err) {
            console.log('Error getting tasks:', err);
            return res.status(500).json({ message: 'Error getting tasks' });
        }
        res.json(tasks);
    });
};

const getTaskById = (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    const query = 'SELECT * FROM tasks WHERE id = ? AND user_id = ?';

    db.get(query, [taskId, userId], (err, task) => {
        if (err) {
            console.log('Error getting task:', err);
            return res.status(500).json({ message: 'Error getting task' });
        }
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    });
};

const createTask = (req, res) => {
    const { title, description, status } = req.body;
    const userId = req.user.id;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const query = 'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)';
    const taskStatus = status || 'pending';

    db.run(query, [title, description, taskStatus, userId], function(err) {
        if (err) {
            console.log('Error creating task:', err);
            return res.status(500).json({ message: 'Error creating task' });
        }
        console.log('New task created with id:', this.lastID);

        res.status(201).json({
            message: 'Task created successfully',
            task: {
                id: this.lastID,
                title,
                description,
                status: taskStatus,
                user_id: userId
            }
        });
    });
};

const updateTask = (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, description, status } = req.body;

    const checkQuery = 'SELECT * FROM tasks WHERE id = ? AND user_id = ?';

    db.get(checkQuery, [taskId, userId], (err, task) => {
        if (err) {
            console.log('Error finding task:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updatedTitle = title || task.title;
        const updatedDescription = description || task.description;
        const updatedStatus = status || task.status;

        const updateQuery = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?';

        db.run(updateQuery, [updatedTitle, updatedDescription, updatedStatus, taskId, userId], (err) => {
            if (err) {
                console.log('Error updating task:', err);
                return res.status(500).json({ message: 'Error updating task' });
            }
            res.json({
                message: 'Task updated successfully',
                task: {
                    id: taskId,
                    title: updatedTitle,
                    description: updatedDescription,
                    status: updatedStatus
                }
            });
        });
    });
};

const deleteTask = (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    const checkQuery = 'SELECT * FROM tasks WHERE id = ? AND user_id = ?';

    db.get(checkQuery, [taskId, userId], (err, task) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const deleteQuery = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';

        db.run(deleteQuery, [taskId, userId], (err) => {
            if (err) {
                console.log('Error deleting task:', err);
                return res.status(500).json({ message: 'Error deleting task' });
            }
            res.json({ message: 'Task deleted successfully' });
        });
    });
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };