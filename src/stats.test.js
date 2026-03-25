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

    it('should maintain consistency under concurrent increments', async () => {
      const initial = getStats().totalTasks;
      const concurrentOps = 10;

      // Fire 10 increments at the same time — simulates high-traffic burst
      await Promise.all(
        Array.from({ length: concurrentOps }, () => incrementTaskCount())
      );

      const final = getStats().totalTasks;
      assert.strictEqual(final, initial + concurrentOps,
        `Expected ${initial + concurrentOps} but got ${final} — lost ${initial + concurrentOps - final} increments due to race condition`
      );
    });

    it('should maintain consistency under concurrent decrements', async () => {
      // First, sequentially add tasks so we have room to decrement
      for (let i = 0; i < 10; i++) {
        await incrementTaskCount();
      }
      const before = getStats().totalTasks;
      const concurrentOps = 5;

      // Fire 5 decrements at the same time
      await Promise.all(
        Array.from({ length: concurrentOps }, () => decrementTaskCount())
      );

      const final = getStats().totalTasks;
      assert.strictEqual(final, before - concurrentOps,
        `Expected ${before - concurrentOps} but got ${final} — lost ${Math.abs(before - concurrentOps - final)} decrements due to race condition`
      );
    });

    it('should maintain consistency under mixed concurrent increments and decrements', async () => {
      // Set up a known starting point with some headroom
      for (let i = 0; i < 5; i++) {
        await incrementTaskCount();
      }
      const before = getStats().totalTasks; // 8

      // Fire 8 increments and 4 decrements concurrently — net +4
      await Promise.all([
        ...Array.from({ length: 8 }, () => incrementTaskCount()),
        ...Array.from({ length: 4 }, () => decrementTaskCount()),
      ]);

      const final = getStats().totalTasks;
      assert.strictEqual(final, before + 4,
        `Expected ${before + 4} but got ${final} — race condition in mixed operations`
      );
    });

    it('should handle a large burst of concurrent operations', async () => {
      const initial = getStats().totalTasks;
      const concurrentOps = 25;

      await Promise.all(
        Array.from({ length: concurrentOps }, () => incrementTaskCount())
      );

      const final = getStats().totalTasks;
      assert.strictEqual(final, initial + concurrentOps,
        `Expected ${initial + concurrentOps} but got ${final} — lost ${initial + concurrentOps - final} increments in large burst`
      );
    });

    it('should work correctly for sequential operations after concurrent ones', async () => {
      const initial = getStats().totalTasks;

      // Concurrent burst first
      await Promise.all(
        Array.from({ length: 5 }, () => incrementTaskCount())
      );

      // Then sequential operations — lock should not be stuck
      await incrementTaskCount();
      await incrementTaskCount();
      await decrementTaskCount();

      // 5 concurrent + 2 sequential increments - 1 decrement = net +6
      const final = getStats().totalTasks;
      assert.strictEqual(final, initial + 6,
        'Lock appears to be stuck after concurrent operations'
      );
    });
  });
});
