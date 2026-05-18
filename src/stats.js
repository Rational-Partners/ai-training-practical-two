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
 * Increment task count.
 *
 * The read and write must happen in the same synchronous tick — interleaving
 * an `await` between them allows concurrent callers to read the same value
 * and write back the same +1, losing every increment but one. The simulated
 * I/O delay is moved before the read so the mutation itself is atomic from
 * the event loop's perspective.
 */
async function incrementTaskCount() {
  // Simulate I/O latency
  await new Promise(resolve => setTimeout(resolve, 15));

  // Atomic read-modify-write — no await between read and write
  stats.totalTasks = stats.totalTasks + 1;
  stats.lastUpdated = new Date().toISOString();
}

async function decrementTaskCount() {
  await new Promise(resolve => setTimeout(resolve, 15));
  stats.totalTasks = stats.totalTasks - 1;
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
