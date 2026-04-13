const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { getStats, incrementTaskCount, decrementTaskCount, resetStats } = require('./stats');

describe('Stats', () => {
  beforeEach(() => {
    resetStats();
  });

  describe('getStats', () => {
    it('should return stats object', () => {
      const stats = getStats();
      assert.ok(stats);
      assert.ok(typeof stats === 'object');
    });

    it('should return stats with required fields', () => {
      const stats = getStats();
      assert.ok('totalTasks' in stats);
      assert.ok('completedTasks' in stats);
      assert.ok('lastUpdated' in stats);
    });

    it('should return totalTasks as a number', () => {
      const stats = getStats();
      assert.ok(typeof stats.totalTasks === 'number');
    });

    it('should return initial totalTasks count of 3', () => {
      const stats = getStats();
      assert.strictEqual(stats.totalTasks, 3);
    });

    it('should return a copy of stats (not reference)', () => {
      const stats1 = getStats();
      const stats2 = getStats();
      stats1.totalTasks = 999;
      assert.notStrictEqual(stats2.totalTasks, 999);
    });

    it('should have valid lastUpdated timestamp', () => {
      const stats = getStats();
      const date = new Date(stats.lastUpdated);
      assert.ok(!isNaN(date.getTime()));
    });
  });

  describe('incrementTaskCount', () => {
    it('should increment count by 1', async () => {
      const before = getStats().totalTasks;
      await incrementTaskCount();
      const after = getStats().totalTasks;
      assert.strictEqual(after, before + 1);
    });

    it('should update lastUpdated timestamp', async () => {
      const before = getStats().lastUpdated;
      await new Promise(resolve => setTimeout(resolve, 20));
      await incrementTaskCount();
      const after = getStats().lastUpdated;
      assert.notStrictEqual(after, before);
    });

    it('should work multiple times sequentially', async () => {
      const initial = getStats().totalTasks;
      await incrementTaskCount();
      await incrementTaskCount();
      await incrementTaskCount();
      const final = getStats().totalTasks;
      assert.strictEqual(final, initial + 3);
    });
  });

  describe('decrementTaskCount', () => {
    it('should decrement count by 1', async () => {
      const before = getStats().totalTasks;
      await decrementTaskCount();
      const after = getStats().totalTasks;
      assert.strictEqual(after, before - 1);
    });

    it('should update lastUpdated timestamp', async () => {
      const before = getStats().lastUpdated;
      await new Promise(resolve => setTimeout(resolve, 20));
      await decrementTaskCount();
      const after = getStats().lastUpdated;
      assert.notStrictEqual(after, before);
    });
  });

  describe('resetStats', () => {
    it('should reset totalTasks to initial value', async () => {
      await incrementTaskCount();
      await incrementTaskCount();
      resetStats();
      const stats = getStats();
      assert.strictEqual(stats.totalTasks, 3);
    });

    it('should reset completedTasks to 0', async () => {
      resetStats();
      const stats = getStats();
      assert.strictEqual(stats.completedTasks, 0);
    });
  });

  describe('concurrent operations', () => {
    it('should correctly count all increments under concurrent load', async () => {
      const initial = getStats().totalTasks;
      await Promise.all([
        incrementTaskCount(),
        incrementTaskCount(),
        incrementTaskCount(),
        incrementTaskCount(),
        incrementTaskCount(),
      ]);
      const final = getStats().totalTasks;
      assert.strictEqual(final, initial + 5);
    });

    it('should correctly handle concurrent bulk increments', async () => {
      const initial = getStats().totalTasks;
      await Promise.all(Array.from({ length: 10 }, () => incrementTaskCount()));
      const final = getStats().totalTasks;
      assert.strictEqual(final, initial + 10);
    });
  });

  describe('integration', () => {
    it('should handle increment and decrement together', async () => {
      const initial = getStats().totalTasks;
      await incrementTaskCount();
      await incrementTaskCount();
      await decrementTaskCount();
      const final = getStats().totalTasks;
      assert.strictEqual(final, initial + 1);
    });

    it('should maintain consistency after many sequential operations', async () => {
      const initial = getStats().totalTasks;

      // 5 increments
      for (let i = 0; i < 5; i++) {
        await incrementTaskCount();
      }

      // 2 decrements
      for (let i = 0; i < 2; i++) {
        await decrementTaskCount();
      }

      const final = getStats().totalTasks;
      assert.strictEqual(final, initial + 3);
    });
  });
});
