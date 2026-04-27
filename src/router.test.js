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

  describe('POST /api/tasks', () => {
    it('should return the created task as a flat object (no data wrapper)', async () => {
      // Regression: frontend reads response.id directly (logs/frontend-2024-01-21.log).
      // Server was wrapping the task in { data, success: true }, breaking handleCreateTask.
      const req = mockRequest('POST', '/api/tasks', {
        title: 'Update documentation',
        description: 'Document new endpoints',
        assigneeId: 1,
      });
      const result = await router(req);

      assert.strictEqual(result.status, 201);
      // Top-level task fields must be present, matching the shape of GET /api/tasks/:id
      assert.strictEqual(typeof result.body.id, 'number');
      assert.strictEqual(result.body.title, 'Update documentation');
      assert.strictEqual(result.body.status, 'pending');
      assert.strictEqual(result.body.assigneeId, 1);
      // No envelope keys
      assert.strictEqual(result.body.data, undefined);
      assert.strictEqual(result.body.success, undefined);
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
