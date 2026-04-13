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
  // Simulate database operation delay
  await new Promise(resolve => setTimeout(resolve, 15));

  // Atomic update - increment happens in single tick to prevent race conditions
  // In a real database, this would be: UPDATE stats SET totalTasks = totalTasks + 1
  stats.totalTasks++;
  stats.lastUpdated = new Date().toISOString();
}

async function decrementTaskCount() {
  // Simulate database operation delay
  await new Promise(resolve => setTimeout(resolve, 15));

  // Atomic update
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
