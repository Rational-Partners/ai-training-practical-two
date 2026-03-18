const { tasks } = require('./data');

// In-memory user store
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

function getUsers() {
  return users;
}

function getUserById(id) {
  return users.find(u => u.id === id);
}

/**
 * Get all tasks assigned to a user
 */
function getUserTasks(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  return tasks.filter(t => t.assigneeId === user.id);
}

module.exports = { getUsers, getUserById, getUserTasks };
