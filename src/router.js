const { getUsers, getUserById, getUserTasks } = require('./users');
const { getTasks, getTaskById, createTask, updateTaskStatus } = require('./tasks');
const { getStats, incrementTaskCount } = require('./stats');

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

async function router(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  // Users
  if (path === '/api/users' && method === 'GET') {
    return { body: getUsers() };
  }

  if (path.match(/^\/api\/users\/\d+$/) && method === 'GET') {
    const id = parseInt(path.split('/')[3]);
    const user = getUserById(id);
    if (!user) return { status: 404, body: { error: 'User not found' } };
    return { body: user };
  }

  if (path.match(/^\/api\/users\/\d+\/tasks$/) && method === 'GET') {
    const id = parseInt(path.split('/')[3]);
    const tasks = getUserTasks(id);
    if (!tasks) return { status: 404, body: { error: 'User not found' } };
    return { body: tasks };
  }

  // Tasks
  if (path === '/api/tasks' && method === 'GET') {
    return { body: getTasks() };
  }

  if (path.match(/^\/api\/tasks\/\d+$/) && method === 'GET') {
    const id = parseInt(path.split('/')[3]);
    const task = getTaskById(id);
    if (!task) return { status: 404, body: { error: 'Task not found' } };
    return { body: task };
  }

  if (path === '/api/tasks' && method === 'POST') {
    const body = await parseBody(req);
    const task = await createTask(body);
    return { status: 201, body: task };
  }

  if (path.match(/^\/api\/tasks\/\d+\/status$/) && method === 'PATCH') {
    const id = parseInt(path.split('/')[3]);
    const body = await parseBody(req);
    const task = await updateTaskStatus(id, body.status);
    if (!task) return { status: 404, body: { error: 'Task not found' } };
    return { body: task };
  }

  // Stats
  if (path === '/api/stats' && method === 'GET') {
    return { body: getStats() };
  }

  return { status: 404, body: { error: 'Not found' } };
}

module.exports = { router };
