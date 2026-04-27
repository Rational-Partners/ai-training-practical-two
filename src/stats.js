/**
 * Stats module - tracks task statistics
 */

// Simulated database state
let stats = {
  totalTasks: 3, // Matches initial data
  completedTasks: 0,
  lastUpdated: new Date().toISOString(),
};

// Serializes all stats mutations so concurrent read-modify-write
// sequences cannot clobber each other (lost-update race observed in
// logs/monitoring-2024-01-22.log).
let lock = Promise.resolve();

function withLock(fn) {
  const next = lock.then(fn);
  lock = next.catch(() => {});
  return next;
}

function getStats() {
  return { ...stats };
}

async function incrementTaskCount() {
  return withLock(async () => {
    // Simulate reading from database
    await new Promise(resolve => setTimeout(resolve, 5));
    const currentCount = stats.totalTasks;

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 10));

    // Simulate writing back to database
    stats.totalTasks = currentCount + 1;
    stats.lastUpdated = new Date().toISOString();
  });
}

async function decrementTaskCount() {
  return withLock(async () => {
    await new Promise(resolve => setTimeout(resolve, 5));
    const currentCount = stats.totalTasks;
    await new Promise(resolve => setTimeout(resolve, 10));
    stats.totalTasks = currentCount - 1;
    stats.lastUpdated = new Date().toISOString();
  });
}

// For testing - reset stats
function resetStats() {
  stats = {
    totalTasks: 3,
    completedTasks: 0,
    lastUpdated: new Date().toISOString(),
  };
  lock = Promise.resolve();
}

module.exports = { getStats, incrementTaskCount, decrementTaskCount, resetStats };
