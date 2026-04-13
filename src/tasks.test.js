const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { getTasks, getTaskById, createTask, updateTaskStatus } = require('./tasks');
const { resetStats, getStats } = require('./stats');

describe('Tasks', () => {
  beforeEach(() => {
    resetStats();
  });

  describe('getTasks', () => {
    it('should return an array of tasks', () => {
      const tasks = getTasks();
      assert.ok(Array.isArray(tasks));
      assert.ok(tasks.length > 0);
    });

    it('should return tasks with required fields', () => {
      const tasks = getTasks();
      tasks.forEach(task => {
        assert.ok(task.id);
        assert.ok(task.title);
        assert.ok(task.status);
        assert.ok(task.priority);
      });
    });

    it('should return tasks with valid status values', () => {
      const validStatuses = ['pending', 'in_progress', 'completed'];
      const tasks = getTasks();
      tasks.forEach(task => {
        assert.ok(validStatuses.includes(task.status), `Invalid status: ${task.status}`);
      });
    });

    it('should return tasks with valid priority values', () => {
      const validPriorities = ['low', 'medium', 'high'];
      const tasks = getTasks();
      tasks.forEach(task => {
        assert.ok(validPriorities.includes(task.priority), `Invalid priority: ${task.priority}`);
      });
    });
  });

  describe('getTaskById', () => {
    it('should return task when found', () => {
      const task = getTaskById(1);
      assert.ok(task);
      assert.strictEqual(task.id, 1);
    });

    it('should return task with all fields', () => {
      const task = getTaskById(1);
      assert.ok(task.id);
      assert.ok(task.title);
      assert.ok(task.status);
      assert.ok(task.priority);
      assert.ok(task.createdAt);
    });

    it('should return undefined when task not found', () => {
      const task = getTaskById(999);
      assert.strictEqual(task, undefined);
    });

    it('should return correct task for each id', () => {
      const task1 = getTaskById(1);
      const task2 = getTaskById(2);

      assert.strictEqual(task1.title, 'Set up project structure');
      assert.strictEqual(task2.title, 'Implement user authentication');
    });
  });

  describe('createTask', () => {
    it('should create a task with provided title', async () => {
      const result = await createTask({
        title: 'Test Task',
        description: 'A test task',
        assigneeId: 1,
      });

      assert.ok(result);
      assert.ok(result.id);
    });

    it('should create a task and increment stats', async () => {
      const beforeCount = getStats().totalTasks;

      await createTask({
        title: 'Another Task',
        description: 'Description',
        assigneeId: 1,
      });

      const afterCount = getStats().totalTasks;
      assert.strictEqual(afterCount, beforeCount + 1);
    });

    it('should create multiple tasks sequentially', async () => {
      const beforeCount = getStats().totalTasks;

      await createTask({ title: 'Task A', assigneeId: 1 });
      await createTask({ title: 'Task B', assigneeId: 2 });
      await createTask({ title: 'Task C', assigneeId: 1 });

      const afterCount = getStats().totalTasks;
      assert.strictEqual(afterCount, beforeCount + 3);
    });

    it('should set default priority to medium', async () => {
      const result = await createTask({
        title: 'Task without priority',
        assigneeId: 1,
      });

      // Check the task was created (in the data wrapper or directly)
      const taskData = result.data || result;
      assert.strictEqual(taskData.priority, 'medium');
    });

    it('should set status to pending for new tasks', async () => {
      const result = await createTask({
        title: 'New task',
        assigneeId: 1,
      });

      const taskData = result.data || result;
      assert.strictEqual(taskData.status, 'pending');
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', async () => {
      const task = await updateTaskStatus(2, 'completed');
      assert.ok(task);
      assert.strictEqual(task.status, 'completed');
    });

    it('should return null for non-existent task', async () => {
      const task = await updateTaskStatus(999, 'completed');
      assert.strictEqual(task, null);
    });

    it('should preserve other task fields when updating status', async () => {
      const before = getTaskById(2);
      const after = await updateTaskStatus(2, 'in_progress');

      assert.strictEqual(after.id, before.id);
      assert.strictEqual(after.title, before.title);
      assert.strictEqual(after.assigneeId, before.assigneeId);
      assert.strictEqual(after.status, 'in_progress');
    });
  });
});
