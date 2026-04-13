const { tasks } = require('./data');
const { incrementTaskCount, decrementTaskCount } = require('./stats');

let nextId = 100;

function getTasks() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find(t => t.id === id);
}

/**
 * Create a new task
 */
async function createTask({ title, description, assigneeId, priority = 'medium' }) {
  // Simulate async database operation
  await new Promise(resolve => setTimeout(resolve, 10));

  const task = {
    id: nextId++,
    title,
    description,
    assigneeId,
    priority,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);

  // Update stats
  await incrementTaskCount();

  return task;
}

/**
 * Update task status
 */
async function updateTaskStatus(id, newStatus) {
  const task = tasks.find(t => t.id === id);
  if (!task) return null;

  const oldStatus = task.status;
  task.status = newStatus;

  if (oldStatus !== 'completed' && newStatus === 'completed') {
    await incrementTaskCount();
  }
  if (oldStatus === 'completed' && newStatus !== 'completed') {
    await decrementTaskCount();
  }

  return task;
}

module.exports = { getTasks, getTaskById, createTask, updateTaskStatus };
