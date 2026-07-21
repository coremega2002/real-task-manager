import { Router } from 'express';

const router = Router();

import { Pool } from 'pg';

const pool = new Pool();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tm_tasks ORDER BY task_order');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Add a new task
router.post('/', async (req, res) => {
  const { title, description, statusId, tagIds, priority, dueDate, order, archived } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tm_tasks (title, description, status_id, tag_ids, priority, due_date, task_order, archived) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, statusId, tagIds, priority, dueDate, order, archived]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Error adding task' });
  }
});

// Update an existing task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, statusId, tagIds, priority, dueDate, order, archived } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tm_tasks SET title = $1, description = $2, status_id = $3, tag_ids = $4, priority = $5, due_date = $6, task_order = $7, archived = $8, updated_at = NOW() WHERE id = $9 RETURNING *',
      [title, description, statusId, tagIds, priority, dueDate, order, archived, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tm_tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

export default router;
