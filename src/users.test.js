const { describe, it } = require('node:test');
const assert = require('node:assert');
const { getUsers, getUserById, getUserTasks } = require('./users');

describe('Users', () => {
  describe('getUsers', () => {
    it('should return an array of users', () => {
      const users = getUsers();
      assert.ok(Array.isArray(users));
      assert.ok(users.length > 0);
    });

    it('should return users with required fields', () => {
      const users = getUsers();
      users.forEach(user => {
        assert.ok(user.id);
        assert.ok(user.name);
        assert.ok(user.email);
      });
    });

    it('should return users with valid email format', () => {
      const users = getUsers();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      users.forEach(user => {
        assert.ok(emailRegex.test(user.email), `Invalid email: ${user.email}`);
      });
    });
  });

  describe('getUserById', () => {
    it('should return user when found', () => {
      const user = getUserById(1);
      assert.strictEqual(user.name, 'Alice Johnson');
      assert.strictEqual(user.email, 'alice@example.com');
    });

    it('should return correct user for each valid id', () => {
      const user1 = getUserById(1);
      const user2 = getUserById(2);
      const user3 = getUserById(3);

      assert.strictEqual(user1.name, 'Alice Johnson');
      assert.strictEqual(user2.name, 'Bob Smith');
      assert.strictEqual(user3.name, 'Charlie Brown');
    });

    it('should return undefined when user not found', () => {
      const user = getUserById(999);
      assert.strictEqual(user, undefined);
    });

    it('should handle string id by returning undefined', () => {
      const user = getUserById('invalid');
      assert.strictEqual(user, undefined);
    });
  });

  describe('getUserTasks', () => {
    it('should return tasks for user 1', () => {
      const tasks = getUserTasks(1);
      assert.ok(Array.isArray(tasks));
      assert.ok(tasks.length > 0);
    });

    it('should return only tasks assigned to the specified user', () => {
      const tasks = getUserTasks(1);
      tasks.forEach(task => {
        assert.strictEqual(task.assigneeId, 1);
      });
    });

    it('should return tasks with required fields', () => {
      const tasks = getUserTasks(1);
      tasks.forEach(task => {
        assert.ok(task.id);
        assert.ok(task.title);
        assert.ok(task.status);
      });
    });

    it('should return null for non-existent user', () => {
      const tasks = getUserTasks(999);
      assert.strictEqual(tasks, null);
    });

    it('should return different tasks for different users', () => {
      const tasks1 = getUserTasks(1);
      const tasks2 = getUserTasks(2);

      // User 1 and 2 should have different task sets
      const ids1 = tasks1.map(t => t.id);
      const ids2 = tasks2.map(t => t.id);

      // No overlap expected
      const overlap = ids1.filter(id => ids2.includes(id));
      assert.strictEqual(overlap.length, 0);
    });
  });
});
