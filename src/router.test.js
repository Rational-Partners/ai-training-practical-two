const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { router } = require('./router');
const { resetStats } = require('./stats');

// Helper to create mock request
function mockRequest(method, url, body = null) {
  const req = {
    method,
    url,
    headers: { host: 'localhost:3000' },
    body: body ? JSON.stringify(body) : '',
  };

  // Mock the data event handling
  const handlers = {};
  req.on = (event, handler) => {
    handlers[event] = handler;
  };

  // Simulate request body parsing
  setTimeout(() => {
    if (handlers.data && body) {
      handlers.data(JSON.stringify(body));
    }
    if (handlers.end) {
      handlers.end();
    }
  }, 0);

  return req;
}

describe('Router', () => {
  beforeEach(() => {
    resetStats();
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const req = mockRequest('GET', '/api/users');
      const result = await router(req);

      assert.ok(result.body);
      assert.ok(Array.isArray(result.body));
      assert.ok(result.body.length > 0);
    });

    it('should return 200 status by default', async () => {
      const req = mockRequest('GET', '/api/users');
      const result = await router(req);

      assert.ok(!result.status || result.status === 200);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user when found', async () => {
      const req = mockRequest('GET', '/api/users/1');
      const result = await router(req);

      assert.ok(result.body);
      assert.strictEqual(result.body.id, 1);
      assert.strictEqual(result.body.name, 'Alice Johnson');
    });

    it('should return 404 when user not found', async () => {
      const req = mockRequest('GET', '/api/users/999');
      const result = await router(req);

      assert.strictEqual(result.status, 404);
      assert.ok(result.body.error);
    });
  });

  describe('GET /api/users/:id/tasks', () => {
    it('should return tasks for valid user', async () => {
      const req = mockRequest('GET', '/api/users/1/tasks');
      const result = await router(req);

      assert.ok(result.body);
      assert.ok(Array.isArray(result.body));
    });

    it('should return 404 for non-existent user tasks', async () => {
      const req = mockRequest('GET', '/api/users/999/tasks');
      const result = await router(req);

      assert.strictEqual(result.status, 404);
      assert.strictEqual(result.body.error, 'User not found');
    });

    it('should return 404 for user id 0 tasks', async () => {
      const req = mockRequest('GET', '/api/users/0/tasks');
      const result = await router(req);

      assert.strictEqual(result.status, 404);
      assert.strictEqual(result.body.error, 'User not found');
    });
  });

  describe('POST /api/tasks', () => {
    it('should return 201 with the created task', async () => {
      const req = mockRequest('POST', '/api/tasks', {
        title: 'Router test task',
        assigneeId: 1,
      });
      const result = await router(req);

      assert.strictEqual(result.status, 201);
      assert.ok(result.body.id);
      assert.strictEqual(result.body.title, 'Router test task');
    });

    it('should return the task directly from the route, not wrapped', async () => {
      const req = mockRequest('POST', '/api/tasks', {
        title: 'Envelope route test',
        assigneeId: 2,
      });
      const result = await router(req);

      assert.strictEqual(result.status, 201);
      assert.ok(result.body.id, 'response body should have id at top level');
      assert.strictEqual(result.body.data, undefined, 'response body should not be wrapped');
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should update and return the task', async () => {
      const req = mockRequest('PATCH', '/api/tasks/2/status', {
        status: 'in_progress',
      });
      const result = await router(req);

      assert.ok(!result.status || result.status === 200);
      assert.strictEqual(result.body.status, 'in_progress');
      assert.strictEqual(result.body.id, 2);
    });

    it('should return 404 for non-existent task status update', async () => {
      const req = mockRequest('PATCH', '/api/tasks/9999/status', {
        status: 'completed',
      });
      const result = await router(req);

      assert.strictEqual(result.status, 404);
      assert.ok(result.body.error);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return list of tasks', async () => {
      const req = mockRequest('GET', '/api/tasks');
      const result = await router(req);

      assert.ok(result.body);
      assert.ok(Array.isArray(result.body));
      assert.ok(result.body.length > 0);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return task when found', async () => {
      const req = mockRequest('GET', '/api/tasks/1');
      const result = await router(req);

      assert.ok(result.body);
      assert.strictEqual(result.body.id, 1);
    });

    it('should return 404 when task not found', async () => {
      const req = mockRequest('GET', '/api/tasks/999');
      const result = await router(req);

      assert.strictEqual(result.status, 404);
      assert.ok(result.body.error);
    });
  });

  describe('GET /api/stats', () => {
    it('should return stats object', async () => {
      const req = mockRequest('GET', '/api/stats');
      const result = await router(req);

      assert.ok(result.body);
      assert.ok('totalTasks' in result.body);
    });
  });

  describe('Unknown routes', () => {
    it('should return 404 for unknown paths', async () => {
      const req = mockRequest('GET', '/api/unknown');
      const result = await router(req);

      assert.strictEqual(result.status, 404);
      assert.strictEqual(result.body.error, 'Not found');
    });

    it('should return 404 for unknown methods', async () => {
      const req = mockRequest('DELETE', '/api/users');
      const result = await router(req);

      assert.strictEqual(result.status, 404);
    });
  });
});
