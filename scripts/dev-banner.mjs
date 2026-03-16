import http from 'node:http';
import os from 'node:os';

const PORT = process.env.BACKEND_PORT || process.env.PORT || 3000;
const POLL_INTERVAL = 500;
const TIMEOUT = 30_000;

function getLanIP() {
  return Object.values(os.networkInterfaces())
    .flat()
    .find((i) => i && i.family === 'IPv4' && !i.internal)?.address;
}

function poll() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}/api/stats`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(res.statusCode === 200));
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer() {
  const start = Date.now();
  while (Date.now() - start < TIMEOUT) {
    if (await poll()) return true;
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }
  return false;
}

function printBanner() {
  const lanIP = getLanIP();
  const local = `http://localhost:${PORT}`;
  const network = lanIP ? `http://${lanIP}:${PORT}` : null;
  const api = `${local}/api`;
  const logFile = 'logs/backend.log';

  const lines = [
    '',
    `  Local:    ${local}`,
    network ? `  Network:  \x1b[1m${network}\x1b[0m` : null,
    `  API:      ${api}`,
    `  Log file: ${logFile}`,
    '',
  ].filter(Boolean);

  const maxLen = Math.max(
    ...lines.map((l) => l.replace(/\x1b\[[0-9;]*m/g, '').length)
  );
  const border = '─'.repeat(maxLen + 2);

  console.log();
  console.log(`  ┌${border}┐`);
  for (const line of lines) {
    const visible = line.replace(/\x1b\[[0-9;]*m/g, '').length;
    const pad = ' '.repeat(maxLen - visible);
    console.log(`  │ ${line}${pad} │`);
  }
  console.log(`  └${border}┘`);
  console.log();
}

const ready = await waitForServer();

if (ready) {
  printBanner();
} else {
  console.error(
    `\n  Server did not start within ${TIMEOUT / 1000}s.\n  Check logs/backend.log for details.\n`
  );
  process.exit(1);
}

// Keep alive so concurrently doesn't exit
setInterval(() => {}, 1 << 30);
