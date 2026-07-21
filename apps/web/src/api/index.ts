import express from 'express';

const app = express();

const tasks = [
  {
    id: 'task-1',
    title: 'Design new dashboard layout',
    description: '<p>Create a modern and user-friendly dashboard with key metrics and analytics.</p>',
    statusId: 'in-progress',
    tagIds: ['feature'],
    priority: 'high',
    dueDate: '2024-12-20',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 0,
    archived: false,
  },
  {
    id: 'task-2',
    title: 'Fix login bug on mobile',
    description: '<p>Users are unable to login on mobile devices. Need to investigate and fix the authentication flow.</p>',
    statusId: 'todo',
    tagIds: ['bug'],
    priority: 'urgent',
    dueDate: '2024-12-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 1,
    archived: false,
  },
  {
    id: 'task-3',
    title: 'Write API documentation',
    description: '<p>Document all REST API endpoints with examples and error handling information.</p>',
    statusId: 'todo',
    tagIds: ['documentation'],
    priority: 'medium',
    dueDate: '2024-12-25',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 2,
    archived: false,
  },
  {
    id: 'task-4',
    title: 'Implement dark mode',
    description: '<p>Add dark mode support throughout the application with theme switching capability.</p>',
    statusId: 'review',
    tagIds: ['enhancement'],
    priority: 'medium',
    dueDate: '2024-12-22',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 3,
    archived: false,
  },
  {
    id: 'task-5',
    title: 'Optimize database queries',
    description: '<p>Review and optimize slow database queries to improve application performance.</p>',
    statusId: 'done',
    tagIds: ['enhancement'],
    priority: 'low',
    dueDate: '2024-12-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 4,
    archived: false,
  },
];

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

app.listen(3000, () => {
  console.log('API server running on http://localhost:3000');
});
