/**
 * Stats module - tracks task statistics
 */

// Simulated database state
let stats = {
  totalTasks: 3, // Matches initial data
  completedTasks: 0,
  lastUpdated: new Date().toISOString(),
};

function getStats() {
  return { ...stats };
}

/**
 * Increment task count
 */
async function incrementTaskCount() {
  // Simulate async processing time
  await new Promise(resolve => setTimeout(resolve, 5));
  await new Promise(resolve => setTimeout(resolve, 10));

  // Atomic increment - avoids lost updates under concurrent calls
  stats.totalTasks++;
  stats.lastUpdated = new Date().toISOString();
}

async function decrementTaskCount() {
  await new Promise(resolve => setTimeout(resolve, 5));
  await new Promise(resolve => setTimeout(resolve, 10));

  // Atomic decrement
  stats.totalTasks--;
  stats.lastUpdated = new Date().toISOString();
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
