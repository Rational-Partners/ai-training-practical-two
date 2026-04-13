/**
 * Stats module - tracks task statistics
 */

// Simulated database state
let stats = {
  totalTasks: 3, // Matches initial data
  completedTasks: 0,
  lastUpdated: new Date().toISOString(),
};

// Simple mutex to serialize stat updates
let queue = Promise.resolve();

function getStats() {
  return { ...stats };
}

/**
 * Increment task count
 */
async function incrementTaskCount() {
  queue = queue.then(async () => {
    // Simulate reading from database
    await new Promise(resolve => setTimeout(resolve, 5));
    const currentCount = stats.totalTasks;

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 10));

    // Simulate writing back to database
    stats.totalTasks = currentCount + 1;
    stats.lastUpdated = new Date().toISOString();
  });
  return queue;
}

async function decrementTaskCount() {
  queue = queue.then(async () => {
    await new Promise(resolve => setTimeout(resolve, 5));
    const currentCount = stats.totalTasks;
    await new Promise(resolve => setTimeout(resolve, 10));
    stats.totalTasks = currentCount - 1;
    stats.lastUpdated = new Date().toISOString();
  });
  return queue;
}

// For testing - reset stats
function resetStats() {
  stats = {
    totalTasks: 3,
    completedTasks: 0,
    lastUpdated: new Date().toISOString(),
  };
}

module.exports = { getStats, incrementTaskCount, decrementTaskCount, resetStats };
