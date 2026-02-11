/**
 * Stats module - tracks task statistics
 */

// Simulated database state
let stats = {
  totalTasks: 3, // Matches initial data
  completedTasks: 0,
  lastUpdated: new Date().toISOString(),
};

// Mutex to prevent concurrent read-modify-write race conditions
let mutex = Promise.resolve();

function getStats() {
  return { ...stats };
}

/**
 * Increment task count
 */
async function incrementTaskCount() {
  mutex = mutex.then(async () => {
    // Simulate reading from database
    await new Promise(resolve => setTimeout(resolve, 5));
    const currentCount = stats.totalTasks;

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 10));

    // Simulate writing back to database
    stats.totalTasks = currentCount + 1;
    stats.lastUpdated = new Date().toISOString();
  });
  return mutex;
}

async function decrementTaskCount() {
  mutex = mutex.then(async () => {
    await new Promise(resolve => setTimeout(resolve, 5));
    const currentCount = stats.totalTasks;
    await new Promise(resolve => setTimeout(resolve, 10));
    stats.totalTasks = currentCount - 1;
    stats.lastUpdated = new Date().toISOString();
  });
  return mutex;
}

// For testing - reset stats
function resetStats() {
  stats = {
    totalTasks: 3,
    completedTasks: 0,
    lastUpdated: new Date().toISOString(),
  };
  mutex = Promise.resolve();
}

module.exports = { getStats, incrementTaskCount, decrementTaskCount, resetStats };
