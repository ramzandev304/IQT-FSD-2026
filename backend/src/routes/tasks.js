const express = require('express');
const pool = require('../db/pool');

const router = express.Router();
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// GET /api/tasks - list all tasks
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY completed ASC, due_date ASC NULLS LAST, created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks - create a task
router.post('/', async (req, res, next) => {
  try {
    const { title, description, priority, due_date } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    const nextPriority = priority && VALID_PRIORITIES.includes(priority) ? priority : 'medium';

    const result = await pool.query(
      'INSERT INTO tasks (title, description, priority, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title.trim(), description || null, nextPriority, due_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id - update a task (title, description, completed, priority, due_date)
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, due_date } = req.body;

    const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'task not found' });
    }

    const current = existing.rows[0];
    const nextTitle = title !== undefined ? title : current.title;
    const nextDescription = description !== undefined ? description : current.description;
    const nextCompleted = completed !== undefined ? completed : current.completed;
    const nextDueDate = due_date !== undefined ? due_date : current.due_date;
    let nextPriority = priority !== undefined ? priority : current.priority;

    if (!nextTitle || !String(nextTitle).trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    if (!VALID_PRIORITIES.includes(nextPriority)) {
      return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
    }

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, completed = $3, priority = $4, due_date = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [nextTitle, nextDescription, nextCompleted, nextPriority, nextDueDate, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'task not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
