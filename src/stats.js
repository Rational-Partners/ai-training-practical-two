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
  await new Promise(resolve => setTimeout(resolve, 5));
  // Increment atomically — no await between read and write
  stats.totalTasks += 1;
  stats.lastUpdated = new Date().toISOString();
}

async function decrementTaskCount() {
  await new Promise(resolve => setTimeout(resolve, 5));
  stats.totalTasks -= 1;
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
